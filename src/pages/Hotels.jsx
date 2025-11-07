import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Top/footer.jsx";
import Card from "../cards/Card.jsx";
import Contact from "../Section/contact.jsx";
import Retour from "../components/retour.tsx";
import pays from "../utils/pays.ts";
import { useAuth } from "../contexts/AuthContext.js";
import getHotels from "../api/Hotels.ts";
import { NavbarContext } from "../contexts/NavbarContext.tsx";
import Header from "../Top/navbar.jsx";

export default function HotelsPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const navbar = useContext(NavbarContext);

  const [visible, setVisible] = useState(3);
  const [selectedCountry, setSelectedCountry] = useState("France");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalHotels, setTotalHotels] = useState(0);

  const storedData = JSON.parse(localStorage.getItem("formData")) || {};
  const destinationFilter = storedData.destination || null;
  const budgetFilter = storedData.budget ? parseFloat(storedData.budget) : null;

  const mapHotelData = (hotel, index) => {
    const stableId = hotel.id_hotel || hotel.id || `hotel_${index}_${hotel.nom}`;

    return {
      id: stableId,
      num_chambre: hotel.id_hotel || hotel.id || hotel.num_chambre || stableId,
      nom: hotel.nom || "Sans nom",
      image: hotel.image || "",
      desc: hotel.description || hotel.desc || "",
      pays: hotel.pays || "",
      ville: hotel.ville || "",
      categorie_chambre: hotel.categorie_chambre || "",
      prix: hotel.prix || 0,
      nb_etoiles: hotel.nb_etoile || hotel.nb_etoiles || 0,
      type: "hotel",
    };
  };

  
  useEffect(() => {
    const fetchHotels = async () => {
      if (!navbar.isAuthenticated) {
        alert("Veuillez vous connecter");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const result = await getHotels(token, selectedCountry || "France");

        let hotelsArray = [];
        if (result?.hotels) hotelsArray = result.hotels;
        else if (Array.isArray(result)) hotelsArray = result;
        else if (result?.data) hotelsArray = result.data;

        const mapped = hotelsArray.map((hotel, index) => mapHotelData(hotel, index));
        setData(mapped);
        setTotalHotels(mapped.length);
        setVisible(3);
      } catch (err) {
        console.error(" Erreur:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [selectedCountry, token, navbar.isAuthenticated, navigate]);

  const filteredData = data.filter((item) => {
    let valid = true;

    if (destinationFilter && item.ville && item.ville !== destinationFilter) {
      valid = false;
    }

    if (budgetFilter && item.prix && item.prix > budgetFilter) {
      valid = false;
    }

    if (searchTerm && item.nom) {
      const searchLower = searchTerm.toLowerCase();
      const nomMatch = item.nom.toLowerCase().includes(searchLower);
      const villeMatch = item.ville && item.ville.toLowerCase().includes(searchLower);
      const paysMatch = item.pays && item.pays.toLowerCase().includes(searchLower);

      valid = valid && (nomMatch || villeMatch || paysMatch);
    }

    return valid;
  });


  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 300));
    setVisible((prev) => prev + 3);
    setLoadingMore(false);
  };

  const handleCardClick = (item) => {
    const currentData = JSON.parse(localStorage.getItem("formData")) || {};

    const hotelData = {
      num_chambre: item.num_chambre || item.id,
      id_hotel: item.id_hotel || item.id || item.num_chambre,
      categorie_chambre: item.categorie_chambre,
      nom: item.nom,
      prix: item.prix,
      ville: item.ville,
    };

    currentData.hotel = item.nom;
    localStorage.setItem("selectedHotel", JSON.stringify(hotelData));

    if (destinationFilter) currentData.destination = destinationFilter;
    if (budgetFilter) currentData.budget = budgetFilter;

    localStorage.setItem("formData", JSON.stringify(currentData));
    navigate("/formulaire");
  };

  return (
    <div>
      <Header />

      <section className="px-8 py-20 mt-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Nos Hôtels
        </h1>

        {/* RECHERCHE */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setVisible(3);
              setSearchTerm("");
            }}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none cursor-pointer"
          >
            {pays.map((p) => (
              <option key={p.CODE} value={p.NOM}>
                {p.NOM}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisible(3);
            }}
            placeholder="Rechercher par nom, ville, pays..."
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none w-full md:w-64"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredData.length > 0 ? (
                filteredData.slice(0, visible).map((item, index) => (
                  <Card
                    key={`hotel-${item.id}-${index}`}
                    {...item}
                    showImage={true}
                    showPrice={true}
                    showReserve={true}
                    showStars={item.nb_etoiles > 0}
                    showCategorie={true}
                    onReserve={() => handleCardClick(item)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full py-10">
                  {data.length === 0
                    ? "Aucun hôtel disponible."
                    : "Aucun résultat ne correspond à vos critères."}
                </p>
              )}
            </div>

            {/* VOIR PLUS */}
            <div className="flex justify-center mt-8">
              {visible < filteredData.length ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {loadingMore ? "Chargement..." : `Voir plus ↓ (${visible}/${filteredData.length})`}
                </button>
              ) : (
                filteredData.length > 3 && (
                  <button
                    onClick={() => setVisible(3)}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold"
                  >
                    Voir moins ↑
                  </button>
                )
              )}
            </div>
          </>
        )}
      </section>

      <div className="flex justify-center my-8">
        <Retour />
      </div>

      <Contact />
      <Footer />
    </div>
  );
}