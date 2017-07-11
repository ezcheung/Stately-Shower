/**
* All the functions for interacting with the database
*/

let db = firebase.database();
//let auth = firebase.auth();
let user = null;
firebase.auth().onAuthStateChanged((resp) => {
  console.log("Resp from authentication: ", resp);
  if (resp) {
    user = {name: resp.displayName, uid: resp.uid, photoURL: resp.photoURL}
  } else {
    user = null;
  }
});

/**
* Start a session in a location
* @param {string} location 
*/

export function start(location) {
  console.log("Starting " + location + " for " + user.name);
  return db.ref(`${location}`).once('value').then((currState) => {
    currState = currState.val();
    if(currState.occupied) {
      return;
    }
    db.ref(`${location}`).set(Object.assign(currState, {
      occupied: true,
      user: user,
      startTime: Date.now()
    }))
    db.ref(`${location}/requests/${user.uid}`).set(null);
  })
}

/**
* End a session
* @param {string} location the name of the location
*/

export function end(location) {
  db.ref(`${location}`).once('value').then((currState) => {
    currState = currState.val();
    db.ref(`${location}`).set(Object.assign(currState, {
      occupied: false,
      user: null,
      startTime: null
    }))
  })
}

/**
* Queue for a location
*/ 
export function request(location) {
  console.log("User: ", user);
  let userDBLoc = db.ref(`${location}/requests/${user.uid}`);
  userDBLoc.once('value').then(requested => {
    userDBLoc.set(requested.val() ? null : {user: user, requestedAt: Date.now()});
  })
}

/**
* Clears all requests that are > 8 hours old, run whenever a location is rendered
* and every 10 seconds after that
* For in case people forget to dequeue
*/
export function clearRequests(location) {
  db.ref(`${location}/requests`).once('value').then(requests => {
    requests = requests.val();
    for(let i in requests) {
      if(Date.now() - requests[i].requestedAt > 8 * 60 * 60 * 1000) {
        console.log(`Clearing ${requests[i].user.name}'s Request for ${location}`);
        db.ref(`${location}/requests/${requests[i].user.uid}`).set(null);
      }
    }
  });
}

/**
* Mark a location as out of order; lists the user and their comment
*/
export function setOutOfOrder(location, username, comment) {
  db.ref(`${location}`).once('value').then((currState) => {
    currState = currState.val();
    let time = new Date().toString();
    time = time.slice(4, 11) + time.slice(16, 21);
    db.ref(`${location}`).set(Object.assign(currState, {
      outOfOrder: {setBy: username, comment: comment, timestamp: time}
    }))
  })
}

/**
* Toggle a location no longer out of order
*/
export function setFixed(location) {
  db.ref(`${location}`).once('value').then((currState) => {
    currState = currState.val();
    db.ref(`${location}`).set(Object.assign(currState, {
      outOfOrder: false
    }))
  })
}