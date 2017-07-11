/**
* The head component
*/

import React from 'react';
//  import firebase from 'firebase';

import { start, end, request } from '../models/DatabaseAPI';
import Location from './location';
import Requests from './requests';
import LoadingApp from './loadingApp';
import Alert from './alert';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    // Disable style sheets (Windows Phones didn't like my buttons)
    if(this.props.location.pathname === "/plain") {
      document.styleSheets[1].disabled = true;
    }
    // Put any alert messages here as strings
    this.alerts = [
      
    ];
    this.state = {
      currentUser: firebase.auth().currentUser,
      locations: [
      {name : 'Shower', maxDuration : 45}, 
      {name: 'Bath', maxDuration : 90}
      ],
      userIsIn: null,
      userRequested: "",
      loading : true
    };
    // Nicknames for people in the house, just for fun
    this.nicknames = {
      'Laura Didymus': 'Showerymus',
      'Darcy Evans': 'Towl! :D',
      'Carolyn Rogers': 'Cazoshower',
      'Josh Rose': 'Joshower',
      'Morgan Rogers': 'Showergan',
      'Krishan Shah': 'Shahwer',
      'Rosie Causer': 'Rosie Showser',
      'Elliot Cheung': 'Ez'
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUser: user, loading : false });
      } else {
        this.setState({ currentUser: null, loading : false });
      }
    });
  }

  componentWillMount() {

  }

  // Login
  authenticate() {
    const _this = this; //To avoid issues with 'this'
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

  // Render list of locations
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

  // Render message at top
  currentlyIn () {
    if (!this.state.userIsIn) {
      // return <h2>{`Welcome, ${this.nicknames[this.state.currentUser.displayName] || this.state.currentUser.displayName.split(' ')[0]}!`}</h2>;
      return <h2>{`Welcome, ${this.nicknames[this.state.currentUser.displayName] || this.state.currentUser.displayName.split(' ')[0]}!`}</h2>;
    }
    return <h2>{`You are in the Stately ${this.state.userIsIn}`}</h2>
  }

  // Only allow a user to queue for one location at a time
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

  // Any alerts?
  checkAlert() {
    if(this.alerts && this.alerts.length) {
      return <Alert alerts={this.alerts}/>;
    }
    return null;
  }

  render(){
    var _this = this;
    if(this.state.loading) {
      return <LoadingApp/>
    }
    // Logged in
    if(this.state.currentUser){
      return (
        <div>
        <button className="logoutBtn" onClick={this.signOut.bind(_this)}>
          Log out
        </button>
        {this.currentlyIn()}
        {this.checkAlert()}
        {this.locations()}
        </div>
      )
    } else {
      return (
      <div className="login">
      <h1 className="welcome">Welcome to Stately Shower!</h1>
      <button className="loginBtn" onClick={this.authenticate.bind(_this)}>Log in with Facebook</button>
      </div>
      )
    }
  }
}