import React from 'react';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.alerts
    }
  }

  messageList() {
    return this.state.messages.map((msg, idx) => 
      <div className="alert" key={idx}>
        {msg}
      </div>
    )
  }

  render() {
    return (
      <div className="alert">
        {this.messageList()}
      </div>
    )
  }
}