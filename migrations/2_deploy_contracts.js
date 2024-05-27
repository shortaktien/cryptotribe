const ResourceManagement = artifacts.require("ResourceManagement");

module.exports = function(deployer) {
  deployer.deploy(ResourceManagement);
};

