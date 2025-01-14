import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "👋 ¡Hola! Bienvenido al Chatbot Sushi. Puedes preguntar por el menú, hacer un pedido o consultar el estado de tu orden. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupMessage, setSignupMessage] = useState("");
  const [signinMessage, setSigninMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Estado para almacenar el nombre del usuario
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
          ...(token && { Authorization: `Bearer ${token}` }), // Agregar el token si está disponible
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

      // Desloguear al usuario si el mensaje es "chau" o "adios"
      if (message.toLowerCase().includes("chau") || message.toLowerCase().includes("adios")) {
        setToken(null);
        setUserName(null);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Error al conectar con el servidor." }]);
    } finally {
      setMessage("");
      setIsTyping(false);
    }
  };

  // Manejo de SignIn
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
        setToken(data.accessToken); // Guarda el token en el estado
        setUserName(data.userName); // Guarda el nombre del usuario en el estado
        setSigninMessage("Inicio de sesión exitoso.");
        setSigninData({ email: "", password: "" }); // Limpiar datos del formulario
        setShowSignin(false); // Cerrar el popup
      } else {
        setSigninMessage(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setSigninMessage("Error al conectar con el servidor.");
    }
  };

  // Manejo de SignUp
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
        setSignupMessage(data.message);
        setSignupData({ name: "", email: "", password: "" }); // Limpiar datos del formulario
        setShowSignup(false); // Cerrar el popup
      } else {
        setSignupMessage(data.message || "Error al crear el usuario.");
      }
    } catch (error) {
      setSignupMessage("Error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sushi Nular</h1>
        {userName && <p className="user-greeting">Hola, {userName}</p>} {/* Añadir clase user-greeting */}
        <div className="auth-buttons">
          <button onClick={() => setShowSignup(true)}>Crear Usuario</button>
          <button onClick={() => setShowSignin(true)}>Iniciar Sesión</button>
        </div>
      </header>

      {/* Formulario de crear usuario */}
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
            {signupMessage && <p>{signupMessage}</p>}
          </div>
        </div>
      )}

      {/* Formulario de iniciar sesión */}
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
            {signinMessage && <p>{signinMessage}</p>}
          </div>
        </div>
      )}

      {/* Chatbot */}
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

      {/* Menú */}
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
