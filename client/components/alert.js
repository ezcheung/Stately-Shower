/**
* Class for any alert messages for the house (e.g. 'don't' use x, something in the kitchen is broken)
*/

import React from 'react';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.alerts,
      hidden: {}
    }
  }

  messageList() {
    return this.state.messages.map((msg, idx) => {
      if(!this.state.hidden[idx]){
        return (
          <div className="singleAlert" key={idx}>
          <p className="alertMsg">{msg}</p>
          <p className="hideAlert" onClick={() => this.hideAlert(idx)}>x</p>
          </div>
        )  
      }
      return null;
    })
  }

  /**
  * Hide alert
  */
  
  hideAlert(index) {
    this.state.hidden[index] = true;
    this.forceUpdate();
  }

  render() {
    // Don't render if there are no alerts
    if(Object.keys(this.state.hidden).length >= this.state.messages.length) return null;
    return (
      <div className="alert">
        <h2 id="alertTitle">!</h2>
        {this.messageList()}
      </div>
    )
  }
}