import React from 'react';

export default class LoadingApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <img className="loading" src="assets/squares.svg"/>
      </div>
    )
  }
}