// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./hts-precompile/HederaTokenService.sol";
import "./hts-precompile/IHederaTokenService.sol";
import "./hts-precompile/ExpiryHelper.sol";
import "./hts-precompile/KeyHelper.sol";

import {IActionRepository} from "./interfaces/IActionRepository.sol";

contract CarbonCreditToken is HederaTokenService, KeyHelper, ExpiryHelper {
    address public underlying;
    mapping(int64 => bool) public isSerialUsed;

    IActionRepository public actionRepository;

    constructor(IActionRepository _actionRepository) {
        actionRepository = _actionRepository;

        int response = associateToken(
            address(this),
            _actionRepository.underlying()
        );

        require(
            response == HederaResponseCodes.SUCCESS,
            "Token association failed"
        );
    }

    function createUnderlying(
        string memory name,
        string memory symbol,
        int64 autoRenewPeriod,
        int32 decimals
    ) external payable {
        require(underlying == address(0), "Token already created.");

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

        // Token details
        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.treasury = address(this);
        token.tokenSupplyType = true; // finite supply
        token.tokenKeys = keys;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), autoRenewPeriod);
        token.memo = "";
        token.maxSupply = 100_000_000_000;

        // Call HTS to create the token
        (int256 response, address createdToken) = createFungibleToken(
            token,
            0, // initial supply
            decimals
        );

        require(
            response == HederaResponseCodes.SUCCESS,
            "Token creation failed"
        );

        underlying = createdToken;
    }

    function reedemAction(int64 serialNumber) external {
        require(!isSerialUsed[serialNumber], "Already redeemed");

        int response = transferNFT(
            actionRepository.underlying(),
            msg.sender,
            address(this),
            serialNumber
        );
        require(response == HederaResponseCodes.SUCCESS, "NFT transfer failed");

        IActionRepository.Action memory action = actionRepository
            .getActionFromSerial(serialNumber);

        (int mintResponse, , ) = mintToken(
            underlying,
            action.emissionSaved,
            new bytes[](0)
        );
        require(
            mintResponse == HederaResponseCodes.SUCCESS,
            "Minting carbon token failed"
        );

        int transferResponse = transferToken(
            underlying,
            address(this),
            msg.sender,
            action.emissionSaved
        );
        require(
            transferResponse == HederaResponseCodes.SUCCESS,
            "Transfer carbon token failed"
        );

        isSerialUsed[serialNumber] = true;
    }
}
