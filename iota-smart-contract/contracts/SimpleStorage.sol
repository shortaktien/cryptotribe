// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private data;

    event DataChanged(uint256 newValue);

    function set(uint256 x) public {
        data = x;
        emit DataChanged(x);
    }

    function get() public view returns (uint256) {
        return data;
    }
}
