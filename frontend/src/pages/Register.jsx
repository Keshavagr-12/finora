import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";
import useAuthStore from "../store/authStore";
import { validateRegistration } from "../utils/authValidation";



const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500";


function Register() {

    const navigate = useNavigate();

    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);
    const error = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        clearError();

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (isLoading) return;

        clearError();

        const validationErrors = validateRegistration(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {

            await register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            navigate("/login", {
                replace: true,
                state: {
                    message: "Account created successfully. Please log in."
                }
            });

        } catch {

            // The Zustand store handles the API error.

        }

    };


    return (

        <AuthLayout
            title="Create your account"
            subtitle="Take control of your finances with FINORA."
        >

            {error && (

                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-400"
                >
                    {error}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
            >

                {/* Full Name */}

                <div>

                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Full Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        disabled={isLoading}
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.name}
                        </p>
                    )}

                </div>


                {/* Email */}

                <div>

                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Email Address
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        autoComplete="email"
                        disabled={isLoading}
                        className={inputClass}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.email}
                        </p>
                    )}

                </div>


                {/* Password */}

                <div>

                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Password
                    </label>

                    <div className="relative">

                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className={`${inputClass} pr-12`}
                        />

                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-slate-400"
                        >

                            {showPassword
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }

                        </button>

                    </div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password}
                        </p>
                    )}

                </div>


                {/* Confirm Password */}

                <div>

                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Confirm Password
                    </label>

                    <div className="relative">

                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className={`${inputClass} pr-12`}
                        />

                        <button
                            type="button"
                            aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-3.5 text-slate-400"
                        >

                            {showConfirmPassword
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }

                        </button>

                    </div>

                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.confirmPassword}
                        </p>
                    )}

                </div>


                {/* Submit Button */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {isLoading ? (

                        <>
                            <LoaderCircle
                                size={20}
                                className="animate-spin"
                            />

                            Creating account...
                        </>

                    ) : (

                        "Create Account"

                    )}

                </button>

            </form>


            <p className="mt-6 text-center text-sm text-slate-400">

                Already have an account?{" "}

                <Link
                    to="/login"
                    className="font-medium text-emerald-400 hover:underline"
                >
                    Log in
                </Link>

            </p>

        </AuthLayout>

    );

}

export default Register;