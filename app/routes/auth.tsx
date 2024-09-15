import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AuthContainer from "../components/auth/AuthContainer";

export default function AuthPage() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (token && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  }, [token, isRedirecting, navigate]);

  return <AuthContainer />;
}
