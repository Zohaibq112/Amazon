const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Payment = require('../models/paymentModel');
const ErrorHandler = require('../utils/errorHandler');
const { v4: uuidv4 } = require('uuid');

// 📌 Process Payment (Auto-Approve)
exports.processPayment = asyncErrorHandler(async (req, res, next) => {
    try {
        const { amount, email, phoneNo } = req.body;
        const orderId = "oid" + uuidv4(); // Unique Order ID
        const txnId = uuidv4(); // Fake Transaction ID

        console.log("✅ Auto-Approving Payment...");
        console.log("💰 Amount:", amount);
        console.log("📧 Email:", email);
        console.log("📞 Phone No:", phoneNo);
        console.log("🆔 Order ID:", orderId);
        console.log("🔢 Transaction ID:", txnId);

        // 📌 Store Fake Payment in Database with ALL required fields
        const payment = new Payment({
            orderId,
            txnId,
            txnAmount: amount.toString(), // Convert to string to match schema
            resultInfo: {
                resultStatus: "TXN_SUCCESS",
                resultCode: "01", // Fake Success Code
                resultMsg: "Transaction Successful",
            },
            bankTxnId: uuidv4(), // Fake Bank Transaction ID
            txnType: "Online", // Fake Transaction Type
            gatewayName: "JazzCash", // Fake Payment Gateway
            bankName: "Fake Bank", // Fake Bank Name
            mid: "MID123456789", // Fake Merchant ID
            paymentMode: "JazzCash Wallet", // Fake Payment Mode
            refundAmt: "0.00", // No Refund
            txnDate: new Date().toISOString(), // Fake Transaction Date
        });

        await payment.save(); // Save payment in MongoDB

        console.log("✅ Payment Approved & Saved!");

        res.status(200).json({
            success: true,
            message: "Payment approved successfully!",
            orderId,
            txnId,
        });

    } catch (error) {
        console.error("❌ Payment Processing Error:", error);
        return next(new ErrorHandler("Payment processing failed!", 500));
    }
});

// 📌 Get Payment Status
exports.getPaymentStatus = asyncErrorHandler(async (req, res, next) => {
    try {
        const orderId = req.params.id.trim(); // Ensure no extra spaces

        console.log("🔍 Checking Payment Status for Order ID:", orderId);

        if (!orderId || orderId === "success") {
            console.warn("⚠️ Invalid Order ID received:", orderId);
            return next(new ErrorHandler("Invalid Order ID", 400));
        }

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            console.warn("⚠️ Payment not found for Order ID:", orderId);
            return next(new ErrorHandler("Payment Details Not Found", 404));
        }

        console.log("✅ Payment Found:", payment);

        res.status(200).json({
            success: true,
            txn: {
                id: payment.txnId,
                status: payment.resultInfo.resultStatus,
            },
        });
    } catch (error) {
        console.error("❌ Error Fetching Payment Status:", error);
        return next(new ErrorHandler("Failed to fetch payment status!", 500));
    }
});
