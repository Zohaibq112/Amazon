const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Address is required"]
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        state: {
            type: String,
            required: [true, "State is required"]
        },
        country: {
            type: String,
            required: [true, "Country is required"]
        },
        pincode: {
            type: Number,
            required: [true, "Pincode is required"],
            min: [10000, "Invalid pincode"]
        },
        phoneNo: {
            type: String,
            required: [true, "Phone number is required"],
            validate: {
                validator: function (v) {
                    return /^\d{7,15}$/.test(v); // Ensures only numbers between 7-15 digits
                },
                message: "Invalid phone number format"
            }
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "Product name is required"]
            },
            price: {
                type: Number,
                required: [true, "Product price is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"]
            },
            image: {
                type: String,
                required: [true, "Product image is required"]
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required"]
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    paymentInfo: {
        id: {
            type: String,
            required: [true, "Payment ID is required"]
        },
        status: {
            type: String,
            required: [true, "Payment status is required"],
            enum: ["Pending", "Paid", "Failed"] // Restricts to valid statuses
        }
    },
    paidAt: {
        type: Date,
        default: null // Allows orders without immediate payment
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        default: 0,
        min: [0, "Total price cannot be negative"]
    },
    orderStatus: {
        type: String,
        required: [true, "Order status is required"],
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    },
    deliveredAt: Date,
    shippedAt: Date
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Order", orderSchema);
