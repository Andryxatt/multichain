import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'

import { Account } from './components/Account'
import { Balance } from './components/Balance'
import { BlockNumber } from './components/BlockNumber'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import { ReadContract } from './components/ReadContract'
import { ReadContracts } from './components/ReadContracts'
import { ReadContractsInfinite } from './components/ReadContractsInfinite'
import { SendTransaction } from './components/SendTransaction'
import { SendTransactionPrepared } from './components/SendTransactionPrepared'
import { SignMessage } from './components/SignMessage'
import { SignTypedData } from './components/SignTypedData'
import { Token } from './components/Token'
import { WatchContractEvents } from './components/WatchContractEvents'
import { WatchPendingTransactions } from './components/WatchPendingTransactions'
import { WriteContract } from './components/WriteContract'
import { WriteContractPrepared } from './components/WriteContractPrepared'
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
