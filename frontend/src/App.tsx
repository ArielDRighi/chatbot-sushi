import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupMessage, setSignupMessage] = useState("");
  const [signinMessage, setSigninMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      } else {
        setSignupMessage(data.message || "Error al crear el usuario.");
      }
    } catch (error) {
      setSignupMessage("Error al conectar con el servidor.");
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
        setToken(data.accessToken);
        setSigninMessage("Inicio de sesión exitoso.");
      } else {
        setSigninMessage(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      setSigninMessage("Error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a la aplicación</h1>

        {/* Formulario de crear usuario */}
        <div>
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

        {/* Formulario de iniciar sesión */}
        <div>
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

        {/* Chatbot o área de chat */}
        <div className="chat-container">{/* Aquí iría el chat y otras funcionalidades */}</div>
      </header>
    </div>
  );
};

export default App;
