// import firebase from 'firebase';

let db = firebase.database();
//let auth = firebase.auth();

//let user = firebase.auth().currentUser

/**
* @param {string} location 
*/

export function start(location) {
  db.ref(`${location}`).set({
    occupied: true,
    user: user
  })
}

export function end(location) {
  db.ref(`${location}`).set({
    occupied: false,
    user: null
  })
}