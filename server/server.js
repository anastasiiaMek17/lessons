const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;
const ORDERS_DIR = path.join(__dirname, "..", "data", "orders");
const CSV_FILE = path.join(ORDERS_DIR, "orders.csv");
const JSON_FILE = path.join(ORDERS_DIR, "orders.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

async function ensureOrdersDir() {
  try {
    await fs.access(ORDERS_DIR);
  } catch {
    await fs.mkdir(ORDERS_DIR, { recursive: true });
  }
  
  try {
    await fs.access(CSV_FILE);
  } catch {
    const headers = "ID,Дата,Час,Тип запиту,Ім'я,Телефон,Вибране авто,Питання,Статус\n";
    await fs.writeFile(CSV_FILE, headers, "utf8");
  }
  
  try {
    await fs.access(JSON_FILE);
  } catch {
    await fs.writeFile(JSON_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return "";
  }
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDateForCsv(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatTimeForCsv(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

async function appendToCsv(request) {
  try {
    const requestType = request.type === "car_selection" ? "Вибір авто" : "Консультація";
    const carInfo = request.car || "Не вказано";
    const questionInfo = request.question || "Не вказано";
    const status = "Новий";
    
    const row = [
      request.id,
      formatDateForCsv(request.timestamp),
      formatTimeForCsv(request.timestamp),
      requestType,
      escapeCsvField(request.name),
      escapeCsvField(request.phone),
      escapeCsvField(carInfo),
      escapeCsvField(questionInfo),
      status,
    ].join(",") + "\n";
    
    await fs.appendFile(CSV_FILE, row, "utf8");
  } catch (error) {
    console.error("Error writing to CSV:", error);
    throw error;
  }
}

async function appendToJson(request) {
  try {
    let orders = [];
    try {
      const data = await fs.readFile(JSON_FILE, "utf8");
      orders = JSON.parse(data);
    } catch (error) {
      orders = [];
    }
    
    const formattedRequest = {
      id: request.id,
      date: formatDateForCsv(request.timestamp),
      time: formatTimeForCsv(request.timestamp),
      timestamp: request.timestamp,
      type: request.type === "car_selection" ? "Вибір авто" : "Консультація",
      name: request.name,
      phone: request.phone,
      car: request.car || null,
      question: request.question || null,
      status: "Новий",
    };
    
    orders.push(formattedRequest);
    
    await fs.writeFile(JSON_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to JSON:", error);
    throw error;
  }
}

async function readRequestsFromCsv() {
  try {
    const data = await fs.readFile(CSV_FILE, "utf8");
    const lines = data.trim().split("\n");
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(",");
    const isNewFormat = headers.includes("Дата") && headers.includes("Час");
    const requests = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      
      if (isNewFormat && values.length >= 7) {
        requests.push({
          id: values[0],
          date: values[1] || "",
          time: values[2] || "",
          timestamp: `${values[1] || ""} ${values[2] || ""}`.trim(),
          type: values[3] || "",
          name: values[4] || "",
          phone: values[5] || "",
          car: values[6] || null,
          question: values[7] || null,
          status: values[8] || "Новий",
        });
      } else if (values.length >= 6) {
        const timestamp = values[1] || "";
        const dateTime = timestamp.split(" ");
        requests.push({
          id: values[0],
          date: dateTime[0] || "",
          time: dateTime[1] || "",
          timestamp: timestamp,
          type: values[2] || "",
          name: values[3] || "",
          phone: values[4] || "",
          car: values[5] || null,
          question: values[6] || null,
          status: "Новий",
        });
      }
    }
    
    return requests;
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

app.post("/api/requests", async (req, res) => {
  try {
    const { name, phone, car, question, type } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Ім'я та телефон є обов'язковими полями",
      });
    }

    const phoneRegex = /^\+380\d{9}$/;
    const cleanPhone = phone.replace(/\s/g, "");
    
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        error: "Номер телефону повинен бути у форматі +380XXXXXXXXX (наприклад: +380987718296)",
      });
    }

    const newRequest = {
      id: Date.now().toString(),
      name,
      phone: cleanPhone,
      car: car || null,
      question: question || null,
      type: type || "consultation",
      timestamp: new Date().toISOString(),
    };

    await appendToCsv(newRequest);
    await appendToJson(newRequest);

    console.log("✅ New request received:");
    console.log(`   📋 Type: ${newRequest.type === "car_selection" ? "Вибір авто" : "Консультація"}`);
    console.log(`   👤 Name: ${name}`);
    console.log(`   📞 Phone: ${cleanPhone}`);
    if (car) console.log(`   🚛 Car: ${car}`);
    if (question) console.log(`   ❓ Question: ${question}`);
    console.log(`   📝 Saved to CSV: ${CSV_FILE}`);
    console.log(`   📝 Saved to JSON: ${JSON_FILE}`);

    res.status(201).json({
      success: true,
      message: "Запит успішно відправлено",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Внутрішня помилка сервера",
    });
  }
});

app.get("/api/requests", async (req, res) => {
  try {
    let requests = [];
    try {
      const data = await fs.readFile(JSON_FILE, "utf8");
      requests = JSON.parse(data);
    } catch (error) {
      requests = await readRequestsFromCsv();
    }
    res.json(requests);
  } catch (error) {
    console.error("Error reading requests:", error);
    res.status(500).json({
      error: "Внутрішня помилка сервера",
    });
  }
});

app.patch("/api/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Статус є обов'язковим полем",
      });
    }

    let orders = [];
    try {
      const data = await fs.readFile(JSON_FILE, "utf8");
      orders = JSON.parse(data);
    } catch (error) {
      return res.status(404).json({
        error: "Файл з замовленнями не знайдено",
      });
    }

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        error: "Замовлення не знайдено",
      });
    }

    orders[orderIndex].status = status;

    await fs.writeFile(JSON_FILE, JSON.stringify(orders, null, 2), "utf8");

    await updateCsvFile(orders);

    console.log(`✅ Status updated for order ${id}: ${status}`);

    res.json({
      success: true,
      message: "Статус успішно оновлено",
      data: orders[orderIndex],
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      error: "Внутрішня помилка сервера",
    });
  }
});

async function updateCsvFile(orders) {
  try {
    const headers = "ID,Дата,Час,Тип запиту,Ім'я,Телефон,Вибране авто,Питання,Статус\n";
    let csvContent = headers;

    for (const order of orders) {
      const carInfo = order.car || "Не вказано";
      const questionInfo = order.question || "Не вказано";
      
      const row = [
        order.id,
        order.date || "",
        order.time || "",
        order.type || "",
        escapeCsvField(order.name || ""),
        escapeCsvField(order.phone || ""),
        escapeCsvField(carInfo),
        escapeCsvField(questionInfo),
        order.status || "Новий",
      ].join(",") + "\n";
      csvContent += row;
    }

    await fs.writeFile(CSV_FILE, csvContent, "utf8");
  } catch (error) {
    console.error("Error updating CSV:", error);
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  await ensureOrdersDir();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 CSV file: ${CSV_FILE}`);
    console.log(`📁 JSON file: ${JSON_FILE}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});


