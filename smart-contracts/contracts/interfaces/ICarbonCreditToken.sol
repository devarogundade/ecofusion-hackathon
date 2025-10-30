// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ICarbonCreditToken {
    function underlying() external view returns (address);
}
