var NuetCoin = artifacts.require("./NuetCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(NuetCoin , 1000000);
};
