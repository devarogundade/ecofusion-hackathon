// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IActionRepository {
    enum Status {
        Pending,
        Approved,
        Rejected
    }

    struct Action {
        string metadataUrl; // URL or IPFS reference to details
        Status status;
        address submitter;
        int64 emissionSaved; // optional metric (e.g. in tons CO₂)
    }

    function underlying() external view returns (address);

    function getAction(int64 actionId) external view returns (Action memory);

    function getActionFromSerial(
        int64 serialNumber
    ) external view returns (Action memory);
}
