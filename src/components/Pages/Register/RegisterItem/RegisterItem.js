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
          <p className="pt-3 text-m text-gray-500 text-center">{product.description}</p>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2 px-6 rounded"
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
