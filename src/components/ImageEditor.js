import React, { Component } from "react";
import ReactDOM from "react-dom";
import Selector from "./Selector";
import Slider from "react-rangeslider";
import { createWorker } from "tesseract.js";

import "react-rangeslider/lib/index.css";
import "../styles/ImageEditor.css";

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      imgData: "",
      mainCanvasVisibleStyle: {
        //display: "inline-block"
      },
      selectorVisibleStyle: {
        display: "none"
      },
      isSelectDisabled: true,
      isToolsDisabled: true,
      rotateSliderValue: 0,
      OCRResult: ""
    };
    this.doOCR = this.doOCR.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
    this.editOCRResult = this.editOCRResult.bind(this);
  }

  // * tesseract.js-core
  //? webWorker: 브라우저의 Main Thread 와 별개로 작동되는 Thread 를 생성
  //? 브라우저 렌더링 같은 Main Thread 의 작업을 방해하지 않고, 새로운 Thread 에서 스크립트를 실행
  // 브라우저의 리소스를 많이 사용해서 webWorker에서 동작/ 최초 인식 때 한번만 가져오고 이후부터는 캐시에서 불러옴
  worker = createWorker({
    logger: m => console.log(m)
  });

  getCanvasMidPoint() {
    const canvas = this.refs.resultCanvas;
    let xPoint = canvas.width / 2 - this.state.selection.width / 2;
    let yPoint = canvas.height / 2 - this.state.selection.height / 2;
    return {
      x: xPoint,
      y: yPoint
    };
  }

  loadCanvas(imgData) {
    let canvas = this.refs.resultCanvas;
    console.log(canvas);
    //<canvas class="canvas" width="1600" height="800">
    const context = canvas.getContext("2d");
    let _this = this;

    var image = new Image();
    image.onload = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      let imgSize = {
        width: image.width,
        height: image.height
      };
      _this.setState({ selection: imgSize });
      context.save();
      context.translate(
        _this.getCanvasMidPoint().x,
        _this.getCanvasMidPoint().y
      );
      context.drawImage(image, 0, 0);
      context.restore();
      _this.setState({ imgData: canvas.toDataURL("image/jpeg") });
      _this.setState({ isSelectDisabled: false });
    };
    image.src = this.state.imgData;
  }

  setSelection(pixels) {
    this.setState({ selection: pixels });
    this.setState({ isSelectDisabled: true });
    this.setState({ isToolsDisabled: false });
  }

  cropImg() {
    let selection = this.state.selection;
    let _this = this;
    const canvas = this.refs.resultCanvas;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    var image = new Image();
    image.onload = function() {
      context.save();
      let midPoint = _this.getCanvasMidPoint();
      context.translate(midPoint.x, midPoint.y);
      context.drawImage(
        image,
        selection.x,
        selection.y,
        selection.width,
        selection.height,
        0,
        0,
        selection.width,
        selection.height
      );
      context.restore();
      _this.setState({ imgData: canvas.toDataURL("image/jpeg") });
      _this.toggleSelector(false);
      _this.setState({ isSelectDisabled: false });
      _this.setState({ isToolsDisabled: true });
    };
    image.src = this.state.imgData;
  }

  loadFile() {
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    var _this = this;

    reader.onloadend = function() {
      console.log(typeof reader.result); //string
      console.log(reader.result);
      /*
      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABCQAAAJSCAIAA
      ACUX4O4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAA
      EnQAABJ0Ad5mH3gAAP+lSURBVHhe3P2Hc2PLlt6JVhHeAySLngRA71nmlPe
      WFoSjt+VPX7W61a1umZaJmSfNhDRP0nsTM/MHv+9bKzOx9wbIYtWpc+7Vi/
      gCAYIgiL137sz1y+WuPeqJUb3RR70R6Elv5Glv9CkfqWe94ee94Rc3Ij9P+
      LTQN/XyRuhVJ73uC1+kN/2RgPR1z5+HX/aGX/a0CS/24m0R6PWN6Ou+6Jv+
      mF/xN/0J6HUfFH99I/6qNwa9hHpiL3piz7qjTwvUk0L0cT7yCCpEHuYjD3J
      hUehBPnTfr3u5rns5POkSXb9f6HrQH {...}
      */
      _this.setState({ imgData: reader.result });
      _this.loadCanvas(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  toggleSelector(isToggled) {
    if (isToggled) {
      this.setState({ selectorVisibleStyle: { display: "inline-block" } });
      this.setState({ mainCanvasVisibleStyle: { display: "none" } });
    } else {
      this.setState({ selectorVisibleStyle: { display: "none" } });
      this.setState({ mainCanvasVisibleStyle: { display: "inline-block" } });
    }
  }

  rotate() {
    let value = this.state.rotateSliderValue;
    let selection = this.state.selection;
    const canvas = this.refs.resultCanvas;
    const context = canvas.getContext("2d");
    let _this = this;

    var image = new Image();
    image.onload = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      let midPoint = _this.getCanvasMidPoint();
      context.translate(midPoint.x, midPoint.y);
      context.rotate((value * Math.PI) / 180);
      context.drawImage(
        image,
        selection.x,
        selection.y,
        selection.width,
        selection.height,
        0,
        0,
        selection.width,
        selection.height
      );
      context.restore();
      _this.setState({ imgData: canvas.toDataURL("image/jpeg") });
      _this.toggleSelector(false);
      _this.setState({ isSelectDisabled: false });
      _this.setState({ isToolsDisabled: true });
    };
    image.src = this.state.imgData;
  }

  resize(percentage) {
    let selection = this.state.selection;
    const canvas = this.refs.resultCanvas;
    const context = canvas.getContext("2d");
    let _this = this;

    var image = new Image();
    image.onload = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(percentage, percentage);
      context.drawImage(
        image,
        selection.x,
        selection.y,
        selection.width,
        selection.height,
        0,
        0,
        selection.width,
        selection.height
      );
      context.restore();
      _this.setState({ imgData: canvas.toDataURL("image/jpeg") });
      _this.toggleSelector(false);
      _this.setState({ isSelectDisabled: false });
      _this.setState({ isToolsDisabled: true });
    };
    image.src = this.state.imgData;
  }

  handleRotateSlider = value => {
    this.setState({
      rotateSliderValue: value
    });
    this.rotate();
  };

  onDegreeChange() {
    this.setState({
      rotateSliderValue: this.refs.rotationTxt.value
    });
  }

  // downloadImg()
  // {
  //   console.log("downloadImg");
  //   console.log(this.state.imgData);
  //   var dt = this.state.imgData;
  //   this.refs.downloadBtn.href = dt;
  // }

  doOCR = async () => {
    // console.log("image", this.state.image);
    this.setState({ ocr: "Recognizing..." });
    await this.worker.load(); // loads tesseract.js-core scripts
    await this.worker.loadLanguage("eng");
    await this.worker.initialize("eng"); // initializes the Tesseract API
    const {
      data: { text }
    } = await this.worker.recognize(this.state.imgData);
    this.setState({ ocr: text });
    console.log("text", text);
    this.handleDetect(text);
  };

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ OCRResult: imageText });
    // const textAddCard = [...this.state.addCardForm];
    // textAddCard[0].answer = imageText; //* answer는 필수
    // this.setState({ addCardForm: textAddCard });
  }

  editOCRResult(e) {
    this.setState({ OCRResult: e.target.value });
  }

  render() {
    return (
      <div class="imageEditor">
        <canvas
          className="canvas"
          ref="resultCanvas"
          style={this.state.mainCanvasVisibleStyle}
          width="1600"
          height="800"
        />
        <div className="canvas" style={this.state.selectorVisibleStyle}>
          <Selector
            imgData={this.state.imgData}
            imgSrc={this.state.imgSrc}
            img={this.state.canvas}
            setSelection={pixels => {
              this.setSelection(pixels);
            }}
            toggleSelector={toggle => {
              this.toggleSelector(toggle);
            }}
          />
        </div>

        <div className="editorOptions">
          <div className="imageOption">
            <label htmlFor="fileBrowser"> Upload Image </label> <br />
            <input
              type="file"
              id="fileBrowser"
              onChange={this.loadFile.bind(this)}
              style={{ display: "inline-block" }}
            />
          </div>
          <button onClick={this.doOCR}>detect</button>
          <input
            value={this.state.OCRResult}
            onChange={this.editOCRResult}
          ></input>
          <div className="imageOption">
            <label htmlFor="makeSelection"> Make Selection </label> <br />
            <button
              type="button"
              id="makeSelection"
              onClick={toggle => {
                this.toggleSelector(true);
              }}
              style={{ display: "inline-block" }}
              //disabled={this.state.isSelectDisabled}
            >
              Select{" "}
            </button>
          </div>

          <div className="imageOption">
            <label htmlFor="crop"> Crop </label> <br />
            <button
              type="button"
              id="crop"
              onClick={() => {
                this.cropImg();
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              Crop{" "}
            </button>
          </div>

          <div className="imageOption">
            <label htmlFor="rotateTxt"> Rotate </label> <br />
            <input
              type="number"
              id="rotateTxt"
              ref="rotationTxt"
              onChange={this.onDegreeChange.bind(this)}
              disabled={this.state.isToolsDisabled}
            />
            <button
              type="button"
              onClick={degrees => {
                this.rotate(20);
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              Rotate{" "}
            </button>
          </div>

          <div className="imageOption">
            <label htmlFor="resize"> Resize </label> <br />
            <button
              type="button"
              id="resize"
              onClick={percentage => {
                this.resize(0.5);
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              -{" "}
            </button>
            <button
              type="button"
              onClick={percentage => {
                this.resize(1.5);
              }}
              style={{ display: "inline-block" }}
              disabled={this.state.isToolsDisabled}
            >
              {" "}
              +{" "}
            </button>
          </div>

          {/* <div className="imageOption">
            <label htmlFor="download"> Download Image </label> <br/>
            <a id="download" ref="downloadBtn" onClick={this.downloadImg.bind(this)} download="face.jpg" href={this.state.imgData}>  <button disabled={this.state.isSelectDisabled}> Download Image </button> </a>
          </div> */}
        </div>

        <div className="slider" style={{ width: "250px" }}>
          <h3 htmlFor="rotateSlider"> Rotate Angle </h3>
          <Slider
            min={-180}
            max={180}
            tooltip={false}
            value={this.state.rotateSliderValue}
            onChange={this.handleRotateSlider}
          />
          <div className="value">{this.state.rotateSliderValue}</div>
        </div>
      </div>
    );
  }
}
export default ImageEditor;
