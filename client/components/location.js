import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Notifier from 'react-desktop-notification'
import {start, end, request, clearRequests} from '../models/DatabaseAPI.js';

const maxMins = 90;

export default class Location extends React.Component {


  constructor(props) {
    super(props);
    let fbUser = firebase.auth().currentUser;
    this.currentUser = this.props.currUser;
    this.state = {
      location: this.props.loc,
      occupied: false,
      inUser: null,
      startTime: null,
      currentTime: Date.now(),
      requests: [],
    }
    // setInterval(() => {console.log("State: ", this.state)}, 3000);
    this.notify = false;
    this.notifying = false;
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
    clearRequests(this.props.loc);
    this.counter = setInterval(() => this.setState({currentTime: Date.now()}), 1000);
  }

  componentWillMount() {
    this.dbLoc.on('value', (locData) => {
      console.log("locdata.val: ", locData.val());
      this.notifying = !locData.val().occupied && this.notify;
      this.setState({
        occupied: locData.val().occupied,
        inUser: locData.val().user,
        startTime: locData.val().startTime,
        requests: locData.val().request,
      })
      console.log("This.state: ", this.state);
    })
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  buttonSelect() {
    if(!this.state.inUser) {
      return (
        <button className="inBtn btn" onClick={()=> start(this.props.loc)}>
          In
        </button>
      );
    } else if(this.state.inUser.uid === this.currentUser.uid) {
      return (
        <button className="outBtn btn" onClick={()=> end(this.props.loc)}>
          Out
        </button>
      )
    } else {
      return (
        <button className="reqBtn btn" onClick={() => request(this.props.loc)}>
          I want next!
        </button>
      )
    }
  }

  timeSpent() {
    let diff = this.state.currentTime - this.state.startTime;
    if(diff >= maxMins * 60 * 1000) { //timeCap
      end(this.props.loc)
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

  pendingReqs() {
    if(this.state.requests) {
      let reqs = [];
      for (let i in this.state.requests) {
        reqs.push(<label className="username">{this.state.requests[i].displayName}</label>);
      }
      return (<div className="requests">{reqs}</div>);
    }
    return null;
  }

  notifyUser() {
    if (this.notifying) {
      console.log("Notifying");
      Notifier.start(`Vacancy`, `Stately ${this.props.loc} is now vacant`, 'statelyshower.club', './assets/showerIcon.png');
      this.notifying = false;
      return (
        <ReactAudioPlayer src="./assets/capisci.mp3" autoPlay="true"/>
      )
    }
    return null;
  }

  notifyMeSection() {
    if (this.state.inUser && this.state.inUser.uid !== this.currentUser.uid) {
      return (
        <div className="notify">
          <label>Notify me when vacant:</label>
          <input type="checkbox" onChange={ () => { this.notify = !this.notify } }/>
        </div>
      )
    }
    this.notify = false;
    return null;
  }

  render() {
    return (
      <div className={(this.state.inUser &&
        this.state.inUser.uid !== this.currentUser.uid) ?
        "unavailable location" : "location"}>
        <h1>{this.props.loc}</h1>
        <div className="locControls">
          {this.buttonSelect()}
          {this.notifyMeSection()}
          {this.notifyUser()}
          {this.pendingReqs()}
          {this.occupantDisplay()}
        </div>
      </div>
    )
  }
}