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

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // localStorage
    const storedData = JSON.parse(localStorage.getItem("formData")) || {};
    const destinationFilter = storedData.destination || null;
    const budgetFilter = storedData.budget
        ? parseFloat(storedData.budget)
        : null;

    useEffect(() => {
        if (pageType !== "hotels" && pageType !== "compagnies") return;

        const fetchData = async () => {
            if (!navbar.isAuthenticated) {
                alert("Veuillez vous connecter");
                return;
            }

            setLoading(true);
            try {
                if (pageType === "hotels") {
                    const result = await getHotels(
                        token,
                        selectedCountry || "France"
                    );
                    if (result && result.hotels) {
                        setData(
                            result.hotels.map((h) => ({ ...h, type: "hotel" }))
                        );
                    } else {
                        setData([]);
                    }
                } else if (pageType === "compagnies") {
                    const result = await getAirlines(token);
                    // adapte selon le format : result.airlines ou result
                    if (result?.airlines) {
                        setData(
                            result.airlines.map((a) => ({
                                ...a,
                                type: "compagnie",
                            }))
                        );
                    } else if (Array.isArray(result)) {
                        setData(
                            result.map((a) => ({ ...a, type: "compagnie" }))
                        );
                    } else {
                        setData([]);
                    }
                }
            } catch (err) {
                console.error("Erreur fetch pages :", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pageType, token, selectedCountry]);

    // villes du pays choisi
    const villes = pays.find((p) => p.NOM === selectedCountry)?.VILLE || [];

    const filteredData = data.filter((item) => {
        let valid = true;

        if (pageType !== "hotels" && pageType !== "compagnies") {
            if (
                destinationFilter &&
                item.ville &&
                item.ville !== destinationFilter
            ) {
                valid = false;
            }
        }

        if (budgetFilter && item.prix && item.prix > budgetFilter) {
            valid = false;
        }

        if (selectedCity && item.ville) {
            valid =
                valid &&
                item.ville.toLowerCase() === selectedCity.toLowerCase();
        }

        if (searchTerm && item.nom) {
            valid =
                valid &&
                item.nom.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return valid;
    });

    const titles = {
        hotels: "Nos Hôtels",
        compagnies: "Nos Compagnies Aériennes",
    };

    const handleCardClick = (type, nom) => {
        const currentData = JSON.parse(localStorage.getItem("formData")) || {};

        if (type === "hotel") currentData.hotel = nom;
        if (type === "compagnie") currentData.compagnie = nom;

        if (destinationFilter) currentData.destination = destinationFilter;
        if (budgetFilter) currentData.budget = budgetFilter;

        localStorage.setItem("formData", JSON.stringify(currentData));

        navigate("/formulaire");
    };

    const [airlines, setAirlines] = useState(undefined);

    useEffect(() => {
        const fetchAirlines = async () => {
            const data = await getAirlines(token);
            setAirlines(data);
            console.log("====================================");
            console.log(data);
            console.log("====================================");
        };
        fetchAirlines();
    }, []);

    console.log(filteredData);
    return (
        <div>
            <Header />

            <section className="px-8 py-20 mt-10">
                <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                    {titles[pageType] || "Liste"}
                </h1>

                {/* --- BARRE DE RECHERCHE PAYS/VILLE --- */}
                {(pageType === "hotels" || pageType === "compagnies") && (
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                        >
                            <option value="">-- Toutes les villes --</option>
                            {pays
                                .flatMap((p) =>
                                    Array.isArray(p.VILLE) ? p.VILLE : [p.VILLE]
                                )
                                .sort((a, b) => a.localeCompare(b))
                                .map((v, i) => (
                                    <option key={i} value={v}>
                                        {v}
                                    </option>
                                ))}
                        </select>

                        {/* Champ de recherche */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un nom..."
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none w-full md:w-64"
                        />
                    </div>
                )}

                {/* --- CARTES --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredData.length > 0 ? (
                        filteredData
                            .slice(0, visible)
                            .map((item) => (
                                <Card
                                    key={item.id}
                                    {...item}
                                    showImage={!!item.image}
                                    showPrice={!!item.prix}
                                    showReserve
                                    showStars={!!item.nb_etoiles}
                                    showDate={!!item.date}
                                    onReserve={() =>
                                        handleCardClick(item.type, item.nom)
                                    }
                                />
                            ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">
                            Aucun résultat ne correspond à vos critères.
                        </p>
                    )}
                </div>

                {/* --- BOUTONS --- */}
                <div className="flex justify-center mt-6">
                    {visible < filteredData.length ? (
                        <button
                            onClick={() => setVisible(visible + 3)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Voir plus ↓
                        </button>
                    ) : (
                        filteredData.length > 3 && (
                            <button
                                onClick={() => setVisible(3)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                Voir moins ↑
                            </button>
                        )
                    )}
                </div>
            </section>

            <div className="flex justify-center">
                <Retour />
            </div>

            <Contact />
            <Footer />
        </div>
    );
}
