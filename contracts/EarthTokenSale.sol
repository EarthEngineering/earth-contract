pragma solidity >=0.5.11 <0.7.0;

import "./Earth.sol";

contract EarthTokenSale {
    address payable admin;
    Earth public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(Earth tokenContract, uint256 tokenPrice) public {
        admin = msg.sender;
        tokenContract = tokenContract;
        tokenPrice = tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "");
    }

    function buyTokens(uint256 numberOfTokens) public payable {
        require(msg.value == multiply(numberOfTokens, tokenPrice), "");
        require(tokenContract.balances(admin) >= numberOfTokens, "");
        require(tokenContract.transfer(msg.sender, numberOfTokens), "");

        tokensSold += numberOfTokens;

        emit Sell(msg.sender, numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin, "");
        require(tokenContract.transfer(admin, tokenContract.balances(admin)), "");

        // Just transfer the balance to the admin
        admin.transfer(address(this).balance);
    }
}