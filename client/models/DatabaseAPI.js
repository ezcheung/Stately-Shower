// import firebase from 'firebase';

let db = firebase.database();
//let auth = firebase.auth();
let user = null;
firebase.auth().onAuthStateChanged((resp) => {
  if (resp) {
    user = {name: resp.displayName, uid: resp.uid, photoURL: resp.photoURL}
  } else {
    user = null;
  }
});
/**
* @param {string} location 
*/

export function start(location) {
  console.log("Starting " + location + " for " + user.name);
  return db.ref(`${location}`).once('value').then((currState) => {
    if(currState.occupied) {
      return;
    }
    db.ref(`${location}/request/${user.uid}`).set(false);
    return db.ref(`${location}`).set({
      occupied: true,
      user: user,
      startTime: Date.now()
    })
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
  let userDBLoc = db.ref(`${location}/requests/${user.uid}`);
  userDBLoc.once('value').then(requested => {
    userDBLoc.set(requested.val() ? null : {user: user, requestedAt: Date.now()});
  })
}

export function clearRequests(location) {
  db.ref(`${location}/requests`).remove();
}

export function setOutOfOrder(location, username) {
  db.ref(`${location}`).set({
    outOfOrder: username
  })
}

export function setFixed(location) {
  db.ref(`${location}`).set({
    outOfOrder: false
  })
}