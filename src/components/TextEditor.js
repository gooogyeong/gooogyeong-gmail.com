import React, { Component } from "react";

import { Editor } from "@toast-ui/react-editor";

import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
//import "@toast-ui/editor/dist/toastui-editor-contents.min.css";
// import "tui-editor/dist/tui-editor.min.css";
// import "tui-editor/dist/tui-editor-contents.min.css";

//import "tui-grid/dist/tui-grid.css";
import Grid from "@toast-ui/react-grid";

//import "./styles.css";

const template = `| question | answer | note |
| -------- | ------ | ---- |
|  |  |  |`;

export default function TextEditor() {
  return (
    <div className="App">
      <Editor
        initialValue={template}
        //        //initialValue="hello react editor world!"
        //        initialValue={`| question | answer | note |
        //        | -------- | ------ | ---- |
        //        | | | |`}
        previewStyle="tab"
        height="300px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        usageStatistics={false}
      />
    </div>
  );
}

// export default class TextEditor extends Component {
//   //   gridRef = React.createRef();

//   //   data = [
//   //     { id: 1, name: "Editor" },
//   //     { id: 2, name: "Grid" },
//   //     { id: 3, name: "Chart" }
//   //   ];

//   //   columns = [
//   //     { name: "question", header: "Question" },
//   //     { name: "answer", header: "Answer" },
//   //     { name: "note", header: "Note" }
//   //   ];

//   //   handleAppendRow = () => {
//   //     this.gridRef.current.getInstance().appendRow({});
//   //   };

//   render() {
//     return (
//       <div>
//         <Editor
//           initialValue="hello react editor world!"
//           previewStyle="tab"
//           height="300px"
//           initialEditType="markdown"
//           useCommandShortcut={true}
//           usageStatistics={false}
//         />
//       </div>
//     );
//   }
// }
