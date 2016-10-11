import React from 'react';
//import firebase from 'firebase';

export default class Location extends React.Component {

  constructor(props) {
    super(props);
    this.currentUser = firebase.auth().currentUser;
    this.state = {
      location: this.props.location,
      occupied: false,
      user: {}
    }
    this.dbLoc = firebase.database().ref(`/${this.props.location}`)
  }

  componentWillMount() {
    this.dbLoc.on('value', (locData) => {
      this.setState({
        occupied: locData.val().occupied,
        user: locData.val().user
      })
    })
  }
}