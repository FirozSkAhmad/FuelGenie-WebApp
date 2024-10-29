import React, { createContext, useReducer, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

// Reducer to handle authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP":
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

// Check for existing user data
const getInitialAuthState = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return {
    user: storedUser || null,
    isAuthenticated: !!storedUser, // Set to true if a user is found
  };
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialAuthState());

  // Signup function
  const signup = async (name, email, gender, phoneNumber, password) => {
    try {
      const response = await api.post("/user/create-user", {
        name,
        email,
        gender,
        phoneNumber,
        password,
      });
      const user = response.data.user[0];
      localStorage.setItem("user", JSON.stringify(user)); // Persist user data
      dispatch({ type: "SIGNUP", payload: user });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/user/user-login", { email, password });
      if (response.status === 200) {
        const userData = response.data.data;
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: "LOGIN", payload: userData });
        return response.status; // Return status to indicate success
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials."); // Throw user-friendly error
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  // Check for existing user data on app load (not necessary anymore)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: storedUser });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
