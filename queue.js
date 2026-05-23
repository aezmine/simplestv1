import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
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

const ordersDiv = document.getElementById("orders");

const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "asc")
);

// ==========================================
// 3. FETCH AND RENDER DATA
// ==========================================
onSnapshot(q, (snapshot) => {
    ordersDiv.innerHTML = "";
    let queueNumber = 1;

    snapshot.forEach((doc) => {
        const order = doc.data();
        let orderTime = "-";
        
        // Format Created Time
        if (order.createdAt) {
            orderTime = order.createdAt.toDate().toLocaleString("en-MY", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        }

        // Format Updated Time
        let updateTime = "-";
        if (order.updatedAt) {
            updateTime = order.updatedAt.toDate().toLocaleString("en-MY", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        }

        // Calculate Waiting Time
        let waitingMinutes = "-";
        if (order.createdAt) {
            const created = order.createdAt.toDate();
            if ((order.status === "Delivered" || order.status === "Rejected") && order.updatedAt) {
                const finished = order.updatedAt.toDate();
                waitingMinutes = Math.floor((finished - created) / 60000);
            } else {
                waitingMinutes = Math.floor((Date.now() - created) / 60000);
            }
        }

        // Determine CSS classes based on Status
        const statusText = order.status || "Pending";
        let cardClass = "";
        let badgeClass = "badge-default";
        
        if (statusText === "Pending" || statusText === "In Making") {
            badgeClass = "badge-pending";
        } else if (statusText === "Delivered") {
            cardClass = "status-delivered";
            badgeClass = "badge-delivered";
        } else if (statusText === "Rejected") {
            cardClass = "status-rejected";
            badgeClass = "badge-rejected";
        }

        // Timer Label
        const timeLabel = (statusText === "Delivered" || statusText === "Rejected") 
            ? "Total Time" 
            : "Waiting";

        // Build HTML Layout
        ordersDiv.innerHTML += `
            <div class="queue-card ${cardClass}">
                
                <div class="queue-header">
                    <h3 class="queue-number">#${queueNumber}</h3>
                    <span class="status-badge ${badgeClass}">${statusText}</span>
                </div>

                <div class="queue-details">
                    <div class="detail-group">
                        <span class="detail-label">Customer</span>
                        <span class="detail-value">${order.name}</span>
                    </div>
                    
                    <div class="detail-group">
                        <span class="detail-label">Order Item</span>
                        <span class="detail-value">🍔 ${order.food}</span>
                    </div>

                    <div class="detail-group full-width">
                        <span class="detail-label">Customer Note</span>
                        <span class="detail-value" style="font-weight: normal;">
                            ${order.customerNote || "<em style='color:#ccc'>No notes provided</em>"}
                        </span>
                    </div>
                </div>

                <div class="detail-group">
                    <span class="detail-label">Admin Message</span>
                    <div class="admin-msg">
                        ${order.adminComment || "No message from admin"}
                    </div>
                </div>

                <div class="queue-footer">
                    <span>Ordered: ${orderTime}</span>
                    <span class="timer-badge">⏱ ${timeLabel}: ${waitingMinutes} min</span>
                </div>
                
            </div>
        `;
        queueNumber++;
    });
});