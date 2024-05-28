document.getElementById('expert-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cropYield = document.getElementById('crop-yield').value;
    const demand = document.getElementById('demand').value;

    const rules = [
        {crop_yield: "низька", demand: "будь-який", price_increase: "висока"},
        {crop_yield: "середня", demand: "високий", price_increase: "середня"},
        {crop_yield: "середня", demand: "низький", price_increase: "низька"},
        {crop_yield: "висока", demand: "низький", price_increase: "низька"},
        {crop_yield: "висока", demand: "високий", price_increase: "середня"}
    ];

    let result = "Немає даних для такого поєднання";

    for (let rule of rules) {
        if (rule.crop_yield === cropYield && (rule.demand === demand || rule.demand === "будь-який")) {
            result = `Ймовірність підвищення цін: ${rule.price_increase}`;
            break;
        }
    }

    document.getElementById('result').innerText = result;
});
