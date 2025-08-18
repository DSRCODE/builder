import api from "@/lib/api";
import { RazorpayOptions } from "@/types/razorpay"; // adjust path if needed
import { toast } from "sonner";

interface OpenRazorpayCheckoutArgs {
  amount: number;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  order_id?: string;
  key?: string;
}

export const openRazorpayCheckout = ({
  amount,
  name,
  description,
  email,
  phone,
  order_id,
  key,
}: OpenRazorpayCheckoutArgs) => {
  const options: RazorpayOptions = {
    key: key,
    amount: amount * 100,
    currency: "INR",
    name,
    description,
    image: "/logo192.png",
    order_id,
    handler: async function (response: any) {
      const formData = new FormData();
      formData.append("razorpay_payment_id", response.razorpay_payment_id);
      formData.append("razorpay_order_id", response.razorpay_order_id);
      formData.append("razorpay_signature", response.razorpay_signature);

      try {
        const verifyResponse: any = await api.post(
          "/package/verify-payment",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (verifyResponse.data.status === "success") {
          toast.success("Payment verified! Thank you.");
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        alert("Payment verification error. Please try again.");
        console.error(error);
      }
    },
    prefill: {
      email,
      contact: phone,
    },
    theme: {
      color: "#0d9488",
    },
  };

  if (window.Razorpay) {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } else {
    toast.warning("Razorpay SDK not loaded");
  }
};
