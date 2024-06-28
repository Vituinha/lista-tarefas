import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDvra7dhz12tLikd-7KdTFI9TsVhtH0rrc",
    authDomain: "curso-react-d3bdf.firebaseapp.com",
    projectId: "curso-react-d3bdf",
    storageBucket: "curso-react-d3bdf.appspot.com",
    messagingSenderId: "234562934544",
    appId: "1:234562934544:web:d863422e7ca2ec7c45f795",
    measurementId: "G-88Q31894VG"  
  };
  
const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }