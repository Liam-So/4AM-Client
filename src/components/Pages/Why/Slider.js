import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const settings = {
  showArrows: false,
  interval: 5000,
  dynamicHeight: false,
  stopOnHover: true,
  infiniteLoop: true,
  showStatus: false,
  transitionTime: 500,
  showThumbs: false,
  showIndicators: true,
  swipeable: true,
  emulateTouch: true,
  autoPlay: true,
};

function Slider() {
  return (
    <Carousel {...settings}>
      <div>
        <img src="images/Andrew-Attacking-Dinos-2.jpg" alt="" />
      </div>
      <div>
        <img src="images/Andrew-Attacking-Dinos-3.jpg" alt="" />
      </div>
      <div>
        <img src="images/Andrew-Attacking-Dinos-4.jpg" alt="" />
      </div>
    </Carousel>
  );
}

export default Slider;
