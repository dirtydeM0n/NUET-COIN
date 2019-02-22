pragma solidity ^0.4.2;

import "./NuetCoin.sol";
contract NuetCoinSale {
    address admin;
    NuetCoin public tokenContract;
    uint256 public tokenPrice;

    constructor(NuetCoin _tokenContract, uint256 _tokenPrice) public {
        // assign an admin which will have control over this tokensale contract
        admin = msg.sender;
        // interacting with the coin contract
        tokenContract = _tokenContract;
        // Token Price in exchange for ethers
        tokenPrice = _tokenPrice;
    }
}