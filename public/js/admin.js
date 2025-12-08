const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

let orders = [];
let filteredOrders = [];
let currentOrderId = null;

function checkAuth() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("adminPanel").style.display = "none";
}

function showAdminPanel() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadOrders();
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        errorDiv.classList.remove("show");
        showAdminPanel();
    } else {
        errorDiv.textContent = "Невірний логін або пароль";
        errorDiv.classList.add("show");
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    showLoginScreen();
    document.getElementById("loginForm").reset();
});

async function loadOrders() {
    try {
        const response = await fetch("http://localhost:3000/api/requests");
        if (response.ok) {
            orders = await response.json();
            filteredOrders = [...orders];
            updateStatistics();
            renderOrders();
        } else {
            throw new Error("Помилка завантаження замовлень");
        }
    } catch (error) {
        console.error("Error loading orders:", error);
        document.getElementById("ordersTableBody").innerHTML = `
            <tr>
                <td colspan="10" class="loading" style="color: #dc2626;">
                    Помилка завантаження. Переконайтеся, що сервер запущений.
                </td>
            </tr>
        `;
    }
}

function updateStatistics() {
    const total = orders.length;
    const newOrders = orders.filter((o) => o.status === "Новий").length;
    const carSelection = orders.filter((o) => o.type === "Вибір авто").length;
    const consultations = orders.filter((o) => o.type === "Консультація").length;

    document.getElementById("totalOrders").textContent = total;
    document.getElementById("newOrders").textContent = newOrders;
    document.getElementById("carSelectionOrders").textContent = carSelection;
    document.getElementById("consultationOrders").textContent = consultations;
}

function renderOrders() {
    const tbody = document.getElementById("ordersTableBody");

    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">Замовлень не знайдено</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredOrders
        .map((order) => {
            const statusClass = getStatusClass(order.status);
            return `
            <tr>
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.date || ""}</td>
                <td>${order.time || ""}</td>
                <td>${order.type || ""}</td>
                <td>${order.name || ""}</td>
                <td>${order.phone || ""}</td>
                <td>${order.car || "—"}</td>
                <td>${order.question || "—"}</td>
                <td>
                    <span class="status-badge status-badge--${statusClass}">
                        ${order.status || "Новий"}
                    </span>
                </td>
                <td>
                    <button class="btn-change-status" onclick="openStatusModal('${order.id}')">
                        Змінити
                    </button>
                </td>
            </tr>
        `;
        })
        .join("");
}

function getStatusClass(status) {
    const statusMap = {
        Новий: "new",
        "В обробці": "processing",
        Виконано: "completed",
        Скасовано: "cancelled",
    };
    return statusMap[status] || "new";
}

document.getElementById("filterType").addEventListener("change", applyFilters);
document.getElementById("filterStatus").addEventListener("change", applyFilters);
document.getElementById("filterDate").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("clearFilters").addEventListener("click", clearFilters);

function applyFilters() {
    const typeFilter = document.getElementById("filterType").value;
    const statusFilter = document.getElementById("filterStatus").value;
    const dateFilter = document.getElementById("filterDate").value;
    const searchFilter = document.getElementById("searchInput").value.toLowerCase();

    filteredOrders = orders.filter((order) => {
        const matchType = !typeFilter || order.type === typeFilter;
        const matchStatus = !statusFilter || order.status === statusFilter;
        const matchDate = !dateFilter || order.date === dateFilter;
        const matchSearch =
            !searchFilter ||
            order.name?.toLowerCase().includes(searchFilter) ||
            order.phone?.includes(searchFilter) ||
            order.id?.includes(searchFilter);

        return matchType && matchStatus && matchDate && matchSearch;
    });

    renderOrders();
}

function clearFilters() {
    document.getElementById("filterType").value = "";
    document.getElementById("filterStatus").value = "";
    document.getElementById("filterDate").value = "";
    document.getElementById("searchInput").value = "";
    filteredOrders = [...orders];
    renderOrders();
}

function openStatusModal(orderId) {
    currentOrderId = orderId;
    const order = orders.find((o) => o.id === orderId);
    if (order) {
        document.getElementById("modalOrderId").textContent = orderId.substring(0, 12) + "...";
        document.getElementById("newStatus").value = order.status || "Новий";
        document.getElementById("statusModal").classList.add("active");
    }
}

function closeStatusModal() {
    document.getElementById("statusModal").classList.remove("active");
    currentOrderId = null;
}

document.getElementById("cancelStatus").addEventListener("click", closeStatusModal);

document.getElementById("saveStatus").addEventListener("click", async () => {
    const newStatus = document.getElementById("newStatus").value;
    if (!currentOrderId) return;

    try {
        const response = await fetch(
            `http://localhost:3000/api/requests/${currentOrderId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            }
        );

        if (response.ok) {
            const order = orders.find((o) => o.id === currentOrderId);
            if (order) {
                order.status = newStatus;
            }
            updateStatistics();
            applyFilters();
            closeStatusModal();
        } else {
            throw new Error("Помилка оновлення статусу");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Помилка оновлення статусу. Спробуйте ще раз.");
    }
});

document.getElementById("statusModal").addEventListener("click", (e) => {
    if (e.target.id === "statusModal") {
        closeStatusModal();
    }
});

checkAuth();

setInterval(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
        loadOrders();
    }
}, 30000);

