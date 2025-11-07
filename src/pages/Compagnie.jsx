import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Top/footer.jsx";
import Card from "../cards/Card.jsx";
import Contact from "../Section/contact.jsx";
import Retour from "../components/retour.tsx";
import { useAuth } from "../contexts/AuthContext.js";
import getAirlines from "../api/Airlines.ts";
import { NavbarContext } from "../contexts/NavbarContext.tsx";
import Header from "../Top/navbar.jsx";

export default function AirlinesPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const navbar = useContext(NavbarContext);

  const [visible, setVisible] = useState(3);
  const [selectedCountry, setSelectedCountry] = useState("France");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  const storedData = JSON.parse(localStorage.getItem("formData")) || {};
  const budgetFilter = storedData.budget ? parseFloat(storedData.budget) : null;
  const volType = storedData.volType;

  const mapAirlineData = (airline, index) => {
    const VRAI_ID_VOL = airline.num_vol || airline.id_vol || airline.id || `erreur_${index}`;

    return {
      id: VRAI_ID_VOL,
      num_vol: VRAI_ID_VOL,
      num_vol_retourner: 0,
      nom: airline.nom || "Sans nom",
      image: airline.logo || airline.image || "",
      desc: airline.description || airline.desc || "",
      pays: airline.pays || "",
      ville: airline.ville || "",
      prix: airline.prix || "",
      nb_etoiles: airline.nb_etoiles || airline.rating || 0,
      type: "compagnie",
    };
  };

  useEffect(() => {
    const fetchAirlines = async () => {
      if (!navbar.isAuthenticated) {
        alert("Veuillez vous connecter");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const result = await getAirlines(token, selectedCountry);

        let airlinesArray = [];
        if (result?.airlines) airlinesArray = result.airlines;
        else if (Array.isArray(result)) airlinesArray = result;
        else if (result?.data) airlinesArray = result.data;

        const mapped = airlinesArray.map((airline, index) => mapAirlineData(airline, index));
        setData(mapped);
        setVisible(3);
      } catch (err) {
        console.error(" Erreur:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAirlines();
  }, [selectedCountry, token, navbar.isAuthenticated, navigate]);


  const filteredData = data.filter((item) => {
    let valid = true;

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

    const flightData = {
      num_vol: item.num_vol || item.id,
      num_vol_retourner: item.num_vol_retourner || 0,
      id_vol: item.id_vol || item.id || item.num_vol,
      nom: item.nom,
      compagnie: item.nom,
      ville: item.ville,
      prix: item.prix,
    };

    if (volType === "aller") {
      localStorage.setItem("selectedVolAller", JSON.stringify(flightData));
      currentData.volAller = item.nom;
    } else if (volType === "retour") {
      localStorage.setItem("selectedVolRetour", JSON.stringify(flightData));
      currentData.volRetour = item.nom;
    } else {
      localStorage.setItem("selectedFlight", JSON.stringify(flightData));
      currentData.compagnie = item.nom;
    }

    if (budgetFilter) currentData.budget = budgetFilter;

    localStorage.setItem("formData", JSON.stringify(currentData));
    navigate("/formulaire");
  };

  return (
    <div>
      <Header />

      <section className="px-8 py-20 mt-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Nos Compagnies Aériennes
        </h1>

        {/* RECHERCHE */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisible(3);
            }}
            placeholder="Rechercher une compagnie..."
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none w-full md:w-96"
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
                    key={`airline-${item.id}-${index}`}
                    {...item}
                    showImage={true}
                    showPrice={true}
                    showReserve={true}
                    showStars={item.nb_etoiles > 0}
                    showCategorie={false}
                    onReserve={() => handleCardClick(item)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full py-10">
                  {data.length === 0
                    ? "Aucune compagnie disponible."
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