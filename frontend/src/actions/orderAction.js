import axios from "axios";
import {
    ALL_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    NEW_ORDER_FAIL,
    NEW_ORDER_REQUEST,
    NEW_ORDER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    PAYMENT_STATUS_FAIL,
    PAYMENT_STATUS_REQUEST,
    PAYMENT_STATUS_SUCCESS,
    UPDATE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
} from "../constants/orderConstants";

const BASE_URL = "https://amazon3-q2oo.onrender.com/api/v1"; // Your deployed backend

// 📌 New Order
export const newOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ORDER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        console.log("📝 Placing new order:", order); // Debugging log

        const { data } = await axios.post(`${BASE_URL}/order/new`, order, config);

        console.log("✅ Order placed successfully:", data); // Debugging log

        dispatch({
            type: NEW_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error("❌ Order creation failed:", error.response?.data?.message || error);
        dispatch({
            type: NEW_ORDER_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Get User Orders
export const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        console.log("🔍 Fetching user orders..."); // Debugging log

        const { data } = await axios.get(`${BASE_URL}/orders/me`);

        console.log("✅ User orders fetched:", data.orders); // Debugging log

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders,
        });
    } catch (error) {
        console.error("❌ Failed to fetch user orders:", error.response?.data?.message || error);
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        console.log("🔍 Fetching details for Order ID:", id); // Debugging log

        const { data } = await axios.get(`${BASE_URL}/order/${id}`);

        console.log("✅ Order details fetched:", data.order); // Debugging log

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order,
        });
    } catch (error) {
        console.error("❌ Failed to fetch order details:", error.response?.data?.message || error);
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Get Payment Status
export const getPaymentStatus = (id) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_STATUS_REQUEST });

        if (!id || id === "success") {
            console.warn("⚠️ Invalid Order ID received for payment status:", id);
            throw new Error("Invalid Order ID provided");
        }

        console.log("🔍 Fetching payment status for Order ID:", id); // Debugging log

        const { data } = await axios.get(`${BASE_URL}/payment/status/${id}`);

        console.log("✅ Payment Status Response:", data); // Debugging log

        dispatch({
            type: PAYMENT_STATUS_SUCCESS,
            payload: data.txn,
        });
    } catch (error) {
        console.error("❌ Payment Status Error:", error.response?.data?.message || error);
        dispatch({
            type: PAYMENT_STATUS_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Get All Orders (Admin)
export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        console.log("🔍 Fetching all orders (Admin)..."); // Debugging log

        const { data } = await axios.get(`${BASE_URL}/admin/orders`);

        console.log("✅ All orders fetched:", data.orders); // Debugging log

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data.orders,
        });
    } catch (error) {
        console.error("❌ Failed to fetch all orders:", error.response?.data?.message || error);
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Update Order (Admin)
export const updateOrder = (id, order) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        console.log("🔄 Updating Order ID:", id, "Data:", order); // Debugging log

        const { data } = await axios.put(`${BASE_URL}/admin/order/${id}`, order, config);

        console.log("✅ Order updated successfully:", data.success); // Debugging log

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        console.error("❌ Order update failed:", error.response?.data?.message || error);
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Delete Order (Admin)
export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        console.log("🗑️ Deleting Order ID:", id); // Debugging log

        const { data } = await axios.delete(`${BASE_URL}/admin/order/${id}`);

        console.log("✅ Order deleted successfully:", data.success); // Debugging log

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        console.error("❌ Order deletion failed:", error.response?.data?.message || error);
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response?.data?.message || "Unknown error",
        });
    }
};

// 📌 Clear All Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
