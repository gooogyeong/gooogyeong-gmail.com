import React, { Component } from "react";

export default class MultipleImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileObj: [],
      fileArray: []
      //file: []
      //currentImg: ""
    };
    this.selectFile = this.selectFile.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    // this.uploadFiles = this.uploadFiles.bind(this);
  }

  //   toBase64 = file =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = error => reject(error);
  //     });

  async selectFile(i, e) {
    var file = this.state.fileObj[i];
    this.props.displayFile(file);
  }

  uploadMultipleFiles(e) {
    console.log(e.target.files);
    const newFileObj = [...this.state.fileObj];
    for (let i = 0; i < e.target.files.length; i++) {
      newFileObj.push(e.target.files[i]);
    }
    this.setState({ fileObj: newFileObj });
    //this.fileObj.push(e.target.files);
    console.log(this.state.fileObj);
    const newFileArray = [];
    for (let i = 0; i < newFileObj.length; i++) {
      newFileArray.push(URL.createObjectURL(newFileObj[i]));
    }
    console.log(this.fileArray);
    this.setState({ fileArray: newFileArray });
  }

  //   uploadFiles(e) {
  //     e.preventDefault();
  //     console.log(this.state.file);
  //   }

  render() {
    console.log(this.state.fileArray);
    console.log(this.state.fileObj);
    return (
      <form>
        <div className="form-group multi-preview">
          {(this.state.fileArray || []).map((url, i) => (
            <img
              onClick={e => {
                this.selectFile(i, e);
              }}
              style={{ width: 100, heigth: 100 }}
              src={url}
              alt="..."
            />
          ))}
        </div>

        <div className="form-group">
          <input
            type="file"
            className="form-control"
            onChange={this.uploadMultipleFiles}
            multiple
          />
        </div>
        {/* <button
          type="button"
          className="btn btn-danger btn-block"
          onClick={this.uploadFiles}
        >
          Upload
        </button> */}
      </form>
    );
  }
}
