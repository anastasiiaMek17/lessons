function showToast(type, title, message, duration = 5000) {
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  toast.innerHTML = `
    <div class="toast__icon">${icons[type] || "ℹ"}</div>
    <div class="toast__content">
      <div class="toast__title">${title}</div>
      ${message ? `<div class="toast__message">${message}</div>` : ""}
    </div>
    <button class="toast__close" aria-label="Закрити">&times;</button>
  `;

  document.body.appendChild(toast);

  const closeBtn = toast.querySelector(".toast__close");
  closeBtn.addEventListener("click", () => {
    closeToast(toast);
  });

  if (duration > 0) {
    setTimeout(() => {
      closeToast(toast);
    }, duration);
  }

  return toast;
}

function closeToast(toast) {
  toast.classList.add("toast--closing");
  setTimeout(() => {
    toast.remove();
  }, 300);
}

let lastScroll = 0;
const header = document.querySelector("header");
const delta = 5;
const headerHeight = header.offsetHeight;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (Math.abs(currentScroll - lastScroll) <= delta) return;

  if (currentScroll > lastScroll && currentScroll > headerHeight) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  const navLinks = nav.querySelectorAll(".nav__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

const weightSlider = document.getElementById("weight-slider");
const weightValueSpan = document.getElementById("weight-value");

function updateWeightValue() {
  weightValueSpan.textContent = weightSlider.value;
}

weightSlider.addEventListener("input", updateWeightValue);

updateWeightValue();

const CITY_COORDINATES = {
  kyiv: { lat: 50.4501, lng: 30.5234, name: "Київ" },
  lviv: { lat: 49.8397, lng: 24.0297, name: "Львів" },
  odesa: { lat: 46.4825, lng: 30.7233, name: "Одеса" },
  dnipro: { lat: 48.4647, lng: 35.0462, name: "Дніпро" },
  warsaw: { lat: 52.2297, lng: 21.0122, name: "Варшава" },
  krakow: { lat: 50.0647, lng: 19.9450, name: "Краків" },
  wroclaw: { lat: 51.1079, lng: 17.0385, name: "Вроцлав" },
  bucharest: { lat: 44.4268, lng: 26.1025, name: "Бухарест" },
  "cluj-napoca": { lat: 46.7712, lng: 23.6236, name: "Клуж-Напока" },
  timisoara: { lat: 45.7489, lng: 21.2087, name: "Тімішоара" },
  iasi: { lat: 47.1585, lng: 27.6014, name: "Ясси" },
  constanta: { lat: 44.1598, lng: 28.6348, name: "Констанца" },
  istanbul: { lat: 41.0082, lng: 28.9784, name: "Стамбул" },
  ankara: { lat: 39.9334, lng: 32.8597, name: "Анкара" },
  izmir: { lat: 38.4237, lng: 27.1428, name: "Ізмір" },
  bursa: { lat: 40.1826, lng: 29.0665, name: "Бурса" },
  sofia: { lat: 42.6977, lng: 23.3219, name: "Софія" },
  plovdiv: { lat: 42.1354, lng: 24.7453, name: "Пловдив" },
  bratislava: { lat: 48.1486, lng: 17.1077, name: "Братислава" },
  kosice: { lat: 48.7139, lng: 21.2581, name: "Кошице" },
};

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculatePrice(distance, weight) {
  const baseRate = 200;
  const minCharge = 2000;
  const calculatedPrice = distance * baseRate * weight;
  return Math.max(calculatedPrice, minCharge);
}

document.addEventListener("DOMContentLoaded", () => {
  const selectFrom = document.getElementById("calculator__select-from");
  const selectTo = document.getElementById("calculator__select-consignee");
  const priceDisplay = document.getElementById("shipping-price");

  function updateWeightValue() {
    weightValueSpan.textContent = weightSlider.value;
    calculateTariff();
  }

  function calculateTariff() {
    const cityFrom = selectFrom?.value;
    const cityTo = selectTo?.value;
    const weight = parseFloat(weightSlider.value);

    if (!cityFrom || !cityTo) {
      priceDisplay.textContent = "0.00 UAH";
      return;
    }

    const fromCoords = CITY_COORDINATES[cityFrom];
    const toCoords = CITY_COORDINATES[cityTo];

    if (!fromCoords || !toCoords) {
      priceDisplay.textContent = "0.00 UAH";
      return;
    }

    const distance = calculateDistance(
      fromCoords.lat,
      fromCoords.lng,
      toCoords.lat,
      toCoords.lng
    );

    const totalCost = calculatePrice(distance, weight);

    priceDisplay.textContent = `${totalCost.toFixed(0)} UAH`;
  }

  weightSlider.addEventListener("input", updateWeightValue);

  selectFrom.addEventListener("change", calculateTariff);
  selectTo.addEventListener("change", calculateTariff);

  updateWeightValue();
  calculateTariff();
});

function validatePhone(phone) {
  const cleanPhone = phone.replace(/\s/g, "");
  const phoneRegex = /^\+380\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

function formatPhoneInput(input) {
  let value = input.value.replace(/\D/g, "");
  
  if (value.length === 0) {
    input.value = "+380";
    return;
  }
  
  if (value.startsWith("380")) {
    value = "+" + value;
  } else if (value.startsWith("0")) {
    value = "+380" + value.substring(1);
  } else if (!value.startsWith("+380")) {
    value = "+380" + value;
  }
  
  if (value.length > 13) {
    value = value.substring(0, 13);
  }
  
  if (value.length > 4) {
    const formatted = value.substring(0, 4) + " " + 
                     value.substring(4, 6) + 
                     (value.length > 6 ? " " + value.substring(6, 9) : "") +
                     (value.length > 9 ? " " + value.substring(9, 11) : "") +
                     (value.length > 11 ? " " + value.substring(11) : "");
    input.value = formatted;
  } else {
    input.value = value;
  }
}

function cleanPhoneNumber(phone) {
  return phone.replace(/\s/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  const carModal = document.getElementById("carModal");
  const carForm = document.getElementById("carForm");
  const closeModal = document.getElementById("closeModal");
  const selectedCarInput = document.getElementById("selectedCar");
  const carButtons = document.querySelectorAll(".cars-card__button");
  const modalPhoneInput = document.getElementById("modalPhone");

  if (modalPhoneInput) {
    modalPhoneInput.addEventListener("input", () => {
      formatPhoneInput(modalPhoneInput);
    });
    
    modalPhoneInput.addEventListener("focus", () => {
      if (!modalPhoneInput.value) {
        modalPhoneInput.value = "+380";
      }
    });
  }

  carButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const carType = button.getAttribute("data-car");
      selectedCarInput.value = carType;
      
      const selectedCarDisplay = document.getElementById("selectedCarDisplay");
      const selectedCarText = document.getElementById("selectedCarText");
      if (selectedCarDisplay && selectedCarText) {
        selectedCarText.textContent = carType;
        selectedCarDisplay.style.display = "block";
      }
      
      if (modalPhoneInput) {
        modalPhoneInput.value = "+380";
      }
      
      carModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  closeModal.addEventListener("click", () => {
    carModal.classList.remove("active");
    document.body.style.overflow = "";
    carForm.reset();
    const selectedCarDisplay = document.getElementById("selectedCarDisplay");
    if (selectedCarDisplay) {
      selectedCarDisplay.style.display = "none";
    }
  });

  carModal.addEventListener("click", (e) => {
    if (e.target === carModal) {
      carModal.classList.remove("active");
      document.body.style.overflow = "";
      carForm.reset();
      const selectedCarDisplay = document.getElementById("selectedCarDisplay");
      if (selectedCarDisplay) {
        selectedCarDisplay.style.display = "none";
      }
    }
  });

  carForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("modalName").value.trim();
    const phone = document.getElementById("modalPhone").value;
    const cleanPhone = cleanPhoneNumber(phone);

    if (!name) {
      showToast("error", "Помилка", "Будь ласка, введіть ваше ім'я");
      return;
    }

    if (!validatePhone(cleanPhone)) {
      showToast(
        "error",
        "Невірний формат телефону",
        "Номер телефону повинен бути у форматі +380XXXXXXXXX\nНаприклад: +380987718296"
      );
      return;
    }

    const formData = {
      name,
      phone: cleanPhone,
      car: selectedCarInput.value,
      type: "car_selection",
    };

    try {
      const response = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(
          "success",
          "Дякуємо за замовлення!",
          `Ваше замовлення на "${selectedCarInput.value}" прийнято. Наші менеджери зв'яжуться з вами найближчим часом.`,
          6000
        );
        carForm.reset();
        if (modalPhoneInput) {
          modalPhoneInput.value = "+380";
        }
        carModal.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Помилка відправки");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
        showToast(
          "error",
          "Помилка підключення",
          "Не вдалося підключитися до сервера. Переконайтеся, що сервер запущений (npm start) або зателефонуйте нам: +380987718296",
          8000
        );
      } else {
        showToast("error", "Помилка", error.message || "Сталася помилка. Спробуйте ще раз або зателефонуйте нам: +380987718296");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const footerForm = document.querySelector(".footer__form");
  const footerFormSubmit = document.getElementById("footerFormSubmit");
  const footerPhoneInput = document.getElementById("phone");

  if (footerPhoneInput) {
    footerPhoneInput.addEventListener("input", () => {
      formatPhoneInput(footerPhoneInput);
    });
    
    footerPhoneInput.addEventListener("focus", () => {
      if (!footerPhoneInput.value) {
        footerPhoneInput.value = "+380";
      }
    });
  }

  if (footerFormSubmit) {
    footerFormSubmit.addEventListener("click", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value;
      const question = document.getElementById("question").value.trim();
      const cleanPhone = cleanPhoneNumber(phone);

      if (!name) {
        showToast("error", "Помилка", "Будь ласка, введіть ваше ім'я");
        return;
      }

      if (!validatePhone(cleanPhone)) {
        showToast(
          "error",
          "Невірний формат телефону",
          "Номер телефону повинен бути у форматі +380XXXXXXXXX\nНаприклад: +380987718296"
        );
        return;
      }

      const formData = {
        name,
        phone: cleanPhone,
        question: question || "",
        type: "consultation",
      };

      try {
        const response = await fetch("http://localhost:3000/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast(
            "success",
            "Дякуємо за запит!",
            "Ваш запит на консультацію прийнято. Наші менеджери зв'яжуться з вами найближчим часом.",
            6000
          );
          footerForm.querySelectorAll("input").forEach((input) => {
            if (input.id === "phone") {
              input.value = "+380";
            } else {
              input.value = "";
            }
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Помилка відправки");
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
          showToast(
            "error",
            "Помилка підключення",
            "Не вдалося підключитися до сервера. Переконайтеся, що сервер запущений (npm start) або зателефонуйте нам: +380987718296",
            8000
          );
        } else {
          showToast("error", "Помилка", error.message || "Сталася помилка. Спробуйте ще раз або зателефонуйте нам: +380987718296");
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const heroButton = document.getElementById("heroButton");

  if (heroButton) {
    heroButton.addEventListener("click", () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
