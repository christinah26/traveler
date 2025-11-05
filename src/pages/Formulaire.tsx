import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/traveler-nobg.png";
import Retour from "../components/retour";
import { MapPin, Send, X, Plane, Hotel } from "lucide-react";
import Swal from "sweetalert2";
import pays from "../utils/pays";
import createBookings from "../api/AddBooking";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Formulaire() {
  const navigate = useNavigate();
  const { token: contextToken, id: contextId, refreshToken } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [paysDepart, setPaysDepart] = useState("Andorre");
  const [paysArrivee, setPaysArrivee] = useState("Andorre");

  const [selectedVolAller, setSelectedVolAller] = useState<any>(null);
  const [selectedVolRetour, setSelectedVolRetour] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Vérifie la validité du token
  const isTokenValid = (t: string | null) => {
    if (!t) return false;
    try {
      const decoded: any = jwtDecode(t);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // Récupère token + user au chargement
  useEffect(() => {
    const loadAuth = async () => {
      let activeToken = contextToken || localStorage.getItem("token");
      let activeId = contextId;

      // Si le token n’est pas valide, essaie d’en générer un nouveau via refreshToken()
      if (!isTokenValid(activeToken)) {
        const newToken = await refreshToken();
        if (newToken) {
          activeToken = newToken;
          localStorage.setItem("token", newToken);
        }
      }

      // Si l'ID est manquant, le récupérer depuis localStorage
      if (!activeId) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            activeId = user.id || user.userId || null;
          } catch (e) {
            console.error("Erreur parsing user:", e);
          }
        }
      }

      setToken(activeToken);
      setUserId(activeId || null);
      setIsReady(true);

      console.log("🔑 Token final chargé:", !!activeToken);
      console.log("👤 ID final chargé:", activeId);
    };

    loadAuth();
  }, [contextToken, contextId, refreshToken]);

  // Récupère les sélections sauvegardées
  useEffect(() => {
    const volAller = localStorage.getItem("selectedVolAller");
    const volRetour = localStorage.getItem("selectedVolRetour");
    const hotel = localStorage.getItem("selectedHotel");

    if (volAller) setSelectedVolAller(JSON.parse(volAller));
    if (volRetour) setSelectedVolRetour(JSON.parse(volRetour));
    if (hotel) setSelectedHotel(JSON.parse(hotel));
  }, []);

  // Vérifie si authentifié
  const isAuthenticated = token && isTokenValid(token);

  // Reset des sélections
  const resetVolAller = () => {
    setSelectedVolAller(null);
    localStorage.removeItem("selectedVolAller");
  };
  const resetVolRetour = () => {
    setSelectedVolRetour(null);
    localStorage.removeItem("selectedVolRetour");
  };
  const resetHotel = () => {
    setSelectedHotel(null);
    localStorage.removeItem("selectedHotel");
  };

  // Navigation
  const handleSelectVolAller = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({ paysDepart, paysArrivee, volType: "aller" })
    );
    navigate("/pages/compagnies");
  };
  const handleSelectVolRetour = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({ paysDepart, paysArrivee, volType: "retour" })
    );
    navigate("/pages/compagnies");
  };
  const handleSelectHotel = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({ paysDepart, paysArrivee })
    );
    navigate("/pages/hotels");
  };

  // Création de la réservation
  const handleCreateReservation = async () => {
    console.log("🔐 Token dispo:", !!token);
    console.log("✅ Auth:", !!isAuthenticated);
    console.log("👤 User ID:", userId);

    if (!isAuthenticated) {
      Swal.fire({
        icon: "error",
        text: "Veuillez vous reconnecter avant de réserver.",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
      return;
    }

    if (!userId) {
      Swal.fire({
        icon: "error",
        text: "Informations utilisateur manquantes.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!selectedVolAller || !selectedVolRetour || !selectedHotel) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez sélectionner un vol aller, un vol retour et un hôtel.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const num_vol = selectedVolAller.num_vol;
      const num_vol_retourner = selectedVolRetour.num_vol;
      const num_chambre = selectedHotel.num_chambre;

      console.log("📡 Envoi à /bookings/add:", {
        num_vol,
        num_vol_retourner,
        num_chambre,
        id_client: userId,
        code : "GRP" 
      });

      const response = await createBookings(
        token!,
        num_vol,
        num_vol_retourner,
        num_chambre,
        userId!,
       "GRP", 
      );

      console.log("📦 Réponse /bookings/add:", response);

      if (response && (response.success || response.status === 200)) {
        Swal.fire({
          icon: "success",
          text: "Réservation créée avec succès !",
          confirmButtonText: "OK",
        }).then(() => {
          ["selectedVolAller", "selectedVolRetour", "selectedHotel", "formData"].forEach(localStorage.removeItem);
          navigate("/home");
        });
      } else {
        Swal.fire({
          icon: "error",
          text: response?.message || "Erreur lors de la réservation.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      Swal.fire({
        icon: "error",
        text: "Une erreur s'est produite.",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isReady) {
    return (
      <div className="flex h-screen justify-center items-center bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-50 bg-white rounded-full shadow-lg mb-4">
            <img src={Logo} alt="Logo" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Réservez votre voyage
          </h1>
          <p className="text-blue-50 text-lg">
            Remplissez le formulaire pour démarrer votre aventure
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Pays de départ *
                </label>
                <select
                  value={paysDepart}
                  onChange={(e) => setPaysDepart(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {pays.map((p) => (
                    <option key={p.CODE} value={p.NOM}>
                      {p.NOM}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Pays d'arrivée *
                </label>
                <select
                  value={paysArrivee}
                  onChange={(e) => setPaysArrivee(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {pays.map((p) => (
                    <option key={p.CODE} value={p.NOM}>
                      {p.NOM}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vol aller */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Plane className="inline w-4 h-4 mr-1" />
                Vol aller *
              </label>
              {selectedVolAller ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={selectedVolAller.nom}
                    readOnly
                    className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={resetVolAller}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSelectVolAller}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choisir un vol aller
                </button>
              )}
            </div>

            {/* Vol retour */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Plane className="inline w-4 h-4 mr-1" />
                Vol retour *
              </label>
              {selectedVolRetour ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={selectedVolRetour.nom}
                    readOnly
                    className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={resetVolRetour}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSelectVolRetour}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choisir un vol retour
                </button>
              )}
            </div>

            {/* Hôtel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Hotel className="inline w-4 h-4 mr-1" />
                Hôtel *
              </label>
              {selectedHotel ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={selectedHotel.nom}
                    readOnly
                    className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={resetHotel}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSelectHotel}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choisir un hôtel
                </button>
              )}
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Retour />
              <button
                type="button"
                onClick={handleCreateReservation}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" /> Confirmer la réservation
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          * Tous les champs sont obligatoires
        </p>
      </div>
    </div>
  );
}