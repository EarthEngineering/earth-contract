# EARTH Contract

## Intro

_Coming soon_

## Getting Started

### Prerequesites

[NodeJS](https://nodejs.org/en) long term support which is 12.14.0 at the time of writing.

[Truffle](https://www.trufflesuite.com) which is a development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier.

```
npm install -g truffle
```

[Ganache](https://www.trufflesuite.com/ganache) which is a one-click blockchain for local development.

### Setup

Clone the repo

```
git clone https://github.com/EarthEngineering/earth-contract.git
cd earth-contract
```

Fire up Ganache and deploy the smart contract

```
truffle migrate --reset
```

Run the test suite

```
truffle test
```

## Earth Contract

### Properties

```solidity
string public symbol = "EARTH";
string public standard = "EARTH Token v0.1.1";
uint256 public totalSupply;
```

### Events

### Transfer

Emitted each time a transfer happens

```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
);
```

### Approval

Emmitted each time a delegated transfer is approved

```solidity
event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
);
```

## More Info

Find out more about EARTH: https://www.earth.engineering

- [Telegram](https://t.me/earthengineering)
- [Twitter](https://twitter.com/earth_engineer)
- [Facebook](https://www.facebook.com/TheEarthEngineer)
- [Github](https://github.com/earthengineering)
- [Email](gabriel.earth.engineering@gmail.com)
- [Blog](https://blog.earth.engineering)

```

```
