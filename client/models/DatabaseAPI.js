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
  db.ref(`${location}/request/${user.uid}`).set(false);
  return db.ref(`${location}`).set({
    occupied: true,
    user: user,
    startTime: Date.now()
  })
}

export function end(location) {
  //let current = db.ref(``) // TODO: get current shower, save stats
  db.ref(`${location}`).set({
    occupied: false,
    user: null,
    startTime: null
  })
}

export function request(location) {
  db.ref(`${location}/request/${user.uid}`).set(true);
}