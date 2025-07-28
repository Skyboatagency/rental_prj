import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Monitor screen width to conditionally display the image column
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add CSS for hover states via style element
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .input-field:focus {
        border-color: #4096ff;
      }
      
      .forgot-password:hover {
        text-decoration: underline;
      }
      
      .sign-in-button:hover {
        background-color: #40a9ff;
      }
      
      .social-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .or-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.2);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Tentative de connexion avec:", { username, password });

    try {
      const response = await axios.post(`${API_URL}/admins/login`, {
        email: username,
        password: password
      });

      if (response.data) {
        // Stocker les données de l'utilisateur
        const userData = {
          id: response.data.id,
          name: response.data.nom,
          email: response.data.email,
          role: "admin",
          status: "active"
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", userData.id);
        console.log("Données utilisateur stockées:", userData);
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError(error.response?.data?.message || "Identifiants incorrects");
    }
  };

  return (
    <div style={styles.container}>
      {/* FORM SIDE (Left) */}
      <div style={styles.formSide}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Sign In</h1>
          <div style={styles.titleUnderline}></div>
          <p style={styles.subtitle}>Enter your credentials to access your account.</p>
          
          {error && <div style={styles.errorBox}>{error}</div>}
          
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                className="input-field"
                placeholder="example@gmail.com"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                className="input-field"
                placeholder="********"
              />
            </div>
            
            <div style={styles.rememberForgotRow}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="rememberMe" style={styles.rememberLabel}>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" style={styles.forgotPasswordLink} className="forgot-password">
                Forget Password?
              </Link>
            </div>
            
            <button type="submit" style={styles.signInButton} className="sign-in-button">
              Sign In
            </button>
            <div style={styles.registerContainer}>
              <p style={styles.registerText}>Vous n'avez pas de compte ?</p>
              <Link to="/admin-register" style={styles.registerLink}>
                S'inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* IMAGE SIDE (Right) - Hide on smaller screens */}
      {screenWidth >= 768 && (
        <div style={styles.imageSide}>
          {/* You can add content here if you wish */}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  
  // Left side - Form
  formSide: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001529",
    padding: "40px 20px",
    color: "#fff",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "30px",
    color: "#ccc",
    textAlign: "center",
  },
  titleUnderline: {
    height: "3px",
    width: "60px",
    background: "linear-gradient(90deg, #1890ff, #40a9ff)",
    margin: "0 auto",
    marginBottom: "15px",
    borderRadius: "2px",
    boxShadow: "0 2px 4px rgba(24, 144, 255, 0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500",
    textAlign: "left"
  },
  input: {
    padding: "12px 16px",
    fontSize: "14px",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.3s",
  },
  rememberForgotRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkbox: {
    accentColor: "#4096ff",
  },
  rememberLabel: {
    fontSize: "14px",
    color: "#fff",
  },
  forgotPasswordLink: {
    fontSize: "14px",
    color: "#4096ff",
    textDecoration: "none",
  },
  signInButton: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#1890ff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  errorBox: {
    backgroundColor: "rgba(255, 77, 79, 0.2)",
    color: "#ff4d4f",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    fontSize: "14px",
    textAlign: "center",
  },
  
  // Right side - Image
  imageSide: {
    flex: "1",
    backgroundImage: 'url("/images/driver.jpg")', // Fallback to Unsplash if local image missing
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  registerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
  },
  registerText: {
    fontSize: "14px",
    color: "#fff",
  },
  registerLink: {
    fontSize: "14px",
    color: "#4096ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
