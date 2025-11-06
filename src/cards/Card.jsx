import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Card({
  type,  
  nom,
  image,
  desc,
  pays,
  ville,
  categorie_chambre,
  prix,
  nb_etoiles,
  date,
  showImage = false,
  showPrice = false,
  showReserve = false,
  showStars = false,
  showDate = false,
  showdesc = false,
  showCategorie = false,
  onReserve = null,
  id,
  num_chambre,
  num_vol,
  num_vol_retourner,
  id_hotel,
  id_vol,
}) {
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleReserve = () => {
        if (!token) {
            navigate("/login");
            return;
        }

         if (onReserve) {
            const itemData = {
                type,
                id,
                nom,
                image,
                desc,
                pays,
                ville,
                categorie_chambre,
                prix,
                nb_etoiles,
                date,
                num_chambre,
                num_vol,
                num_vol_retourner,
                id_hotel,
                id_vol,
            };
            onReserve(itemData);
        } else {
            // Fallback si onReserve n'est pas passé
            const currentData = JSON.parse(localStorage.getItem("formData")) || {};
            
            if (type === "hotel") currentData.hotel = nom;
            if (type === "compagnie") currentData.compagnie = nom;
            
            localStorage.setItem("formData", JSON.stringify(currentData));
            navigate("/formulaire");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            {/* Image */}
            {showImage && image && (
                <div className="relative overflow-hidden h-54 group">
                    <img 
                        src={image} 
                        alt={nom} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    {/* Badge type sur l'image */}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {type}
                    </div>
                </div>
            )}

            <div className="p-4 flex flex-col flex-grow items-center">
                {/* Nom */}
                <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">{nom}</h3>

                {/* Étoiles */}
                {showStars && nb_etoiles && (
                    <div className="flex justify-center mb-3">
                        {Array.from({ length: nb_etoiles }).map((_, i) => (
                            <span key={i} className="text-yellow-500 text-lg">★</span>
                        ))}
                    </div>
                )}

                {/* Localisation */}
                {(pays || ville) && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                        {ville && (
                            <span className="text-gray-700 text-sm bg-blue-50 px-3 py-1 rounded-full">
                                ville: {ville}
                            </span>
                        )}
                        {pays && (
                            <span className="text-gray-700 text-sm bg-green-50 px-3 py-1 rounded-full">
                                pays: {pays}
                            </span>
                        )}
                    </div>
                )}

                {/* Catégorie */}
                {showCategorie && categorie_chambre && (
                    <p className="text-gray-600 text-sm flex-grow text-center mb-3 line-clamp-3">
                        Chambre :{categorie_chambre}
                    </p>
                )}

                {/* Description */}
                {showdesc && desc && (
                    <p className="text-gray-600 text-sm flex-grow text-center mb-3 line-clamp-3">
                        {desc}
                    </p>
                )}

                {/* Date */}
                {showDate && date && (
                    <p className="text-gray-500 text-xs mt-2 bg-gray-100 px-3 py-1 rounded-full">
                        {date}
                    </p>
                )}

                {/* Prix */}
                {showPrice && prix && (
                    <p className="text-blue-800 font-bold text-xl mt-3">
                        {prix} <span className="text-xl font-normal">€</span>
                    </p>
                )}

                {/* Bouton Réserver */}
                {showReserve && (
                    <button
                        onClick={handleReserve}
                        className="mt-4 px-5 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Réserver maintenant
                    </button>
                )}
            </div>
        </div>
    );
}