import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpotifyLogo from "../../assets/spotify/Icon.svg";
import SoundCloudLogo from "../../assets/soundcloud/Icon.svg";
import {spotifyLoginAuth} from "../../services/spotifyAuth";
import {soundcloudLoginAuth} from "../../services/soundcloudAuth";
import { registerUser } from "../../services/api";
import { useAuth } from "../../contexts/authContext";

const SignUpCard = (): JSX.Element => {
  interface errors {
    email?: string;
    password?: string;
    confirm?: string;
  }

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [errors, setErrors] = useState<errors>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  {
    /* 
        TODO:
            Insert Logo 
    */
  }

  const validateForm = (): boolean => {
    const newErrors: errors = {};
    const emailRegex: RegExp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,32}$/;

    if (!email) {
      newErrors.email = "An email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!password) {
      newErrors.password = "A password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-32 characters long, include at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm your password.";
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const { userInfo, userHasPassword } = await registerUser(email, password);
      login(userInfo, userHasPassword);
      navigate("/home");
    } catch (error: any) {
      if (error.error === "Email Already in Use.") {
        setErrors({
          email: "Email is already in use. If you already have an account, try logging in another way. in use.",
        });
      } else {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center text-textPrimary">
      <div className="font-bold text-xl md:text-2xl text-center my-5">Sign Up</div>
      <div className="bg-secondary text-textSecondary flex flex-col p-6 sm:px-8 w-11/12 sm:w-3/4 md:w-2/4 lg:w-2/6 shadow-md rounded gap-5">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm ">
                Email Address
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                id="email-input"
                autoComplete="off"
                className="border border-gray-300 rounded p-1 focus:outline-primary"></input>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                id="password-input"
                autoComplete="new-password"
                className="border border-gray-300 rounded p-1"></input>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="Confirm-password" className="text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
                id="confirm-password-input"
                autoComplete="new-password"
                className="border border-gray-300 rounded p-1"></input>
              {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="border rounded bg-primary text-textPrimary hover:bg-gray-600 w-full py-2 text-sm">
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <div className="flex gap-3 justify-center items-center">
          <hr className="w-1/5"></hr>
          <div className="text-sm">Or Continue with</div>
          <hr className="w-1/5"></hr>
        </div>
        <div className="flex justify-center items-center w-full gap-5">
          <button
            onClick={spotifyLoginAuth}
            className="flex justify-center items-center border py-2 w-2/5 shadow gap-2 hover:bg-gray-100">
            <img src={SpotifyLogo} alt="Spotify Logo" className="w-6 h-6" />
            <span className="text-sm">Spotify</span>
          </button>
          <button
            onClick={soundcloudLoginAuth}
            className="flex justify-center items-center border py-2 w-2/5 shadow gap-2 hover:bg-gray-100">
            <img src={SoundCloudLogo} alt="SoundCloud Logo" className="w-6 h-6" />
            <span className="text-sm">SoundCloud</span>
          </button>
        </div>
      </div>
      <span className=" text-sm text-center mt-2">
        Already have an Account?{" "}
        <Link to="/sign-in" className="underline text-blue-400">
          Sign in Here!
        </Link>
      </span>
    </div>
  );
};

export default SignUpCard;
