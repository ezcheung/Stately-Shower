// import firebase from 'firebase';

let db = firebase.database();
//let auth = firebase.auth();
let user = null;
firebase.auth().onAuthStateChanged((resp) => {
  if (resp) {
    user = {name: resp.displayName, uid: resp.uid}
  } else {
    user = null;
  }
});
/**
* @param {string} location 
*/

export function start(location) {
  console.log("Starting " + location + " for " + user.name);
  return db.ref(`${location}`).set({
    occupied: true,
    user: user,
    startTime: Date.now()
  })
}

export function end(location) {
  db.ref(`${location}`).set({
    occupied: false,
    user: null,
    startTime: null
  })
}