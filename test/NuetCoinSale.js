var NuetCoin = artifacts.require("./NuetCoin.sol");
var NuetCoinSale = artifacts.require("./NuetCoinSale.sol");

contract('NuetCoinSale', function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // the price is wei 0.001 ether
    var buyer = accounts[1];
    var admin = accounts[0];
    var tokensAvailable = 750000; // 75percent from total supply available
    var numberOfTokens;
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
    it('facilitates token buying', function(){
        return NuetCoin.deployed().then(function(instance){
            // grabbing token instance first
            tokenInstance = instance;

            return NuetCoinSale.deployed();
        }).then(function(instance) {
            // then grab token sale instance
            tokenSaleInstance = instance;
            // Provisioning 75% of tokens to the coin-sale contract from nuetcoin contract
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        }).then(function(receipt) {
            numberOfTokens = 10;
            
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value:  tokenPrice * numberOfTokens});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'triggers one event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            
            return tokenSaleInstance.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            // trying to buy tokens different from the ether value
            // prevention from under or overpaying
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value:  tokenPrice * numberOfTokens});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'Cannot purchase more tokens than available');
        });
    });
});