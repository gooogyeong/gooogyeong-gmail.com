import React, { Component, useState, useEffect } from "react";
import "./HomePage.css";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import Button from "react-bootstrap/Button";
import { createWorker } from "tesseract.js";

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
      imageSrc: "",
      OCRResult: ""
    };
    this.imageEditor = React.createRef();
    this.saveImageToDisk = this.saveImageToDisk.bind(this);
    this.doOCR = this.doOCR.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
  }
  // * tesseract.js-core
  //? webWorker: 브라우저의 Main Thread 와 별개로 작동되는 Thread 를 생성
  //? 브라우저 렌더링 같은 Main Thread 의 작업을 방해하지 않고, 새로운 Thread 에서 스크립트를 실행
  // 브라우저의 리소스를 많이 사용해서 webWorker에서 동작/ 최초 인식 때 한번만 가져오고 이후부터는 캐시에서 불러옴
  worker = createWorker({
    logger: m => console.log(m)
  });

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
    // console.log("image", this.state.image);
    this.setState({ ocr: "Recognizing..." });
    await this.worker.load(); // loads tesseract.js-core scripts
    await this.worker.loadLanguage("eng");
    await this.worker.initialize("eng"); // initializes the Tesseract API
    const {
      data: { text }
    } = await this.worker.recognize(
      this.imageEditor.current.imageEditorInst.toDataURL()
    );
    this.setState({ ocr: text });
    console.log("text", text);
    this.handleDetect(text);
  };

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ OCRResult: imageText });
  }

  render() {
    console.log(this.state.imageSrc);
    //console.log(this.imageEditor.current.getInstance().bind(this));
    //console.dir(this.imageEditor.current);
    return (
      <div className="home-page">
        <div className="center">
          <h1>Photo Editor</h1>
          <Button className="button" onClick={this.saveImageToDisk}>
            Save Image to Disk
          </Button>
        </div>
        <ImageEditor
          ref={this.imageEditor}
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
        <textarea
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
