import React, { useState } from "react";

const ExportReport = () => {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-08-28");
  const [type, setType] = useState("month");
  const [loading, setLoading] = useState(false);

  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNmQ0MjAyYmQ0MDdhMDRkYmZmZTAwMGIwMTEwZTYzYzE0MDIxODlmZDhiYzZhNDhhZDgxNjkxMzNiODM4ODFkNzY3ZjFlYjQwNTVkYzJjOWMiLCJpYXQiOjE3NjIxNTk5OTAuNTg2MjUyLCJuYmYiOjE3NjIxNTk5OTAuNTg2MjU1LCJleHAiOjE3NjIxNjcxOTAuMzQ2MDI4LCJzdWIiOiI5Iiwic2NvcGVzIjpbXX0.E1OL6RJkOaogNide5nmjghc_eHjfg9GNkNw_--zKJPnMJ_a2Jt3nUfFBVHp93-n0nMz_6rpoOGWJE0jrK1oWlbdJ3QwRUTKpoWxhZEhTp4z3bpVTIyMd2YLUYCGym0SvQmNnVKGNx7xZkw5eCDfKluMhUwCrLcAW2HSSokHrIw9FA1_OWSi81cvsYbQ0R6Yp6W_qD6zdl5VtGCzYyQ5j6o1wUbEgrDC4yk59BGT8bj_8Q8DfRtT9kBeVs1M5Yad_sJEqQ_4j06a1VtX1I-CT7nU2x8kzM-3vTWh8pDjlUlxyTtUSeIw9HHPXliOfv1HyagCoThF2nXPhTmC36qGShBCjQYCgmE2ZssCtLJskfvMeIMyWEDj_P46sD86CcpvartV0kkM4bAln0SigV4m0vJXXfWkMdcheZGwYvi_prJBiClKH11FAZegwjjs5xcOlw0xDhHoO7d2WLEVj3YEA8QxgTmHm8G-SGqFEyB5lai8RvhZYkxFWXSQztUP8V7rukCpPoGDxMh3h25hqZB0gQ07t1NnX1g9xlaENRj1e4jdMp-oIKRKefiHCApT-tbC9GEPV3__BdbRpCfTbuoyQNZY51qWZ7lBpE93BKgk-2sG5uIyMAyKbec5G5MffrL2_C2IHdFdcA2c_DZDy5Qrp-ci92MMIai2sS4n_3t3Ss5U"

  const handleExport = async () => {
    if (!token) {
      alert("Không tìm thấy token đăng nhập.");
      return;
    }

    try {
      setLoading(true);

      const url = `http://localhost:8080/api/admin/dashboard/export?start_date=${startDate}&end_date=${endDate}&type=${type}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      // 📁 Nhận file nhị phân (blob)
      const blob = await response.blob();

      // 🧾 Tạo link tải file
      const fileURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `dashboard_export_new_${type}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Không thể export file. Kiểm tra console để xem chi tiết lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Export Dashboard Report</h2>

      <div style={styles.field}>
        <label style={styles.label}>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
      >
        {loading ? "Đang export..." : "Export Excel"}
      </button>
    </div>
  );
};

// 🎨 CSS đơn giản
const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  field: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
  buttonDisabled: {
    background: "#aaa",
    cursor: "not-allowed",
  },
};

export default ExportReport;
