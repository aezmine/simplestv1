import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/*
Ha tengok apa tu? What u looking for....

Kalau jumpa API key ni pun tak boleh buat apa sangat pon HAHAHAHA.
Saja je fun2 buat web simple ni AHHAHA.

Nothing here, just take it.
JUST normal API je.

- MINKACAK
*/

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

const foodCards =
    document.querySelectorAll(".food-card");

const foodInput =
    document.getElementById("food");

const selectedFoodText =
    document.getElementById("selectedFood");

const customFoodContainer =
    document.getElementById(
        "customFoodContainer"
    );

foodCards.forEach(card => {

    card.addEventListener("click", function () {

        foodCards.forEach(c =>
            c.classList.remove("selected")
        );

        this.classList.add("selected");

        const foodName =
            this.dataset.food;

        if (foodName === "CUSTOM") {

            customFoodContainer.style.display =
                "block";

            foodInput.value = "";

            selectedFoodText.textContent =
                "Custom Order";

        } else {

            customFoodContainer.style.display =
                "none";

            foodInput.value =
                foodName;

            selectedFoodText.textContent =
                foodName;
        }
    });

});

window.submitOrder = async function () {

    const name =
        document.getElementById("name")
        .value
        .trim();

    let food =
        foodInput.value;

    const customerNote =
        document.getElementById("customerNote")
        .value
        .trim();

    if (
        selectedFoodText.textContent ===
        "Custom Order"
    ) {

        food =
            document.getElementById(
                "customFood"
            )
            .value
            .trim();

        if (!food) {

            alert(
                "Please enter custom food name"
            );

            return;
        }
    }

    if (!name) {

        alert(
            "Please enter your name"
        );

        return;
    }

    if (!food) {

        alert(
            "Please select a food item"
        );

        return;
    }

    try {

        await addDoc(
            collection(db, "orders"),
            {
                name: name,
                food: food,
                customerNote: customerNote,
                adminComment: "",
                status: "Pending",
                createdAt: serverTimestamp()
            }
        );

        alert(
            "Order Submitted Successfully!"
        );

        document.getElementById(
            "name"
        ).value = "";

        document.getElementById(
            "customerNote"
        ).value = "";

        const customFood =
            document.getElementById(
                "customFood"
            );

        if (customFood) {
            customFood.value = "";
        }

        foodInput.value = "";

        selectedFoodText.textContent =
            "None";

        customFoodContainer.style.display =
            "none";

        foodCards.forEach(card =>
            card.classList.remove(
                "selected"
            )
        );

    } catch (error) {

        console.error(error);

        alert(
            "Failed to submit order."
        );
    }
};