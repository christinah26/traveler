import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/traveler-nobg.png";
import Retour from "../components/retour";
import { MapPin, Send, X } from "lucide-react";
import Swal from "sweetalert2";
import pays from "../utils/pays";
import createBookings from "../api/AddBooking";
import getAvailableFlights from "../api/Bookings";
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
  const [typeReservation, setTypeReservation] = useState("IND"); // ✅ NOUVEAU
  
  const [optionsDisponibles, setOptionsDisponibles] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<any>(null);

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

  // Récupère token et user au chargement
  useEffect(() => {
    const loadAuth = async () => {
      let activeToken = contextToken || localStorage.getItem("token");
      let activeId = contextId;

      if (!isTokenValid(activeToken)) {
        const newToken = await refreshToken();
        if (newToken) {
          activeToken = newToken;
          localStorage.setItem("token", newToken);
        }
      }

      if (!activeId) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            activeId = user.id_client || user.id || user.userId || null;
          } catch (e) {
            console.error("Erreur parsing user:", e);
          }
        }
      }

      setToken(activeToken);
      setUserId(activeId || null);
      setIsReady(true);

    };

    loadAuth();
  }, [contextToken, contextId, refreshToken]);

   const isAuthenticated = token && isTokenValid(token);

   useEffect(() => {
    const loadOptions = async () => {
      if (!isAuthenticated || !token || paysDepart === paysArrivee) {
        setOptionsDisponibles([]);
        return;
      }

      setLoadingOptions(true);
   
      const result = await getAvailableFlights(token, paysDepart, paysArrivee);
      
   
      if (result?.vols && result?.hotels && Array.isArray(result.vols) && Array.isArray(result.hotels)) {
           const combinaisons: any[] = [];
        
        result.vols.forEach((volPair: any) => {
          result.hotels.forEach((hotel: any) => {
            const totalPrice = 
              (parseFloat(volPair.vol_aller?.prix || 0) || 0) +
              (parseFloat(volPair.vol_retour?.prix || 0) || 0) +
              (parseFloat(hotel.prix || 0) || 0);

            combinaisons.push({
              vol_aller: volPair.vol_aller,
              vol_retour: volPair.vol_retour,
              hotel: hotel,
              num_vol_aller: volPair.vol_aller?.num_vol,
              num_vol_retour: volPair.vol_retour?.num_vol,
              num_chambre: hotel.num_chambre,
              compagnie_aerienne_aller: volPair.vol_aller?.compagnie_aerienne || "N/A",
              compagnie_aerienne_retour: volPair.vol_retour?.compagnie_aerienne || "N/A",
              prix_aller: volPair.vol_aller?.prix || "0",
              prix_retour: volPair.vol_retour?.prix || "0",
              prix_chambre: hotel.prix || "0",
              hotel_nom: hotel.nom,
              total: totalPrice.toFixed(2),
            });
          });
        });

        setOptionsDisponibles(combinaisons);
      } else {
        setOptionsDisponibles([]);
       }

      setLoadingOptions(false);
    };

    const timer = setTimeout(loadOptions, 500);
    return () => clearTimeout(timer);
  }, [paysDepart, paysArrivee, isAuthenticated, token]);

  // Création de la réservation
  const handleCreateReservation = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "error",
        text: "Veuillez vous reconnecter.",
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

    if (!selectedOption) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez sélectionner une option (vol aller + retour + hôtel).",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const num_vol = selectedOption.num_vol_aller;
      const num_vol_retourner = selectedOption.num_vol_retour;
      const num_chambre = selectedOption.num_chambre;
      const id_client = userId;
      const code = typeReservation; 

      const response = await createBookings(
        token!,
        num_vol,
        num_vol_retourner,
        num_chambre,
        id_client,
        code
      );

       if (response && (response.success || response.status === 200 || response.message)) {
        if (response?.num_reservation) {
          // Stockez TOUS les nums_reservation dans un array
          let reservations = JSON.parse(localStorage.getItem("userReservations") || "[]");
          reservations.push({
            num_reservation: response.num_reservation,
            destination: selectedOption.destination,
            debut_sejour: selectedOption.debut_sejour,
            timestamp: Date.now()
          });
          localStorage.setItem("userReservations", JSON.stringify(reservations));
        }
        
        Swal.fire({
          icon: "success",
          text: response.message || "Réservation créée avec succès !",
          confirmButtonText: "OK",
        }).then(() => {
          if (response.num_reservation) {
            localStorage.setItem("lastReservation", response.num_reservation.toString());
          }
          navigate("/home");
        });
      } else if (response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
          icon: "error",
          text: "Session expirée.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          text: response?.message || "Erreur lors de la réservation.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-50 bg-white rounded-full shadow-lg mb-4">
            <img src={Logo} alt="Logo" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Réservez votre voyage</h1>
          <p className="text-blue-50 text-lg">Sélectionnez votre destination</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Type de réservation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type de réservation *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="typeReservation"
                    value="IND"
                    checked={typeReservation === "IND"}
                    onChange={(e) => setTypeReservation(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Individuel (IND)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="typeReservation"
                    value="GRP"
                    checked={typeReservation === "GRP"}
                    onChange={(e) => setTypeReservation(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Groupe (GRP)</span>
                </label>
              </div>
            </div>

            {/* Sélection des pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Pays de départ *
                </label>
                <select
                  value={paysDepart}
                  onChange={(e) => {
                    setPaysDepart(e.target.value);
                    setSelectedOption(null);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
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
                  onChange={(e) => {
                    setPaysArrivee(e.target.value);
                    setSelectedOption(null);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {pays.map((p) => (
                    <option key={p.CODE} value={p.NOM}>
                      {p.NOM}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Affichage des options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Options disponibles *
              </label>
              
              {loadingOptions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-white"></div>
                </div>
              ) : optionsDisponibles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {paysDepart === paysArrivee
                    ? "Veuillez choisir deux pays différents"
                    : "Aucune option disponible pour cette route"}
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {optionsDisponibles.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedOption(option)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedOption === option
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Vol Aller</p>
                          <p className="font-semibold">{option.compagnie_aerienne_aller}</p>
                          <p className="text-sm text-gray-600">{option.vol_aller?.heure_depart} - {option.vol_aller?.date_vol?.split('T')[0]}</p>
                          <p className="text-sm text-gray-600">{option.prix_aller} €</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Vol Retour</p>
                          <p className="font-semibold">{option.compagnie_aerienne_retour}</p>
                          <p className="text-sm text-gray-600">{option.vol_retour?.heure_depart} - {option.vol_retour?.date_vol?.split('T')[0]}</p>
                          <p className="text-sm text-gray-600">{option.prix_retour} €</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Hôtel ({option.hotel?.categorie})</p>
                          <p className="font-semibold">{option.hotel_nom}</p>
                          <p className="text-sm text-gray-600">⭐ {option.hotel?.nb_etoile}</p>
                          <p className="text-sm text-gray-600">{option.prix_chambre} €/nuit</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        Total: {option.total} €
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Retour />
              <button
                type="button"
                onClick={handleCreateReservation}
                disabled={loadingOptions || !selectedOption}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50"
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