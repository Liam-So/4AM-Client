import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "../../../axios";
import Topbar from "../../Topbar/Topbar";
import Logo from "../../../images/logo.png";
import RegistrationForm from "./RegistrationForm";
import { checkStockForItem, updateStock } from "../Cart/CartServices";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Checkout() {
  const { id } = useParams();

  // 'loading' | 'loaded' | 'error' | 'soldout'
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  // 'form' | 'payment'
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({});
  const [paymentError, setPaymentError] = useState(false);

  const isProd = true;
  const initialOptions = {
    "client-id": isProd
      ? process.env.REACT_APP_PAYPAL_PROD
      : process.env.REACT_APP_PAYPAL_SANDBOX,
    currency: "CAD",
  };

  const fetchProduct = useCallback(async () => {
    setStatus("loading");

    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const req = await axios.get(`/registration/${id}`, { timeout: 20000 });

        if (!req.data || !req.data._id) {
          setStatus("error");
          return;
        }

        setProduct(req.data);
        setStatus(req.data.sku > 0 ? "loaded" : "soldout");
        return;
      } catch (err) {
        if (attempt === maxAttempts) {
          setStatus("error");
          return;
        }
        await wait(2000 * attempt);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isGirlsCamp = (product?.name || "").toLowerCase().includes("girl");
  const campType = isGirlsCamp ? "Girls" : "Boys";
  const tshirtSubtext = isGirlsCamp ? "Women's Sizes" : "Men's Sizes";

  const basketItem = product
    ? {
        _id: product._id,
        id: product.id,
        type: "RGT",
        title: product.name,
        price: product.price,
        quantity: 1,
      }
    : null;

  const createOrder = async (data, actions) => {
    setPaymentError(false);

    // Re-check stock right before payment -- someone else may have taken
    // the last spot while this visitor was filling out the form.
    const fresh = await axios.get(`/registration/${id}`);
    const inStock = checkStockForItem(fresh.data, basketItem);

    if (!inStock) {
      setPaymentError(true);
      setStatus("soldout");
      return;
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "CAD",
            value: product.price,
            breakdown: { item_total: { currency_code: "CAD", value: product.price } },
          },
          items: [
            {
              name: product.name,
              quantity: "1",
              unit_amount: { currency_code: "CAD", value: product.price },
            },
          ],
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    await actions.order.capture();

    await updateStock([basketItem]);

    await axios.post("/transactions", {
      id: data.orderID,
      amount: product.price,
      items: [basketItem],
    });

    // Save the registration form -- Mongo is saved first on the backend,
    // then mirrored to the correct Google Sheet, so this data is never
    // lost even if a payment succeeds and this call has a hiccup.
    try {
      await axios.post("/registration-form", {
        campId: product._id,
        campType,
        campName: product.name,
        transactionId: data.orderID,
        ...formData,
      });
    } catch (err) {
      console.error("Registration form save failed:", err);
    }

    window.location.href = "/success";
  };

  const onError = (err) => {
    console.error(err);
    window.location.href = "/paymentFailed";
  };

  const CenteredMessage = ({ title, subtitle, children }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gradient text-gray-600 min-h-screen flex items-center"
    >
      <div className="container mx-auto p-4 flex flex-wrap items-center justify-center text-center">
        <div className="w-full p-4">
          <img src={Logo} alt="logo" className="mx-auto mb-6" style={{ maxWidth: "160px" }} />
          <div className="text-2xl md:text-3xl font-medium mb-2">{title}</div>
          {subtitle && <div className="text-lg text-gray-500 mb-6">{subtitle}</div>}
          {children}
        </div>
      </div>
    </motion.div>
  );

  const renderBody = () => {
    if (status === "loading") {
      return (
        <CenteredMessage
          title="Loading registration..."
          subtitle="This can take a few seconds. Thanks for your patience!"
        />
      );
    }

    if (status === "error") {
      return (
        <CenteredMessage
          title="We're having trouble loading this page."
          subtitle="Please try again in a moment."
        >
          <button
            onClick={fetchProduct}
            className="bg-brand hover:bg-brand-dark text-white font-medium py-2 px-6 rounded"
          >
            Try Again
          </button>
        </CenteredMessage>
      );
    }

    if (status === "soldout") {
      return (
        <CenteredMessage
          title="Sorry, registration is full."
          subtitle="Stay tuned to our social media accounts for updates. Thank you for your interest!"
        >
          <Link to="/register" className="text-blue-600 underline">
            Back to registration
          </Link>
        </CenteredMessage>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {product.name} Registration
          </h2>
          <p className="text-gray-500 mt-2">${product.price} CAD</p>

          <div className="flex justify-center items-center gap-4 mt-6 text-sm font-medium">
            <span className={step === "form" ? "text-brand" : "text-gray-400"}>
              Step 1: Registration Form
            </span>
            <span className="text-gray-300">&rarr;</span>
            <span className={step === "payment" ? "text-brand" : "text-gray-400"}>
              Step 2: Payment
            </span>
          </div>
        </div>

        {step === "form" && (
          <RegistrationForm
            formData={formData}
            onChange={handleFieldChange}
            tshirtSubtext={tshirtSubtext}
            onSubmit={() => setStep("payment")}
          />
        )}

        {step === "payment" && (
          <div className="bg-white shadow-lg rounded p-6 md:p-8">
            {paymentError && (
              <p className="text-red-500 text-center mb-4">
                Sorry, this camp just sold out while you were checking out. Payment was not processed.
              </p>
            )}
            <p className="text-gray-600 text-center mb-6">
              Total due: <span className="font-semibold">${product.price} CAD</span>
            </p>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            </PayPalScriptProvider>
            <div className="text-center mt-6">
              <button
                onClick={() => setStep("form")}
                className="text-gray-500 underline text-sm"
              >
                Back to Registration Form
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Topbar transparent={true} />
      {renderBody()}
    </div>
  );
}

export default Checkout;
