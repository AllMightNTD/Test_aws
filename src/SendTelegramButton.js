import React, { useState } from "react";
import axios from "axios";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "./telegramConfig";

const SendTelegramButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setStatus("");

    const message = "📩 Gửi trực tiếp từ ReactJS đến Telegram!";

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const res = await axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      });

      if (res.data.ok) {
        setStatus("✅ Gửi thành công!");
      } else {
        setStatus("⚠️ Gửi thất bại.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Lỗi khi gửi tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#aaa" : "#2b7bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang gửi..." : "Gửi Telegram"}
      </button>

      {status && <p style={{ marginTop: "15px" }}>{status}</p>}
    </div>
  );
};

export default SendTelegramButton;
