import React, { Component, useState, useEffect } from "react";
import "./HomePage.css";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
import { createWorker } from "tesseract.js";

import SelectLanguage from "./SelectLanguage.js";
import MultipleImageUpload from "./MultipleImageUpload";

const franc = require("franc");

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
      currentImg: "",
      language: [],
      ocr: "",
      imageSrc: "",
      OCRResult: ""
    };
    this.imageEditor = React.createRef();
    this.getImageInfo = this.getImageInfo.bind(this);
    this.displayFile = this.displayFile.bind(this);
    this.selectLang = this.selectLang.bind(this);
    this.saveImageToDisk = this.saveImageToDisk.bind(this);
    this.doOCR = this.doOCR.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
    this.editOCRResult = this.editOCRResult.bind(this);
  }

  getImageInfo() {
    console.log(this.state.imageSrc);
  }

  displayFile(file) {
    const imageEditorInst = this.imageEditor.current.getInstance();
    imageEditorInst.loadImageFromFile(file).then(result => {
      console.log("old : " + result.oldWidth + ", " + result.oldHeight);
      console.log("new : " + result.newWidth + ", " + result.newHeight);
    });
  }

  selectLang(langArr) {
    this.setState({ language: langArr });
  }

  saveImageToDisk() {
    const imageEditorInst = this.imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    if (data) {
      const mimeType = data.split(";")[0];
      const extension = data.split(";")[0].split("/")[1];
      download(data, `image.${extension}`, mimeType);
    }
  }

  doOCR = async () => {
    const worker = createWorker({
      logger: m => console.log(m)
    });
    this.setState({ ocr: "Recognizing..." });
    await worker.load(); // loads tesseract.js-core scripts
    await worker.loadLanguage(this.state.language.join("+"));
    await worker.initialize(this.state.language.join("+")); // initializes the Tesseract API
    const {
      data: { text }
    } = await worker.recognize(
      this.imageEditor.current.imageEditorInst.toDataURL()
    );
    //console.log(franc.all(text));
    this.setState({ ocr: text });
    //console.log(browser.i18n.detectLanguage(text));
    console.log("text", text);
    this.handleDetect(text);
  };

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ OCRResult: imageText });
  }

  editOCRResult(e) {
    this.setState({ OCRResult: e.target.value });
  }

  render() {
    console.log(this.state.currentImg);
    console.log(this.state.imageSrc);
    return (
      <div className="home-page">
        <div className="center">
          <h1>Photo Editor</h1>
          <MultipleImageUpload displayFile={this.displayFile} />
          <Button className="button" onClick={this.saveImageToDisk}>
            Save Image to Disk
          </Button>
          <Button onClick={this.getImageInfo}>Get Image Info</Button>
        </div>
        <ImageEditor
          ref={this.imageEditor}
          // {...imageEditorOptions}
          includeUI={{
            loadImage: {
              path: this.state.imageSrc,
              name: "image"
            },
            theme: myTheme,
            //sets the menu in the toolbar
            menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
            //We set initMenu to an empty string so that it won’t show any dialog when user load the image
            initMenu: "",
            uiSize: {
              height: `calc(100vh - 160px)`
            },
            menuBarPosition: "bottom"
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
        <button onClick={this.doOCR}>detect</button>
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
