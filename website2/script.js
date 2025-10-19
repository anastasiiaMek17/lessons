// Аккордеони для лекцій
document.addEventListener("DOMContentLoaded", function(){
  const acc = document.querySelectorAll(".accordion");
  acc.forEach(button => {
    button.addEventListener("click", function(){
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if(panel.style.display === "block"){
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  });

  // Вкладки для модулів
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", function(){
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.style.display = "none");

      btn.classList.add("active");
      tabContents[index].style.display = "block";
    });
  });

  // Відкрити першу вкладку за замовчуванням
  if(tabButtons.length > 0){
    tabButtons[0].click();
  }
});

// Перевірка тестів
function checkTest(formId){
  const form = document.getElementById(formId);
  const result = form.querySelector(".result");
  const inputs = form.querySelectorAll("input[type='radio']");
  let correct = true;

  inputs.forEach(input => {
    if(input.checked){
      if(input.dataset.correct !== "true"){
        correct = false;
      }
    } else if(input.dataset.correct === "true"){
      correct = false;
    }
  });

  if(correct){
    result.textContent = "Правильно! ✅";
    result.style.color = "green";
  } else {
    result.textContent = "Неправильно ❌";
    result.style.color = "red";
  }
}
