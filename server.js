const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));

const products = [
  {
    id: 1,
    name: "Gaming Laptop",
    price: 89999,
    image: "https://picsum.photos/300?1"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 4999,
    image: "https://picsum.photos/300?2"
  },
  {
    id: 3,
    name: "Wireless Mouse",
    price: 1999,
    image: "https://picsum.photos/300?3"
  },
  {
    id: 4,
    name: "27 Inch Monitor",
    price: 14999,
    image: "https://picsum.photos/300?4"
  }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date()
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
