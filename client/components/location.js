/**
* Component for each location
*/

import React from 'react';
import Notifier from 'react-desktop-notification';
import LoadingLoc from './loadingLoc';
import {start, end, request, clearRequests, setOutOfOrder, setFixed} from '../models/DatabaseAPI.js';

//const this.props.loc.maxDuration = 90;

export default class Location extends React.Component {


  constructor(props) {
    super(props);
    let fbUser = firebase.auth().currentUser;
    this.currentUser = this.props.currUser;
    this.state = {
      loading: true,
      location: this.props.loc.name,
      occupied: false,
      inUser: null,
      startTime: null,
      currentTime: Date.now(),
      outOfOrder: false,
      requested: false
    }
    //setInterval(() => {console.log("State: ", this.state)}, 3000); //log state for debugging
    clearRequests(this.props.loc.name); // Check for stale requests
    setInterval(() => {clearRequests(this.props.loc.name)}, 10000);
    this.notify = false;
    this.notifying = false;
    this.dbLoc = firebase.database().ref(`${this.props.loc.name}`);
    this.counter = setInterval(() => this.setState({currentTime: Date.now()}), 1000); //timer
  }

  componentWillMount() {
    this.state.loading = true;
    this.dbLoc.on('value', (locData) => {
      this.notifying = !locData.val().occupied && this.notify;
      if(this.notifying) this.notifyUser();
      if(locData.val().user && locData.val().user.uid === this.currentUser.uid){
        this.props.setUserIn(this.props.loc.name);
      } else {
        this.props.setUserIn(null);
      }
      this.setState({
        occupied: locData.val().occupied,
        inUser: locData.val().user,
        startTime: locData.val().startTime,
        outOfOrder: locData.val().outOfOrder,
        requested: Boolean(locData.val().requests && locData.val().requests[this.currentUser.uid]),
        loading: false
      })
      console.log(`${this.props.loc.name}.state:` , this.state);
    })
    // this.dbLoc.child(`requests`).on('value')
  }

  componentDidMount() {
    // this.setState({loading: false});
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  // Logic for determining which buttons to render based on state of location
  buttonSelect() {
    // Marked out of order, no comment
    if(this.state.outOfOrder && !this.state.outOfOrder.comment.length && !this.state.outOfOrder.comment.trim().length) {
      return (<div className="outOfOrder">{`Stately ${this.props.loc.name} has been marked unavailable by ${this.state.outOfOrder.setBy}`}
              <br/>
              {`${this.state.outOfOrder.timestamp}`}
              </div>)
    }
    // Marked out of order with comment
    if(this.state.outOfOrder) {
      return (<div className="outOfOrder">{`Stately ${this.props.loc.name} has been marked unavailable by ${this.state.outOfOrder.setBy} because: `}
              <br/>
              {`"${this.state.outOfOrder.comment.trim()}"`}
              <br/>
              {`${this.state.outOfOrder.timestamp}`} 
              </div>)
    }
    // Location vacant, user not in anywhere
    if(!this.state.inUser && !this.props.userIsIn) {
      // && !(this.props.userRequested.length && this.props.userRequested !== this.props.loc.name)
      return (
        <button className="inBtn btn" onClick={()=> {
          start(this.props.loc.name);
          if(this.state.requested) {
            this.props.setUserRequest(this.props.loc.name);
          }
        }}>
          In
        </button>
      );
    } else if (!this.state.inUser) {
      return null; //User's in somewhere else, don't let them enter this
    } else if(this.state.inUser.uid === this.currentUser.uid) {
      return (
        <button className="outBtn btn" onClick={()=> {
          end(this.props.loc.name);
          //this.props.setUserIn(null);
        }}>
          Out
        </button>
      )
    } else {
      return null;
    }
  }

  // Logic for the queueing button
  requestBtn() {
    if (this.props.userIsIn) {
      // || (this.props.userRequested.length && this.props.userRequested !== this.props.loc.name)
      return null;
    }
    return (
      <button className={this.state.requested ? "deReqBtn btn" : "reqBtn btn"} onClick={() => {
        request(this.props.loc.name);
        this.props.setUserRequest(this.props.loc.name);
      }}>
      {this.state.requested ? "Dequeue" : "Enqueue"}</button>
      )
  }

  // Calculate time of current session
  timeSpent() {
    let diff = this.state.currentTime - this.state.startTime;
    if(diff >= this.props.loc.maxDuration * 60 * 1000) { //timeCap
      end(this.props.loc.name)
      return null;
    }
    if(diff <= 0) {
      return "0:00";
    }
    let secs = Math.floor(diff/1000);
    let mins = Math.floor(secs/60);
    secs = secs % 60;
    if(secs < 10) {
      secs = '0' + secs;
    }
    return `${mins}:${secs}`;
  }

  // Find who's in the location
  occupantDisplay() {
    if(!this.state.inUser) {
      return null;
    }
    return (
      <div>
        <div className="occupant">
        { `Occupied by: ${this.state.inUser.name}` }
        </div>
        <div className="duration">
        { this.timeSpent() }
        </div>
      </div>
    );
  }

  // For notifications
  notifyUser() {
    if (this.notifying) {
      console.log("Notifying");
      //Notifier.start(`Vacancy`, `Stately ${this.props.loc.name} is now vacant`, '/', './assets/showerIcon.png');
      //this.notifying = false;
      let titleAlert = true;
      let titleOscillator = setInterval(() => {
        document.title = titleAlert ? "(!) Stately Shower" : "Stately Shower";
        titleAlert = !titleAlert;
      }, 250);
      //let alertSound = new Audio('./assets/alert.wav');
      let alertSound = document.getElementById('alertSound');
      alertSound.src = './assets/alert.wav';
      alertSound.play();
      // alertSound.src = null;
      alert(`Stately ${this.props.loc.name} is now vacant`);
      Notifier.start(`Vacancy`, `Stately ${this.props.loc.name} is now vacant`, '/', './assets/showerIcon.png');
      setTimeout(() => {
        document.title = "Stately Shower";
        clearInterval(titleOscillator);
      }, 10000);
      this.notifying = false;
    }
    return null;
  }

  // Checkbox to select if you want notifications
  notifyMeSection() {
    if (this.state.inUser && this.state.inUser.uid !== this.currentUser.uid) {
      return (
        <div className="notify">
          <label>Notify me when vacant:</label>
          <input type="checkbox" onChange={ () => { 
            this.notify = !this.notify;
            document.getElementById('alertSound').src = undefined;
            document.getElementById('alertSound').play(); 
          } }/>
        </div>
      )
    }
    this.notify = false;
    return null;
  }

  // Run when out of order button is pressed
  toggleOutOfOrder() {
    if(this.state.outOfOrder) {
      setFixed(this.props.loc.name);
    } else {
      let comment = window.prompt(`Why are you marking Stately ${this.props.loc.name} as unavailable?`);
      setOutOfOrder(this.props.loc.name, this.currentUser.displayName, comment ? comment : "");
    }
  }

  outOfOrderBtn() {
    if(!this.state.inUser) {
      return (<button className="outOfOrderBtn btn" onClick={this.toggleOutOfOrder.bind(this)}>
        {this.state.outOfOrder ? "Mark as available" : "Mark as unavailable"}
      </button>
      )
    }
    return null;
  }

  render() {
    if(this.state.loading) {
      return (
        <LoadingLoc />
      )
    }
    return (
      <div className={(this.state.inUser &&
        this.state.inUser.uid !== this.currentUser.uid
        || this.state.outOfOrder) ?
        "unavailable location" : "location"}>
        <div className="topRow">
          <h1>{this.props.loc.name}</h1>
          {this.outOfOrderBtn()}
        </div>
        <div className="locControls">
          {this.buttonSelect()}
          {this.requestBtn()}
          {this.notifyMeSection()}
          <audio id="alertSound"></audio>
          {this.occupantDisplay()}
        </div>
      </div>
    )
  }
          // {this.notifyUser()}
}