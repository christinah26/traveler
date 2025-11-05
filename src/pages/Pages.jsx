import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Top/footer.jsx";
import Card from "../cards/Card.jsx";
import Contact from "../Section/contact.jsx";
import Retour from "../components/retour.tsx";
import pays from "../Data/pays.json";
import { useAuth } from "../contexts/AuthContext.js";
import getHotels from "../api/Hotels.ts";
import getAirlines from "../api/Airlines.ts";
import { NavbarContext } from "../contexts/NavbarContext.tsx";
import Header from "../Top/navbar.jsx";



export default function Pages() {
    const { pageType } = useParams();
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const navbar = useContext(NavbarContext);

    const [visible, setVisible] = useState(3);
    const [selectedCountry, setSelectedCountry] = useState("France");
    const [searchTerm, setSearchTerm] = useState("");

    const storedData = JSON.parse(localStorage.getItem("formData")) || {};
    const destinationFilter = storedData.destination || null;
    const budgetFilter = storedData.budget ? parseFloat(storedData.budget) : null;
    const volType = storedData.volType; 
    const paysDepart = storedData.paysDepart;
    const paysArrivee = storedData.paysArrivee;

    
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
            categorie_chambre: hotel.categorie_chambre  || "",
            prix: hotel.prix || 0,
            nb_etoiles: hotel.nb_etoile || hotel.nb_etoiles|| 0,
            type: "hotel", 
        };
    };

    const mapAirlineData = (airline, index) => {
     
        const nameHash = airline.nom.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a; 
        }, 0);
        
        const stableId = Math.abs(nameHash) || (index + 1);
        
        return {
            id: `airline_${index}`,
            num_vol: stableId,
            num_vol_retourner: 0,
            nom: airline.nom || "Sans nom",
            image: airline.logo || airline.image || "",
            desc: airline.description || airline.desc || "",
            pays: airline.pays || "",
            ville: airline.ville || "",
            date: airline.date || "",
            prix: airline.prix || "",
            nb_etoiles: airline.nb_etoiles || airline.rating || 0,
            type: "compagnie", 
        };
    };

    
    useEffect(() => {
        if (pageType !== "hotels" && pageType !== "compagnies") return;

        const fetchData = async () => {
            if (!navbar.isAuthenticated) {
                alert("Veuillez vous connecter");
                navigate("/login");
                return;
            }

            setLoading(true);
            try {
                if (pageType === "hotels") {
                    console.log(" Fetching hotels pour:", selectedCountry);
                    const result = await getHotels(token, selectedCountry || "France");
                    console.log(" Hotels bruts:", result);

                    let hotelsArray = [];
                    if (result?.hotels) hotelsArray = result.hotels;
                    else if (Array.isArray(result)) hotelsArray = result;
                    else if (result?.data) hotelsArray = result.data;

                    const mapped = hotelsArray.map((hotel, index) => mapHotelData(hotel, index));
                    console.log(" Hotels mappés:", mapped);
                    setData(mapped);

                } else if (pageType === "compagnies") {
                    console.log("Fetching airlines");
                    const result = await getAirlines(token , selectedCountry);
                    console.log(" Airlines brutes:", result);
                    
                 
                    if (Array.isArray(result) && result[0]) {
                        console.log("🔍 Première airline (détail):", result[0]);
                        console.log("🔍 Clés de la première airline:", Object.keys(result[0]));
                        console.log("🔍 Valeurs:", JSON.stringify(result[0], null, 2));
                        console.log("🔍 Entrée complète:", result[0]);
                    } else if (result?.airlines && result.airlines[0]) {
                        console.log("🔍 Première airline (détail):", result.airlines[0]);
                        console.log("🔍 Clés de la première airline:", Object.keys(result.airlines[0]));
                        console.log("🔍 Valeurs:", JSON.stringify(result.airlines[0], null, 2));
                        console.log("🔍 Entrée complète:", result.airlines[0]);
                    }
                    
                  
                    console.log("🔍 Premiers 5 airlines:", result.slice ? result.slice(0, 5) : result?.airlines?.slice(0, 5));
                    
                    let airlinesArray = [];
                    if (result?.airlines) airlinesArray = result.airlines;
                    else if (Array.isArray(result)) airlinesArray = result;
                    else if (result?.data) airlinesArray = result.data;

                    const mapped = airlinesArray.map((airline, index) => mapAirlineData(airline, index));
                    console.log(" Airlines mappées:", mapped);
                    setData(mapped);
                }
            } catch (err) {
                console.error("Erreur:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pageType, token, selectedCountry, navbar.isAuthenticated, navigate]);

   
    const filteredData = data.filter((item) => {
        let valid = true;

        if (destinationFilter && item.ville && item.ville !== destinationFilter) {
            valid = false;
        }

        if (budgetFilter && item.prix && item.prix > budgetFilter) {
            valid = false;
        }

        if (searchTerm && item.nom) {
            valid = valid && item.nom.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return valid;
    });

    const titles = {
        hotels: "Nos Hôtels",
        compagnies: "Nos Compagnies Aériennes",
    };

  
    const handleCardClick = (item) => {
        console.log("====== 🖱️ CLICK SUR CARTE ======");
        console.log("🖱️ Item cliqué COMPLET:", item);
        console.log("📊 Type de l'item:", item.type);
        console.log("📊 volType:", volType);
        
        const currentData = JSON.parse(localStorage.getItem("formData")) || {};

        if (item.type === "hotel") {
            console.log("🏨 Type = hotel détecté");
            
            const hotelData = {
                num_chambre: item.num_chambre || item.id,
                id_hotel: item.id_hotel || item.id || item.num_chambre,
                categorie_chambre: item.categorie_chambre,
                nom: item.nom,
                prix: item.prix,
                ville: item.ville
            };
            
            console.log("💾 Sauvegarde hôtel:", hotelData);
            currentData.hotel = item.nom;
            localStorage.setItem("selectedHotel", JSON.stringify(hotelData));
        }

        if (item.type === "compagnie") {
            console.log("✈️ Type = compagnie détecté");
            console.log("📊 volType pour déterminer aller/retour:", volType);
            
            const flightData = {
                num_vol: item.num_vol || item.id,
                num_vol_retourner: item.num_vol_retourner || 0,
                id_vol: item.id_vol || item.id || item.num_vol,
                nom: item.nom,
                compagnie: item.nom,
                ville: item.ville,
                prix: item.prix
            };
            
            
            if (volType === "aller") {
                console.log("💾 Sauvegarde vol ALLER:", flightData);
                localStorage.setItem("selectedVolAller", JSON.stringify(flightData));
                currentData.volAller = item.nom;
            } else if (volType === "retour") {
                console.log("💾 Sauvegarde vol RETOUR:", flightData);
                localStorage.setItem("selectedVolRetour", JSON.stringify(flightData));
                currentData.volRetour = item.nom;
            } else {
               
                console.log("💾 Sauvegarde vol (legacy):", flightData);
                localStorage.setItem("selectedFlight", JSON.stringify(flightData));
                currentData.compagnie = item.nom;
            }
        }
        
        if (destinationFilter) currentData.destination = destinationFilter;
        if (budgetFilter) currentData.budget = budgetFilter;

        localStorage.setItem("formData", JSON.stringify(currentData));
        console.log("✅ Données sauvegardées dans localStorage");
        navigate("/formulaire");
    };

    return (
        <div>
            <Header />

            <section className="px-8 py-20 mt-10">
                <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                    {titles[pageType] || "Liste"}
                </h1>

                {/* RECHERCHE */}
                {(pageType === "hotels" || pageType === "compagnies") && (
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
                        {pageType === "hotels" && (
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                            >
                                {pays.map((p) => (
                                    <option key={p.CODE} value={p.NOM}>
                                        {p.NOM}
                                    </option>
                                ))}
                            </select>
                        )}
                         {pageType === "compagnies" && (
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                            >
                                {pays.map((p) => (
                                    <option key={p.CODE} value={p.NOM}>
                                        {p.NOM}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher..."
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none w-full md:w-64"
                        />
                    </div>
                )}

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
                                filteredData.slice(0, visible).map((item) => (
                                    <Card
                                        key={item.id}
                                        {...item}
                                        showImage={true}
                                        showPrice={true}
                                        showReserve={true}
                                        showStars={item.nb_etoiles > 0}
                                        showCategorie={pageType === "hotels"}
                                        onReserve={() => handleCardClick(item)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-600 col-span-full py-10">
                                    {data.length === 0 
                                        ? "Aucune donnée disponible."
                                        : "Aucun résultat."}
                                </p>
                            )}
                        </div>

                        {/* VOIR PLUS */}
                        <div className="flex justify-center mt-8">
                            {visible < filteredData.length ? (
                                <button
                                    onClick={() => setVisible(visible + 3)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Voir plus ↓
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