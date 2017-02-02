import React, { Component } from 'react';

import './App.css';
class UploadScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[]
    }
  }
  componentWillMount(){
  }
  render() {
    return (
      <div className="Upload">
        This is upload screen
      </div>
    );
  }
}


export default UploadScreen;
