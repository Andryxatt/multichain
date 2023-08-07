import { useCallback, useEffect, useState } from "react";
import EditorFiles from "./EditorFIles";
import EditorManual from "./EditorManual";
import { ethers } from "ethers";
import { useDebounce } from "../hooks/useDebounce";

const Editor = (props: any) => {
    const [editorMiror, setEditorMiror] = useState<string>("");
    const [arrayOfAddressesFromEditor, setArrayOfAddressesFromEditor] = useState<any>();
    const [validArray, setValidArray] = useState<any>([]);
    const [isValid, setIsValid] = useState<boolean>(true);
    const regx = /^\d+(\.\d+)?$/;
    const validate = useCallback(() => {
        console.log("arrayOfAddressesFromEditor", arrayOfAddressesFromEditor);
        if (arrayOfAddressesFromEditor !== undefined) {
            const arrayOfElements = arrayOfAddressesFromEditor?.split("\n")[0] === "" ? [] : arrayOfAddressesFromEditor?.split("\n");
            let newArray: any = [];
            arrayOfElements.forEach(async (element: any, index: number) => {
                let newElement: any;
                if (element.split(",")[0] !== undefined || element.split(",")[1] !== undefined) {
                    newElement = {
                        address: element.split(",")[0],
                        amount: element.split(",")[1],
                        errorAddress: !ethers.isAddress(element.split(",")[0]) ? "is not valid" : "",
                        errorAmount: element.split(",")[1] === undefined || !regx.test(element.split(",")[1].trim()) ? "is not valid" : "",
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
        console.log("deleteInvalid");
        let newElems = "";
        const valArr: any = [];
        console.log("validArray", validArray);
        validArray.forEach((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {
                if (index === validArray.length - 1) {
                    newElems += element.address + "," + element.amount;
                }
                else {
                    newElems += element.address + "," + element.amount + "\n";
                }
                console.log("element", element);
                valArr.push(element);
            }
        });
        console.log("valArr", valArr);
        setValidArray(valArr);
        setEditorMiror(newElems);
        setArrayOfAddressesFromEditor(newElems);
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }
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
        </div>
    )
}
export default Editor