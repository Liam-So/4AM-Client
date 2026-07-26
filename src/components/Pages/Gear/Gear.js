import React, { useState, useEffect } from 'react' ;
import Topbar from '../../Topbar/Topbar' ; 
import GearProduct from './GearProduct/GearProduct';
import axios from "../../../axios" ;
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { getTotalItems } from "../../reducer";

function Gear() {
    const [products, setProducts] = useState([]);
    const [{ basket }] = useStateValue();

    useEffect(() => {
        async function fetchData() {
          const req = await axios.get("/gear");
    
          setProducts(req.data);
        }
    
        fetchData();
      }, []);

    const mapGlobalId = (arr) => {
        let globals = {} ; 

        arr.forEach(element => {
            if (!(element.globalId in globals)) {
                globals[element.globalId] = {
                    id: element.globalId,
                    title: element.name,
                    img: element.img,
                    name: element.name,
                    price: element.price
                } ; 
            }
        });

        return (Object.values(globals).map((product) => (
            <GearProduct key={product.id} product={products} />
        )))
    }

    return (
    <>
        <div className="gear">
            <Topbar />
            <div className="subGear">
                Gear
            </div>
        </div> 

        <div className="flex justify-end container mx-auto px-4 md:px-12 mt-6">
            <Link
                to="/cart"
                className="bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2 px-4 rounded"
            >
                View Cart ({getTotalItems(Object.values(basket))})
            </Link>
        </div>

        <div className="flex container my-12 mx-auto px-4 md:px-12">
            <div className="flex flex-wrap">
                    {mapGlobalId(products)}
            </div>
        </div>
    </>
    )
}

export default Gear
