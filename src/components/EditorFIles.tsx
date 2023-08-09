import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import './../style.css'
const EditorFiles = (props: any) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    // triggers when file is dropped
    const handleDrop = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files[0].name.split('.')[1] === "xlsx") {
            excelFileRead(e.dataTransfer.files);
        }
        else if (e.dataTransfer.files[0].type === "text/plain" || e.dataTransfer.files[0].name.split('.')[1] === "csv") {
            txtcsvFileRead(e.dataTransfer.files);
        }
    };
    // triggers when file is selected with click
    const handleChange = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.files[0].name.split('.')[1] === "xlsx") {
            excelFileRead(e.target.files);
        }
        else if (e.target.files[0].type === "text/plain" || e.target.files[0].type === "text/csv") {
            txtcsvFileRead(e.target.files);
        }
    };
    const txtcsvFileRead = (filesFromEvent: any) => {
        const files = filesFromEvent, f = files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target!.result?.toString();
            const allTextLines = data!.split(/\r\n|\n/);
            allTextLines.shift();
            allTextLines.pop();
            const res = allTextLines.reduce((acc: any, line: any) => {
                const [address, amount] = line.split(',');
                acc += address + "," + amount + "\n";
                return acc;
            }, "");
            props.setArrayOfAddressesFromEditor(res)
        };
        reader.readAsText(f);
    }
    const excelFileRead = (filesFromEvent: any) => {
        const files = filesFromEvent, f = files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target!.result;
            const readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
            dataParse.shift();
            //convert array element to object in parseData array 
            const res = dataParse.reduce((acc: any, line: any) => {
                acc += line[0] + "," + line[1] + "\n";
                return acc;
            }, "");
            props.setArrayOfAddressesFromEditor(res)
        };
        reader.readAsBinaryString(f);
    }
    return (
        <div className="editor-files">
            <form onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className="drag_drop-form">
                <label htmlFor="images" className="drop-container" id="dropcontainer">
                    <span className="drop-title">Drop files here</span>
                    or
                    <input ref={inputRef} type="file" multiple={true} onChange={handleChange} id="images" />
                </label>
            </form>
        </div>
    )
}
export default EditorFiles