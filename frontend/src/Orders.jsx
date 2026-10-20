import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          alert(data.message || "Failed to load orders");
        }
      } catch (error) {
        console.error(error);
        alert("Server se connection nahi ho raha.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={styles.page}>
      <h1>Admin Orders</h1>

      {orders.length === 0 ? (
        <h2>No orders found</h2>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.order}>
            <h2>Order #{order._id}</h2>

            <p>
              <strong>Customer:</strong>{" "}
              {order.userId?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.userId?.email}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <h3>Products</h3>

            {order.products.map((product, index) => (
              <div key={index} style={styles.product}>
                <p>
                  <strong>{product.name}</strong>
                </p>

                <p>
                  Price: Rs. {product.price}
                </p>

                <p>
                  Quantity: {product.quantity}
                </p>
              </div>
            ))}

            <h2>
              Total: Rs. {order.totalAmount}
            </h2>

            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  order: {
    background: "white",
    padding: "25px",
    marginBottom: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  product: {
    padding: "10px",
    marginBottom: "10px",
    background: "#f1f1f1",
    borderRadius: "8px",
  },
};

export default Orders;