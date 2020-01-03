let Earth = artifacts.require("./Earth.sol")

let main = async () => {
  contract("Earth", async accounts => {
    it("initializes the contract with the correct values", async () => {
      let instance = await Earth.deployed()

      let name = await instance.name()
      assert.equal(name, "EARTH Token", "has the correct name")

      let symbol = await instance.symbol()
      assert.equal(symbol, "EARTH", "has the correct symbol")

      let standard = await instance.standard()
      assert.equal(standard, "EARTH Token v0.0.1", "has the correct standard")
    })

    it("allocates the initial supply upon deployment", async () => {
      let instance = await Earth.deployed()
      let totalSupply = await instance.totalSupply()
      assert.equal(
        totalSupply.toNumber(),
        1000000,
        "sets the total supply to 1,000,000"
      )

      let adminBalance = await instance.balanceOf(accounts[0])
      assert.equal(
        adminBalance.toNumber(),
        1000000,
        "it allocates the initial supply to the admin account"
      )
    })

    it("transfers token ownership", async () => {
      let instance = await Earth.deployed()

      try {
        await instance.transfer.call(accounts[1], 99999999999999999999999)
      } catch (error) {
        assert.equal(error.reason, "invalid number value")
      }

      try {
        await instance.transfer.call(accounts[1], 1000001, {
          from: accounts[0]
        })
      } catch (error) {
        assert(
          error.hijackedStack.indexOf("revert") >= 0,
          "Sender doesn't have enough EARTH"
        )
      }

      let success = await instance.transfer.call(accounts[1], 260000, {
        from: accounts[0]
      })
      assert.equal(success, true, "it returns true")

      let res = await instance.transfer(accounts[1], 250000, {
        from: accounts[0]
      })

      assert.equal(res.logs.length, 1, "triggers one event")
      assert.equal(
        res.logs[0].event,
        "Transfer",
        'should be the "Transfer" event'
      )
      assert.equal(
        res.logs[0].args.from,
        accounts[0],
        "logs the account the tokens are transferred from"
      )
      assert.equal(
        res.logs[0].args.to,
        accounts[1],
        "logs the account the tokens are transferred to"
      )
      assert.equal(res.logs[0].args.value, 250000, "logs the transfer amount")

      let balance1 = await instance.balanceOf(accounts[1])
      assert.equal(
        balance1.toNumber(),
        260000,
        "adds the amount to the receiving account"
      )

      let balance0 = await instance.balanceOf(accounts[0])
      assert.equal(
        balance0.toNumber(),
        740000,
        "deducts the amount from the sending account"
      )
    })
  })
}
main()
