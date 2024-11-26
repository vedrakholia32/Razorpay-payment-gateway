/* eslint-disable no-unused-vars */
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProductCard() {
  const [amount, setAmount] = useState(350); // Default amount

  // handlePayment Function
  const handlePayment = async () => {
    const payload = { amount };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response Error:", errorText);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      handlePaymentVerify(data.data);
    } catch (error) {
      console.error("Payment request error:", error);
    }
  };

  // handlePaymentVerify Function
  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Devknus",
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Card className="mt-6 w-96 bg-[#222f3e] text-white">
      {/* CardHeader */}
      <CardHeader color="" className="relative h-96 bg-[#2C3A47]">
        {/* Image  */}
        <img
          src="https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp"
          alt="card-image"
        />
      </CardHeader>

      {/* CardBody */}
      <CardBody>
        {/* Typography For Title */}
        <Typography variant="h5" className="mb-2">
          My First Product
        </Typography>

        {/* Typography For Price */}
        <Typography>
          ₹{amount} <span className="line-through">₹699</span>
        </Typography>
      </CardBody>

      {/* CardFooter */}
      <CardFooter className="pt-0">
        {/* Buy Now Button */}
        <Button
          onClick={handlePayment}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-[#1B9CFC]"
        >
          Buy Now
        </Button>
        <Toaster />
      </CardFooter>
    </Card>
  );
}
