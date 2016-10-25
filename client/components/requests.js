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
        queue: reqs.val();
      });
    })
  }

  portraits() {
    let output = [];
    for(let i = 0; i < this.state.queue.length; i++) {
      output.push(<img src={this.state.queue[i].photoURL}/>)
    }
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