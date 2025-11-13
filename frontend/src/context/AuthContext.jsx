import { createContext, useContext, useReducer, useEffect } from "react";
import { useCart } from "./CartContext"; // 👈 Add this import

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const { clearCart } = useCart(); // 👈 Access cart context
  const [state, dispatch] = useReducer(authReducer, { user: null }, () => {
    const saved = localStorage.getItem("userInfo");
    return saved ? { user: JSON.parse(saved) } : { user: null };
  });

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [state.user]);

  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    clearCart(); // ✅ empty cart on logout
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
