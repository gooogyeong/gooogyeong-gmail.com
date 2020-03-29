import React, { Component } from "react";

export default class MultipleImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   fileObj: [],
      //   fileArray: []
      //file: []
      //currentImg: ""
    };
    // this.selectFile = this.selectFile.bind(this);

    //this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    // this.uploadFiles = this.uploadFiles.bind(this);
  }

  //   toBase64 = file =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = error => reject(error);
  //     });

  //   selectFile(i, e) {
  //     //console.log(i);
  //     var file = this.state.fileObj[i];
  //     this.props.displayFile(file, i);
  //   }

  //   uploadMultipleFiles(e) {
  //     console.log(e.target.files);
  //     const newFileObj = [...this.state.fileObj];
  //     for (let i = 0; i < e.target.files.length; i++) {
  //       newFileObj.push(e.target.files[i]);
  //     }
  //     this.setState({ fileObj: newFileObj });
  //     //this.fileObj.push(e.target.files);
  //     console.log(this.state.fileObj);
  //     const newFileArray = [];
  //     for (let i = 0; i < newFileObj.length; i++) {
  //       newFileArray.push(URL.createObjectURL(newFileObj[i]));
  //     }
  //     console.log(this.fileArray);
  //     this.setState({ fileArray: newFileArray });
  //   }

  //   uploadFiles(e) {
  //     e.preventDefault();
  //     console.log(this.state.file);
  //   }

  render() {
    return (
      <form>
        <div className="form-group multi-preview">
          {(this.props.fileArray || []).map((url, i) => (
            <img
              onClick={e => {
                this.props.selectFile(i, e);
              }}
              style={{ width: 100, heigth: 100 }}
              src={url} //<img src="blob:http://localhost:3000/3c9d9cbd-7efb-4454-86ae-6323f70e79e9" alt="..." style="width: 100px;">
              alt="..."
            />
          ))}
        </div>

        <div className="form-group">
          <input
            type="file"
            className="form-control"
            onChange={this.props.uploadMultipleFiles}
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
