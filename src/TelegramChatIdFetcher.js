import React, { useState } from "react";
import { TELEGRAM_BOT_TOKEN } from "./telegramConfig";

export default function TelegramChatIdFetcher() {
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChatId = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
      const data = await response.json();

      console.log("API Response:", data);

      if (data.ok && data.result.length > 0) {
        // Lấy chat_id từ tin nhắn gần nhất
        const lastMessage = data.result[data.result.length - 1];
        const id = lastMessage.message?.chat?.id;

        if (id) {
          setChatId(id);
        } else {
          setError("Không tìm thấy chat_id trong dữ liệu.");
        }
      } else {
        setError("Không có dữ liệu hoặc bot chưa nhận tin nhắn.");
      }
    } catch (err) {
      setError("Lỗi khi gọi API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Lấy Chat ID Telegram</h2>
      {/* <input
        type="text"
        placeholder="Nhập BOT TOKEN..."
        value={botToken}
        onChange={(e) => setBotToken(e.target.value)}
        style={{ width: "400px", padding: "8px", marginBottom: "10px" }}
      />
      <br /> */}
      <button
        onClick={getChatId}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0088cc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Đang lấy..." : "Lấy Chat ID"}
      </button>

      {chatId && (
        <p style={{ marginTop: "15px", color: "green" }}>
          ✅ Chat ID của bạn là: <b>{chatId}</b>
        </p>
      )}

      {error && (
        <p style={{ marginTop: "15px", color: "red" }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
