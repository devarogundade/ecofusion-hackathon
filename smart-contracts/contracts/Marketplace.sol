// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./hts-precompile/HederaTokenService.sol";

import {ICarbonCreditToken} from "./interfaces/ICarbonCreditToken.sol";

contract Marketplace is HederaTokenService {
    int64 private listingIdCounter;
    ICarbonCreditToken public carbonCreditToken;

    struct Listing {
        address seller;
        int64 amount;
        int64 price; // in tinybars per token unit
        int64 expiresAt; // timestamp in seconds
        bool active;
    }

    mapping(int64 => Listing) public listings;

    event Listed(
        int64 indexed listingId,
        address indexed seller,
        int64 amount,
        int64 price,
        int64 expiresAt
    );
    event Delisted(int64 indexed listingId);
    event Purchased(
        int64 indexed listingId,
        address indexed buyer,
        int64 amount,
        int64 totalPaid
    );

    constructor(ICarbonCreditToken _carbonCreditToken) {
        carbonCreditToken = _carbonCreditToken;

        int response = associateToken(
            address(this),
            _carbonCreditToken.underlying()
        );

        require(
            response == HederaResponseCodes.SUCCESS,
            "Token association failed"
        );
    }

    /**
     * @notice List carbon credit tokens for sale
     * @param amount The amount of carbon tokens to sell
     * @param price The price per token (in tinybars)
     * @param expiresIn The duration (in seconds) until listing expiration
     */
    function list(
        int64 amount,
        int64 price,
        int64 expiresIn
    ) external returns (int64 listingId) {
        require(amount > 0, "Invalid amount");
        require(price > 0, "Invalid price");

        // Transfer the listed tokens to the marketplace
        int response = transferToken(
            carbonCreditToken.underlying(),
            msg.sender,
            address(this),
            amount
        );
        require(
            response == HederaResponseCodes.SUCCESS,
            "Token transfer failed"
        );

        listingId = ++listingIdCounter;

        listings[listingId] = Listing({
            seller: msg.sender,
            amount: amount,
            price: price,
            expiresAt: int64(int(block.timestamp) + expiresIn),
            active: true
        });

        emit Listed(
            listingId,
            msg.sender,
            amount,
            price,
            int64(int(block.timestamp) + expiresIn)
        );
    }

    /**
     * @notice Remove a listing before it’s purchased
     */
    function delist(int64 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");

        listing.active = false;

        // Return tokens to seller
        int response = transferToken(
            carbonCreditToken.underlying(),
            address(this),
            msg.sender,
            listing.amount
        );
        require(response == HederaResponseCodes.SUCCESS, "Token return failed");

        emit Delisted(listingId);
    }

    /**
     * @notice Buy listed carbon credit tokens
     */
    function buy(int64 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(
            block.timestamp <= uint64(listing.expiresAt),
            "Listing expired"
        );

        require(
            msg.value >= uint256(uint64(listing.price)),
            "Insufficient payment"
        );

        listing.active = false;

        // Transfer tokens to buyer
        int response = transferToken(
            carbonCreditToken.underlying(),
            address(this),
            msg.sender,
            listing.amount
        );
        require(
            response == HederaResponseCodes.SUCCESS,
            "Token transfer failed"
        );

        // Pay the seller
        payable(listing.seller).transfer(uint256(uint64(listing.price)));

        // Refund excess payment (if any)
        if (msg.value > uint256(uint64(listing.price))) {
            payable(msg.sender).transfer(
                msg.value - uint256(uint64(listing.price))
            );
        }

        emit Purchased(listingId, msg.sender, listing.amount, listing.price);
    }
}
