import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600,red500, greenA200} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import Checkbox from 'material-ui/Checkbox';
import './App.css';
import FontIcon from 'material-ui/FontIcon';
var apiBaseUrl = "http://localhost:4000/api/";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');
export default class PastFiles extends Component {
  constructor(props){
    super(props);
    this.state={
      role:'student',
      filesPreview:[],
      previousfilesList:[],
      filesToBePrinted:[]
    }
  }
componentDidMount(){
  var self=this;
  var req = request.get(apiBaseUrl + 'fileretrieve');
  req.end(function (err,res){
    if(err){
     console.log("some error ");
    }
    else{
      // console.log("response from server",JSON.stringify(res.body));
      if(res.body.code=="200"){
        var filestobeDisplayed = res.body.result;
        var filenamesDiv=[];
        for(var i in filestobeDisplayed){
          filenamesDiv.push(
            <ListItem
              rightAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
              primaryText={filestobeDisplayed[i].name}
              leftCheckbox={<Checkbox value={filestobeDisplayed[i].name} onCheck={(event, value) => self.handleFileCheck(event,value)}/>}
            />
          )
        }
        var fileDivContainer=[];
        fileDivContainer.push(
          <div className="previousfilesContainer">
          <MuiThemeProvider>
          <List>
      <Subheader inset={true}>Files</Subheader>
        {filenamesDiv}
    </List>
          </MuiThemeProvider>
          <MuiThemeProvider>
               <RaisedButton disabled={self.state.printButtonDisabled} label="Print Files" primary={true} style={style} onClick={(event) => self.handlePreviousFilesClick(event)}/>
          </MuiThemeProvider>
          </div>
        );
        self.setState({filesPreview:fileDivContainer,previousfilesList:res.body.result});
      }
    }
  })
}  
handleFileCheck(event,value){
  var filesToBePrinted = this.state.filesToBePrinted;
  if(value){
    filesToBePrinted.push({name:event.target.value})
  }
  else{
    for(var i in filesToBePrinted){
      if(filesToBePrinted[i].name == event.target.value){
        filesToBePrinted.splice(i,1)
      }
    }
  }
  console.log("somename",JSON.stringify(filesToBePrinted));
  this.setState({filesToBePrinted})

}
render() {
    return (
      <div className="App">
        {this.state.filesPreview}
      </div>
    )
}
}
const style = {
  margin: 15,
};
