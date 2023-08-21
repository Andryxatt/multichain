import { Web3Button } from '@web3modal/react'
import { useAccount, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import Editors from './components/Editors'
import { Balance, AccountBalance } from './components/Balance'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { ethereumContractConfig, zkSynkContractConfig, lineaContractConfig, usdcContractConfig } from './components/contracts'

export function App() {
  const { chain } = useNetwork()
  const { isConnected, address } = useAccount()
  const [tokenAddres, setTokenAddres] = useState<any>("0x45067035BCeba873A414d6befca1A1ebda2Ea101")
  const [isEthOrToken, setIsEthOrToken] = useState<string>("ETH");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currentContract, setCurrentContract] = useState<any>()
  const [validArray, setValidArray] = useState<any>([]);
  useEffect(() => {
    //TODO change to your own contract with network name or chainId
    setCurrentContract(chain?.name === "ethereum" ? ethereumContractConfig : chain?.name === "zkSynk" ? zkSynkContractConfig : lineaContractConfig)
  }, [chain])
  const { write: sendETH, data: dataETH, error: errorETH, isLoading: isLoadingETH, isError: isErrorETH } = useContractWrite({
    ...currentContract,
    //TODO change to Send
    functionName: 'Send',
  })
  const {data: allowance} = useContractRead({
    abi: usdcContractConfig.abi,
    address: tokenAddres,
    functionName: 'allowance',
    args: [address!, "0x014B307A95758Cef541850fc05A570bfFadd672b"]
  })
  const { write: approve, data: dataApprove, error: errorApprove, isLoading: isLoadingApprove, isError: isErrorApprove } = useContractWrite({
    abi: usdcContractConfig.abi,
    address: tokenAddres,
    functionName: 'approve',
  })
  const { write: sendToken, data: dataToken, error: errorToken, isLoading: isLoadingToken, isError: isErrorToken } = useContractWrite({
    abi: usdcContractConfig.abi,
    address: tokenAddres,
    functionName: 'transfer',
  })
  const {data: decimals} = useContractRead({
    abi: usdcContractConfig.abi,
    address: tokenAddres,
    functionName: 'decimals',
  })
  const {
    data: receiptETH,
    isLoading: isPendingETH,
    isSuccess: isSuccessETH,
  } = useWaitForTransaction({ hash: dataETH?.hash })
  const {
    data: receiptApprove,
    isLoading: isPendingApprove,
    isSuccess: isSuccessApprove,
  } = useWaitForTransaction({ hash: dataApprove?.hash })
  const {
    data: receiptToken,
    isLoading: isPendingToken,
    isSuccess: isSuccessToken,
  } = useWaitForTransaction({ hash: dataETH?.hash })
  useEffect(() => {
    if (isSuccessApprove) {
      console.log('receiptApprove', receiptApprove)
      sendToken?.({
        args: [
          validArray.map((element: any) => element.address),
          //TODO change to if ETH parseEthers else parseUnits and add token decimals
          validArray.map((element: any) => ethers.formatUnits(element.amount, decimals?.toString()))
        ],
      })
    }
  }, [isSuccessApprove])
  return (
    <>
      <Web3Button />
      {isConnected && (
        <div>
          <div className="xy-section">
            <div className="white-bg" />
            <div className="w-container">
              <div className="xy-hero">
                <NetworkSwitcher />
                <h1 className="heading-2">Select ETHER or TOKEN</h1>
              </div>
            </div>
            <div className="xy-input-section">
              <div className="xy-output-wrapper">
                <div className="accountwrapper">
                  <Balance />
                </div>
                <div className="xy-output-bar">
                  <div className="bar-wrapper">
                    <a href="#" onClick={() => setIsEthOrToken('ETH')} className={`${isEthOrToken === "ETH" ? "button-2" : "button"} w-button`}>ETHER</a>
                    <a href="#" onClick={() => setIsEthOrToken('TOKEN')} className={`${isEthOrToken === "TOKEN" ? "button-2" : "button"} w-button`}>TOKEN</a>
                  </div>
                </div>
                <div className="w-form">
                  <form id="email-form" name="email-form" data-name="Email Form" method="get" className="form" data-wf-page-id="64dc36ed0cfc1c9b6dededa8" data-wf-element-id="abf84366-e99d-247a-dd31-323be2171a13"><label htmlFor="name-2" className="field-label">Token address</label>
                    <input type="text" onChange={(e)=>setTokenAddres(e.target.value)} className="text-field-3 w-input" maxLength={256} name="name-2" data-name="Name 2" placeholder="0x45067035BCeba873A414d6befca1A1ebda2Ea101" id="name-2" />
                    <input type="submit" defaultValue="Submit" data-wait="Please wait..." className="btn btn-flex btn-marshmallow btn-marshmallow_lavender token w-button" /></form>
                </div>
                <button onClick={() => {
                  if(isEthOrToken === "ETH"){
                    sendETH({
                      args: [
                        validArray.map((element: any) => element.address),
                        ethers.parseEther((totalAmount + 0.05).toString())
                      ],
                    })
                  }
                  else {
                    if(parseFloat(ethers.formatUnits(Number(allowance).toString())) < totalAmount){
                      approve({
                        args: [
                          currentContract.address,
                          ethers.parseUnits((totalAmount).toString(), decimals)
                        ],
                      })
                    }
                    else {
                      sendToken?.({
                        args: [
                          validArray.map((element: any) => element.address),
                          //TODO change to if ETH parseEthers else parseUnits and add token decimals
                          validArray.map((element: any) => ethers.formatUnits(element.amount, decimals))
                        ],
                      })
                    }
                  }
                }}>Send Tx</button>
                <div className="w-form">
                  <Editors setValidArray={setValidArray} validArray={validArray} setTotalAmount={setTotalAmount} totalAmount={totalAmount} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
