import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPPeKtoJzo8Zgb66grnXXnUXsan3c1SE",
  authDomain: "zarbdor-im.firebaseapp.com",
  projectId: "zarbdor-im",
  storageBucket: "zarbdor-im.firebasestorage.app",
  messagingSenderId: "357835692912",
  appId: "1:357835692912:web:78b76ca1aedcd5751c0db5",
  measurementId: "G-HMIP9RGBGW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);