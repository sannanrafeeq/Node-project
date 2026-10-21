import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1>Our Products</h1>

        <button
          onClick={() => navigate("/cart")}
          style={styles.cartButton}
        >
          🛒 View Cart
        </button>
      </div>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product._id} style={styles.card}>
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
            />

            <h2>{product.name}</h2>

            <p style={styles.description}>
              {product.description}
            </p>

            <p style={styles.category}>
              Category: {product.category}
            </p>

            <h3>Rs. {product.price}</h3>

            <button
              onClick={() => addToCart(product)}
              style={styles.addButton}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "1px solid #ddd",
  },

  cartButton: {
    padding: "15px 25px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  description: {
    color: "#666",
  },

  category: {
    color: "#888",
  },

  addButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default Products;