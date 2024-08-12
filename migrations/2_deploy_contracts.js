const BuildingManagement = artifacts.require("BuildingManagement");

module.exports = function(deployer) {
  deployer.deploy(BuildingManagement);
};
