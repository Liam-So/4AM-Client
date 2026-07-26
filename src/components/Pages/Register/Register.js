import React, { useState, useEffect, useCallback } from "react";
import RegisterItem from "./RegisterItem/RegisterItem";
import axios from "../../../axios";
import Topbar from "../../Topbar/Topbar";
import Logo from "../../../images/logo.png";
import { motion } from 'framer-motion';

// Simple delay helper for retrying against a backend that may still be
// waking up from an idle spin-down (e.g. Render free tier).
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Register() {
  const [products, setProducts] = useState([]);
  // 'loading' | 'loaded' | 'error'
  const [status, setStatus] = useState('loading');

  const fetchData = useCallback(async () => {
    setStatus('loading');

    const maxAttempts = 4;
    // Backend can be cold-starting (Render free tier spins down after
    // inactivity and can take 30-60s to wake), so retry a few times
    // with backoff instead of giving up on the first failure.
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const req = await axios.get("/registration", { timeout: 20000 });
        setProducts(req.data);
        setStatus('loaded');
        return;
      } catch (err) {
        if (attempt === maxAttempts) {
          setStatus('error');
          return;
        }
        // 2s, 4s, 8s backoff — gives a cold Render instance time to wake up
        await wait(2000 * attempt);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const availableProducts = products.filter(product => product.sku > 0);

  const LoadingCamp = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="gradient text-gray-600 min-h-screen flex items-center">
      <div className="container mx-auto p-4 flex flex-wrap items-center justify-center text-center">
        <div className="w-full p-4">
          <img src={Logo} alt="logo" className="mx-auto mb-6" style={{ maxWidth: '160px' }} />
          <div className="text-2xl md:text-3xl font-medium mb-2">Checking registration status...</div>
          <div className="text-lg text-gray-500">This can take a few seconds. Thanks for your patience!</div>
        </div>
      </div>
    </motion.div>
  );

  const ErrorCamp = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="gradient text-gray-600 min-h-screen flex items-center">
      <div className="container mx-auto p-4 flex flex-wrap items-center justify-center text-center">
        <div className="w-full p-4">
          <img src={Logo} alt="logo" className="mx-auto mb-6" style={{ maxWidth: '160px' }} />
          <div className="text-2xl md:text-3xl font-medium mb-4">We're having trouble loading registration.</div>
          <div className="text-lg mb-6 text-gray-500">
            This is usually temporary. Please try again in a moment.
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    </motion.div>
  );

  const EmptyCamp = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="gradient text-gray-600 min-h-screen flex items-center">
      <div className="container mx-auto p-4 flex flex-wrap items-center">
        <div className="w-full md:w-3/12 text-center p-4">
          <img src={Logo} alt="logo" />
        </div>
        <div className="w-full md:w-7/12 text-center md:text-left p-4">
          <div className="text-6xl font-medium">Sorry...</div>
          <div className="text-xl md:text-3xl font-medium mb-4">
            Registration is currently not available.
          </div>
          <div className="text-lg mb-8">
            Stay tuned to our social media accounts for registration announcements. Thank you for your interest.
          </div>
        </div>
      </div>
    </motion.div>
  );

  const RegisterCamp = () => (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-sans bg-white">
      <div>
        <section className="bg-white mt-20 mb-20">
          <div className="max-w-2xl px-6 text-center mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800">Registration now open!</h2>
            <p className="text-gray-600 mt-4">The 2026 4AM Camp will be held September 5-6 at Citadel High School.<br/>
            Athletes must be going into grades 10-12 this September. <br/>
            <br/>
            The girls group will go from 8:30-10:30am & 2-3:30pm each day and the boys group will go from 11am-1pm & 4-5:30pm each day.<br/>
            <br/>
            The cost of the camp is $120.<br/>
            <br/>
            All proceeds from the camp go towards the 4AM Award.</p>
          </div>
        </section>

        <section className="pattern pb-56">
          <div className="flex flex-col pb-16 md:px-12 lg:flex-row lg:px-60 xl:px-96">
            {availableProducts.map((product) => (
              <div key={product._id} className="flex container mx-auto max-w-sm w-full p-4 sm:w-1/2">
                <RegisterItem product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );

  const renderContent = () => {
    if (status === 'loading') return <LoadingCamp />;
    if (status === 'error') return <ErrorCamp />;
    return availableProducts.length ? <RegisterCamp /> : <EmptyCamp />;
  };

  return (
    <div>
      <Topbar transparent={true} />
      {renderContent()}
    </div>
  );
}

export default Register;
