pragma solidity >=0.4.21 <0.7.0;

contract Earth {
    string public name = "EARTH Token";
    string public symbol = "EARTH";
    string public standard = "EARTH Token v0.1.1";
    uint256 public totalSupply;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 initialSupply) public {
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        // validate in put
        require(balanceOf[msg.sender] >= value, "Sender doesn't have enough EARTH");

        // update balances
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        // get sender address
        address from = msg.sender;

        // emit event
        emit Transfer(from, to, value);

        return true;

    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

        function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);
        // require(balanceOf[from] > value, "From doesn't have enough EARTH");
        // require(allowance[from][msg.sender] > value, "Sender doesn't have enough EARTH");

        balanceOf[from] -= value;
        balanceOf[to] += value;

        allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);

        return true;
    }
}
