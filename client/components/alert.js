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
          <div className="alert" key={idx}>
          <p>{msg}</p>
          <p className="hideAlert" onClick={() => this.hideAlert(idx)}>X</p>
          </div>
        )  
      }
      return null;
    })
  }

  hideAlert(index) {
    this.state.hidden[index] = true;
    this.forceUpdate();
  }

  render() {
    return (
      <div className="alert">
        {this.messageList()}
      </div>
    )
  }
}