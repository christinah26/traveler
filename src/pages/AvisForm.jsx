import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/review";
import ToggleSection from "../components/ToggleSection";
import rating from "../api/Rating";
import { useAuth } from "../contexts/AuthContext.js";
import { jwtDecode } from 'jwt-decode';

export default function AvisForm({  }) {
  const navigate = useNavigate();
  const authContext = useAuth();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [isReady, setIsReady] = useState(false);

 
  useEffect(() => {
    const getAuthData = () => {
   
      let activeToken = authContext?.token || localStorage.getItem("token");
      setToken(activeToken);

    
      let activeUserId = authContext?.id;
      if (!activeUserId) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            activeUserId = user.id || user.userId;
          } catch (e) {
            console.error("Erreur parsing user:", e);
          }
        }
      }
      setUserId(activeUserId || null);

     
      const propReservationId = null;
      setReservationId(finalReservationId || null);

      setIsReady(true);

      console.log("🔑 Token chargé pour avis:", !!activeToken);
      console.log("👤 User ID chargé:", activeUserId);
      console.log("🎫 Reservation ID chargé:", finalReservationId);
    };

    getAuthData();
  }, [authContext?.token, authContext?.id, propReservationId]);

  
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const isAuthenticated = token && isTokenValid(token);

  const [reviewData, setReviewData] = useState({
    user: "",
    hotel: "",
    hotelRating: 0,
    hotelComment: "",
    airline: "",
    airlineRating: 0,
    airlineComment: "",
  });

  const [sections, setSections] = useState({ hotel: true, airline: true });
  const [loading, setLoading] = useState(false);

  const handleSectionToggle = (type) =>
    setSections((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("✅ Auth check:", { isAuthenticated, token: !!token, isReady });

    // Vérifie l'authentification
    if (!isAuthenticated) {
      Swal.fire({
        icon: "error",
        text: "Vous devez être connecté pour laisser un avis.",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
      return;
    }

    if (!reviewData.user) {
      Swal.fire("Erreur", "Merci d'indiquer votre nom ou e-mail", "warning");
      return;
    }

    if (
      (sections.hotel && (!reviewData.hotel || reviewData.hotelRating === 0)) ||
      (sections.airline && (!reviewData.airline || reviewData.airlineRating === 0))
    ) {
      Swal.fire("Erreur", "Merci de remplir tous les champs et de donner une note", "warning");
      return;
    }

    // Vérifie que au moins un avis est présent
    if (!reviewData.hotelComment && !reviewData.airlineComment) {
      Swal.fire("Erreur", "Merci de laisser au moins un commentaire", "warning");
      return;
    }

    // Le num_reservation est déjà dans l'API du backend (via le token)
    const ratingData = {
      note_hotel: reviewData.hotelRating,
      avis_hotel: reviewData.hotelComment,
      note_compagnie_aerienne_aller: reviewData.airlineRating,
      avis_compagnie_aerienne_aller: reviewData.airlineComment,
      note_compagnie_aerienne_retour: 0,
      avis_compagnie_aerienne_retour: "",
    };

    console.log("📤 Envoi avis avec:", ratingData);
    console.log("📝 JSON stringifié:", JSON.stringify(ratingData, null, 2));

    setLoading(true);
    try {
      const res = await rating(token, ratingData);

      console.log("📦 Réponse avis:", res);

      if (res && res.success) {
        Swal.fire("Merci !", "Votre avis a été publié avec succès", "success");
        setReviewData({
          user: "",
          hotel: "",
          hotelRating: 0,
          hotelComment: "",
          airline: "",
          airlineRating: 0,
          airlineComment: "",
        });
        navigate("/");
      } else if (res && res.status === 401) {
        // Token expiré
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
          icon: "error",
          text: "Votre session a expiré. Veuillez vous reconnecter.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire("Erreur", res?.message || "Impossible d'envoyer votre avis", "error");
      }
    } catch (err) {
      console.error("❌ Erreur:", err);
      Swal.fire("Erreur", "Une erreur est survenue lors de l'envoi", "error");
    } finally {
      setLoading(false);
    }
  };

  // Montre un loader en attendant que le token soit chargé
  if (!isReady) {
    return (
      <div className="flex h-screen justify-center items-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Laisser un Avis</h2>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom ou e-mail
            </label>
            <input
              type="text"
              value={reviewData.user}
              onChange={(e) =>
                setReviewData({ ...reviewData, user: e.target.value })
              }
              placeholder="Ex : Jean Dupont / jean@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <ToggleSection sections={sections} onToggle={handleSectionToggle} />

          {sections.hotel && (
            <ReviewSection
              label="l'Hôtel"
              nameValue={reviewData.hotel}
              onNameChange={(v) => setReviewData({ ...reviewData, hotel: v })}
              ratingValue={reviewData.hotelRating}
              onRatingChange={(v) => setReviewData({ ...reviewData, hotelRating: v })}
              commentValue={reviewData.hotelComment}
              onCommentChange={(v) => setReviewData({ ...reviewData, hotelComment: v })}
              required
            />
          )}

          {sections.airline && (
            <ReviewSection
              label="la Compagnie aérienne"
              nameValue={reviewData.airline}
              onNameChange={(v) => setReviewData({ ...reviewData, airline: v })}
              ratingValue={reviewData.airlineRating}
              onRatingChange={(v) => setReviewData({ ...reviewData, airlineRating: v })}
              commentValue={reviewData.airlineComment}
              onCommentChange={(v) => setReviewData({ ...reviewData, airlineComment: v })}
              required
            />
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="reset"
              onClick={() =>
                setReviewData({
                  user: "",
                  hotel: "",
                  hotelRating: 0,
                  hotelComment: "",
                  airline: "",
                  airlineRating: 0,
                  airlineComment: "",
                })
              }
              className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-blue-700"
              } text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition`}
            >
              {loading ? "Envoi..." : "Publier l'avis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}