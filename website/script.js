// Typing effect for hero
const title = document.getElementById('typed');
const fullText = title.textContent;
title.textContent = '';
let i = 0;
function typeWriter(){
  if(i < fullText.length){
    title.textContent += fullText.charAt(i);
    i++;
    setTimeout(typeWriter, 28);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  typeWriter();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// Simple form handling (no server) - shows success message
function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('formStatus');
    if (!name || !email || !message) {
        status.textContent = 'Будь ласка, заповніть всі поля.';
        return false;
    }
    // simulate sending
    status.style.color = '#00e6a8';
    status.textContent = 'Повідомлення надіслано';
    
    

}
