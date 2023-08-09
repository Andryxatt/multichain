import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { Account } from './components/Account'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import Editors from './components/Editors'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <h1>Multichain</h1>
      <Web3Button />

      {isConnected && (
        <>
          <hr />
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <hr />
          <h2>Account</h2>
          <Account />
          <br />
          <hr />
        </>
      )}
      <Editors />
    </>
  )
}
