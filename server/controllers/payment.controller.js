import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model";
import razorpay from "../services/razorpay.service";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;
    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan deta" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.user.id,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    return res.status(500).json({ message: `Failed to create order ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_Order_Id, razorpay_Payment_Id, razorpay_signature } =
      req.body;

    const body = razorpay_Order_Id + "|" + razorpay_Payment_Id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid paymentsignature" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_Order_Id,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    if (payment.status === "paid") {
      return res.status(400).json({ message: "Payment already verified" });
    } else {
      payment.razorpayPaymentId = razorpay_Payment_Id;
      payment.status = "paid";
      await payment.save();
    }

    const updateUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true },
    );

    res.json({
      success: true,
      message: "Payment verified successfully and credit added",
      creditsAdded: payment.credits,
      user: updateUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to verify payment ${error}` });
  }
};
