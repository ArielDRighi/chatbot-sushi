import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "👋 ¡Hola! Bienvenido al Chatbot Sushi. 📝 Si necesitas ayuda, escribe 'Ayuda' para ver una lista de comandos disponibles. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChat((prevChat) => [...prevChat, { sender: "user", text: message }]);
    setMenuItems([]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      if (data.menuItems) {
        setMenuItems(data.menuItems);
        setChat((prevChat) => [...prevChat, { sender: "bot", text: "🍣 A continuación te presento el menú:" }]);
      } else {
        setChat((prevChat) => [...prevChat, { sender: "bot", text: data.response }]);
      }

      if (message.toLowerCase().includes("chau") || message.toLowerCase().includes("adios")) {
        setToken(null);
        setUserName(null);
        toast.info("Sesión cerrada exitosamente.");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Error al conectar con el servidor." }]);
    } finally {
      setMessage("");
      setIsTyping(false);
    }
  };

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = signinData;

    try {
      const res = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.accessToken);
        setUserName(data.userName);
        toast.success("Sesión iniciada exitosamente.");
        setSigninData({ email: "", password: "" });
        setShowSignin(false);
      } else {
        toast.error(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      toast.error("Error al conectar con el servidor.");
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = signupData;

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Usuario creado exitosamente.");
        setSignupData({ name: "", email: "", password: "" });
        setShowSignup(false);
        setShowSignin(true); // Abrir el popup de inicio de sesión
      } else {
        toast.error(data.message || "Error al crear el usuario.");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <header className="App-header">
        <h1>Sushi Nular</h1>
        {userName && <p className="user-greeting">Hola, {userName}</p>}
        <div className="auth-buttons">
          <button onClick={() => setShowSignup(true)}>Crear Usuario</button>
          <button onClick={() => setShowSignin(true)}>Iniciar Sesión</button>
        </div>
      </header>

      {showSignup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowSignup(false)}>
              &times;
            </span>
            <h2>Crear Usuario</h2>
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                placeholder="Nombre"
                required
              />
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Correo electrónico"
                required
              />
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="Contraseña"
                required
              />
              <button type="submit">Crear Usuario</button>
            </form>
          </div>
        </div>
      )}

      {showSignin && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowSignin(false)}>
              &times;
            </span>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSigninSubmit}>
              <input
                type="email"
                name="email"
                value={signinData.email}
                onChange={handleSigninChange}
                placeholder="Correo electrónico"
                required
              />
              <input
                type="password"
                name="password"
                value={signinData.password}
                onChange={handleSigninChange}
                placeholder="Contraseña"
                required
              />
              <button type="submit">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      )}

      <div className="chat-container">
        <h2>Chatbot Sushi</h2>
        <div className="chat-box">
          {chat.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
              <span style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: msg.text }} />
            </div>
          ))}
          {isTyping && <div className="chat-message bot">Chatbot está escribiendo...</div>}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button type="submit">Enviar</button>
        </form>
      </div>

      {menuItems.length > 0 && (
        <div className="menu-container">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Precio: ${item.price}</p>
              <p className={item.available ? "available" : "not-available"}>
                {item.available ? "Disponible" : "No disponible"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
