let Earth = artifacts.require("./Earth.sol")

module.exports = deployer => {
  deployer.deploy(Earth, 1000000)
}
