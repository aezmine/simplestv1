import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ==========================================
// 1. FIREBASE SETUP
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

// ==========================================
// 2. SHOP DATA
// ==========================================
const SHOPS = [
    { name: "Geprek Farisz Bistro",    img: "assets/p1.jpg" },
    { name: "Nasi Arab Limbong",        img: "assets/p2.jpg" },
    { name: "Nasi Ayam Limbong",        img: "assets/p3.jpg" },
    { name: "Burger Apiq",             img: "assets/p4.jpg" },
    { name: "Burger Ngosek",           img: "assets/p5.jpg" },
    { name: "Nasi Kandar Pak Damat",   img: "assets/p6.jpg" },
    { name: "Sri Andaman",             img: "assets/p7.jpg" },
];

// ==========================================
// 3. HELPERS
// ==========================================

/**
 * Renders a row of filled/empty star characters.
 * @param {number} rating  — integer 1–5
 * @param {number} total   — total stars (default 5)
 */
function renderStars(rating, total = 5) {
    let stars = "";
    for (let i = 1; i <= total; i++) {
        stars += i <= rating ? "⭐" : "☆";
    }
    return stars;
}

/**
 * Formats a Firestore Timestamp into a human-readable string.
 */
function formatTime(timestamp) {
    if (!timestamp) return "-";
    return timestamp.toDate().toLocaleString("en-MY", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

/**
 * Returns a safe CSS-class-friendly ID fragment from a shop name.
 */
function shopId(name) {
    return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase();
}

// ==========================================
// 4. FETCH REVIEWS FOR ONE SHOP
// ==========================================
async function fetchReviews(shopName) {
    try {
        // Simple where-only query — no composite index required.
        // Results are sorted client-side below.
        const q = query(
            collection(db, "reviews"),
            where("shopName", "==", shopName)
        );
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort newest-first client-side (avoids needing a Firestore composite index)
        reviews.sort((a, b) => {
            const ta = a.createdAt ? a.createdAt.toMillis() : 0;
            const tb = b.createdAt ? b.createdAt.toMillis() : 0;
            return tb - ta;
        });

        return reviews;
    } catch (err) {
        console.error("fetchReviews error:", err);
        throw err; // re-throw so renderReviews can catch and show error state
    }
}

// ==========================================
// 5. RENDER REVIEWS INTO A CARD BODY
// ==========================================
async function renderReviews(shopName) {
    const sid = shopId(shopName);
    const listEl = document.getElementById(`review-list-${sid}`);
    if (!listEl) return;

    listEl.innerHTML = `<p class="review-empty"><span>⏳</span>Loading reviews…</p>`;

    let reviews;
    try {
        reviews = await fetchReviews(shopName);
    } catch (err) {
        listEl.innerHTML = `
            <div class="review-empty">
                <span>⚠️</span>
                Could not load reviews. Please refresh and try again.
            </div>
        `;
        return;
    }

    // Update average rating in the header
    const avgEl = document.getElementById(`avg-${sid}`);
    if (avgEl) {
        if (reviews.length === 0) {
            avgEl.innerHTML = `<span class="avg-stars">☆☆☆☆☆</span> <span class="review-count">No reviews yet</span>`;
        } else {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            const rounded = Math.round(avg * 10) / 10;
            avgEl.innerHTML = `
                <span class="avg-stars">${renderStars(Math.round(avg))}</span>
                <span class="avg-score">${rounded}</span>
                <span class="review-count">(${reviews.length} review${reviews.length !== 1 ? "s" : ""})</span>
            `;
        }
    }

    // Render review items
    if (reviews.length === 0) {
        listEl.innerHTML = `
            <div class="review-empty">
                <span>💬</span>
                No reviews yet — be the first!
            </div>
        `;
        return;
    }

    listEl.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="review-item-header">
                <span class="review-item-name">👤 ${escapeHtml(r.reviewerName)}</span>
                <span class="review-item-stars">${renderStars(r.rating)}</span>
            </div>
            <p class="review-item-comment">${escapeHtml(r.comment)}</p>
            <div class="review-item-time">${formatTime(r.createdAt)}</div>
        </div>
    `).join("");
}

// ==========================================
// 6. SUBMIT A REVIEW
// ==========================================
async function submitReview(shopName) {
    const sid = shopId(shopName);

    const nameInput    = document.getElementById(`rf-name-${sid}`);
    const commentInput = document.getElementById(`rf-comment-${sid}`);
    const ratingInputs = document.querySelectorAll(`input[name="rf-rating-${sid}"]:checked`);

    const reviewerName = nameInput.value.trim();
    const comment      = commentInput.value.trim();
    const rating       = ratingInputs.length > 0 ? parseInt(ratingInputs[0].value) : 0;

    // Validate
    if (!reviewerName) {
        alert("Please enter your name.");
        nameInput.focus();
        return;
    }
    if (!rating) {
        alert("Please select a star rating.");
        return;
    }
    if (!comment) {
        alert("Please write a comment.");
        commentInput.focus();
        return;
    }

    const submitBtn = document.getElementById(`rf-submit-${sid}`);
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
        await addDoc(collection(db, "reviews"), {
            shopName:     shopName,
            reviewerName: reviewerName,
            rating:       rating,
            comment:      comment,
            createdAt:    serverTimestamp()
        });

        // Reset form
        nameInput.value    = "";
        commentInput.value = "";
        document.querySelectorAll(`input[name="rf-rating-${sid}"]`)
            .forEach(r => r.checked = false);

        // Hide form
        toggleForm(sid, false);

        // Refresh review list
        await renderReviews(shopName);

    } catch (err) {
        console.error("Failed to submit review:", err);
        alert("Failed to submit review. Please try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Review";
    }
}

// ==========================================
// 7. UI TOGGLE HELPERS
// ==========================================
function toggleCard(shopName) {
    const sid  = shopId(shopName);
    const card = document.getElementById(`card-${sid}`);
    const isExpanded = card.classList.contains("expanded");

    if (isExpanded) {
        card.classList.remove("expanded");
    } else {
        card.classList.add("expanded");
        renderReviews(shopName);
    }
}

function toggleForm(sid, show) {
    const form   = document.getElementById(`review-form-${sid}`);
    const btnWrap = document.getElementById(`btn-leave-${sid}`);
    if (show) {
        form.classList.add("visible");
        btnWrap.style.display = "none";
    } else {
        form.classList.remove("visible");
        btnWrap.style.display = "block";
    }
}

// ==========================================
// 8. XSS ESCAPE HELPER
// ==========================================
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ==========================================
// 9. BUILD THE PAGE
// ==========================================
function buildPage() {
    const container = document.getElementById("shops-container");

    container.innerHTML = SHOPS.map(shop => {
        const sid = shopId(shop.name);

        // Star picker HTML — uses row-reverse CSS trick for hover-left highlighting
        const starPicker = `
            <div class="star-picker">
                <input type="radio" id="rf-star5-${sid}" name="rf-rating-${sid}" value="5">
                <label for="rf-star5-${sid}" title="5 stars">★</label>
                <input type="radio" id="rf-star4-${sid}" name="rf-rating-${sid}" value="4">
                <label for="rf-star4-${sid}" title="4 stars">★</label>
                <input type="radio" id="rf-star3-${sid}" name="rf-rating-${sid}" value="3">
                <label for="rf-star3-${sid}" title="3 stars">★</label>
                <input type="radio" id="rf-star2-${sid}" name="rf-rating-${sid}" value="2">
                <label for="rf-star2-${sid}" title="2 stars">★</label>
                <input type="radio" id="rf-star1-${sid}" name="rf-rating-${sid}" value="1">
                <label for="rf-star1-${sid}" title="1 star">★</label>
            </div>
        `;

        return `
            <div class="shop-review-card" id="card-${sid}">

                <!-- Clickable header -->
                <div class="shop-card-header" onclick="toggleCard('${escapeHtml(shop.name)}')">
                    <img class="shop-card-img" src="${shop.img}" alt="${escapeHtml(shop.name)}">
                    <div class="shop-card-info">
                        <p class="shop-card-name">${escapeHtml(shop.name)}</p>
                        <div class="avg-rating" id="avg-${sid}">
                            <span class="avg-stars">☆☆☆☆☆</span>
                            <span class="review-count">Loading…</span>
                        </div>
                    </div>
                    <span class="shop-card-toggle">›</span>
                </div>

                <!-- Expandable body -->
                <div class="shop-card-body">
                    <!-- Review list -->
                    <div class="review-list" id="review-list-${sid}"></div>

                    <!-- Leave a Review button -->
                    <div id="btn-leave-${sid}">
                        <button class="btn-leave-review" onclick="toggleForm('${sid}', true)">
                            ✏️ Leave a Review
                        </button>
                    </div>

                    <!-- Review form (hidden by default) -->
                    <div class="review-form" id="review-form-${sid}">
                        <p class="review-form-title">✍️ Write your review for ${escapeHtml(shop.name)}</p>

                        <label class="review-form-label" for="rf-name-${sid}">Your Name</label>
                        <input
                            id="rf-name-${sid}"
                            type="text"
                            placeholder="e.g. Ahmad, Siti, Anonymous…"
                            autocomplete="name"
                        >

                        <label class="review-form-label">Your Rating</label>
                        ${starPicker}

                        <label class="review-form-label" for="rf-comment-${sid}">Your Comment</label>
                        <textarea
                            id="rf-comment-${sid}"
                            rows="3"
                            placeholder="Share your experience with this stall…"
                        ></textarea>

                        <div class="review-form-actions">
                            <button
                                class="btn-submit-review"
                                id="rf-submit-${sid}"
                                onclick="submitReview('${escapeHtml(shop.name)}')"
                            >
                                Submit Review
                            </button>
                            <button class="btn-cancel-review" onclick="toggleForm('${sid}', false)">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }).join("");

    // Load average ratings for all shops on page load (collapsed state preview)
    SHOPS.forEach(shop => {
        const sid = shopId(shop.name);
        fetchReviews(shop.name)
            .then(reviews => {
                const avgEl = document.getElementById(`avg-${sid}`);
                if (!avgEl) return;
                if (reviews.length === 0) {
                    avgEl.innerHTML = `<span class="avg-stars">☆☆☆☆☆</span> <span class="review-count">No reviews yet</span>`;
                } else {
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    const rounded = Math.round(avg * 10) / 10;
                    avgEl.innerHTML = `
                        <span class="avg-stars">${renderStars(Math.round(avg))}</span>
                        <span class="avg-score">${rounded}</span>
                        <span class="review-count">(${reviews.length} review${reviews.length !== 1 ? "s" : ""})</span>
                    `;
                }
            })
            .catch(() => {
                const avgEl = document.getElementById(`avg-${sid}`);
                if (avgEl) avgEl.innerHTML = `<span class="review-count">—</span>`;
            });
    });
}

// ==========================================
// 10. EXPOSE FUNCTIONS TO INLINE ONCLICK
// ==========================================
window.toggleCard   = toggleCard;
window.toggleForm   = toggleForm;
window.submitReview = submitReview;

// ==========================================
// 11. INITIALIZE
// ==========================================
buildPage();
