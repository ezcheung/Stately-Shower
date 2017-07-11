/**
* Loading a location
*/

import React from 'react';

export default class LoadingLoc extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        <img className="location loading" src="assets/squares.svg"/>
      </div>
    )
  }
}