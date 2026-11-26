import { useState } from "react";

import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    LoaderCircle
} from "lucide-react";

import AuthLayout from "../layouts/AuthLayout";

import useAuthStore from "../store/authStore";

import {
    validateLogin
} from "../utils/authValidation";


const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500";


function Login() {

    const navigate = useNavigate();

    const location = useLocation();

    const login = useAuthStore((state) => state.login);

    const isLoading = useAuthStore((state) => state.isLoading);

    const error = useAuthStore((state) => state.error);

    const clearError = useAuthStore((state) => state.clearError);


    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);

    const [successMessage, setSuccessMessage] = useState(
        location.state?.message || ""
    );


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

        setSuccessMessage("");

        const validationErrors = validateLogin(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {

            await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            navigate("/dashboard", {
                replace: true
            });

        } catch {

            // API errors are handled by the Zustand store.

        }

    };


    return (

        <AuthLayout
            title="Welcome back"
            subtitle="Log in to manage your finances with FINORA."
        >

            {/* Registration success message */}

            {successMessage && (

                <div
                    role="status"
                    className="mb-4 rounded-lg border border-emerald-800 bg-emerald-950/50 p-3 text-sm text-emerald-400"
                >
                    {successMessage}
                </div>

            )}


            {/* Backend error message */}

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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className={`${inputClass} pr-12`}
                        />

                        <button
                            type="button"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
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


                {/* Submit button */}

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

                            Logging in...
                        </>

                    ) : (

                        "Log In"

                    )}

                </button>

            </form>


            <p className="mt-6 text-center text-sm text-slate-400">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    onClick={clearError}
                    className="font-medium text-emerald-400 hover:underline"
                >
                    Create account
                </Link>

            </p>

        </AuthLayout>

    );

}

export default Login;