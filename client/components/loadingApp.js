import React from 'react';

export default class LoadingApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <img className="loadingApp" src="assets/squares.svg"/>
      </div>
    )
  }
}