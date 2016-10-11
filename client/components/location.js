import React from 'react';
//import firebase from 'firebase';
import {start, end} from '../models/DatabaseAPI.js';

export default class Location extends React.Component {

  constructor(props) {
    super(props);
    let fbUser = firebase.auth().currentUser;
    this.currentUser = this.props.currUser;
    this.state = {
      location: this.props.loc,
      occupied: false,
      inUser: null
    }
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
  }

  componentWillMount() {
    this.dbLoc.on('value', (locData) => {
      console.log("locdata.val: ", locData.val());
      this.setState({
        occupied: locData.val().occupied,
        inUser: locData.val().user
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

  occupantDisplay() {
    
  }

  render() {
    return (
      <div className="location">
        <h1>{this.props.loc}</h1>
        <div className="locControls">
          {this.buttonSelect()}
        </div>
      </div>
    )
  }
}