import React from "react";

const HeroSection = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-6">

      {/* Main Heading */}
      <h1 className="text-[60px] md:text-[90px] font-bold text-center text-red-400 leading-tight">
        Women Safety & <br /> Emergency Alert System
      </h1>

      {/* Small Description */}
      <p className="text-center text-gray-700 text-lg mt-6 max-w-3xl">
        A smart women safety application developed to provide emergency
        support using SOS alerts, live location tracking and emergency
        contact management.
      </p>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold text-pink-500 text-center mb-8">
          Women Safety Features
        </h2>

        <div className="space-y-5 text-2xl font-medium">
          <p>✔ SOS Emergency Alert</p>
          <p>✔ Real-Time Location Sharing</p>
          <p>✔ Emergency Contact Management</p>
          <p>✔ Secure User Authentication</p>
          <p>✔ Fast Emergency Assistance</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;