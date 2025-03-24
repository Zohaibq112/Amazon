const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const { v4: uuidv4 } = require('uuid');

// 📌 Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    try {
        let { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

        console.log("🛍 Creating Order...");
        console.log("📍 Shipping Info:", shippingInfo);
        console.log("📦 Order Items:", orderItems);
        console.log("💰 Total Price:", totalPrice);
        console.log("🆔 Payment Info:", paymentInfo);
        console.log("👤 User ID:", req.user ? req.user._id : "❌ User not authenticated!");

        // 🔴 Validate Required Fields
        if (!orderItems || !orderItems.length) {
            console.error("❌ Error: Order Items are missing!");
            return next(new ErrorHandler("Order items are required!", 400));
        }

        if (!req.user || !req.user._id) {
            console.error("❌ Error: User is not authenticated!");
            return next(new ErrorHandler("User authentication failed!", 401));
        }

        // 📌 Ensure Total Price is a Valid Number
        if (!totalPrice || typeof totalPrice !== "number" || totalPrice <= 0) {
            console.error("❌ Error: Invalid Total Price:", totalPrice);
            return next(new ErrorHandler("Invalid total price!", 400));
        }

        // 📌 Handle Missing Payment Info
        if (!paymentInfo || !paymentInfo.id) {
            console.warn("⚠️ Payment Info Missing, Generating Fake Payment...");
            paymentInfo = {
                id: "txn-" + uuidv4(),
                status: "TXN_SUCCESS",
            };
        }

        // ✅ Save Order to Database
        const order = new Order({
            shippingInfo,
            orderItems,
            paymentInfo,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
            orderStatus: "Processing",
        });

        try {
            const savedOrder = await order.save();
            console.log("✅ Order Saved in Database! Order ID:", savedOrder._id);

            // ✅ Send Email Confirmation
            await sendEmail({
                email: req.user.email,
                templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
                data: {
                    name: req.user.name,
                    shippingInfo,
                    orderItems,
                    totalPrice,
                    oid: savedOrder._id,
                },
            });

            res.status(201).json({ success: true, order: savedOrder });
        } catch (error) {
            console.error("❌ Mongoose Validation Error:", error);
            return next(new ErrorHandler("Order creation failed due to validation errors!", 500));
        }
    } catch (error) {
        console.error("❌ Order Creation Failed:", error);
        return next(new ErrorHandler("Order creation failed!", 500));
    }
});

// 📌 Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("🔍 Fetching Order ID:", req.params.id);

        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            console.warn("⚠️ Order Not Found for ID:", req.params.id);
            return next(new ErrorHandler("Order Not Found", 404));
        }

        console.log("✅ Order Found:", order._id);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("❌ Error Fetching Order:", error);
        return next(new ErrorHandler("Failed to fetch order!", 500));
    }
});

// 📌 Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("📋 Fetching Orders for User:", req.user._id);

        const orders = await Order.find({ user: req.user._id });

        if (!orders.length) {
            console.warn("⚠️ No Orders Found for User:", req.user._id);
            return next(new ErrorHandler("No Orders Found", 404));
        }

        console.log("✅ Found Orders:", orders.length);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("❌ Error Fetching Orders:", error);
        return next(new ErrorHandler("Failed to fetch orders!", 500));
    }
});

// 📌 Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("📋 Fetching All Orders...");

        const orders = await Order.find();

        if (!orders.length) {
            console.warn("⚠️ No Orders Found");
            return next(new ErrorHandler("No Orders Found", 404));
        }

        let totalAmount = 0;
        orders.forEach(order => totalAmount += order.totalPrice);

        console.log("✅ Total Orders:", orders.length, "| 💰 Total Revenue:", totalAmount);

        res.status(200).json({ success: true, orders, totalAmount });
    } catch (error) {
        console.error("❌ Error Fetching Orders:", error);
        return next(new ErrorHandler("Failed to fetch orders!", 500));
    }
});

// 📌 Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("🔄 Updating Order ID:", req.params.id, "➡ Status:", req.body.status);

        const order = await Order.findById(req.params.id);

        if (!order) {
            console.warn("⚠️ Order Not Found for ID:", req.params.id);
            return next(new ErrorHandler("Order Not Found", 404));
        }

        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("Already Delivered", 400));
        }

        if (req.body.status === "Shipped") {
            order.shippedAt = Date.now();
            order.orderItems.forEach(async (i) => await updateStock(i.product, i.quantity));
        }

        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        console.log("✅ Order Updated Successfully!");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error Updating Order:", error);
        return next(new ErrorHandler("Failed to update order!", 500));
    }
});

// 📌 Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    try {
        console.log("🗑 Deleting Order ID:", req.params.id);

        const order = await Order.findById(req.params.id);

        if (!order) {
            console.warn("⚠️ Order Not Found for ID:", req.params.id);
            return next(new ErrorHandler("Order Not Found", 404));
        }

        await order.deleteOne();

        console.log("✅ Order Deleted Successfully!");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error Deleting Order:", error);
        return next(new ErrorHandler("Failed to deletx  e order!", 500));
    }
});
