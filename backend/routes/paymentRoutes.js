import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { mpesaPay, mpesaMockCallback} from "../controllers/paymentController.js";
import { paypalPay,paypalCapture } from "../controllers/paymentController.js";


const router = express.Router();

router.post("/mpesa", protect, mpesaPay);
router.post("/mock-callback", mpesaMockCallback);
router.post("/paypal", paypalPay);
router.post("/paypal/capture", paypalCapture);

//M-PESA CALLBACK HANDLER
router.post("/callback", (req, res) => {
  console.log("M-PESA CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
});
export default router;

