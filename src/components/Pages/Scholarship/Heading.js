import React from "react";

function Heading() {
  return (
    <main className="font-sans bg-white">
      <div>
          <section className="bg-white mt-20">
              <div className="max-w-3xl px-6 text-center mx-auto">
                  <h2 className="text-4xl font-semibold text-gray-800">The 4AM Award</h2>
                  <p className="text-xl text-gray-600 mt-4">
                  The goal of the 4AM Camp is to honour Andrew's legacy by <br/>
                  paying his impact forward to the next generation of basketball players. <br/>
                  <br/>
                  All of the proceeds from the camp go towards an annual award in Andrew's name. <br/>
                  <br/>
                  Given Andrew's involvement in the Basketball Nova Scotia Provincial Teams,<br/>
                  Andrew’s family decided the award should be given to a BNS athlete. <br/>
                  <br/>
                  The 4AM Award considers three aspects in the selection of the recipient: <br/>
                  financial need, burden of travel (cost and time), and character.
                  </p>

              </div>
          </section>
      </div>
    </main>
  );
}

export default Heading;
