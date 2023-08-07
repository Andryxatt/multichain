import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
const EditorManual = (props:any) => {
    const onChange = React.useCallback((value: any, viewUpdate: any) => {
        props.setArrayOfAddressesFromEditor(value);
    }, []);
    console.log("props.editorMiror",props.editorMiror)
    return (
        <div className="editor-files">
            <CodeMirror
                value={props.editorMiror}
                height="200px"
                extensions={[javascript({ jsx: true })]}
                theme={okaidia}
                onChange={onChange}
                style={{ fontSize: 12 }}
            />
          
        </div>
    )

}
export default EditorManual