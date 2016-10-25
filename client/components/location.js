import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Notifier from 'react-desktop-notification'
import {start, end, request, clearRequests, setOutOfOrder, setFixed} from '../models/DatabaseAPI.js';

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
      outOfOrder: false,
      requested: false
    }
    //setInterval(() => {console.log("State: ", this.state)}, 3000);
    this.notify = false;
    this.notifying = false;
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
    this.counter = setInterval(() => this.setState({currentTime: Date.now()}), 1000);
  }

  componentWillMount() {
    clearRequests(this.props.loc);
    this.dbLoc.on('value', (locData) => {
      console.log("locdata.val: ", locData.val());
      this.notifying = !locData.val().occupied && this.notify;
      this.setState({
        occupied: locData.val().occupied,
        inUser: locData.val().user,
        startTime: locData.val().startTime,
        outOfOrder: locData.val().outOfOrder,
        requested: Boolean(locData.val().requests && locData.val().requests[this.currentUser.uid])
      })
      console.log("This.state: ", this.state);
    })
    // this.dbLoc.child(`requests`).on('value')
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  buttonSelect() {
    if(this.state.outOfOrder) {
      return (<div>{`Stately ${this.props.loc} has been marked unavailable by ${this.state.outOfOrder}`}</div>)
    }
    if(!this.state.inUser && !this.props.userIsIn) {
      return (
        <button className="inBtn btn" onClick={()=> {
          start(this.props.loc);
          this.props.setUserIn(this.props.loc);
        }}>
          In
        </button>
      );
    } else if (!this.state.inUser) {
      return null;
    } else if(this.state.inUser.uid === this.currentUser.uid) {
      return (
        <button className="outBtn btn" onClick={()=> {
          end(this.props.loc);
          this.props.setUserIn(null);
        }}>
          Out
        </button>
      )
    } else {
      <button className="reqBtn btn" onClick={() => request(this.props.loc)}>I want next!</button>
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

  notifyUser() {
    if (this.notifying) {
      console.log("Notifying");
      //Notifier.start(`Vacancy`, `Stately ${this.props.loc} is now vacant`, '/', './assets/showerIcon.png');
      //this.notifying = false;
      let titleAlert = true;
      let titleOscillator = setInterval(() => {
        document.title = titleAlert ? "(!) Stately Shower" : "Stately Shower";
        titleAlert = !titleAlert;
      }, 250);
      setTimeout(() => {
        document.title = "Stately Shower";
        clearInterval(titleOscillator);
      }, 10000);
      return (
        <ReactAudioPlayer src="./assets/alert.wav" 
        autoPlay="true"
        onEnded={() => {
          this.notifying = false;
          alert(`Stately ${this.props.loc} is now vacant`);
        }}
        onPlay={() => {
          Notifier.start(`Vacancy`, `Stately ${this.props.loc} is now vacant`, '/', './assets/showerIcon.png');
        }}/>
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

  toggleOutOfOrder() {
    if(this.state.outOfOrder) {
      setFixed(this.props.loc);
    } else {
      setOutOfOrder(this.props.loc, this.currentUser.displayName);
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
    return (
      <div className={(this.state.inUser &&
        this.state.inUser.uid !== this.currentUser.uid
        || this.state.outOfOrder) ?
        "unavailable location" : "location"}>
        <div className="topRow">
          <h1>{this.props.loc}</h1>
          {this.outOfOrderBtn()}
        </div>
        <div className="locControls">
          {this.buttonSelect()}
          {this.notifyMeSection()}
          {this.notifyUser()}
          {this.occupantDisplay()}
        </div>
      </div>
    )
  }
}