import React from "react"
import logo from "./earth-telegram-ico.png"
import "./App.css"
import EarthContract from "./contracts/Earth.json"
import getWeb3 from "./getWeb3"

class App extends React.Component<
  {},
  {
    storageValue: number
    web3: any
    accounts: any
    contract: any
    name: string
    symbol: string
    account: string
    balance: number
  }
> {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    name: "",
    symbol: "",
    account: "",
    balance: 0
  }

  componentDidMount = async () => {
    console.log("App initialized...")
    try {
      // Get network provider and web3 instance.
      const web3: {
        eth: {
          getAccounts: Function
          net: {
            getId: Function
          }
          Contract: any
        }
      } = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts: any = await web3.eth.getAccounts()
      const account: string = accounts[0]

      // Get the contract instance.
      const networkId: number = await web3.eth.net.getId()
      const networks: any = EarthContract.networks
      const deployedNetwork: any = networks[networkId]
      const instance: any = new web3.eth.Contract(
        EarthContract.abi,
        deployedNetwork && deployedNetwork.address
      )
      console.log(instance)
      const name: string = await instance.methods.name().call()
      const symbol: string = await instance.methods.symbol().call()
      const balance: number = await instance.methods
        .balances(accounts[0])
        .call()

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        name,
        symbol,
        account,
        balance
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>EARTH Crowdsale</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Introducing {this.state.name} ({this.state.symbol})! Token price is
            0.001 Ether. {this.state.balance} EARTH total minted.
          </p>
          <a
            className="App-link"
            href="https://www.earth.engineering"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More about EARTH
          </a>
        </header>
      </div>
    )
  }
}

export default App
