import { useEffect, useState } from "react";
console.log("Cart.jsx file loaded");
const initialMeasurements = {
  shoulder: "",
  chest: "",
  waist: "",
  sleevesLength: "",
  kurtaLength: "",
  shalwarLength: "",
  pantLength: "",
};

const initialDesign = {
  frontPocket: "No",
  sidePockets: "No",
  buttons: "Simple",
  style: "Simple",
  waistcoat: "No",
};

const initialCustomization = {
  fulfillmentType: "",
  fabricType: "",
  fabricColor: "",
  measurements: { ...initialMeasurements },
  design: { ...initialDesign },
};

const initialDelivery = {
  name: "",
  phone: "",
  houseNo: "",
  street: "",
  area: "",
  city: "",
  notes: "",
};

function Cart() {
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = savedCart.map((item) => ({
        ...item,
        customization: {
          ...initialCustomization,
          ...(item.customization || {}),
          measurements: {
            ...initialMeasurements,
            ...((item.customization || {}).measurements || {}),
          },
          design: {
            ...initialDesign,
            ...((item.customization || {}).design || {}),
          },
        },
      }));

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id !== id) return item;

        return {
          ...item,
          quantity: Number(item.quantity) + change,
        };
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const updateChoice = (id, field, value) => {
    const updatedCart = cart.map((item) => {
      if (item._id !== id) return item;

      return {
        ...item,
        customization: {
          ...item.customization,
          [field]: value,
        },
      };
    });

    saveCart(updatedCart);
  };

  const updateCustomization = (id, section, field, value) => {
    const updatedCart = cart.map((item) => {
      if (item._id !== id) return item;

      return {
        ...item,
        customization: {
          ...item.customization,
          [section]: {
            ...item.customization[section],
            [field]: value,
          },
        },
      };
    });

    saveCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before placing your order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    for (const item of cart) {
      const c = item.customization || {};

      if (!c.fulfillmentType || !c.fabricType || !c.fabricColor) {
        alert(
          "Please select suit type, fabric and color for " +
            item.name +
            "."
        );
        return;
      }

      if (c.fulfillmentType === "stitched") {
        const m = c.measurements || {};

        const requiredFields = [
          ["shoulder", "Shoulder"],
          ["chest", "Chest"],
          ["waist", "Waist"],
          ["sleevesLength", "Sleeves length"],
          ["kurtaLength", "Kurta/shirt length"],
          ["shalwarLength", "Shalwar length"],
        ];

        for (const [key, label] of requiredFields) {
          if (!m[key] || !Number.isFinite(Number(m[key])) || Number(m[key]) <= 0) {
            alert(
              "Please enter a valid " + label + " for " + item.name + "."
            );
            return;
          }
        }
      }
    }

    const requiredDelivery = [
      ["name", "Full name"],
      ["phone", "Contact number"],
      ["houseNo", "House/flat number"],
      ["area", "Area/Mohalla"],
      ["city", "City"],
    ];

    for (const [key, label] of requiredDelivery) {
      if (!delivery[key].trim()) {
        alert("Please enter " + label + ".");
        return;
      }
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          products: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            customization: item.customization,
          })),
          totalAmount: total,
          deliveryDetails: delivery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Order failed.");
        console.error("Order response:", data);
        return;
      }

      alert("Order placed successfully!");

      localStorage.removeItem("cart");
      setCart([]);
      setDelivery({ ...initialDelivery });
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
      alert("Server se connection nahi ho raha. Backend check karo.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "12px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
  };

  const sectionStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "18px",
    marginTop: "18px",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginTop: "8px",
  };

  return (
    <div style={styles.page}>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <form onSubmit={handleCheckout}>
          {cart.map((item) => {
            const c = item.customization || initialCustomization;
            const m = c.measurements || initialMeasurements;
            const d = c.design || initialDesign;

            return (
              <div key={item._id} style={styles.item}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.image}
                />

                <div style={{ flex: 1, minWidth: "240px" }}>
                  <h2>{item.name}</h2>
                  <p>Product price: Rs. {item.price}</p>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, -1)}
                  >
                    -
                  </button>

                  <span style={styles.quantity}>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, 1)}
                  >
                    +
                  </button>

                  <div style={sectionStyle}>
                    <h3>Customize Your Suit</h3>

                    <label style={labelStyle}>Suit Type</label>
                    <select
                      style={fieldStyle}
                      value={c.fulfillmentType}
                      onChange={(e) =>
                        updateChoice(item._id, "fulfillmentType", e.target.value)
                      }
                      required
                    >
                      <option value="">Select suit type</option>
                      <option value="stitched">Stitched suit</option>
                      <option value="unstitched">Unstitched fabric only</option>
                    </select>

                    <label style={labelStyle}>Fabric Type</label>
                    <select
                      style={fieldStyle}
                      value={c.fabricType}
                      onChange={(e) =>
                        updateChoice(item._id, "fabricType", e.target.value)
                      }
                      required
                    >
                      <option value="">Select fabric</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Wash and Wear">Wash and Wear</option>
                      <option value="Linen">Linen</option>
                      <option value="Khaddar">Khaddar</option>
                      <option value="Other">Other</option>
                    </select>

                    <label style={labelStyle}>Fabric Color</label>
                    <select
                      style={fieldStyle}
                      value={c.fabricColor}
                      onChange={(e) =>
                        updateChoice(item._id, "fabricColor", e.target.value)
                      }
                      required
                    >
                      <option value="">Select color</option>
                      {[
                        "Black",
                        "White",
                        "Navy Blue",
                        "Grey",
                        "Beige",
                        "Brown",
                        "Olive Green",
                        "Maroon",
                      ].map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>

                    {c.fulfillmentType === "stitched" && (
                      <>
                        <h4>Measurements (inches)</h4>

                        {[
                          ["shoulder", "Shoulder"],
                          ["chest", "Chest"],
                          ["waist", "Waist"],
                          ["sleevesLength", "Sleeves Length"],
                          ["kurtaLength", "Kurta/Shirt Length"],
                          ["shalwarLength", "Shalwar Length"],
                        ].map(([key, label]) => (
                          <div key={key}>
                            <label style={labelStyle}>{label}</label>
                            <input
                              type="number"
                              min="0.25"
                              step="0.25"
                              style={fieldStyle}
                              value={m[key] || ""}
                              onChange={(e) =>
                                updateCustomization(
                                  item._id,
                                  "measurements",
                                  key,
                                  e.target.value
                                )
                              }
                              placeholder={"Enter " + label.toLowerCase()}
                              required
                            />
                          </div>
                        ))}

                        <label style={labelStyle}>
                          Pant Length (optional, inches)
                        </label>
                        <input
                          type="number"
                          min="0.25"
                          step="0.25"
                          style={fieldStyle}
                          value={m.pantLength || ""}
                          onChange={(e) =>
                            updateCustomization(
                              item._id,
                              "measurements",
                              "pantLength",
                              e.target.value
                            )
                          }
                        />

                        <h4>Design Options</h4>

                        {[
                          ["frontPocket", "Front Pocket", ["No", "Yes"]],
                          ["sidePockets", "Side Pockets", ["No", "Yes"]],
                          ["buttons", "Buttons", ["Simple", "Designer"]],
                          ["style", "Suit Style", ["Simple", "Designed"]],
                          ["waistcoat", "Waistcoat", ["No", "Yes"]],
                        ].map(([key, label, options]) => (
                          <div key={key}>
                            <label style={labelStyle}>{label}</label>
                            <select
                              style={fieldStyle}
                              value={d[key] || options[0]}
                              onChange={(e) =>
                                updateCustomization(
                                  item._id,
                                  "design",
                                  key,
                                  e.target.value
                                )
                              }
                            >
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={sectionStyle}>
            <h2>Delivery Details</h2>

            {[
              ["name", "Full Name"],
              ["phone", "Contact Number"],
              ["houseNo", "House / Flat Number"],
              ["street", "Street / Road"],
              ["area", "Area / Mohalla"],
              ["city", "City"],
            ].map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={fieldStyle}
                  value={delivery[key]}
                  onChange={(e) =>
                    setDelivery((previous) => ({
                      ...previous,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={label}
                  required={key !== "street"}
                />
              </div>
            ))}

            <label style={labelStyle}>Additional Instructions (optional)</label>
            <textarea
              style={fieldStyle}
              rows="3"
              value={delivery.notes}
              onChange={(e) =>
                setDelivery((previous) => ({
                  ...previous,
                  notes: e.target.value,
                }))
              }
              placeholder="Any delivery instructions"
            />
          </div>

          <h2>Total: Rs. {total}</h2>

          <p>
            Abhi total sirf product price se calculate hota hai.
            Fabric, stitching aur design ki extra pricing baad mein admin
            panel se connect karni hogi.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.checkout,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  item: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  quantity: {
    margin: "0 15px",
    fontWeight: "bold",
  },
  checkout: {
    padding: "14px 25px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Cart;
