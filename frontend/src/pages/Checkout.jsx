import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";
import { clearCart } from "../redux/cartSlice";
import "../Styles/checkout.css";

const Checkout = () => {
  // Authentication
  const { user } = useContext(AuthContext);

  // Redux cart
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  // Navigation
  const navigate = useNavigate();

  // Component state
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [error, setError] = useState("");

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity ?? item.qty ?? 1),
    0
  );

  // Handle address input changes
  const updateField = (event) => {
    const { name, value } = event.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Currency formatter
  const currency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Fallback payment for development/testing
  const bypassPayment = async () => {
    try {
      await saveOrder("TEST_BYPASS");
    } catch (err) {
      setError(err.message || "Failed to place test order.");
    }
  };

  // Save order to backend
  const saveOrder = async (paymentId) => {
    const saveOrderRes = await fetch("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item._id ?? item.id ?? item.productId,
          quantity: Number(item.quantity ?? item.qty ?? 1),
          price: Number(item.price),
        })),
        totalAmount: totalPrice,
        address,
        paymentId,
      }),
    });

    const saveOrderData = await saveOrderRes.json().catch(() => ({}));

    if (!saveOrderRes.ok) {
      throw new Error(saveOrderData.message || "Order saving failed.");
    }

    dispatch(clearCart());
    navigate("/order-success");
  };

  // Initialize payment
  const handlePayNow = async (event) => {
    event.preventDefault();
    setError("");

    if (!user?.token) {
      setError("Please log in before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      // Create Razorpay order on backend
      const orderRes = await fetch("/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100),
        }),
      });

      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        const fallback = window.confirm(
          "Payment initialization failed. For local development only, do you want to place a test order without payment?"
        );

        if (fallback) {
          await bypassPayment();
        } else {
          setError(orderData.message || "Payment failed to initialize.");
        }

        return;
      }

      // Ensure Razorpay Checkout is loaded
      if (!window.Razorpay) {
        setError(
          "Razorpay Checkout is not loaded. Please include the Razorpay script."
        );
        return;
      }

      const razorpayKey = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        setError("Razorpay is missing its public key. Set RAZORPAY_KEY_ID on the backend.");
        return;
      }

      // Razorpay configuration
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Campus Cart",
        description: "Campus Cart Order",
        order_id: orderData.id || orderData.orderId,

        prefill: {
          name: address.fullName,
          email: user.email || "",
        },

        theme: {
          color: "#f97316",
        },

        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await fetch("/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (!verifyRes.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            // Save the order after successful verification
            await saveOrder(response.razorpay_payment_id);
          } catch (err) {
            setError(err.message || "Something went wrong after payment.");
          }
        },

        modal: {
          ondismiss: () => {
            setError("Payment was cancelled.");
          },
        },
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setError(
          response.error?.description || "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || "Unable to process your order.");
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-heading">
        <p className="checkout-eyebrow">Campus Cart</p>
        <h1>Checkout</h1>
        <p>Enter your delivery address to place your order.</p>
      </header>

      {!user?.token && (
        <p className="checkout-login-note">
          Please <Link to="/login">log in</Link> before placing your order.
        </p>
      )}

      <div className="checkout-layout">
        <form
          className="checkout-card checkout-form"
          onSubmit={handlePayNow}
        >
          <h2>Delivery details</h2>

          <label>
            Full name
            <input
              name="fullName"
              autoComplete="name"
              value={address.fullName}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Street address
            <input
              name="street"
              autoComplete="street-address"
              value={address.street}
              onChange={updateField}
              required
            />
          </label>

          <div className="checkout-field-row">
            <label>
              City
              <input
                name="city"
                autoComplete="address-level2"
                value={address.city}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Postal code
              <input
                name="postalCode"
                autoComplete="postal-code"
                value={address.postalCode}
                onChange={updateField}
                required
              />
            </label>
          </div>

          <label>
            Country
            <input
              name="country"
              autoComplete="country-name"
              value={address.country}
              onChange={updateField}
              required
            />
          </label>

          {error && (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="checkout-button checkout-primary"
            type="submit"
            disabled={!user?.token || cartItems.length === 0}
          >
            Pay now
          </button>
        </form>

        <aside className="checkout-card checkout-summary">
          <h2>Order summary</h2>

          <ul className="checkout-items">
            {cartItems.map((item) => {
              const id = item._id ?? item.id ?? item.productId;
              const quantity = Number(item.quantity ?? item.qty ?? 1);

              return (
                <li key={id}>
                  <span>
                    {item.productname || "Product"}{" "}
                    <small>× {quantity}</small>
                  </span>

                  <strong>
                    {currency(Number(item.price || 0) * quantity)}
                  </strong>
                </li>
              );
            })}
          </ul>

          <p className="checkout-total">
            <span>Total</span>
            <strong>{currency(totalPrice)}</strong>
          </p>

          <p className="checkout-payment-note">
            Secure online payment powered by Razorpay.
          </p>

          <Link className="checkout-back-link" to="/cart">
            Back to cart
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
