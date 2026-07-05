import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-10 rounded-xl p-10">
      <div className="space-y-5">

        <h1 className="text-3xl font-bold text-pink-500">
          Women Safety & Alert System
        </h1>

        <p className="text-lg max-w-3xl">
          A smart women safety application developed to provide
          emergency support using SOS alerts, location sharing,
          and emergency contact management.
        </p>

        <div className="border-t border-gray-700 pt-5 mt-5">
          <p className="text-center text-gray-300">
            Developed by Nagma Nayak | Final Year Project
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;