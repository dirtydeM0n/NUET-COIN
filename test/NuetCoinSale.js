var NuetCoinSale = artifacts.require("./NuetCoinSale.sol");

contract('NuetCoinSale', function(accounts){
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // the price is wei 0.001 ether
    it('Initializes the contract with the correct values', function(){
        return NuetCoinSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has valid contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address, 0x0, 'token contract needs to exist');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });
});