import { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "./validation";

interface ValidationErrors {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const useFormValidation = (
  email: string,
  password: string,
  confirmPassword?: string,
) => {
  const [errors, setErrors] = useState<ValidationErrors>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isTouched, setIsTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError =
      confirmPassword && password !== confirmPassword
        ? "Passwords do not match."
        : "";

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Form validation
    setIsFormValid(
      !emailError &&
        !passwordError &&
        (!confirmPasswordError || !confirmPassword),
    );
  }, [email, password, confirmPassword]);

  const handleBlur = (field: keyof typeof isTouched) => {
    setIsTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  return { errors, isFormValid, isTouched, handleBlur };
};
