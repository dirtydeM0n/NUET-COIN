pragma solidity ^0.4.2;

import "./NuetCoin.sol";
contract NuetCoinSale {
    address admin;
    NuetCoin public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    event Sell(address _buyer, uint256 _amount);

    constructor(NuetCoin _tokenContract, uint256 _tokenPrice) public {
        // assign an admin which will have control over this tokensale contract
        admin = msg.sender;
        // interacting with the coin contract
        tokenContract = _tokenContract;
        // Token Price in exchange for ethers
        tokenPrice = _tokenPrice;
    }
    // from the DS math library
    // internal function cannot be accessed externally
    // pure function do not interact with the blockchain and is purely a normal function
    function multiply(uint256 x, uint256 y) internal pure returns(uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // require that the value is equal to the tokens in ether and prevention from under or overpaying
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // require that the contract have enough contracts
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        // Check whether a transfer was successfull or not
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of the tokens sold
        tokensSold += _numberOfTokens;
        // emiting a sell event
        emit Sell(msg.sender, _numberOfTokens); // the person calling this function will be the buyer


    }
}