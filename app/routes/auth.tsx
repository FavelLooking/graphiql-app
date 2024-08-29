import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <button
          onClick={() => handleTabChange("login")}
          style={{ fontWeight: activeTab === "login" ? "bold" : "normal" }}
        >
          Login
        </button>
        <button
          onClick={() => handleTabChange("register")}
          style={{ fontWeight: activeTab === "register" ? "bold" : "normal" }}
        >
          Registration
        </button>
      </div>
      <div>
        {activeTab === "login" && (
          <div>
            {/* Форма логина */}
            <h2>Login</h2>
            <form>
              <div>
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" name="email" required />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password" required />
              </div>
              <button type="submit">Sign In</button>
            </form>
          </div>
        )}
        {activeTab === "register" && (
          <div>
            {/* Форма регистрации */}
            <h2>Registration</h2>
            <form>
              <div>
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" name="email" required />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" name="password" required />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                />
              </div>
              <button type="submit">Sign Up</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
