import React from 'react';
//import firebase from 'firebase';
import {start, end} from '../models/DatabaseAPI.js';

const maxMins = 60;

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
      currentTime: Date.now()
    }
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
    setInterval(() => this.setState({currentTime: Date.now()}), 1000);
  }

  componentWillMount() {
    this.dbLoc.on('value', (locData) => {
      this.setState({
        occupied: locData.val().occupied,
        inUser: locData.val().user,
        startTime: locData.val().startTime
      })
    })
  }

  buttonSelect() {
    if(!this.state.inUser) {
      return (
        <button className="inBtn btn" onClick={()=> start(this.props.loc)}>
          In
        </button>
      )
    } else if(this.state.inUser.uid === this.currentUser.uid) {
      return (
        <button className="outBtn btn" onClick={()=> end(this.props.loc)}>
          Out
        </button>
      )
    } else {
      return null;
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
    } else {
      return (
        <div>
          <div className="occupant">
          {`Occupied by: ${this.state.inUser.name}`}
          </div>
          <div className="duration">
          {this.timeSpent()}
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="location">
        <h1>{this.props.loc}</h1>
        <div className="locControls">
          {this.buttonSelect()}
          {this.occupantDisplay()}
        </div>
      </div>
    )
  }
}