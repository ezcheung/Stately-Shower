// import firebase from 'firebase';

let db = firebase.database();
//let auth = firebase.auth();
let user = firebase.auth().currentUser;
user = {name: user.displayName, uid: user.uid};
/**
* @param {string} location 
*/

export function start(location) {
  console.log("Starting " + location + " for " + user.name);
  return db.ref(`${location}`).set({
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