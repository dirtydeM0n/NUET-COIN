var NuetCoin = artifacts.require("./NuetCoin.sol");
var NuetCoinSale = artifacts.require("./NuetCoinSale.sol");

module.exports = function(deployer) { // using a promise chain to pass parameters into coin-sale contract
  deployer.deploy(NuetCoin , 1000000).then(function(){
    var tokenPrice = 1000000000000000; // the price is wei 0.001 ether
   return deployer.deploy(NuetCoinSale, NuetCoin.address, tokenPrice);
  });

};
