import { API_URL } from "./config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  // ================= GET PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= CHECK TOKEN =================
  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as admin first.");
      navigate("/login");
      return null;
    }

    return token;
  };

  // ================= ADD / UPDATE PRODUCT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          image,
          description,
          category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editingId
            ? "Product updated successfully!"
            : "Product added successfully!"
        );

        clearForm();
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server se connection nahi ho raha");
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    const token = getToken();

    if (!token) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product deleted successfully!");

        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server se connection nahi ho raha");
    }
  };

  // ================= EDIT PRODUCT =================
  const handleEdit = (product) => {
    setEditingId(product._id);

    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setDescription(product.description);
    setCategory(product.category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CLEAR FORM =================
  const clearForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setCategory("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ================= ADMIN FORM ================= */}

        <div style={styles.card}>
          <h1>Admin Panel</h1>

          <p style={styles.subtitle}>
            {editingId
              ? "Update Product"
              : "Add New Product"}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={styles.input}
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={styles.textarea}
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={styles.input}
              required
            />

            <button
              type="submit"
              style={styles.button}
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                style={styles.cancelButton}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* ================= PRODUCTS ================= */}

        <h1 style={styles.productsTitle}>
          All Products
        </h1>

        <div style={styles.grid}>
          {products.map((product) => (
            <div
              key={product._id}
              style={styles.productCard}
            >
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />

              <h2>{product.name}</h2>

              <p style={styles.description}>
                {product.description}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {product.category}
              </p>

              <h3>Rs. {product.price}</h3>

              <div style={styles.actions}>
                <button
                  onClick={() =>
                    handleEdit(product)
                  }
                  style={styles.editButton}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(product._id)
                  }
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    maxWidth: "420px",
    margin: "0 auto",
    padding: "35px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    height: "100px",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    resize: "none",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  cancelButton: {
    width: "100%",
    padding: "13px",
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#777",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  productsTitle: {
    textAlign: "center",
    marginTop: "50px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },

  productCard: {
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
    lineHeight: "1.6",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  editButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  deleteButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
};

export default Admin;