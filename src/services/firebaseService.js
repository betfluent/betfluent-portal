import firebase from '../firebase';

/* Read Methods */
export const firebaseRef = ({ ref }) => {
  return firebase.database().ref(ref);
};

export const firebaseChild = ({ ref, child }) => {
  return firebase
    .database()
    .ref(ref)
    .child(child);
};

export const firebaseOrder = ({ ref, child, value }) => {
  return firebase
    .database()
    .ref(ref)
    .orderByChild(child)
    .equalTo(value);
};

export const getFeed = ({ ref, params, list, callback }) => {
  if (callback) {
    const func = ref({ ...params });
    const feed = func.on('value', snapshot => {
      if (list) {
        if (snapshot.exists() && snapshot.hasChildren()) {
          const objMap = snapshot.val();
          callback(
            Object.keys(objMap).map(key => ({ ...objMap[key], id: key }))
          );
        } else callback([]);
      } else if (snapshot.exists()) {
        callback(snapshot.val());
      } else callback({});
    });
    return { off: () => func.off('value', feed) };
  }
  return new Promise(res => {
    ref({ ...params })
      .once('value')
      .then(snapshot => {
        if (list) {
          if (snapshot.exists()) {
            const objMap = snapshot.val();
            res(Object.keys(objMap).map(key => ({ ...objMap[key], id: key })));
          } else callback([]);
        } else if (snapshot.exists()) {
          res(snapshot.val());
        } else res({});
      });
  });
};

/* Generate Key */
export const getKey = () => firebase.database().ref().push().key;

/* Auth Methods */
export const firebaseAuth = firebase.auth();

export const signInWithEmail = ({ email, password }) => {
  return () => firebaseAuth.signInWithEmailAndPassword(email, password);
};

export const signOut = () => firebaseAuth.signOut();
