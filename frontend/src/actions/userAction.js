import axios from 'axios';
import {
    LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL,
    LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS, LOGOUT_USER_FAIL, CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL, RESET_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL,
    USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL,
    ALL_USERS_FAIL, ALL_USERS_SUCCESS, ALL_USERS_REQUEST
} from '../constants/userConstants';

const BASE_URL = 'https://amazon3-q2oo.onrender.com/api/v1';  // Deployed Backend URL

// Login User
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`${BASE_URL}/login`, { email, password }, config);

        dispatch({ type: LOGIN_USER_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({ type: LOGIN_USER_FAIL, payload: error.response?.data?.message || "Login failed" });
    }
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const { data } = await axios.post(`${BASE_URL}/register`, userData, config);

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response?.data?.message || "Registration failed" });
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get(`${BASE_URL}/me`);

        dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({ type: LOAD_USER_FAIL, payload: error.response?.data?.message || "Failed to load user" });
    }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get(`${BASE_URL}/logout`);
        dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error) {
        dispatch({ type: LOGOUT_USER_FAIL, payload: error.response?.data?.message || "Logout failed" });
    }
};

// Update User Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const { data } = await axios.put(`${BASE_URL}/me/update`, userData, config);

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({ type: UPDATE_PROFILE_FAIL, payload: error.response?.data?.message || "Update failed" });
    }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`${BASE_URL}/password/update`, passwords, config);

        dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({ type: UPDATE_PASSWORD_FAIL, payload: error.response?.data?.message || "Password update failed" });
    }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`${BASE_URL}/password/forgot`, email, config);

        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });

    } catch (error) {
        dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response?.data?.message || "Forgot password failed" });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`${BASE_URL}/password/reset/${token}`, passwords, config);

        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({ type: RESET_PASSWORD_FAIL, payload: error.response?.data?.message || "Reset password failed" });
    }
};

// Get All Users (Admin)
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });

        const { data } = await axios.get(`${BASE_URL}/admin/users`);

        dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });

    } catch (error) {
        dispatch({ type: ALL_USERS_FAIL, payload: error.response?.data?.message || "Failed to fetch users" });
    }
};

// Get User Details (Admin)
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });

        const { data } = await axios.get(`${BASE_URL}/admin/user/${id}`);

        dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({ type: USER_DETAILS_FAIL, payload: error.response?.data?.message || "Failed to fetch user details" });
    }
};

// Update User (Admin)
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`${BASE_URL}/admin/user/${id}`, userData, config);

        dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({ type: UPDATE_USER_FAIL, payload: error.response?.data?.message || "Failed to update user" });
    }
};

// Delete User (Admin)
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });

        const { data } = await axios.delete(`${BASE_URL}/admin/user/${id}`);

        dispatch({ type: DELETE_USER_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({ type: DELETE_USER_FAIL, payload: error.response?.data?.message || "Failed to delete user" });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
