import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbpMFzaiAG_MCFePnrfn8oe2cI29p0C1k",
  authDomain: "biz-architect.firebaseapp.com",
  projectId: "biz-architect",
  storageBucket: "biz-architect.firebasestorage.app",
  messagingSenderId: "148330064278",
  appId: "1:148330064278:web:31bfaefe51017b590395b7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);