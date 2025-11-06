import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Send, AlertCircle, Plane, Hotel } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../Top/navbar";
import Footer from "../Top/footer";
import rating from "../api/rating";
import Swal from "sweetalert2";

function Avis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [reservation, setReservation] = useState(null);
  const [ratings, setRatings] = useState({
    hotel: { note: 0, avis: "" },
    vol_aller: { note: 0, avis: "" },
    vol_retour: { note: 0, avis: "" },
  });
  const [hoverRatings, setHoverRatings] = useState({
    hotel: 0,
    vol_aller: 0,
    vol_retour: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupère la réservation depuis le state
  useEffect(() => {
    try {
      
      let reservationData = location.state?.reservation;

      if (!reservationData) {
        const stored = localStorage.getItem("tempReservationData");
        if (stored) {
          reservationData = JSON.parse(stored);
        }
      }

      if (reservationData) {
        console.log("📋 Réservation chargée:", reservationData);

        setReservation(reservationData);
      } else {
        setError("Impossible de charger les données de la réservation");
      }
    } catch (err) {
      console.error("❌ Erreur chargement réservation:", err);
      setError("Erreur lors du chargement des données");
    }
  }, [location, token]);

  const handleRatingChange = (category, note) => {
    setRatings((prev) => ({
      ...prev,
      [category]: { ...prev[category], note },
    }));
  };

  const handleAvisChange = (category, avis) => {
    setRatings((prev) => ({
      ...prev,
      [category]: { ...prev[category], avis },
    }));
  };

  const handleHoverRating = (category, value) => {
    setHoverRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmitReview = async () => {
    if (!reservation) {
      Swal.fire({
        icon: "error",
        text: "Données de réservation manquantes",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!token) {
      console.error("❌ Token manquant!");
      Swal.fire({
        icon: "error",
        text: "Session expirée, veuillez vous reconnecter",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
      return;
    }

    // Validation
    if (ratings.hotel.note === 0) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez noter l'hôtel",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!ratings.hotel.avis.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez donner un avis sur l'hôtel",
        confirmButtonText: "OK",
      });
      return;
    }

    if (ratings.vol_aller.note === 0) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez noter le vol aller",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!ratings.vol_aller.avis.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez donner un avis sur le vol aller",
        confirmButtonText: "OK",
      });
      return;
    }

    if (ratings.vol_retour.note === 0) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez noter le vol retour",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!ratings.vol_retour.avis.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Veuillez donner un avis sur le vol retour",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);

      console.log("🔑 Token utilisé:", token ? "✓ Présent" : "✗ Manquant");
      console.log("📋 ID Réservation:", reservation.num_reservation);

      // Données  requises par l'API
      const ratingData = {
        num_reservation: Number(reservation.num_reservation),
        note_hotel: Number(ratings.hotel.note),
        avis_hotel: String(ratings.hotel.avis).trim(),
        note_compagnie_aerienne_aller: Number(ratings.vol_aller.note),
        avis_compagnie_aerienne_aller: String(ratings.vol_aller.avis).trim(),
        note_compagnie_aerienne_retour: Number(ratings.vol_retour.note),
        avis_compagnie_aerienne_retour: String(ratings.vol_retour.avis).trim(),
      };

      console.log("📤 Envoi des avis - Payload MINIMALISTE:");
      console.log(JSON.stringify(ratingData, null, 2));
      console.log("📊 Types des données:");
      console.log("  - num_reservation:", typeof ratingData.num_reservation, ratingData.num_reservation);
      console.log("  - note_hotel:", typeof ratingData.note_hotel, ratingData.note_hotel);
      console.log("  - avis_hotel:", typeof ratingData.avis_hotel, ratingData.avis_hotel.substring(0, 50));

      const response = await rating(token, ratingData);

      console.log("📊 Réponse reçue:", response);

      if (response && response.status === 403) {
        console.error("❌ Erreur 403 Forbidden:", response.error);
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas les permissions nécessaires. Veuillez vous reconnecter.",
          confirmButtonText: "Se reconnecter",
        }).then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
      } else if (response && response.status === 500) {
        console.error("❌ Erreur serveur 500:", response.error);
        console.error("📋 URL appelée:", response.url);
        console.error("📋 Payload envoyé:", response.payload);
        Swal.fire({
          icon: "error",
          title: "Erreur serveur 500",
          html: `
            <div style="text-align: left;">
              <p><strong>Message:</strong> ${response.error}</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                Veuillez contacter l'administrateur avec ces informations:<br/>
                <code>${response.error}</code>
              </p>
            </div>
          `,
          confirmButtonText: "OK",
        });
      } else if (response && (response.success || response.status === 200 || response.message || response.id)) {
        Swal.fire({
          icon: "success",
          text: response.message || "Avis enregistrés avec succès !",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("tempReservationData");
          localStorage.removeItem("tempReservationId");
          navigate("/home");
        });
      } else if (response && response.status === 500) {
        console.error("❌ Erreur serveur 500:", response.error);
        Swal.fire({
          icon: "error",
          title: "Erreur serveur",
          text: "L'API a retourné une erreur 500. Vérifiez les données envoyées.",
          confirmButtonText: "OK",
        });
      } else {
        throw new Error(response?.error || "Erreur inconnue");
      }
    } catch (err) {
      console.error("❌ Erreur:", err);
      Swal.fire({
        icon: "error",
        text: err instanceof Error ? err.message : "Erreur lors de l'enregistrement des avis",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ name, label, value, onChange, onHover }) => {
    const hoverValue = hoverRatings[name] || value;

    const getEmoji = (val) => {
      switch (val) {
        case 1:
          return "😞 Très mauvais";
        case 2:
          return "😕 Mauvais";
        case 3:
          return "😐 Acceptable";
        case 4:
          return "😊 Bon";
        case 5:
          return "😍 Excellent";
        default:
          return "";
      }
    };

    return (
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label} *
        </label>
        <div className="flex gap-3 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => onHover(star)}
              onMouseLeave={() => onHover(0)}
              className="transition-transform transform hover:scale-110"
            >
              <Star
                size={40}
                className={`${
                  star <= hoverValue
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } transition-all`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">{hoverValue > 0 && getEmoji(hoverValue)}</p>
      </div>
    );
  };

  if (!reservation && !error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200 pt-24 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          {error ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/home")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Retour au dashboard
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Donnez votre avis
              </h1>
              <p className="text-blue-600 mb-8 font-bold text-xl bg-blue-50 p-4 rounded-lg text-center">
                Partagez votre expérience de voyage en évaluant l'hôtel et les
                vols
              </p>

              {/* Résumé de la réservation */}
              {reservation && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Réservation #{reservation.num_reservation}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">📍 Destination</p>
                      <p className="font-semibold text-gray-800">
                        {reservation.destination}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">🏨 Hôtel</p>
                      <p className="font-semibold text-gray-800">
                        {reservation.hotel || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">📅 Durée</p>
                      <p className="font-semibold text-gray-800">
                        {reservation.duree_sejour} jours
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-10">
                {/* SECTION HÔTEL */}
                <div className="border-b-2 border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Hotel className="text-green-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Évaluez l'hôtel
                    </h2>
                  </div>

                  {reservation?.hotel && (
                    <p className="text-gray-600 mb-6">
                      {reservation.hotel} ({reservation.categorie_chambre})
                    </p>
                  )}

                  <StarRating
                    name="hotel"
                    label="Note générale de l'hôtel"
                    value={ratings.hotel.note}
                    onChange={(note) => handleRatingChange("hotel", note)}
                    onHover={(value) => handleHoverRating("hotel", value)}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Votre avis sur l'hôtel *
                    </label>
                    <textarea
                      value={ratings.hotel.avis}
                      onChange={(e) =>
                        handleAvisChange("hotel", e.target.value)
                      }
                      placeholder="Décrivez votre expérience à l'hôtel..."
                      maxLength={500}
                      className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {ratings.hotel.avis.length}/500 caractères
                    </p>
                  </div>
                </div>

                {/* SECTION VOL ALLER */}
                <div className="border-b-2 border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Plane className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Évaluez le vol aller
                    </h2>
                  </div>

                  <StarRating
                    name="vol_aller"
                    label="Note du vol aller"
                    value={ratings.vol_aller.note}
                    onChange={(note) => handleRatingChange("vol_aller", note)}
                    onHover={(value) => handleHoverRating("vol_aller", value)}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Votre avis sur le vol aller *
                    </label>
                    <textarea
                      value={ratings.vol_aller.avis}
                      onChange={(e) =>
                        handleAvisChange("vol_aller", e.target.value)
                      }
                      placeholder="Décrivez votre expérience du vol..."
                      maxLength={500}
                      className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {ratings.vol_aller.avis.length}/500 caractères
                    </p>
                  </div>
                </div>

                {/* SECTION VOL RETOUR */}
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Plane
                        className="text-purple-600 transform rotate-180"
                        size={24}
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Évaluez le vol retour
                    </h2>
                  </div>

                  <StarRating
                    name="vol_retour"
                    label="Note du vol retour"
                    value={ratings.vol_retour.note}
                    onChange={(note) => handleRatingChange("vol_retour", note)}
                    onHover={(value) => handleHoverRating("vol_retour", value)}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Votre avis sur le vol retour *
                    </label>
                    <textarea
                      value={ratings.vol_retour.avis}
                      onChange={(e) =>
                        handleAvisChange("vol_retour", e.target.value)
                      }
                      placeholder="Décrivez votre expérience du vol..."
                      maxLength={500}
                      className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {ratings.vol_retour.avis.length}/500 caractères
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => navigate("/home")}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                  {loading ? "Envoi..." : "Soumettre les avis"}
                </button>
              </div>

              <p className="text-center text-gray-600 text-sm mt-6">
                * Tous les champs sont obligatoires
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Avis;