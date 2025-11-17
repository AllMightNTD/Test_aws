import {
  Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import ExportReport from "./ExcelExport";
import SendTelegramButton from "./SendTelegramButton";
import TelegramChatIdFetcher from "./TelegramChatIdFetcher";

const stripePromise = loadStripe(
  "pk_test_51LdnpfKV038b6jFFQtlZzI2dZy5dYWrz8MmVYRrQydnyB9txsyC21UWVNuKNj35oyb3VMB5hFedr1aABaqYMKklB00zxptFmUz"
);

// ⚡ clientSecret phải là của SetupIntent bạn tạo từ backend
const options = {
  clientSecret: "seti_1SOCPdKV038b6jFFc2DM78gs_secret_TKs9MNOOlnM2TDZXPuZDNAYFou7hJn6",
  appearance: {
    theme: 'night',
  },
};

export default function App() {
  return (
    <Elements stripe={stripePromise} options={options}>
      {/* <CheckoutForm />
      <ExportReport/> */}
      <TelegramChatIdFetcher/>
      <SendTelegramButton/>
    </Elements>
  );
}
