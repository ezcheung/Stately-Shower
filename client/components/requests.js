import React from 'react';
import {request, clearRequests} from '../models/DatabaseAPI';

export default class Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
    }
    this.dbLoc = firebase.database().ref(`${this.props.loc}/requests`);
  }

  componentWillMount() {
    this.dbLoc.on('value', (reqs) => {
      console.log("Reqs received: ", reqs.val());
      this.setState({
        queue: reqs.val()
      });
    })
  }

  portraits() {
    if(!this.state.queue) {
      return;
    }
    let output = [];
    for(let i in this.state.queue) {
      output.push(<img 
        className="portrait"
        alt={this.state.queue[i].user.name} 
        title={this.state.queue[i].user.name} 
        src={this.state.queue[i].user.photoURL}/>)
    }
    output.sort((a, b) => a.requestedAt - b.requestedAt);
    return output;
  }

  render() {
    return (
      <div className="requestBar">
        <label>On deck:</label>
        <div className="reqPortraits">
          {this.portraits()}
        </div>
      </div>
    )
  }
}