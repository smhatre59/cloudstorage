import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Tree from 'react-file-tree';
import './App.css';
import Dropzone from 'react-dropzone';
var apiBaseUrl = "http://localhost:4000/api/";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

class UploadScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      filecount:10,
      role:'teacher',
      filesPreview:[],
      filesToBeSent:[]
    }
  }
  componentWillMount(){
  }
  onDrop(acceptedFiles, rejectedFiles) {
      // console.log('Accepted files: ', acceptedFiles[0].name);
      var filesToBeSent=this.state.filesToBeSent;
      filesToBeSent.push(acceptedFiles);
      var filesPreview=[];
      for(var i in filesToBeSent){
        filesPreview.push(<div>
          {filesToBeSent[i][0].name}
          </div>
        )
      }
      this.setState({filesToBeSent,filesPreview});
      // console.log('Rejected files: ', rejectedFiles);
}
handleClick(event){
  // console.log("handleClick",event);
  if(this.state.filesToBeSent.length>0){
    var filesArray = this.state.filesToBeSent;
    var req = request.post(apiBaseUrl+'fileprint');
    for(var i in filesArray){
        // console.log("files",filesArray[i][0]);
        req.attach(filesArray[i][0].name,filesArray[i][0])
    }
    req.end(function(err,res){
      if(err){
        console.log("error ocurred");
      }
      console.log("res",res);
      // self.props.indexthis.switchPage();
    });
  }
  else{
    alert("Please upload some files first");
  }
}
  render() {
    return (
      <div className="App">
      <MuiThemeProvider>
        <div>
        <AppBar
           title="Print Files"
         />
         </div>
      </MuiThemeProvider>
          <center>
          <div>
            You can print {this.state.filecount} files since you are {this.state.role}
          </div>

          <Dropzone onDrop={(files) => this.onDrop(files)}>
                <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div>
          Files to be printed are:
          {this.state.filesPreview}
          </div>
          </center>
      <MuiThemeProvider>
           <RaisedButton label="Print Files" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
      </MuiThemeProvider>
          </div>
    );
  }
}

const style = {
  margin: 15,
};

export default UploadScreen;