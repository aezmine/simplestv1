// ==========================================
// 1. AUTHENTICATION CHECK
// ==========================================
if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// ==========================================
// 2. INJECT UI STYLES DIRECTLY FROM JS
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    /* Main Layout */
    body {
        background-color: #f8f9fa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    #orders {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
    }

    /* Admin Order Card */
    .admin-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        border-top: 6px solid #1a1a1a; /* Dark border for admin aesthetic */
    }

    /* Card Header */
    .admin-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 16px;
        margin-bottom: 16px;
    }

    .customer-info h3 {
        margin: 0 0 4px 0;
        font-size: 1.25rem;
        color: #1a1a1a;
    }

    .order-time {
        font-size: 0.8rem;
        color: #757575;
    }

    /* Info Grid */
    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 20px;
    }

    .info-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .info-group.full-width {
        grid-column: span 2;
    }

    .info-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #a0a0a0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .info-value {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
    }

    .note-box {
        background: #fffbdf;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 0.9rem;
        color: #d49a00;
        border-left: 3px solid #ffcf24;
    }

    /* Admin Controls Section */
    .admin-controls {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #e9ecef;
    }

    .control-group {
        margin-bottom: 16px;
    }

    .control-group label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: #1a1a1a;
    }

    /* Modern Inputs */
    .app-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #d4d4d4;
        border-radius: 10px;
        font-size: 0.95rem;
        font-family: inherit;
        background-color: #ffffff;
        transition: all 0.2s ease;
        box-sizing: border-box;
    }

    .app-input:focus {
        outline: none;
        border-color: #ffcf24;
        box-shadow: 0 0 0 3px rgba(255, 207, 36, 0.2);
    }

    select.app-input {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 16px top 50%;
        background-size: 12px auto;
    }

    /* Buttons */
    .button-group {
        display: flex;
        gap: 12px;
        margin-top: 20px;
    }

    .btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }

    .btn-save {
        background-color: #ffcf24;
        color: #1a1a1a;
        box-shadow: 0 4px 10px rgba(255, 207, 36, 0.2);
    }
    .btn-save:hover { transform: translateY(-2px); background-color: #ffc910; }

    .btn-delete {
        background-color: #fff0f0;
        color: #dc3545;
        border: 1px solid #ffcccc;
    }
    .btn-delete:hover { transform: translateY(-2px); background-color: #ffe6e6; }
`;
document.head.appendChild(style);

// ==========================================
// 3. FIREBASE SETUP
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

window.logout = function () {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
};

// ==========================================
// 4. LOAD & RENDER ORDERS
// ==========================================
async function loadOrders() {
    const container = document.getElementById("orders");
    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "orders"));

    snapshot.forEach((orderDoc) => {
        const order = orderDoc.data();
        let createdTime = "-";
        let updatedTime = "-";

        if (order.createdAt) {
            createdTime = order.createdAt.toDate().toLocaleString("en-MY", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        }
        if (order.updatedAt) {
            updatedTime = order.updatedAt.toDate().toLocaleString("en-MY", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        }

        const currentStatus = order.status || "Pending";
        const customerNote = order.customerNote ? `<div class="note-box">📝 ${order.customerNote}</div>` : `<span class="info-value" style="color:#ccc">None</span>`;

        container.innerHTML += `
        <div class="admin-card">
            
            <div class="admin-card-header">
                <div class="customer-info">
                    <h3>👤 ${order.name}</h3>
                    <div class="order-time">Ordered: ${createdTime}</div>
                </div>
                <div class="order-time">Updated: ${updatedTime}</div>
            </div>

            <div class="info-grid">
                <div class="info-group">
                    <span class="info-label">Order Item</span>
                    <span class="info-value">🍔 ${order.food}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Current Status</span>
                    <span class="info-value">${currentStatus}</span>
                </div>

                <div class="info-group full-width">
                    <span class="info-label">Customer Note</span>
                    ${customerNote}
                </div>
            </div>

            <div class="admin-controls">
                <div class="control-group">
                    <label for="status-${orderDoc.id}">Update Status</label>
                    <select id="status-${orderDoc.id}" class="app-input">
                        <option value="Pending" ${currentStatus === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Accepted" ${currentStatus === "Accepted" ? "selected" : ""}>Accepted</option>
                        <option value="In Making" ${currentStatus === "In Making" ? "selected" : ""}>In Making</option>
                        <option value="Rejected" ${currentStatus === "Rejected" ? "selected" : ""}>Rejected</option>
                        <option value="Delivered" ${currentStatus === "Delivered" ? "selected" : ""}>Delivered</option>
                    </select>
                </div>

                <div class="control-group" style="margin-bottom: 0;">
                    <label for="adminComment-${orderDoc.id}">Admin Message (Visible to Customer)</label>
                    <textarea 
                        id="adminComment-${orderDoc.id}" 
                        class="app-input"
                        rows="2" 
                        placeholder="e.g., Sorry, out of stock! / Food is on the way!"
                    >${order.adminComment || ""}</textarea>
                </div>

                <div class="button-group">
                    <button class="btn btn-save" onclick="updateOrder('${orderDoc.id}')">
                        💾 Save Changes
                    </button>
                    <button class="btn btn-delete" onclick="deleteOrder('${orderDoc.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>

        </div>
        `;
    });
}

// ==========================================
// 5. ACTIONS
// ==========================================
window.updateOrder = async function (id) {
    const status = document.getElementById(`status-${id}`).value;
    const adminComment = document.getElementById(`adminComment-${id}`).value;
    const orderRef = doc(db, "orders", id);

    await updateDoc(orderRef, {
        status: status,
        adminComment: adminComment,
        updatedAt: serverTimestamp()
    });

    alert("✅ Order Updated Successfully!");
    loadOrders();
};

window.deleteOrder = async function (id) {
    const status = document.getElementById(`status-${id}`).value;

    if (status !== "Delivered" && status !== "Rejected") {
        alert("⚠️ Only 'Delivered' or 'Rejected' orders can be deleted to prevent accidental data loss.");
        return;
    }

    const confirmed = confirm("Are you sure you want to permanently delete this order?");
    if (!confirmed) return;

    await deleteDoc(doc(db, "orders", id));
    alert("🗑️ Order Deleted");
    loadOrders();
};

// Initialize
loadOrders();