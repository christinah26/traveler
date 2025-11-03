import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import Formulaire from "./pages/Formulaire.tsx";
import Pages from "./pages/Pages.jsx";
import Login from "./pages/Login.js";
import Signin from "./pages/Signin.js";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import AvisForm from "./pages/AvisForm.jsx";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Dashboard from "./pages/dashboard.tsx";
import AuthProviderWrapper from "./provider/AuthProviderWrapper.tsx";
import TokenAPI from "./api/TokenAPI.ts";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState<string | null>(null);
    const refreshToken = async (): Promise<string | null> => {
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) return null;

        try {
            const data = await TokenAPI(refresh);

            setToken(data?.accessToken);
            setId(data?.id);

            return data?.accessToken;
        } catch (err) {
            setToken(null);
            return null;
        }
    };
    const [id, setId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const data = await TokenAPI(refreshToken || "");
            if (data?.accessToken) {
                setToken(data.accessToken);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!token) {
                const newToken = await refreshToken();
                setIsAuthenticated(!!newToken);
            } else {
                setIsAuthenticated(true);
            }
            setLoading(false);
        })();
    }, [token]);

    if (loading)
        return (
            <div className="flex h-screen justify-center items-center">
                <FaSpinner size={56} className="animate-spin" />
            </div>
        );

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={token ? <Navigate to="/home" /> : <Accueil />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                    path="/signin"
                    element={<Signin setIsAuthenticated={setIsAuthenticated} />}
                />

                <Route
                    element={
                        <AuthProviderWrapper
                            props={{ id, refreshToken, setId, setToken, token }}
                        />
                    }
                >
                    <Route
                        path="/home"
                        element={
                            isAuthenticated ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="/formulaire" element={<Formulaire />} />
                    <Route path="/pages/:pageType" element={<Pages />} />
                    <Route path="/avis" element={<AvisForm />} />
                </Route>
            </Routes>
        </Router>
    );
}
