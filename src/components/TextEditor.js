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

export default function TextEditor() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <Editor
        initialValue="hello react editor world!"
        previewStyle="tab"
        height="300px"
        initialEditType="markdown"
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
