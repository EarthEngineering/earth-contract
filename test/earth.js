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
      assert.equal(standard, "EARTH Token v0.1.1", "has the correct standard")
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

      let success = await instance.transfer.call(accounts[1], 250000, {
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
        250000,
        "adds the amount to the receiving account"
      )

      let balance0 = await instance.balanceOf(accounts[0])
      assert.equal(
        balance0.toNumber(),
        750000,
        "deducts the amount from the sending account"
      )
    })

    it("approves tokens for delegated transfer", async () => {
      let instance = await Earth.deployed()
      let success = await instance.approve.call(accounts[1], 100)
      assert.equal(success, true, "it returns true")

      let receipt = await instance.approve(accounts[1], 100, {
        from: accounts[0]
      })
      assert.equal(receipt.logs.length, 1, "triggers one event")
      assert.equal(
        receipt.logs[0].event,
        "Approval",
        'should be the "Approval" event'
      )
      assert.equal(
        receipt.logs[0].args.owner,
        accounts[0],
        "logs the account the tokens are authorized by"
      )
      assert.equal(
        receipt.logs[0].args.spender,
        accounts[1],
        "logs the account the tokens are authorized to"
      )
      assert.equal(receipt.logs[0].args.value, 100, "logs the transfer amount")

      let allowance = await instance.allowance(accounts[0], accounts[1])
      assert.equal(
        allowance.toNumber(),
        100,
        "stores the allowance for delegated trasnfer"
      )
    })

    it("handles delegated token transfers", async () => {
      let instance = await Earth.deployed()
      fromAccount = accounts[2]
      toAccount = accounts[3]
      spendingAccount = accounts[4]

      // Transfer some tokens to fromAccount
      let receipt = await instance.transfer(fromAccount, 100, {
        from: accounts[0]
      })

      // Approve spendingAccount to spend 10 tokens form fromAccount
      receipt = await instance.approve(spendingAccount, 10, {
        from: fromAccount
      })

      try {
        receipt = await instance.transferFrom(fromAccount, toAccount, 9999, {
          from: spendingAccount
        })
      } catch (error) {
        assert(
          error.hijackedStack.indexOf("revert") >= 0,
          "cannot transfer value larger than balance"
        )
      }

      try {
        receipt = await instance.transferFrom(fromAccount, toAccount, 20, {
          from: spendingAccount
        })
      } catch (error) {
        assert(
          error.hijackedStack.indexOf("revert") >= 0,
          "cannot transfer value larger than approved amount"
        )
      }

      let success = await instance.transferFrom.call(
        fromAccount,
        toAccount,
        10,
        {
          from: spendingAccount
        }
      )
      assert.equal(success, true)

      receipt = await instance.transferFrom(fromAccount, toAccount, 10, {
        from: spendingAccount
      })
      assert.equal(receipt.logs.length, 1, "triggers one event")
      assert.equal(
        receipt.logs[0].event,
        "Transfer",
        'should be the "Transfer" event'
      )
      assert.equal(
        receipt.logs[0].args.from,
        fromAccount,
        "logs the account the tokens are transferred from"
      )
      assert.equal(
        receipt.logs[0].args.to,
        toAccount,
        "logs the account the tokens are transferred to"
      )
      assert.equal(receipt.logs[0].args.value, 10, "logs the transfer amount")

      let balance = await instance.balanceOf(fromAccount)
      assert.equal(
        balance.toNumber(),
        90,
        "deducts the amount from the sending account"
      )
      balance = await instance.balanceOf(toAccount)
      assert.equal(
        balance.toNumber(),
        10,
        "adds the amount from the receiving account"
      )
      let allowance = await instance.allowance(fromAccount, spendingAccount)
      assert.equal(
        allowance.toNumber(),
        0,
        "deducts the amount from the allowance"
      )
    })
  })
}
main()
