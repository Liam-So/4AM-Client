import React from "react";
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent } from "@material-ui/core";
import useStyles from "./styles";

function RegisterItem({ product }) {
  const classes = useStyles();

  return (
    <Link to={`/checkout/${product._id}`} style={{ textDecoration: "none" }}>
      <Card className={classes.root}>
        <CardMedia title={product.name}>
          <img className={classes.image} src={product.img} alt={product.name} />
        </CardMedia>
        <CardContent>
          <div className={classes.cardContent}>
            <p className="text-xl text-gray-900 font-bold">{product.name}</p>
            <p className="font-bold text-xl">${product.price}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="pt-3 text-m text-gray-500">{product.description}</p>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded whitespace-nowrap ml-2"
            >
              Register Now
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default RegisterItem;
