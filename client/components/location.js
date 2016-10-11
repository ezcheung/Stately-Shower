import React from 'react';
//import firebase from 'firebase';
import {start, end} from '../models/DatabaseAPI.js';

export default class Location extends React.Component {

  constructor(props) {
    super(props);
    let fbUser = firebase.auth().currentUser;
    this.currentUser = {name: fbUser.displayName, uid: fbUser.uid};
    this.state = {
      location: this.props.loc,
      occupied: false,
      user: {}
    }
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
  }

  componentWillMount() {
    this.dbLoc.on('value', (locData) => {
      console.log("locdata.val: ", locData.val());
      this.setState({
        occupied: locData.val().occupied,
        user: locData.val().user
      })
    })
  }

  render() {
    return (
      <div className="location">
        <h1>{this.props.loc}</h1>
        <button className="inBtn" onClick={()=> start(this.props.loc, this.currentUser)}>
          In
        </button>
        <button className="outBtn" onClick={()=> end(this.props.loc)}>
          Out
        </button>
      </div>
    )
  }
}