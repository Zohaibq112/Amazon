import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';

const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [payDisable, setPayDisable] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("jazzcash"); // Default to JazzCash

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
        method: selectedPaymentMethod
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPayDisable(true);

        console.log("🛠 Sending Payment Data for JazzCash:", paymentData);

        try {
            const config = { headers: { "Content-Type": "application/json" } };

            const { data } = await axios.post(
                `/api/v1/payment/process`, // Backend API
                paymentData,
                config
            );

            console.log("✅ JazzCash Payment Response:", data);
            enqueueSnackbar("Payment successful!", { variant: "success" });

            // Redirect to Order Success Page
            window.location.href = `/order/success`;

        } catch (error) {
            setPayDisable(false);
            console.error("❌ Payment Error:", error.response?.data?.message || error);
            enqueueSnackbar(error.response?.data?.message || "Payment failed!", { variant: "error" });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Secure Payment | JazzCash" />

            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
                    
                    <div className="flex-1">
                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">
                                <form onSubmit={submitHandler} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    
                                    {/* Payment Methods */}
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="jazzcash"
                                            name="payment-radio-button"
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        >
                                            {/* JazzCash */}
                                            <FormControlLabel
                                                value="jazzcash"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://upload.wikimedia.org/wikipedia/en/9/9e/JazzCash.png" alt="JazzCash Logo" />
                                                        <span>JazzCash</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <input 
                                        type="submit" 
                                        value={`Pay Rs${totalPrice.toLocaleString()}`} 
                                        disabled={payDisable} 
                                        className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                                    />

                                </form>
                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;
