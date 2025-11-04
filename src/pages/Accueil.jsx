import React, { useState, useEffect } from "react";  // AJOUTÉ
import Navbar from "../Top/navbar.jsx";
import Footer from "../Top/footer";
import Header from "../Top/header.jsx";
import SectionList from "../Section/SectionList.jsx";
import Contact from "../Section/contact.jsx";
import FadeIn from "../components/fadeIn.jsx";
import AvisSection from "../Section/AvisSection.jsx";
import HotelData from "../Data/HotelData.jsx"; 
import AirlineData from "../Data/aeroData.jsx";
function Accueil() {
    

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
                            data={HotelData}
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
                            data={AirlineData}
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