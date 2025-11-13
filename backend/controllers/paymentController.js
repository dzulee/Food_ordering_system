import axios from "axios";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
const getMpesaToken = async () => {
  try {
    console.log("🔍 Checking M-Pesa ENV:", {
      key: process.env.MPESA_CONSUMER_KEY,
      secret: process.env.MPESA_CONSUMER_SECRET ? "✅ Loaded" : "❌ Missing",
    });

    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY,
          password: process.env.MPESA_CONSUMER_SECRET,
        },
      }
    );

    console.log("TOKEN RESPONSE:", data);
    return data.access_token;

  } catch (error) {
    console.error("Failed to fetch M-Pesa token:", error.response?.data || error.message);
    throw new Error("Failed to get M-Pesa token");
  }
};


export const mpesaPay = asyncHandler(async (req, res) => {
  const { orderId, phone } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  const token = await getMpesaToken();

  // Generate timestamp properly (14 digits)
  const pad = (n) => n.toString().padStart(2, "0");
  const shortcode = "174379";
  const passkey = "bfb279f9aa9bdbcf15e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  try {
    // Send STK Push request
    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: order.totalAmount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "FOOD_ORDER",
        TransactionDesc: "Food Payment",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("M-Pesa STK Response:", data);

    // Save payment info in DB
    const payment = await Payment.create({
      order: order._id,
      user: order.customer,
      paymentMethod: "mpesa",
      amount: order.totalAmount,
    });

    res.json({ message: "STK Push Sent Successfully", paymentId: payment._id });
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "STK Push failed",
      error: error.response?.data || error.message,
    });
  }
});
export const paypalPay = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  try {
    // 1️⃣ Get access token
    const tokenResponse = await axios({
      url: `${process.env.PAYPAL_API}/v1/oauth2/token`,
      method: "post",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
      params: { grant_type: "client_credentials" },
    });

    const accessToken = tokenResponse.data.access_token;

    // 2️⃣ Create order in PayPal
    const orderResponse = await axios.post(
  `${process.env.PAYPAL_API}/v2/checkout/orders`,
  {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: order.totalAmount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name: "Food Ordering App",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: "http://localhost:5173/payment-success",  // ✅ adjust for your frontend
      cancel_url: "http://localhost:5173/payment-cancel",    // ✅ adjust too
    },
  },

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paypalOrderId = orderResponse.data.id;

    // 3️⃣ Save payment locally
    const payment = await Payment.create({
      order: order._id,
      user: order.customer,
      paymentMethod: "paypal",
      amount: order.totalAmount,
      transactionId: paypalOrderId,
    });

    res.json({
      approvalUrl: orderResponse.data.links.find((l) => l.rel === "approve").href,
      paymentId: payment._id,
      message: "PayPal order created successfully",
    });
  } catch (error) {
    console.error("🔴 PayPal Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "PayPal payment failed",
      error: error.response?.data || error.message,
    });
  }
});
export const paypalCapture = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;

  const tokenResponse = await axios({
    url: `${process.env.PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET,
    },
    params: { grant_type: "client_credentials" },
  });

  const accessToken = tokenResponse.data.access_token;

  const capture = await axios.post(
    `${process.env.PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  res.json(capture.data);
});

export const mpesaMockCallback = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  console.log("Mock M-Pesa Callback triggered for order:", orderId);

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // Simulate M-Pesa payment confirmation
  const payment = await Payment.create({
    order: order._id,
    user: order.customer,
    paymentMethod: "mpesa",
    amount: order.totalAmount,
    status: "success", // you can track this in your schema
    transactionId: `TEST${Date.now()}`,
  });

  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  console.log("Mock payment recorded:", payment._id);

  res.json({
    message: "Mock M-Pesa payment successful",
    paymentId: payment._id,
    transactionId: payment.transactionId,
  });
});


