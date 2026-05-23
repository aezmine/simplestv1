// ==========================================
// 1. AUTHENTICATION CHECK
// ==========================================
if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// ==========================================
// 2. FIREBASE SETUP
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