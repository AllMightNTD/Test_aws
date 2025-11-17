import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });
      if (error) {
        setResult("❌ Error: " + error.message);
      } else {
        setResult("✅ Payment method saved successfully!");
      }
    } catch (err) {
      setResult("❌ Exception: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "20px auto" }}>
      <h2>Save Payment Method</h2>
      <div style={{ marginBottom: "20px" }}>
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        style={{
          padding: "10px 20px",
          background: "#6772e5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Save Card
      </button>
      <pre style={{ marginTop: "20px", fontSize: "14px" }}>{result}</pre>
    </form>
  );
};
