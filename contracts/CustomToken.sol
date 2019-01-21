pragma solidity ^0.5.0;

contract CustomToken {
    string public name = "RAZORx";
    string public symbol = "RZ";
    uint public totaltoken;

    event Transfer(
        address index_from,
        address index_to,
        uint _value
    );

    event Approval(
        address _owner,
        address _spender,
        uint256 _value
    );

    event Sell(
        address _buyer,
        uint256 _amount
    );

    uint256 public tokenPrice;
    uint256 public tokensSold;

    mapping(address => uint) public balanceof;
    mapping(address => mapping(address => uint)) public allowance;

    constructor (uint _initialAmount) public {
        balanceof[msg.sender] = _initialAmount;
        totaltoken = _initialAmount;
    }

    function transfer(address _to, uint _value) public returns (bool check){
        require(balanceof[msg.sender] >= _value);
        balanceof[msg.sender] -= _value;
        balanceof[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool check) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns (bool check){
        require(_value <= balanceof[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceof[_from] -= _value;
        balanceof[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;

    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == _numberOfTokens * tokenPrice);
        require(transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    /* all the getter function from this Contract*/
    function getterToken() public view returns (uint) {
        return totaltoken;
    }


}
