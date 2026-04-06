import React from "react";
import { motion } from "motion/react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebse";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";

function Auth() {
  const dispatch = useDispatch();
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-6 gap-3">
          <div className="bg-black text-white p-3 rounded-xl">
            <BsRobot size={22} />
          </div>
          <h2 className="font-semibold text-xl text-gray-800">
            InterviewPilot
          </h2>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug mb-4 text-gray-900">
            Continue with
          </h1>

          <span className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium text-sm md:text-base">
            <IoSparkles size={18} />
            AI Smart Interview
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        {/* Button */}
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ opacity: 0.8, scale: 1.03 }}
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300"
        >
          <FcGoogle size={20} className="inline-block mr-2" />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;
