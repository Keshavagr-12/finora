export const validateRegistration = (formData) => {

    const errors = {};

    const { name, email, password, confirmPassword } = formData;

    if (name.trim().length < 2) {
        errors.name = "Name must contain at least 2 characters";
    } else if (name.trim().length > 100) {
        errors.name = "Name cannot exceed 100 characters";
    }

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.email = "Enter a valid email address";
    } else if (email.trim().length > 254) {
        errors.email = "Email is too long";
    }

    if (password.length < 8) {
        errors.password = "Password must contain at least 8 characters";
    } else if (new TextEncoder().encode(password).length > 72) {
        errors.password = "Password cannot exceed 72 bytes";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;

};