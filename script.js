
const form = document.getElementById("moneyForm");
const historyBox = document.getElementById("history");

let transactions = JSON.parse(
    localStorage.getItem("myMoneyData") || "[]"
);

// ตั้งวันที่ปัจจุบัน
document.getElementById("date").value =
    new Date().toLocaleDateString("en-CA");

// บันทึกข้อมูล
function saveData() {
    localStorage.setItem(
        "myMoneyData",
        JSON.stringify(transactions)
    );
}

// คำนวณยอดเงิน
function updateSummary() {

    const income = transactions
        .filter(item => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0);

    document.getElementById("income").textContent =
        "฿" + income.toLocaleString("th-TH", {
            minimumFractionDigits: 2
        });

    document.getElementById("expense").textContent =
        "฿" + expense.toLocaleString("th-TH", {
            minimumFractionDigits: 2
        });

    document.getElementById("balance").textContent =
        "฿" + (income - expense).toLocaleString("th-TH", {
            minimumFractionDigits: 2
        });
}

// แสดงประวัติ
function showHistory() {

    historyBox.replaceChildren();

    if (transactions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "ยังไม่มีรายการ";
        historyBox.appendChild(empty);
        return;
    }

    const sorted = [...transactions].sort(
        (a, b) => b.date.localeCompare(a.date)
    );

    sorted.forEach(item => {

        const row = document.createElement("div");
        row.className = "transaction";

        const info = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = item.detail;

        const category = document.createElement("p");
        category.textContent =
            item.category + " • " + item.date;

        info.append(name, category);

        const actions = document.createElement("div");
        actions.style.textAlign = "right";

        const amount = document.createElement("strong");

        amount.className =
            item.type === "income"
                ? "income-text"
                : "expense-text";

        amount.textContent =
            (item.type === "income" ? "+" : "-") +
            "฿" + item.amount.toLocaleString("th-TH", {
                minimumFractionDigits: 2
            });

        const del = document.createElement("button");
        del.className = "delete-btn";
        del.textContent = "ลบ";

        del.addEventListener("click", () => {

            if (confirm("ต้องการลบรายการนี้หรือไม่?")) {

                transactions = transactions.filter(
                    transaction => transaction.id !== item.id
                );

                saveData();
                renderApp();
            }
        });

        actions.append(amount, del);
        row.append(info, actions);

        historyBox.appendChild(row);
    });
}

// เพิ่มรายการใหม่
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const detail =
        document.getElementById("detail").value.trim();

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const amount =
        Number(document.getElementById("amount").value);

    const date =
        document.getElementById("date").value;

    if (
        !detail ||
        !date ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("กรุณากรอกข้อมูลให้ถูกต้อง");
        return;
    }

    const newTransaction = {
        id: Date.now().toString() +
            Math.random().toString(36).slice(2),
        detail,
        type,
        category,
        amount,
        date
    };

    transactions.push(newTransaction);

    saveData();

    form.reset();

    document.getElementById("date").value =
        new Date().toLocaleDateString("en-CA");

    renderApp();
});

// อัปเดตหน้าจอ
function renderApp() {
    updateSummary();
    showHistory();
}

// เริ่มต้นแอป
renderApp();
