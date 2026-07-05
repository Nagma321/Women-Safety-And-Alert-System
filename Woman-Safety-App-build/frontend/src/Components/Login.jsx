import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Config } from '../../API/Config';
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import api from '../../API/CustomApi';

function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit } = useForm();

    const [errors, setErrors] = useState("");

    const navigate = useNavigate();

    const { checkAuth } = useContext(AuthContext);

    // LOGIN
    const Submit = async (data) => {

        setErrors("");

        setIsLoading(true);

        try {

            const response = await api.post(
                Config.LOGINUrl,
                {
                    email: data.email,
                    password: data.password
                }
            );

            if (response) {

                await checkAuth();

                navigate("/HomePage");
            }

        } catch (error) {

            setErrors(
                error.response?.data?.message ||
                error.message
            );

        } finally {

            setIsLoading(false);

        }
    };

    // GOOGLE LOGIN SUCCESS
    const handleGoogleSuccess = async (tokenResponse) => {

        try {

            setIsLoading(true);

            setErrors("");

            const userInfoResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization:
                            `Bearer ${tokenResponse.access_token}`
                    }
                }
            );

            const googleUser = userInfoResponse.data;

            const response = await api.post(
                Config.GoogleSignUpUrl,
                {
                    email: googleUser.email,
                    name: googleUser.name,
                    googleId: googleUser.sub,
                    picture: googleUser.picture
                }
            );

            if (response.data) {

                await checkAuth();

                navigate("/HomePage");

            }

        } catch (error) {

            setErrors(
                error.response?.data?.message ||
                "Failed to login with Google"
            );

            console.error(
                "Google login error:",
                error
            );

        } finally {

            setIsLoading(false);

        }
    };

    // GOOGLE LOGIN
    const handleGoogleLogin = useGoogleLogin({

        onSuccess: handleGoogleSuccess,

        onError: (error) => {

            console.error(
                "Google login error:",
                error
            );

            setErrors(
                "Failed to login with Google"
            );
        }
    });

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">

            <div className="w-full max-w-md">

                {/* LOGIN HEADING */}
                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-pink-500 mb-2">
                        Women Safety & Alert System
                    </h1>

                    <p className="text-gray-600">
                        Login to continue your safety dashboard
                    </p>

                </div>

                {/* LOGIN FORM */}
                <form
                    onSubmit={handleSubmit(Submit)}
                    className="bg-white rounded-lg border-2 border-dotted border-black p-6 space-y-6"
                >

                    {/* GOOGLE BUTTON */}
                    <button
                        type="button"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleGoogleLogin()}
                    >

                        <img
                            src="/google.jfif"
                            alt="Google logo"
                            className="w-5 h-5"
                        />

                        Sign in with Google

                    </button>

                    {/* OR LINE */}
                    <div className="relative flex py-3 items-center">

                        <div className="flex-grow border-t border-gray-200"></div>

                        <span className="flex-shrink mx-4 text-gray-400">
                            or
                        </span>

                        <div className="flex-grow border-t border-gray-200"></div>

                    </div>

                    {/* EMAIL */}
                    <div>

                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: true,
                                pattern: {
                                    value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        "Invalid email address"
                                }
                            })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-black transition-colors duration-300"
                            placeholder="Enter your email"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div>

                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                id="password"
                                {...register("password", {
                                    required: true,
                                    maxLength: 20
                                })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-black transition-colors duration-300"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >

                                {showPassword
                                    ? <FaEyeSlash size={20} />
                                    : <FaEye size={20} />
                                }

                            </button>

                        </div>

                        {errors && (

                            <p className="mt-1 text-sm text-red-500">
                                {errors}
                            </p>

                        )}

                    </div>

                    {/* REMEMBER ME */}
                    <div className="flex items-center justify-between">

                        <label className="flex items-center">

                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-black focus:ring-black"
                            />

                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>

                        </label>

                        <a
                            href="/forgot-password"
                            className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                        >
                            Forgot password?
                        </a>

                    </div>

                    {/* SIGN IN BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white rounded-lg py-2.5 font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {isLoading
                            ? 'Signing in...'
                            : 'Sign In'
                        }

                    </button>

                    {/* SIGNUP LINK */}
                    <div className="text-center text-sm text-gray-600">

                        Don't have an account?{" "}

                        <Link
                            to={"/register"}
                            className="font-semibold text-black hover:underline"
                        >
                            Sign up
                        </Link>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;