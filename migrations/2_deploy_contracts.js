let Earth = artifacts.require("./Earth.sol")
let EarthTokenSale = artifacts.require("./EarthTokenSale.sol")

module.exports = deployer => {
  let totalMinted = 100000000000
  deployer.deploy(Earth, totalMinted).then(() => {
    // Token price is 0.001 Ether
    let tokenPrice = 1000000000000000
    return deployer.deploy(EarthTokenSale, Earth.address, tokenPrice)
  })
}
