import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Box,
} from "@mui/material";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Cookie from "js-cookie";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";

const App = () => {
  const [userToken, setUserToken] = useState(Cookie.get("token") || null);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setUserToken(token);
    navigate("/admin");
  };

  const handleLogout = () => {
    Cookie.remove("token");
    setUserToken(null);
    navigate("/login");
  };

  useEffect(() => {
    const currentToken = Cookie.get("token");
    setToken(currentToken);
    if (currentToken) {
      setUserToken(currentToken);
      if (location.pathname === "/login" || location.pathname === "/") {
        navigate("/admin", { replace: true });
      }
    } else if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ManDown
          </Typography>
          {token && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route
          path="/login"
          element={
            userToken ? (
              <Navigate to="/admin" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            userToken ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={userToken ? "/admin" : "/login"} />}
        />
      </Routes>
    </Box>
  );
};

export default App;
