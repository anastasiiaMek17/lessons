function checkEligibility() {
    const ownHome = document.getElementById("ownHome").checked;
    const stableIncome = document.getElementById("stableIncome").checked;
    const age = parseInt(document.getElementById("age").value);
    const income = parseInt(document.getElementById("income").value);

    let result = "";

    if (ownHome || stableIncome) {
        result = "Вам видадуть кредит.";
    } else if (age < 30 && income < 15000) {
        result = "Вам не видадуть кредит.";
    } else if (income >= 15000) {
        result = "Вам видадуть кредит.";
    } else {
        result = "Ваша кредитна здатність потребує додаткової перевірки.";
    }

    document.getElementById("result").innerText = result;
}
