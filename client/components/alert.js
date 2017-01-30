import React from 'react';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.alert
    }
  }

  render() {
    return (
      <div className="alert">
        {this.state.message}
      </div>
    )
  }
}