import React, { Component } from "react";

export default class MultipleImageUpload extends Component {
  fileObj = [];
  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null]
      //currentImg: ""
    };
    this.selectFile = this.selectFile.bind(this);
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    // this.uploadFiles = this.uploadFiles.bind(this);
  }

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  async selectFile(i, e) {
    var file = this.fileObj[0][i];
    this.props.displayFile(file);
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({ file: this.fileArray });
  }

  //   uploadFiles(e) {
  //     e.preventDefault();
  //     console.log(this.state.file);
  //   }

  render() {
    return (
      <form>
        <div className="form-group multi-preview">
          {(this.fileArray || []).map((url, i) => (
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
