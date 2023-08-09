import { useCallback, useEffect, useState } from "react";
import EditorFiles from "./EditorFIles";
import EditorManual from "./EditorManual";
import { ethers } from "ethers";
import { useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
//TODO Configutre your own contract for each network
import { wagmiContractConfig } from "./contracts";
import { BaseError } from "viem";
import { stringify } from "../utils/stringify";
const Editor = () => {
    const { chain } = useNetwork()
    const [editorMiror, setEditorMiror] = useState<string>("");
    const [arrayOfAddressesFromEditor, setArrayOfAddressesFromEditor] = useState<any>();
    const [validArray, setValidArray] = useState<any>([]);
    const [isValid, setIsValid] = useState<boolean>(true);
    const regxAmount = /^(?!0\d+)\d+(\.\d+)?$/;
    const validate = useCallback(() => {
        if (arrayOfAddressesFromEditor !== undefined) {
            const arrayOfElements = arrayOfAddressesFromEditor?.split("\n")[0] === "" ? [] : arrayOfAddressesFromEditor?.split("\n");
            let newArray: any = [];
            arrayOfElements.forEach(async (element: any, index: number) => {
                let newElement: any;
                if (element.split(",")[0] !== undefined || element.split(",")[1] !== undefined) {
                    console.log(regxAmount.test(element.split(",")[1].trim()))
                    newElement = {
                        address: element.split(",")[0],
                        amount: element.split(",")[1],
                        errorAddress: !ethers.isAddress(element.split(",")[0]) ? "is not valid" : "",
                        errorAmount: element.split(",")[1] === undefined || !regxAmount.test(element.split(",")[1].trim()) ? "is not valid" : "",
                        row: index + 1
                    }
                }
                else {
                    newElement = {
                        address: element.split(",")[0],
                        amount: "",
                        errorAddress: !ethers.isAddress(element.split(",")[0]) ? "is not valid" : "",
                        errorAmount: "is not valid",
                        row: index + 1
                    }
                    setIsValid(false)
                }
                newArray.push(newElement);
            });
            setValidArray(newArray);
            setEditorMiror(arrayOfAddressesFromEditor);
        }
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrayOfAddressesFromEditor]);
    const deleteInvalid = () => {
        let newElems = "";
        const valArr: any = [];
        validArray.forEach((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {
                if (index === validArray.length - 1) {
                    newElems += element.address + "," + element.amount;
                }
                else {
                    newElems += element.address + "," + element.amount + "\n";
                }
                valArr.push(element);
            }
        });
        setValidArray(valArr);
        setEditorMiror(newElems);
        setArrayOfAddressesFromEditor(newElems);
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }
    const [currentContract, setCurrentContract] = useState<any>()
    useEffect(() => {
        //TODO change to your own contract with network name or chainId
        setCurrentContract(chain?.name === "" ? wagmiContractConfig : chain?.name === "" ? wagmiContractConfig : wagmiContractConfig)
    }, [chain])
    const { write, data, error, isLoading, isError } = useContractWrite({
        ...currentContract,
        //TODO change to Send
        functionName: 'mint',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({ hash: data?.hash })
    useEffect(() => {
        validate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrayOfAddressesFromEditor])
    return (
        <div>
            <EditorManual editorMiror={editorMiror} setArrayOfAddressesFromEditor={setArrayOfAddressesFromEditor} />
            <EditorFiles setArrayOfAddressesFromEditor={setArrayOfAddressesFromEditor} />
            <button className="" onClick={deleteInvalid}>Delete them</button>
            <div className={!isValid ? "flex flex-col rounded-sm bg-white border-2 border-red-400 p-3 sm:p-1 mb-1" : "hidden"}>
                {
                    !isValid && arrayOfAddressesFromEditor.length > 0 && arrayOfAddressesFromEditor.map((element: any, index: number) => {

                        if (element.errorAddress !== "" || element.errorAmount !== "") {
                            return (
                                <>
                                    {<span key={index} className="text-red-600 text-xs mb-1">Line {element.row} : {element.address} - invalid wallet address or wrong amount. E.g:address,number</span>}
                                </>
                            )
                        }
                        else return <></>
                    })
                }
            </div>
            <button onClick={() => {
                write({
                    args: [
                        validArray.map((element: any) => element.address),
                        //TODO change to if ETH parseEthers else parseUnits and add token decimals
                        validArray.map((element: any) => ethers.parseUnits(element.amount))
                    ],
                })
            }}>Send Tx</button>

            {isLoading && <div>Check wallet...</div>}
            {isPending && <div>Transaction pending...</div>}
            {isSuccess && (
                <>
                    <div>Transaction Hash: {data?.hash}</div>
                    <div>
                        Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
                    </div>
                </>
            )}
            {isError && <div>{(error as BaseError)?.shortMessage}</div>}
        </div>
    )
}
export default Editor