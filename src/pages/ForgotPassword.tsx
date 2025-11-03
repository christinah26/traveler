import React, { useState } from "react";
import { Plane, Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import Retour from "../components/retour";
// @ts-ignore
import Logo from "../assets/traveler-nobg.png";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        // Validation
        if (!email) {
            alert("Veuillez entrer votre adresse e-mail");
            return;
        }

        // Validation format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Veuillez entrer une adresse e-mail valide");
            return;
        }

        console.log("Demande de réinitialisation pour:", email);

        setIsSubmitted(true);
    };

    const handleBackToLogin = () => {
        // Redirection vers la page de connexion
        window.history.back();
        // ou: window.location.href = '/login';
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* En-tête */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            E-mail Envoyé !
                        </h1>
                        <p className="text-blue-50 text-lg">
                            Vérifiez votre boîte de réception
                        </p>
                    </div>

                    {/* Message de confirmation */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-center space-y-4">
                            <div className="text-6xl mb-4">📧</div>
                            <p className="text-gray-700 text-lg">
                                Un e-mail de réinitialisation a été envoyé à :
                            </p>
                            <p className="text-blue-600 font-bold text-lg">
                                {email}
                            </p>
                            <p className="text-gray-600 text-sm mt-4">
                                Cliquez sur le lien dans l'e-mail pour
                                réinitialiser votre mot de passe. Si vous ne
                                recevez pas l'e-mail dans quelques minutes,
                                vérifiez votre dossier spam.
                            </p>

                            <div className="m-4 px-50 py-2 ">
                                <button
                                    onClick={handleBackToLogin}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl mt-6"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Retour à la connexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-50 bg-white rounded-full shadow-lg mb-4">
                        <img src={Logo} />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Mot de Passe Oublié ?
                    </h1>
                    <p className="text-blue-50 text-lg">
                        Pas de soucis, nous allons vous aider
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="space-y-5">
                        {/* Instructions */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-gray-700 text-sm">
                                Entrez votre adresse e-mail et nous vous
                                enverrons un lien pour réinitialiser votre mot
                                de passe.
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                <Mail className="inline w-4 h-4 mr-1" />
                                Adresse e-mail *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="exemple@email.com"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Retour />

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                            >
                                <Send className="w-5 h-5" />
                                Envoyer le lien de réinitialisation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info supplémentaire */}
                <div className="text-center mt-6">
                    <p className="text-white text-sm">
                        Vous vous souvenez de votre mot de passe ?{" "}
                        <a
                            onClick={() => navigate("/login")}
                            className="font-bold text-white hover:text-blue-100 underline"
                        >
                            Se connecter
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
