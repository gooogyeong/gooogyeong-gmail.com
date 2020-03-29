import React, { Component } from "react";

export default class MultipleImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <form>
        <div className="form-group multi-preview">
          {(this.props.fileArray || []).map((url, i) => (
            <span>
              <img
                id={`img${i}`}
                onClick={e => {
                  this.props.selectFile(i, e);
                }}
                style={{ width: 100, heigth: 100 }}
                src={url} //<img src="blob:http://localhost:3000/3c9d9cbd-7efb-4454-86ae-6323f70e79e9" alt="..." style="width: 100px;">
                alt="..."
              />
              <input
                id={`checkbox${i}`}
                name="file"
                type="checkbox"
                value={`checkbox${i}`}
                onChange={e => {
                  console.log("check");
                  this.props.handleCheck(i, e);
                }}
              />
            </span>
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
      </form>
    );
  }
}
