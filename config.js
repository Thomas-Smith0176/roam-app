import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQJAZBAIREK7TmVklQTANa3XhN8Fbgmhk",
  authDomain: "roam-app-c6dba.firebaseapp.com",
  projectId: "roam-app-c6dba",
  storageBucket: "roam-app-c6dba.appspot.com",
  messagingSenderId: "87140961989",
  appId: "1:87140961989:web:5e468f6769d2fa8dbbeaac",
};
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = initializeFirestore(app,{
  experimentalForceLongPolling: true
  })
  
export { db, auth };



