import React from 'react';
//  import firebase from 'firebase';

import { start, end, request } from '../models/DatabaseAPI';
import Location from './location';
import Requests from './requests';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: firebase.auth().currentUser,
      locations: ['Shower', 'Bath'],
      userIsIn: null,
      userRequested: "",
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });
  }

  componentWillMount() {

  }

  authenticate() {
    const _this = this;
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      _this.setState({ currentUser: result.user });
    });
  }

  signOut() {
    const _this = this;
    firebase.auth().signOut()
    .then(() => {

    })
    .catch((err) => {
      console.error("Error logging out: ", err);
    })
  }

  locations(){
    let locs = [];
    for(let i = 0; i < this.state.locations.length; i++) {
      locs.push(
        <div className="perLocation">
          <Location loc={this.state.locations[i]} currUser={this.state.currentUser} 
          setUserIn={this.setUserIn.bind(this)} userIsIn={this.state.userIsIn}
          userRequested={this.state.userRequested} setUserRequest={this.setUserRequest.bind(this)}/>
          <Requests loc={this.state.locations[i]} currUser={this.state.currentUser}/>
        </div>
      );
    }
    return locs;
  }

  setUserIn (userIn) {
    this.setState({userIsIn: userIn});
  }

  currentlyIn () {
    if (!this.state.userIsIn) {
      return <h2 className="hidden">Hi there</h2>;
    }
    return <h2>{`You are in the Spooky ${this.state.userIsIn}`}</h2>
  }

  setUserRequest (loc) {
    if (this.state.userRequested === loc) {
      this.setState({
        userRequested: ""
      })
    } else if (this.state.userRequested !== "") {
      return;
    } else if (this.state.userRequested === "") {
      this.setState({userRequested: loc});
    }
  }

  authenticateView(){
    var _this = this;
    console.log("This.state.currentUser: ", this.state.currentUser);
    if(this.state.currentUser){
      return (
        <div>
        <button className="logoutBtn" onClick={this.signOut.bind(_this)}>
          Log out
        </button>
        {this.currentlyIn()}
        {this.locations()}
        </div>
      )
    } else {
      return (
      <div className="login">
      <h1 className="welcome">Welcome to Spooky Shower!</h1>
      <button className="loginBtn" onClick={this.authenticate.bind(_this)}>Log in with Facebook</button>
      </div>
      )
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