// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResourceManagement {
    struct Building {
        uint256 level;
        mapping(string => uint256) production;
    }

    mapping(address => mapping(uint256 => Building)) public buildings;
    mapping(address => mapping(string => uint256)) public resources;
    mapping(address => mapping(string => uint256)) public capacities;

    event Upgrade(address indexed user, uint256 buildingId, uint256 newLevel);
    event ResourceSpent(address indexed user, string resource, uint256 amount);

    function upgradeBuilding(uint256 buildingId, string[] memory resourceNames, uint256[] memory resourceCosts) public {
        require(resourceNames.length == resourceCosts.length, "Resource names and costs length mismatch");
        
        for (uint256 i = 0; i < resourceNames.length; i++) {
            require(resources[msg.sender][resourceNames[i]] >= resourceCosts[i], "Not enough resources");
            resources[msg.sender][resourceNames[i]] -= resourceCosts[i];
            emit ResourceSpent(msg.sender, resourceNames[i], resourceCosts[i]);
        }

        buildings[msg.sender][buildingId].level++;
        emit Upgrade(msg.sender, buildingId, buildings[msg.sender][buildingId].level);
    }

    function addResources(string memory resourceName, uint256 amount) public {
        resources[msg.sender][resourceName] += amount;
    }

    function setProduction(uint256 buildingId, string memory resourceName, uint256 amount) public {
        buildings[msg.sender][buildingId].production[resourceName] = amount;
    }

    function getProduction(uint256 buildingId, string memory resourceName) public view returns (uint256) {
        return buildings[msg.sender][buildingId].production[resourceName];
    }

    function setCapacity(string memory resourceName, uint256 amount) public {
        capacities[msg.sender][resourceName] = amount;
    }
}
