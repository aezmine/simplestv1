import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgWoKi7E7bz332p_yWFuufdpyejhmQxSg",
    authDomain: "food-order-demo-806fe.firebaseapp.com",
    projectId: "food-order-demo-806fe",
    storageBucket: "food-order-demo-806fe.firebasestorage.app",
    messagingSenderId: "539344024607",
    appId: "1:539344024607:web:900fbd50f633090352912a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.login = async function() {

    const inputPassword =
        document.getElementById("password").value;

    const docRef =
        doc(db, "settings", "admin");

    const docSnap =
        await getDoc(docRef);

    const realPassword =
        docSnap.data().password;

    if(inputPassword === realPassword){

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
            "admin.html";

    } else {

        alert("Wrong Password");

    }
}