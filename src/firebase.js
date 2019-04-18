import firebase from 'firebase';
/* eslint-disable */
const config = {
  apiKey: "AIzaSyA3vie3Ie_GuZiBEf9DilFSLaaxtGLtACs",
  authDomain: "betfluent-prod.firebaseapp.com",
  databaseURL: "https://betfluent-prod.firebaseio.com",
  projectId: "betfluent-prod",
  storageBucket: "betfluent-prod.appspot.com",
  messagingSenderId: "1052075330350"
};

firebase.initializeApp(config);

export default firebase;
