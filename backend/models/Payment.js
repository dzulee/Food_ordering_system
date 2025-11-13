import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["mpesa", "paypal", "cod"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    mpesaReceipt: { type: String },
    paypalTransactionId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
