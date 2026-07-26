import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "../../../axios";
import Topbar from "../../Topbar/Topbar";
import Logo from "../../../images/logo.png";
import RegistrationForm from "./RegistrationForm";
import Waiver, { todayFormatted } from "./Waiver";
import { checkStockForItem, updateStock } from "../Cart/CartServices";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Checkout() {
  const { id } = useParams();

  // 'loading' | 'loaded' | 'error' | 'soldout'
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  // 'form' | 'waiver' | 'payment'
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({});
  const [waiverData, setWaiverData] = useState({ waiverDate: todayFormatted() });
  const [paymentError, setPaymentError] = useState(false);

  // Free/sponsored-athlete bypass. Both the name list and the special
  // code are checked server-side only (see /check-bypass) -- neither
  // ever ships in this frontend bundle.
  // 'checking' | 'eligible' | 'not-eligible'
  const [bypassStatus, setBypassStatus] = useState("checking");
  const [bypassReason, setBypassReason] = useState(null); // 'name' | 'code'
  const [specialCode, setSpecialCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

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

  // As soon as the visitor reaches the payment step, quietly check
  // whether their entered name is on this year's free/sponsored list.
  useEffect(() => {
    if (step !== "payment") return;

    let cancelled = false;
    setBypassStatus("checking");

    axios
      .post("/check-bypass", { athleteName: formData.athleteName })
      .then((res) => {
        if (cancelled) return;
        if (res.data.bypass) {
          setBypassStatus("eligible");
          setBypassReason("name");
        } else {
          setBypassStatus("not-eligible");
        }
      })
      .catch(() => {
        if (!cancelled) setBypassStatus("not-eligible");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWaiverChange = (field, value) => {
    setWaiverData((prev) => ({ ...prev, [field]: value }));
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

  // Saves the registration form + waiver data (Mongo + Google Sheets on
  // the backend) and sends the visitor to the confirmation page. Used by
  // both the real-payment path and the bypass path, so every registration
  // ends up recorded the same way regardless of how it was completed.
  const saveRegistrationAndFinish = async (paymentMethod, transactionId) => {
    try {
      await axios.post("/registration-form", {
        campId: product._id,
        campType,
        campName: product.name,
        transactionId,
        ...formData,
        ...waiverData,
        paymentMethod,
      });
    } catch (err) {
      console.error("Registration form save failed:", err);
    }

    window.location.href = "/success";
  };

  const applySpecialCode = async () => {
    setCodeError(null);
    try {
      const res = await axios.post("/check-bypass", { code: specialCode });
      if (res.data.bypass) {
        setBypassStatus("eligible");
        setBypassReason("code");
      } else {
        setCodeError("That code isn't valid.");
      }
    } catch (err) {
      setCodeError("Couldn't verify that code right now. Please try again.");
    }
  };

  const completeFreeRegistration = async () => {
    setIsFinalizing(true);

    // A free/sponsored spot still takes up a real spot at camp, so stock
    // still needs to be decremented exactly like a paid registration.
    await updateStock([basketItem]);

    const paymentMethod =
      bypassReason === "code" ? "Free - Special Code" : "Free - Name Match";
    const freeTransactionId = `FREE-${Date.now()}`;

    await axios.post("/transactions", {
      id: freeTransactionId,
      amount: 0,
      items: [basketItem],
    });

    await saveRegistrationAndFinish(paymentMethod, freeTransactionId);
  };

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

    await saveRegistrationAndFinish("Paid", data.orderID);
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

  const StepIndicator = () => (
    <div className="flex justify-center items-center gap-3 mt-6 text-sm font-medium">
      <span className={step === "form" ? "text-brand" : "text-gray-400"}>
        Step 1: Registration Form
      </span>
      <span className="text-gray-300">&rarr;</span>
      <span className={step === "waiver" ? "text-brand" : "text-gray-400"}>
        Step 2: Waiver
      </span>
      <span className="text-gray-300">&rarr;</span>
      <span className={step === "payment" ? "text-brand" : "text-gray-400"}>
        Step 3: Payment
      </span>
    </div>
  );

  const renderPaymentStep = () => {
    if (bypassStatus === "checking" || isFinalizing) {
      return (
        <div className="bg-white shadow-lg rounded p-6 md:p-8 text-center text-gray-500">
          {isFinalizing ? "Completing registration..." : "Checking registration details..."}
        </div>
      );
    }

    if (bypassStatus === "eligible") {
      return (
        <div className="bg-white shadow-lg rounded p-6 md:p-8 text-center">
          <p className="text-gray-700 mb-6">
            This athlete has a free/sponsored spot for this camp -- no payment is required.
          </p>
          <button
            onClick={completeFreeRegistration}
            className="bg-brand hover:bg-brand-dark text-white font-medium py-3 px-8 rounded"
          >
            Complete Registration
          </button>
          <div className="text-center mt-6">
            <button
              onClick={() => setStep("waiver")}
              className="text-gray-500 underline text-sm"
            >
              Back to Waiver
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded p-6 md:p-8">
        {paymentError && (
          <p className="text-red-500 text-center mb-4">
            Sorry, this camp just sold out while you were checking out. Payment was not processed.
          </p>
        )}
        <p className="text-gray-600 text-center mb-6">
          Total due: <span className="font-semibold">${product.price} CAD</span>
        </p>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block text-gray-900 font-medium text-sm mb-2">
            Special Code
          </label>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              className="flex-1 border-b-2 border-gray-200 focus:border-brand outline-none py-2 px-1 text-gray-800 bg-transparent"
              value={specialCode}
              onChange={(e) => setSpecialCode(e.target.value)}
            />
            <button
              type="button"
              onClick={applySpecialCode}
              className="bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2 px-4 rounded"
            >
              Apply
            </button>
          </div>
          {codeError && <p className="text-red-500 text-sm mt-2">{codeError}</p>}
        </div>

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
            onClick={() => setStep("waiver")}
            className="text-gray-500 underline text-sm"
          >
            Back to Waiver
          </button>
        </div>
      </div>
    );
  };

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
          <Link to="/register" className="text-brand underline">
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

          <StepIndicator />
        </div>

        {step === "form" && (
          <RegistrationForm
            formData={formData}
            onChange={handleFieldChange}
            tshirtSubtext={tshirtSubtext}
            onSubmit={() => setStep("waiver")}
          />
        )}

        {step === "waiver" && (
          <Waiver
            waiverData={waiverData}
            onChange={handleWaiverChange}
            onBack={() => setStep("form")}
            onNext={() => setStep("payment")}
          />
        )}

        {step === "payment" && renderPaymentStep()}
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
