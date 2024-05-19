import React, { useState } from "react";
import Topbar from "../../Topbar/Topbar";
import Heading from "./Heading";
import "./Scholarship.css";
import HeroSection from "../../HeroSection/HeroSection";
import { homeObjOne } from "./Data";
import { motion } from "framer-motion";

function Scholarship() {
  const [status, setStatus] = useState("Submit");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const {
      first_name,
      last_name,
      email,
      phone,
      city,
      school,
      team,
      character,
      reference_name,
      reference_relationship,
      reference_phone,
    } = e.target.elements;

    let msg = {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      phone: phone.value,
      city: city.value,
      school: school.value,
      team: team.value,
      character: character.value,
      reference_name: reference_name.value,
      reference_relationship: reference_relationship.value,
      reference_phone: reference_phone.value,
    };

    let response = await fetch(`${process.env.REACT_APP_API}/scholarship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(msg),
    });

    setStatus("Submit");
    let result = await response.json();
    alert(result.status);

    //reset form after submit
    e.target.reset();
  };

  const isAvailable = true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Topbar transparent={true} />
      <Heading />
      <HeroSection {...homeObjOne} />

      {isAvailable === true ? (
        <section className="bg-gray-100 max-w-7x1 mx-auto py-1 sm:py-5 lg:py-6 sm:px-6 lg:px-8">
          <div className="mt-10 sm:mt-0">
            <div className="mt-5 md:mt-0 md:w-9/12 mx-auto">
              <form id="application-form" onSubmit={handleSubmit}>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      
                    <div className="col-span-6 text-center">
                        <h2 className="text-4xl font-semibold text-gray-800">4AM Award Application Form</h2>
                        <p className="mt-2 text-sm text-gray-500">
                        <br/>
                        Fill out the form below to submit an application for the 4AM Award. <br/>
                        <br/>
                        Applicants must write their answer to the application question themsleves – if we suspect the asnwer was written by a parent/guardian it will not be considered. <br/>
                        <br/>
                        Applicants must also provide the name and phone number for a reference that can speak to their character. This person can be a former coach, teacher, etc. Do not use your current BNS Coach unless they have coached you during a previous season. We will contact all references.<br/>
                        <br/>
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Hometown
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="school"
                          className="block text-sm font-medium text-gray-700"
                        >
                          School
                        </label>
                        <input
                          type="text"
                          name="school"
                          id="school"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="team"
                          className="block text-sm font-medium text-gray-700"
                        >
                          BNS Team
                        </label>
                        <select
                          id="team"
                          name="team"
                          required
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option>U15 Girls</option>
                          <option>U15 Boys</option>
                          <option>U17 Girls</option>
                          <option>U17 Boys</option>
                        </select>
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="character"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Application Question
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                                                    
                          The recipient of the 4AM Award is selected based on character. <br/>
                          <br/>
                          Write about the teammate and person you are on and off the court and who/what in your life has shaped you into that person. A reminder that character has nothing to do with basketball skills.<br/>
                          <br/>
                          Andrew embodied strong characteristics of work ethic, leadership, humbleness, and gratitude, making him a champion on and off the court. We encourage you to highlight characteristics like these in yourself and how they relate to your aspirations both on and off the court. <br/>
                          <br/>
                          In the words of Andrew, "Never forget what made you who you are."<br/>
                          <br/>
                          Your answer must be 500 words or less.
                        </p>
                        <div className="mt-5">
                          <textarea
                            id="character"
                            name="character"
                            rows="10"
                            className="txt shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md whitespace-pre-wrap"
                            placeholder="Your response here..."
                            maxLength="5000"
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="reference_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name of Reference
                        </label>
                        <input
                          type="text"
                          name="reference_name"
                          id="reference_name"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="reference_relationship"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Relationship to Athlete
                        </label>
                        <input
                          type="text"
                          name="reference_relationship"
                          id="reference_relationship"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="reference_phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reference's Phone Number
                        </label>
                        <input
                          type="text"
                          name="reference_phone"
                          id="reference_phone"
                          required
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {status}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <div></div>
      )}

      <div className="bg-white pb-4 px-4 rounded-md w-full flex justify-center">

        <div className="overflow-x-auto mt-6 w-10/12 pb-12">
          <h1 className="text-4xl text-gray-800 pb-8">Past Recipients</h1>
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="rounded-lg text-m font-medium text-gray-700 text-left" style={{ fontSize: '0.9674rem' }}>
                <th className="px-4 py-2 bg-gray-200 " style={{ backgroundColor: '#f8f8f8' }}>Recipient</th>
                <th className="px-4 py-2 " style={{ backgroundColor: '#f8f8f8' }}>Hometown</th>
                <th className="px-4 py-2 " style={{ backgroundColor: '#f8f8f8' }}>Year</th>
              </tr>
            </thead>
            <tbody className="text-m font-normal text-gray-700">
            <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Azhyawn Downey</td>
                <td className="px-4 py-4">North Preston</td>
                <td className="px-4 py-4">2023</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Sasha Dabb</td>
                <td className="px-4 py-4">Halifax</td>
                <td className="px-4 py-4">2023</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Ali Oluyole</td>
                <td className="px-4 py-4">Wolfville</td>
                <td className="px-4 py-4">2023</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Makyle Raaki</td>
                <td className="px-4 py-4">Wolfville</td>
                <td className="px-4 py-4">2022</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Owen Cashen</td>
                <td className="px-4 py-4">New Waterford</td>
                <td className="px-4 py-4">2022</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Cohen McDonald</td>
                <td className="px-4 py-4">New Waterford</td>
                <td className="px-4 py-4">2022</td>
              </tr>
              <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">Coby Tunnicliff</td>
                <td className="px-4 py-4">Riverview</td>
                <td className="px-4 py-4">2020</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Scholarship;
