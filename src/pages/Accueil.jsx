import React, { useState, useEffect } from "react";  // AJOUTÉ
import Navbar from "../Top/navbar.jsx";
import Footer from "../Top/footer";
import Header from "../Top/header.jsx";
import SectionList from "../Section/SectionList.jsx";
import Contact from "../Section/contact.jsx";
import FadeIn from "../components/fadeIn.jsx";
import AvisSection from "../Section/AvisSection.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import getHotels from "../api/Hotels.ts"; 
import getAirlines from "../api/Airlines.ts"

function Accueil() {
    const { token } = useAuth();
    const [recommendedHotels, setRecommendedHotels] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [loadingHotels, setLoadingHotels] = useState(true);
    const [loadingAirlines, setLoadingAirlines] = useState(true);
  

    useEffect(() => {
        if (!token) {
            setLoadingHotels(false);
            setLoadingAirlines(false);
            return;
          }
      
          const loadHotels = async () => {
            setLoadingHotels(true);
            try {
                const data = await getHotels(token, "Tous");
                if (data?.hotels && Array.isArray(data.hotels)) {
                const hotelsWithType = data.hotels.slice(0, 6).map(h => ({ ...h, type: "hotel" }));
                setRecommendedHotels(hotelsWithType);
                } else {
                setRecommendedHotels([]);
                console.log("hotels : format inattendu", data);
                }
            } catch (e) {
                console.error("Erreur API hôtels :", e);
                setRecommendedHotels([]);
            } finally {
                setLoadingHotels(false);
            }
        };

        const loadAirlines = async () => {
            setLoadingAirlines(true);
            try {
              const data = await getAirlines(token);
              // adapte selon le format réel : data.airlines ou data
              if (data?.airlines && Array.isArray(data.airlines)) {
                const a = data.airlines.map(a => ({ ...a, type: "compagnie" }));
                setAirlines(a);
              } else if (Array.isArray(data)) {
                setAirlines(data.map(a => ({ ...a, type: "compagnie" })));
              } else {
                setAirlines([]);
                console.log("airlines : format inattendu", data);
              }
            } catch (e) {
              console.error("Erreur getAirlines :", e);
              setAirlines([]);
            } finally {
              setLoadingAirlines(false);
            }
          };
      
          loadHotels();
          loadAirlines();
        }, [token]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <FadeIn>
                    <Header />
                </FadeIn>

                <main className="flex-grow">

                    <FadeIn>
                        {/* Hôtels Recommandés */}
                        <SectionList
                            title="Hôtels Recommandés"
                            sousTitre="Les meilleurs choix pour votre séjour"
                            data={loadingHotels ? [] : recommendedHotels}
                            buttonLink="/pages/hotels"
                            buttonText="Voir tous les hôtels"
                            options={{
                                showImage: true,
                                showPrice: true,
                                showReserve: true,
                                showStars: true,
                                showCategorie: true,
                            }}
                        />
                    </FadeIn>

                    <FadeIn>
                        {/* Compagnies aériennes */}
                        <SectionList
                            title="Nos Compagnies Aériennes"
                            sousTitre="Voyagez en toute sérénité avec nos partenaires de confiance"
                            data={loadingAirlines ? [] : airlines}
                            buttonLink="/pages/compagnies"
                            buttonText="Voir toutes les compagnies"
                            options={{
                                showStars: true,
                                showImage: true,
                                showPrice: false,
                                showReserve: true,
                                showCategorie: false,
                            }}
                        />
                    </FadeIn>

                    <FadeIn>
                        <AvisSection />
                    </FadeIn>

                    <FadeIn>
                        <Contact />
                    </FadeIn>
                </main>

                <Footer />
            </div>
        </>
    );
}

export default Accueil;