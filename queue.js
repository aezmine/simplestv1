import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// 1. INJECT UI STYLES DIRECTLY FROM JS
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* Container Styling */
    #orders {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        max-width: 600px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Queue Card */
    .queue-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-left: 6px solid #ffcf24; /* Default MinPanda Yellow */
        transition: transform 0.2s ease;
    }
    
    .queue-card.status-delivered { border-left-color: #4caf50; }
    .queue-card.status-rejected { border-left-color: #f44336; }

    /* Header: Queue Number & Status */
    .queue-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;
    }

    .queue-number {
        font-size: 1.25rem;
        font-weight: 800;
        color: #1a1a1a;
        margin: 0;
    }

    /* Status Badges */
    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .badge-pending { background-color: #fffbdf; color: #d49a00; }
    .badge-delivered { background-color: #eef7ee; color: #4caf50; }
    .badge-rejected { background-color: #fdeeea; color: #f44336; }
    .badge-default { background-color: #f0f0f0; color: #555; }

    /* Content Grid */
    .queue-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 16px;
    }

    .detail-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .detail-label {
        font-size: 0.75rem;
        color: #757575;
        font-weight: 600;
        text-transform: uppercase;
    }

    .detail-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1a1a1a;
    }
    
    .full-width { grid-column: span 2; }

    /* Admin Message Box */
    .admin-msg {
        background-color: #f8f9fa;
        padding: 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        color: #555;
        border-left: 3px solid #d4d4d4;
        margin-top: 8px;
    }

    /* Footer Timing */
    .queue-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px dashed #e0e0e0;
        font-size: 0.8rem;
        color: #757575;
    }

    .timer-badge {
        background: #f0f0f0;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 600;
        color: #1a1a1a;
    }
`;
document.head.appendChild(style);

// ==========================================
// 2. FIREBASE CONFIGURATION
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