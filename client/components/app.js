import React from 'react';
//import firebase from 'firebase';

import {start, end} from '../models/DatabaseAPI';

export default class App extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      locations: ['Shower', 'Bath']
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({currentUser: user});
      } else {
        this.setState({currentUser: null});
      }
    });
  }

  componentWillMount(){

  }

  authenticate(){
    let _this = this;
    console.log("_this: ", _this);
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      _this.setState({currentUser: result.user});
    })
  }

  locations(){
    let locs = [];
    for(let i = 0; i < this.state.locations.length; i++) {
      
    }
    return (
      <div>Hello</div> 
    )
  }

  authenticateView(){
    var _this = this;
    console.log("This.state.currentUser: ", this.state.currentUser);
    if(this.state.currentUser){
      return <div>{this.locations()}</div>
    } else {
      return <button onClick={this.authenticate.bind(_this)}>Log in with Facebook</button>
    }
  }


  render(){
    return (
      <div>
        {this.authenticateView()}
      </div>
    )
  }
}