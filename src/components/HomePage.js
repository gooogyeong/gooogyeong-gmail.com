import React, { Component, useState, useEffect } from "react";
import "./HomePage.css";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
import { createWorker } from "tesseract.js";

import SelectLanguage from "./SelectLanguage.js";
import MultipleImageUpload from "./MultipleImageUpload";

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const download = require("downloadjs");
const myTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundColor": "#151515",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileObj: [],
      fileArray: [],
      currentImg: "",
      language: [],
      ocr: "",
      imageSrc: "",
      OCRResult: ""
    };
    this.imageEditor = React.createRef();
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.displayFile = this.displayFile.bind(this);
    this.selectLang = this.selectLang.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.doOCR = this.doOCR.bind(this);
    //this.doOCRAll = this.doOCRAll.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
    this.editOCRResult = this.editOCRResult.bind(this);
  }

  uploadMultipleFiles(e) {
    console.log(e.target.files);
    const newFileObj = [...this.state.fileObj];
    for (let i = 0; i < e.target.files.length; i++) {
      newFileObj.push(e.target.files[i]);
    }
    this.setState({ fileObj: newFileObj });
    //this.fileObj.push(e.target.files);

    const newFileArray = [];
    for (let i = 0; i < newFileObj.length; i++) {
      newFileArray.push(URL.createObjectURL(newFileObj[i]));
    }
    this.setState({ fileArray: newFileArray });
  }

  selectFile(i, e) {
    //console.log(i);
    var file = this.state.fileObj[i];
    this.displayFile(file, i);
  }

  displayFile(file, i) {
    console.log(i);
    const imageEditorInst = this.imageEditor.current.getInstance();
    imageEditorInst.loadImageFromFile(file).then(result => {
      console.log("display success");
      // console.log("old : " + result.oldWidth + ", " + result.oldHeight);
      // console.log("new : " + result.newWidth + ", " + result.newHeight);
    });
  }

  selectLang(langArr) {
    this.setState({ language: langArr });
  }

  // dataURItoBlob(dataURI) {
  //   var binary = atob(dataURI.split(",")[1]);
  //   var array = [];
  //   for (var i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  // }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  saveChange() {
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    console.log(imageEditorInst);
    //console.log(imageEditorInst._graphics.imageName);
    const fileName = imageEditorInst._graphics.imageName;
    //console.log(fileName.split(".")[0]);
    // console.log(imageEditorInst._graphics.canvasImage._originalElement.src);
    // imageEditorInst.toBlob(function(blob) {
    //   console.log(blob);
    // });
    const data = imageEditorInst.toDataURL();
    // const blob = this.dataURItoBlob(data);
    // console.log(blob);
    let file;
    if (data) {
      const mimeType = data.split(";")[0];
      //console.log(mimeType); //data:image/png
      const extension = data.split(";")[0].split("/")[1];
      //console.log(extension); //png
      //download(data, `image.${extension}`, mimeType);
      file = this.dataURLtoFile(data, `${fileName.split(".")[0]}.${extension}`);
    }
    console.log(file);
    const newFileObj = [...this.state.fileObj];
    const newFileArray = [...this.state.fileArray];
    for (let i = 0; i < newFileObj.length; i++) {
      if (newFileObj[i].name === fileName) {
        newFileObj[i] = file;
        newFileArray[i] = URL.createObjectURL(file);
      }
    }
    this.setState({ fileObj: newFileObj });
    this.setState({ fileArray: newFileArray });
  }

  // doOCR = async () => {
  //   const worker = createWorker({
  //     logger: m => console.log(m)
  //   });
  //   this.setState({ ocr: "Recognizing..." });
  //   let targetLang = "";
  //   if (this.state.language.length === 1) {
  //     targetLang = this.state.language[0];
  //   } else if (this.state.language.length > 1) {
  //     targetLang = this.state.language.join("+");
  //   }
  //   await worker.load(); // loads tesseract.js-core scripts
  //   await worker.loadLanguage(targetLang);
  //   await worker.initialize(targetLang); // initializes the Tesseract API
  //   const {
  //     data: { text }
  //   } = await worker.recognize(
  //     this.imageEditor.current.imageEditorInst.toDataURL()
  //   );
  //   this.setState({ ocr: text });
  //   console.log("text", text);
  //   this.handleDetect(text);
  // };

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  //TODO: create separate card / create one card 나눠야함
  doOCR = async () => {
    this.setState({ ocr: "Recognizing..." });
    let targetLang = "";
    if (this.state.language.length === 1) {
      targetLang = this.state.language[0];
    } else if (this.state.language.length > 1) {
      targetLang = this.state.language.join("+");
    }

    let newOCR = "";
    const dataURLArr = this.state.fileObj.map(
      async function(fileObj) {
        const dataURL = await this.toBase64(fileObj);
        const worker = createWorker({
          logger: m => console.log(m)
        });
        await worker.load(); // loads tesseract.js-core scripts
        await worker.loadLanguage(targetLang);
        await worker.initialize(targetLang); // initializes the Tesseract API
        const {
          data: { text }
        } = await worker.recognize(dataURL);
        return text;
        //   newOCR += text;
        //   console.log(newOCR);
        //   return newOCR;
      }.bind(this)
    );
    return Promise.all(dataURLArr)
      .then(res => {
        //console.log(res); //배열
        this.setState({ OCRResult: res });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ OCRResult: imageText });
  }

  editOCRResult(e) {
    this.setState({ OCRResult: e.target.value });
  }

  render() {
    // console.log(this.state.fileObj);
    // console.log(this.state.fileArray);
    //["blob:http://localhost:3000/a8984720-e245-4473-97ad-a729f87302a6", {...s}]
    return (
      <div className="home-page">
        <div className="center">
          <MultipleImageUpload
            fileArray={this.state.fileArray}
            uploadMultipleFiles={this.uploadMultipleFiles}
            selectFile={this.selectFile}
            displayFile={this.displayFile}
          />
          <Button className="button" onClick={this.saveChange}>
            Save Change
          </Button>
        </div>
        <ImageEditor
          ref={this.imageEditor}
          // {...imageEditorOptions}
          includeUI={{
            loadImage: {
              path:
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", //this.state.imageSrc,
              name: "Blank" //"image"
            },
            theme: myTheme,
            //sets the menu in the toolbar
            menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
            //We set initMenu to an empty string so that it won’t show any dialog when user load the image
            initMenu: "",
            uiSize: {
              height: `calc(100vh - 160px)`
            },
            menuBarPosition: "top"
          }}
          //sets the size of the image editor
          cssMaxHeight={window.innerHeight}
          cssMaxWidth={window.innerWidth}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70
          }}
          usageStatistics={true}
        />
        {/* <button onClick={this.doOCR}>detect current item</button> */}
        <button onClick={this.doOCR}>detect all item(s)</button>
        <SelectLanguage selectLang={this.selectLang} />
        <textarea
          onChange={this.editOCRResult}
          value={this.state.OCRResult}
          style={{
            width: 1000,
            height: 500
          }}
        ></textarea>
      </div>
    );
  }
}
export default HomePage;
