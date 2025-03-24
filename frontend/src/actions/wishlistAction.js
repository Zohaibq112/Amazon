import axios from "axios";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../constants/wishlistConstants";

const BASE_URL = "https://amazon-6-p147.onrender.com/api/v1"; // Use your deployed backend URL

// Add To Wishlist
export const addToWishlist = (id) => async (dispatch, getState) => {
    const { data } = await axios.get(`${BASE_URL}/product/${id}`);

    dispatch({
        type: ADD_TO_WISHLIST,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            cuttedPrice: data.product.cuttedPrice,
            image: data.product.images[0].url,
            ratings: data.product.ratings,
            reviews: data.product.numOfReviews,
        },
    });

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
};

// Remove From Wishlist
export const removeFromWishlist = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_WISHLIST,
        payload: id,
    });

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
};
