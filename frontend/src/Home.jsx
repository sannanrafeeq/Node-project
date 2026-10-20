import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>
          SMT DESIGNER
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Home
          </Link>

          <Link to="/products" style={styles.link}>
            Products
          </Link>

          <Link to="/cart" style={styles.link}>
            🛒 Cart
          </Link>

          <Link to="/admin" style={styles.admin}>
            Admin
          </Link>

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <p style={styles.smallText}>
          WELCOME TO SMT DESIGNER
        </p>

        <h1 style={styles.heading}>
          Everything You Need,
          <br />
          All In One Place.
        </h1>

        <p style={styles.description}>
          Discover quality products at great prices.
          Shop easily and enjoy a simple shopping experience.
        </p>

        <Link to="/products" style={styles.shopButton}>
          Shop Now →
        </Link>
      </section>

      {/* CATEGORIES */}
      <section style={styles.section}>
        <h2>Shop By Category</h2>

        <div style={styles.categoryGrid}>
          <div style={styles.category}>
            👕
            <h3>Fashion</h3>
            <p style={styles.categoryText}>
              Latest fashion products
            </p>
          </div>

          <div style={styles.category}>
            👗
            <h3>Collection</h3>
            <p style={styles.categoryText}>
              Simple and stylish collection
            </p>
          </div>

          <div style={styles.category}>
            🏠
            <h3>Home</h3>
            <p style={styles.categoryText}>
              Products for your home and lifestyle
            </p>
          </div>

          <div style={styles.category}>
            🎨
            <h3>Designs</h3>
            <p style={styles.categoryText}>
              Useful and creative designs
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={styles.why}>
        <h2>Why Choose SMT Designer?</h2>

        <div style={styles.features}>
          <div>
            <h3>🚚 Fast Delivery</h3>
            <p>Fast and safe delivery.</p>
          </div>

          <div>
            <h3>🔒 Secure Shopping</h3>
            <p>Your shopping experience is secure.</p>
          </div>

          <div>
            <h3>⭐ Quality Products</h3>
            <p>Quality products at good prices.</p>
          </div>
        </div>
      </section>

      
            {/* FOOTER */}
      <footer style={styles.footer}>
        <h2 style={styles.footerTitle}>SMT Designer</h2>

        <p>
          Your simple and reliable online shopping store.
        </p>

        <div style={styles.footerLinks}>
          <Link to="/products" style={styles.footerLink}>
            Products
          </Link>

          <Link to="/cart" style={styles.footerLink}>
            Cart
          </Link>

          <Link to="/" style={styles.footerLink}>
            Home
          </Link>
        </div>

        <p>Owner: Sheikh Muhammad Rafeeq</p>

        <p>
          Mobile: <a href="tel:03118199208" style={styles.footerLink}>
            03118199208
          </a>
        </p>

        <p>© {new Date().getFullYear()} SMT Designer. All rights reserved.</p>
      </footer>
      
    </div>
  );
}

const styles = {
  page: {
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100%",
  fontFamily: "Arial, sans-serif",
  color: "#111827",
  overflowX: "hidden",
},


  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    padding: "18px 40px",
    background: "#111827",
  },

  logo: {
    color: "white",
    fontSize: "26px",
    fontWeight: "bold",
    textDecoration: "none",
  },

  links: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "18px",
  },

  link: {
    color: "white",
    textDecoration: "none",
  },

  admin: {
    color: "white",
    background: "#2563eb",
    textDecoration: "none",
    padding: "8px 15px",
    borderRadius: "6px",
  },

  logout: {
    color: "white",
    background: "#dc2626",
    border: "none",
    padding: "9px 15px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    textAlign: "center",
    padding: "100px 30px",
    background: "#1f2937",
    color: "white",
  },

  smallText: {
  color: "#93c5fd",
  letterSpacing: "2px",
  fontWeight: "bold",
  fontSize: "clamp(16px, 4vw, 33px)",
  overflowWrap: "anywhere",
},


  heading: {
    fontSize: "50px",
    lineHeight: "1.3",
    margin: "20px 0",
  },

  description: {
    maxWidth: "650px",
    margin: "0 auto 30px",
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#d1d5db",
  },

  shopButton: {
    display: "inline-block",
    padding: "14px 30px",
    background: "white",
    color: "#111827",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  section: {
    padding: "70px 40px",
    textAlign: "center",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "40px auto 0",
  },

  category: {
    padding: "30px 20px",
    background: "#f4f6f8",
    borderRadius: "12px",
    fontSize: "35px",
  },

  categoryText: {
    lineHeight: "1.5",
    fontSize: "16px",
  },

  why: {
    padding: "70px 40px",
    textAlign: "center",
    background: "#f4f6f8",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "30px",
    maxWidth: "900px",
    margin: "40px auto 0",
  },

    footer: {
  background: "#111827",
  color: "white",
  textAlign: "center",
  padding: "35px 16px",
  lineHeight: "1.8",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
  wordBreak: "normal",
},

  footerTitle: {
    color: "#3b82f6",
    fontSize: "clamp(20px, 5vw, 28px)",
    margin: "0 0 12px",
  },

  footerLinks: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  margin: "20px 0",
},

  footerLink: {
    color: "white",
    textDecoration: "none",
    margin: "0",
    overflowWrap: "anywhere",
  },
};

export default Home;