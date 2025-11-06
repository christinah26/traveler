import React, { useState } from "react";
import { Star } from "lucide-react";
import AvisAirlines from "../api/AvisAirlines";
import AvisHotels from "../api/AvisHotel";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";

export default function AvisSection({ 
  type = "hotels",
  data = [] 
}) {
  const { token } = useAuth(); 
  const [avis, setAvis] = useState([]);
  const [loadingAvis, setLoadingAvis] = useState(false);
  const [visibleAvis, setVisibleAvis] = useState(3);
  const [showAvisSection, setShowAvisSection] = useState(false);

  
  const handleFetchAvis = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        text: "Veuillez vous connecter pour voir les avis",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoadingAvis(true);
    try {
      let allAvis = [];

    
      for (const item of data) {
        try {
          const itemId = item.id || item.num_chambre || item.num_vol;
          
          if (!itemId) {
            console.warn("⚠️ ID manquant pour:", item);
            continue;
          }

          let itemAvis;
          
          if (type === "hotels") {
            itemAvis = await AvisHotels(token, itemId);
          } else if (type === "airlines") {
            itemAvis = await AvisAirlines(token, itemId);
          }

          console.log(`📋 Avis pour ${type} ID ${itemId}:`, itemAvis);

          if (itemAvis?.ratings) {
            const ratings = Array.isArray(itemAvis.ratings) 
              ? itemAvis.ratings 
              : [itemAvis.ratings];
            
            allAvis = [...allAvis, ...ratings.map(r => ({ 
              ...r, 
              type: type,
              item_id: itemId,
              item_nom: item.nom,
              icon: type === "hotels" ? "🏨" : "✈️"
            }))];
          }
        } catch (err) {
          console.error(`❌ Erreur avis ${type} ${item.id}:`, err);
        }
      }

  
      const shuffled = allAvis.sort(() => Math.random() - 0.5);
      setAvis(shuffled);
      console.log("✅ Total avis chargés:", shuffled.length);

      if (shuffled.length === 0) {
        Swal.fire({
          icon: "info",
          text: "Aucun avis disponible pour le moment",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("❌ Erreur chargement avis:", err);
      Swal.fire({
        icon: "error",
        text: "Erreur lors du chargement des avis",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingAvis(false);
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review }) => {
    const getLabel = () => {
      if (type === "hotels") return `🏨 ${review.item_nom || "Hôtel"}`;
      if (type === "airlines") return `✈️ ${review.item_nom || "Compagnie"}`;
      return "Avis";
    };

    const getAvisText = () => {
      if (type === "hotels") return review.avis_hotel;
      if (type === "airlines") return review.avis_compagnie_aerienne_aller || review.avis_compagnie_aerienne_retour;
      return "";
    };

    const getRating = () => {
      if (type === "hotels") return review.note_hotel;
      if (type === "airlines") return review.note_compagnie_aerienne_aller || review.note_compagnie_aerienne_retour;
      return 0;
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {review.user_name || "Client"}
            </p>
            <p className="text-xs text-gray-500">#{review.num_reservation}</p>
          </div>
          <StarRating rating={getRating()} />
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-blue-600 mb-2">{getLabel()}</p>

        {/* Avis */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          "{getAvisText()}"
        </p>

        {/* Destination */}
        {review.destination && (
          <p className="text-xs text-gray-500 italic">
            📍 {review.destination}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="px-8 py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
       
        <div className="text-center mb-10">

          {/* Bouton Voir/Masquer Avis */}
          {!showAvisSection ? (
            <button
              onClick={() => {
                setShowAvisSection(true);
                handleFetchAvis();
              }}
              disabled={loadingAvis}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loadingAvis ? "Chargement..." : "⭐ Voir les avis"}
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAvisSection(false);
                setVisibleAvis(3);
              }}
              className="bg-gray-400 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-500 transition-all"
            >
              Masquer les avis
            </button>
          )}
        </div>

        {/* Avis Grid */}
        {showAvisSection && (
          <>
            {loadingAvis ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-white"></div>
              </div>
            ) : avis.length > 0 ? (
              <>
                {/* Affiche avis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {avis.slice(0, visibleAvis).map((review, index) => (
                    <ReviewCard
                      key={`${review.num_reservation}-${review.item_id}-${index}`}
                      review={review}
                    />
                  ))}
                </div>

                {/* Bouton Voir Plus / Voir Moins */}
                {visibleAvis < avis.length ? (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setVisibleAvis(visibleAvis + 3)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                    >
                      Voir plus avis ↓ ({visibleAvis}/{avis.length})
                    </button>
                  </div>
                ) : (
                  avis.length > 3 && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setVisibleAvis(3)}
                        className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold text-sm"
                      >
                        Voir moins ↑
                      </button>
                    </div>
                  )
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 py-8">
                Aucun avis disponible pour le moment
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}