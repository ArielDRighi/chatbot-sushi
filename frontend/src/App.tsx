// filepath: /D:/Personal/Chatbot-sushi/chatbot-sushi/frontend/src/App.tsx
import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuItems([]); // Limpiar el estado del menú antes de realizar la solicitud
    try {
      const res = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();

      // Si la respuesta contiene elementos del menú, actualiza el estado del menú
      if (data.menuItems) {
        setMenuItems(data.menuItems);
        setResponse(""); // Limpiar la respuesta general si hay elementos del menú
      } else {
        setResponse(data.response);
        setMenuItems([]); // Limpiar el menú si no hay elementos del menú
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setResponse("Error: Failed to fetch");
      setMenuItems([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatbot Sushi</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje"
          />
          <button type="submit">Enviar</button>
        </form>
        {response && <p>Respuesta: {response}</p>}
        {menuItems.length > 0 && (
          <div className="menu-container">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Precio: ${item.price}</p>
                <p>{item.available ? "Disponible" : "No disponible"}</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
