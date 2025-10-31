// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./hts-precompile/HederaTokenService.sol";
import "./hts-precompile/IHederaTokenService.sol";
import "./hts-precompile/ExpiryHelper.sol";
import "./hts-precompile/KeyHelper.sol";

import {IActionRepository} from "./interfaces/IActionRepository.sol";

contract ActionRepository is
    HederaTokenService,
    KeyHelper,
    ExpiryHelper,
    IActionRepository
{
    event Submitted(address indexed submitter, int64 actionId);
    event Approved(address indexed submitter, int64 actionId);
    event Rejected(address indexed submitter, int64 actionId);

    address public owner;
    address public underlying;
    int64 public actionIdCounter;

    int64 public latestSerialNumber;

    mapping(int64 => Action) public actions;
    mapping(int64 => int64) public serialToActionId;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Initializes a new fungible token representing approved environmental actions.
    function createUnderlying(
        string memory name,
        string memory symbol,
        int64 autoRenewPeriod
    ) external payable onlyOwner {
        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](3);

        // Supply key - contract can mint/burn
        keys[0] = getSingleKey(
            KeyType.SUPPLY,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        // Admin key - contract can update token properties
        keys[1] = getSingleKey(
            KeyType.ADMIN,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        // Pause key - contract can pause token
        keys[2] = getSingleKey(
            KeyType.PAUSE,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.freezeDefault = false;
        token.treasury = address(this);
        token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod);
        token.memo = "";
        token.tokenKeys = keys;

        (int response, address createdToken) = createNonFungibleToken(token);
        require(
            response == HederaResponseCodes.SUCCESS,
            "Token creation failed"
        );

        underlying = createdToken;
    }

    /// @notice Submit a new cleanup or emission-saving action
    function submit(
        string memory metadataUrl
    ) external returns (int64 actionId) {
        actionIdCounter++;
        actions[actionIdCounter] = Action({
            metadataUrl: metadataUrl,
            status: Status.Pending,
            submitter: msg.sender,
            emissionSaved: 0
        });

        emit Submitted(msg.sender, actionId);

        return actionIdCounter;
    }

    /// @notice Approve a submitted action and mint tokens representing emissions saved
    function approve(
        int64 actionId,
        int64 emissionSaved
    ) external onlyOwner returns (int64) {
        Action storage act = actions[actionId];
        require(act.status == Status.Pending, "Action not pending");

        act.status = Status.Approved;
        act.emissionSaved = emissionSaved;

        // Convert metadata URL to bytes
        bytes[] memory metadata = new bytes[](1);
        metadata[0] = bytes(act.metadataUrl);

        // Mint one NFT with the metadata
        (int response, , int64[] memory serialNumbers) = mintToken(
            underlying,
            0,
            metadata
        );
        require(response == HederaResponseCodes.SUCCESS, "Mint failed");
        latestSerialNumber = serialNumbers[0];

        // transfer NFT to submitter
        serialToActionId[serialNumbers[0]] = actionId;
        transferNFT(underlying, address(this), act.submitter, serialNumbers[0]);

        emit Approved(act.submitter, actionId);

        return serialNumbers[0];
    }

    /// @notice Reject a submitted action and (optionally) burn corresponding tokens
    function reject(int64 actionId) external onlyOwner {
        Action storage act = actions[actionId];
        require(act.status == Status.Pending, "Action not pending");

        act.status = Status.Rejected;

        emit Rejected(act.submitter, actionId);
    }

    function getAction(int64 actionId) external view returns (Action memory) {
        return actions[actionId];
    }

    function getActionFromSerial(
        int64 serialNumber
    ) external view returns (Action memory) {
        return actions[serialToActionId[serialNumber]];
    }
}
