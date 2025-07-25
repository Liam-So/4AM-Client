import React from "react";
import Topbar from "../../Topbar/Topbar";
import { motion } from 'framer-motion';

function Donate() {

  return (
    <div className="donate">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Topbar />
      <div class="w-full h-screen flex justify-center items-center">
        <div class="mx-4 text-center text-white">
            <h1 class="font-bold text-5xl xl:text-6xl mb-4">Make a donation.</h1>
            <h2 class="font-bold text-s lg:text-xl md:px-24 lg:px-60 xl:px-96 mb-12 ">
              If you would like to donate to our cause, you can do so at the link below. Your donation will go directly towards the 4AM Award fund.<br/>
              <br/>
              This award is presented to an athlete playing for a Basketball Nova Scotia Provincial Team with financial need and who truly embodies the character of Andrew – traits like work ethic, leadership, humbleness, and gratitude.</h2>

            <div className="get-app flex space-x-5 mt-10 justify-center">
                <form action="https://www.paypal.com/donate" method="post" target="_top">
                      <input type="hidden" name="hosted_button_id" value="N7M2RLZ8WXB78" />
                      <input className="h-24" type="image" src="https://www.svgrepo.com/show/86407/donate.svg" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                      <img alt="" border="0" src="https://www.paypal.com/en_CA/i/scr/pixel.gif" width="1" />
                </form>
              </div>

        </div>
    </div>
    </motion.div>
    </div>
  );
}

export default Donate;
