let Earth = artifacts.require("./Earth.sol")
let EarthTokenSale = artifacts.require("./EarthTokenSale.sol")

module.exports = deployer => {
  deployer.deploy(Earth, 1000000).then(() => {
    // Token price is 0.001 Ether
    let tokenPrice = 1000000000000000
    return deployer.deploy(EarthTokenSale, Earth.address, tokenPrice)
  })
}
