// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuildingManagement {
    struct Building {
        uint256 level;
        address owner;
        uint256 buildTime;
    }

    mapping(uint256 => Building) public buildings;

    event BuildingUpgraded(uint256 buildingId, uint256 newLevel, address owner, string message);
    event BuildingCreated(uint256 buildingId, address owner, uint256 level, string message);

    function buildOrUpgrade(uint256 buildingId, string memory message) public {
        Building storage building = buildings[buildingId];

        if (building.owner == address(0)) {
            building.owner = msg.sender;
            building.level = 1;
            building.buildTime = block.timestamp;

            emit BuildingCreated(buildingId, msg.sender, building.level, message);
        } else {
            require(building.owner == msg.sender, "You are not the owner of this building.");
            building.level += 1;
            building.buildTime = block.timestamp;

            emit BuildingUpgraded(buildingId, building.level, msg.sender, message);
        }
    }

    function getBuildingLevel(uint256 buildingId) public view returns (uint256) {
        return buildings[buildingId].level;
    }

    function getBuildingOwner(uint256 buildingId) public view returns (address) {
        return buildings[buildingId].owner;
    }
}
