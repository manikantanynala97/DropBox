import React, { Component } from "react";
import axios from "axios";

import "moment-timezone";
import moment from "moment";
import "../styles/profile.css";

import ReactLoading from "react-loading";
import { saveAs } from "file-saver";
import Table from "react-bootstrap/Table";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      timeZone: "UTC",
      selectedFile: null,
      uploaded: false,
      deleted: false,
    };
  }

  componentDidMount() {
    this.getFiles();
    this.setState({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  getFiles() {
    console.log("files being called");
    let userName = this.props.uname;
    axios
      .get("http://54.82.44.30:5000/getContent/" + userName)
      .then((res) => {
        console.log(res.data);
        this.setState({
          data: res.data,
        });
      })
      .catch((error) => {
        console.error("Error in Calling the file", error);
      });
  }

  async onFileDownload(fileName) {
    console.log("files being Downloaded..");
    let userName = this.props.uname;
    let file;
      if(userName == "Admin"){
      file =  fileName}
      else
      {
        file = userName + "/" + fileName
      }
      await axios
        .get("http://54.82.44.30:5000/downloadFile/"+ file)
        .then((res) => {
          console.log(res.data);
          saveAs("https://" + res.data, fileName);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }

  async onFileDelete(fileName) {
    console.log("Delete File");
    let userName = this.props.uname;
    let file;
      if(userName == "Admin"){
      file =  fileName}
      else
      {
        file = userName + "/" + fileName
      }
         await axios
        .get("http://54.82.44.30:5000/deleteFile/" + file)
        .then((res) => {
          console.log(res);
            this.getFiles();
          }
        )
        .catch((error) => {
          console.error("There was an error!, In the deletefile opp", error);
        });
      };


  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    console.log(this.state.selectedFile);
    
    let userName = this.props.uname;
    axios
      .post("http://54.82.44.30:5000/uploadFile/" + userName, formData)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          this.setState({
            uploaded: true,
          });
          this.getFiles();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  render() {
    function formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    return (
      <>
      <br/>
        <h1>Welcome to S3 File Storage Solutions</h1>
        {!this.state.data ? (
          <ReactLoading type={"spin"} color="black" />
        ) : (
          <>
            <div>
              <input type="file" onChange={this.onFileChange} />
              <button className="selectButton" onClick={this.onFileUpload}>Upload Files to S3</button>
              {this.state.uploaded ? <p> Uploaded successfully </p> : null}
            </div>
            <br />
            <Table className="tableDesign">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Date Modified</th>
                  <th>File Size</th>
                  <th>Download File</th>
                  <th>Delete File</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((k, i) => (
                  <tr key={k.ETag}>
                    <td>{i + 1}</td>
                    <td>{k.Key}</td>
                    <td>
                      {moment(k.LastModified).tz(this.state.timeZone).calendar()}
                    </td>
                    <td>{formatBytes(k.Size)}</td><td>
                      <button className="selectButton" onClick={() => this.onFileDownload(k.Key)}>
                        Download
                      </button>
                    </td>
                    <td><button className="selectButton" onClick={() => this.onFileDelete(k.Key)}>Delete</button></td>
                    {this.state.deleted ? <p> Deleted successfully !</p> : null}
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
          </>
        )}
        <br />
      </>
    );
  }
}

export default Profile;