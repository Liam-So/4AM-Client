import React, { useState, useEffect } from "react";
import { homeObjOne, homeObjTwo } from "./Data";
import HeroSection from "../../HeroSection/HeroSection";
import { Link } from "react-router-dom";
import Topbar from "../../Topbar/Topbar";
import { motion } from "framer-motion";
import axios from "../../../axios";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get("/registration");

      setProducts(req.data);
    }

    fetchData();
  }, []);

  const availableProducts = products.filter((product) => product.sku > 0);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="home">
        <Topbar />
        <div className="subHome text-3xl md:text-5xl">
          4AM Basketball Camp
          <Link
            to={availableProducts.length ? "/register" : "/donate"}
            style={{ color: "#000", textDecoration: "none" }}
            className="my-4 py-3 px-5 bg-yellow-300 rounded-full text-sm hover:bg-yellow-200 transition duration-300 ease-in-out flex items-center animate-bounce"
          >
            {availableProducts.length ? "REGISTER NOW" : "DONATE NOW"}
          </Link>
        </div>
      </div>
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjTwo} />
    </motion.section>
  );
}

export default Home;
