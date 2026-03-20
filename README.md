# Product Listing Application

This is a simple server-side application built with Node.js and Express that provides a RESTful API for managing a product catalog. It also serves static frontend files from the `public` directory.

## Features
- Provides an in-memory database of various products.
- Fetch all products with options to filter by category, price range, and sort by price.
- Add new products to the database.
- CORS enabled for cross-origin requests.

## Technology Stack
- **Server Environment:** Node.js
- **Framework:** Express.js (`express`)
- **Middleware:** `cors` (for Cross-Origin Resource Sharing), `express.json()` (for parsing JSON bodies)
- **Database:** In-memory array (restarts on server reboot)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd product-listing-project
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the application by running:
```bash
npm start
```

The server will start running at: `http://localhost:3000` (or another port if the `PORT` environment variable is specified).

## API Documentation

### 1. Get All Products
Retrieves a list of products. Supports filtering and sorting via query parameters.

- **URL:** `/api/products`
- **Method:** `GET`
- **Query Parameters (Optional):**
  - `category` (string): Filter by product category (e.g., Electronics, Furniture). If set to "All", returns everything.
  - `minPrice` (number): Minimum price of the product.
  - `maxPrice` (number): Maximum price of the product.
  - `sort` (string): Sort products by price. Accepts `asc` (ascending) or `desc` (descending).

**Success Response:**
- **Code:** `200 OK`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "products": [
      {
        "id": 1,
        "name": "Wireless Earbuds Pro",
        "price": 129.99,
        "category": "Electronics",
        "image": "https://..."
      }
    ]
  }
  ```

### 2. Add a New Product
Adds a new product to the in-memory database.

- **URL:** `/api/products`
- **Method:** `POST`
- **Body Structure:**
  ```json
  {
    "name": "String",        // Required
    "price": Number,         // Required
    "category": "String",    // Required
    "image": "String (URL)"  // Required
  }
  ```

**Success Response:**
- **Code:** `201 Created`
- **Body:**
  ```json
  {
    "message": "Product added",
    "product": {
      "id": 11,
      "name": "New Product",
      "price": 100,
      "category": "Category",
      "image": "https://..."
    }
  }
  ```

**Error Responses:**
- **Code:** `400 Bad Request` (If required fields are missing)
- **Body:** `{ "error": "Missing required fields" }`
