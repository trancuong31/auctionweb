import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .max(100, "Email must not exceed 100 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA]+$/,
      "Usernames must contain only letters"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must not exceed 30 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include numbers, lowercase, uppercase, special characters"
    ),
});

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const submitForm = async (formData) => {
    if (formData.password !== confirm) {
      toast.error("password does not match");
      return;
    }
    try {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Register successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Register failed!");
      }
    } catch (error) {
      console.error(error.detail);
    }
  };

  return (
    <div className="login-bg">
      <img src={logo} alt="Logo" className="login-logo" />
      <div
        className={`login-form-container transition-all duration-700 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="login-title">Register</h1>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              {...register("email")}
              type="email"
              placeholder="Email*"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-[8px] absolute left-0 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              {...register("username")}
              type="text"
              placeholder="Username*"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-[8px] absolute left-0 ml-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-[8px] absolute left-0 ml-1">
                {errors.password.message}
              </p>
            )}
            <span
              className="input-icon right"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="input-group">
            <span className="input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password*"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <span
              className="input-icon right"
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit" className="login-btn">
            Register
          </button>
          <div className="login-or">or</div>
          <div className="login-signup">
            You already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
