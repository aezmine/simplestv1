import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgWoKi7E7bz332p_yWFuufdpyejhmQxSg",
    authDomain: "food-order-demo-806fe.firebaseapp.com",
    projectId: "food-order-demo-806fe",
    storageBucket: "food-order-demo-806fe.firebasestorage.app",
    messagingSenderId: "539344024607",
    appId: "1:539344024607:web:900fbd50f633090352912a",
    measurementId: "G-FG3P33GM83"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.saveName = async function () {

    const name =
      document.getElementById("name").value;

    await addDoc(
      collection(db, "users"),
      {
        name: name
      }
    );

    alert("Saved to Firebase!");
}