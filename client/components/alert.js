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

  hideAlert(index) {
    this.state.hidden[index] = true;
    this.forceUpdate();
  }

  render() {
    if(Object.keys(this.state.hidden).length >= this.state.messages.length) return null;
    return (
      <div className="alert">
        <h2 id="alertTitle">Warning!</h2>
        {this.messageList()}
      </div>
    )
  }
}