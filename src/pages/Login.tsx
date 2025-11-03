import React, { useContext, useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import {ArrowLeft } from 'lucide-react';
import "../components/popup.css"
import Logo from "../assets/traveler-nobg.png";
import Swal from "sweetalert2";
import { login } from "../api/Auth";
import { AuthContext, useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const context = useContext(AuthContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            const data = await login(formData);
            setToken(data.token);
            context.setId ? context.setId(data.id) : null;

            if (data.status === 200) {
                Swal.fire({
                    title: "Connexion réussie !",
                    icon: "success",
                    iconColor: "#ffff",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    customClass: {
                        popup: "custom-popup",
                        title: "custom-title",
                        confirmButton: "custom-confirm-button",
                    },
                }).then((result) => {
                    navigate("/home");
                });
            }

            return data.status;
        } catch (err) {
            console.log("Login failed", err);

            Swal.fire({
                icon: "error",
                iconColor: "#ffff",
                title: "E-mail ou mot de passe incorrect.",
                customClass: {
                    popup: "custom-popup",
                    title: "custom-text",
                    confirmButton: "custom-confirm-button",
                },
            });
        }
    };

   const handleRetour = () => {
      Swal.fire({
         text: "Voulez-vous vraiment quiiter cette page ?",
         icon: "question",
         iconColor: "#ffff",
         showCancelButton: true,
         confirmButtonText: "Oui",
         cancelButtonText: "Non",
         reverseButtons: true,
         customClass: {
           popup: "custom-popup",
           confirmButton: "custom-confirm-button",
           cancelButton: "custom-cancel-button",
         }
       }).then((result) =>{
         if (result.isConfirmed) {
           navigate('/');
         } else if (result.dismiss === "cancel") {
           window.close();
         }
       });
     }; 

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-50 bg-white rounded-full shadow-lg mb-4">
                        <img src={Logo}  alt="Logo" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Connexion
                    </h1>
                    <p className="text-blue-50 text-lg">
                        Connectez-vous à votre compte
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                <User className="inline w-4 h-4 mr-1" />
                                E-mail *
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="exemple@email.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                <Lock className="inline w-4 h-4 mr-1" />
                                Mot de passe *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleRetour}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                            const status = await handleSubmit();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                        >
                                <LogIn className="w-5 h-5" />
                                Se connecter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-white">
                        Vous n'avez pas de compte ?{" "}
                        <a
                            href="/signin"
                            className="font-bold text-white hover:text-blue-100 underline"
                        >
                            S'inscrire
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
