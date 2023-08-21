import { useCallback, useEffect, useState } from "react";
import EditorFiles from "./EditorFIles";
import EditorManual from "./EditorManual";
import { ethers } from "ethers";
const Editor = (props:any) => {
    const [editorMiror, setEditorMiror] = useState<string>("");
    const [arrayOfAddressesFromEditor, setArrayOfAddressesFromEditor] = useState<any>();
    const [isValid, setIsValid] = useState<boolean>(true);
    const regxAmount = /^(?!0\d+)\d+(\.\d+)?$/;
    const validate = useCallback(() => {
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
                if(newElement.errorAddress === "" || newElement.errorAmount === ""){
                    newArray.push(newElement);
                }
            });
            if(newArray.length > 0) {
                const calculateTotal = newArray.reduce((acum: number, element: any) => acum + parseFloat(element.amount), 0);
                console.log(calculateTotal);
                props.setTotalAmount(calculateTotal);
            }
            props.setValidArray(newArray);
            setEditorMiror(arrayOfAddressesFromEditor);
        }
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrayOfAddressesFromEditor]);
    const deleteInvalid = () => {
        let newElems = "";
        const valArr: any = [];
        props.validArray.forEach((element: any, index: number) => {
            if (element.errorAddress === "" && element.errorAmount === "") {
                if (index === props.validArray.length - 1) {
                    newElems += element.address + "," + element.amount;
                }
                else {
                    newElems += element.address + "," + element.amount + "\n";
                }
                valArr.push(element);
            }
        });
        props.setValidArray(valArr);
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
            <button onClick={deleteInvalid}>Delete Invalid</button>
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