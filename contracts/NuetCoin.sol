pragma solidity ^0.4.23 ;

contract NuetCoin {
	event Transfer(    // creating Transfer event
		address indexed _from, 
		address indexed _to,
		uint256 _value);

	// creating Approval event
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);
	
	// create constructor
	// set the total number of coins
	// read the total number of coins
	string public name = "NUET-COIN";
	string public symbol = "NED";
	string public standard = "NUET-COIN v1.0";
	uint256 public totalSupply;
	mapping (address => uint256) public balanceOf; // Associative arrays or (HashTables)
	mapping (address => mapping (address => uint256)) public allowance; // nested mapping
	//first address account A have authorized C uint256 onto second address of account B	
	
	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
		// totalSupply = 1000000;  state variable
	}
	function transfer(address _to, uint256 _value) public returns (bool success) {
		// Exception of the account does not have enough value
		require (balanceOf[msg.sender] >= _value); // if false the code below won't be executed
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value; // transferring funds
		emit Transfer(msg.sender, _to, _value);
		return true;
		}
	// approve function
    function approve(address _spender, uint256 _value) public returns(bool success) { 
		// amount we approved in this function will be stored in allowance mapping
    allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
		}
	
	// transferFrom will work based on the allowance function
	function transferFrom (address _from, address _to, uint256 _value) public returns(bool success) {
		// Require _from has enough tokens
		require(_value <= balanceOf[_from]);
		// Require allowance is big enough
		require(_value <= allowance[_from][msg.sender]);
		// change the balanceOf
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		// Update the allowance
		allowance[_from][msg.sender] -= _value;
		// Transfer event emit
		emit Transfer(_from, _to, _value);
		// return a boolean
		return true;
	}
	
}