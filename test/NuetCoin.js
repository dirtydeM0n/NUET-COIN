var NuetCoin = artifacts.require("./NuetCoin.sol");

contract('NuetCoin' , function(accounts) {
	var tokenInstance;

	it('initializes the contract with the correct values' , function(){
		return NuetCoin.deployed().then(function(instance){
			tokenInstance = instance ;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name , 'NUET-COIN' , 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol , 'NED' , 'has the correct symbol');
			return tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard , 'NUET-COIN v1.0' , 'has the correct standard');
		});
	});

	it('allocates the initial supply upon deployment', function() {
		return NuetCoin.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(), 1000000 , 'sets the total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to thhe admin account');
		});
	});

	it('transfers token ownership', function(){
		return NuetCoin.deployed().then(function(instance){
			tokenInstance = instance;
			// test require statement first by transferring something larger than the sender's balace
			return tokenInstance.transfer.call(accounts[1], 99999999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
			}).then(function(success){
				assert.equal(success, true, 'it returns true');
				return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'triggers one event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			// console.log(receipt);
			return tokenInstance.balanceOf( accounts[1] );
		}).then(function(balance){
			assert.equal(balance.toNumber(), 250000, 'adds the amount to to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 750000 , 'deducts the amount from the sending account');
		});
	});
	it('approves tokens for delegated transfer', function() {
		return NuetCoin.deployed().then( function(instance){
			tokenInstance = instance ;
			// calling a method wont trigger a transaction
			return tokenInstance.approve.call(accounts[1], 100); // just calls the function without creating any transaction being written into the blockchain from solidity.
		}).then(function(success) {
			assert.equal(success, true, 'it returns true');
			return tokenInstance.approve(accounts[1], 100, { from: accounts[0] }); // account A
		}).then( function(receipt) {
			assert.equal(receipt.logs.length, 1, 'trigger one event');
			assert.equal(receipt.logs[0].event, 'Approval', 'should be the approval event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
			return tokenInstance.allowance(accounts[0], accounts[1]); // account A approving account B for 100 tokens
		}).then(function(allowance) {
			assert.equal( allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
		});
	});

	it('handles delegated token trasnfers', function() {
		return NuetCoin.deployed().then(function(instance){
			tokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];
			// Transfer some tokens to fromAccount
			return tokenInstance.transfer(fromAccount, 100, { from: accounts[0]});
		}).then(function(receipt){
			// Approve spendingAccount to spend 10 from fromAccount
			

		})
	})

});

