const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory product database
const products = [
  { id: 1, name: "Wireless Earbuds Pro", price: 129.99, category: "Electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80" },
  { id: 2, name: "Ergonomic Office Chair", price: 249.50, category: "Furniture", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80" },
  { id: 3, name: "Mechanical Keyboard", price: 145.00, category: "Electronics", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { id: 4, name: "Smart Watch Elite", price: 199.99, category: "Electronics", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80" },
  { id: 5, name: "Minimalist Wooden Desk", price: 399.00, category: "Furniture", image: "https://plus.unsplash.com/premium_photo-1675806684725-d721183204db?w=500&q=80" },
  { id: 6, name: "Noise Cancelling Headphones", price: 299.00, category: "Electronics", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
  { id: 7, name: "Aesthetic Coffee Mug", price: 24.50, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80" },
  { id: 8, name: "Scented Soy Candle", price: 35.00, category: "Home", image: "https://images.unsplash.com/photo-1603006905003-cb44ccd36d1b?w=500&q=80" },
  { id: 9, name: "Yoga Mat Premium", price: 65.00, category: "Fitness", image: "https://images.unsplash.com/photo-1601122496300-92a061ef3388?w=500&q=80" },
  { id: 10, name: "Adjustable Dumbbell Set", price: 159.00, category: "Fitness", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80" }
];

// GET /api/products
// Query params: category, minPrice, maxPrice, sort (asc/desc)
app.get("/api/products", (req, res) => {
  let { category, minPrice, maxPrice, sort } = req.query;
  let result = [...products];

  // Filters
  if (category && category !== "All") {
    result = result.filter(p => p.category === category);
  }
  
  if (minPrice !== undefined && minPrice !== "") {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      result = result.filter(p => p.price >= min);
    }
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      result = result.filter(p => p.price <= max);
    }
  }

  // Sorting
  if (sort === "asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  res.json({ products: result });
});

// POST /api/products
app.post("/api/products", (req, res) => {
  const { name, price, category, image } = req.body;
  
  if (!name || price === undefined || !category || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price: parseFloat(price),
    category,
    image
  };

  products.push(newProduct);
  res.status(201).json({ message: "Product added", product: newProduct });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
