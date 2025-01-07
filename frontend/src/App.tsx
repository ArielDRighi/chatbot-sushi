import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChat([...chat, { sender: "user", text: message }]);
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
        setChat([
          ...chat,
          { sender: "user", text: message },
          { sender: "bot", text: "A continuación te presento el menú:" },
        ]);
      } else {
        setChat([...chat, { sender: "user", text: message }, { sender: "bot", text: data.response }]);
        setMenuItems([]); // Limpiar el menú si no hay elementos del menú
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setChat([...chat, { sender: "user", text: message }, { sender: "bot", text: "Error: Failed to fetch" }]);
      setMenuItems([]);
    }
    setMessage(""); // Limpiar el cuadro de texto
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatbot Sushi</h1>
        <div className="chat-container">
          <div className="chat-box">
            {chat.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje"
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
