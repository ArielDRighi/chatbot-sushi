import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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
        headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Error al conectar con el servidor." }]);
    } finally {
      setMessage("");
      setIsTyping(false);
    }
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
              <div key={index} className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
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
      </header>
    </div>
  );
};

export default App;
