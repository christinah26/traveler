import Navbar from "../Top/navbar.jsx";
import Footer from "../Top/footer";
import Header from "../Top/header.jsx";
import SectionList from "../Section/SectionList.jsx";
import destinationsData from "../Data/DestinationData.jsx";
import aeroData from "../Data/aeroData.jsx";
import hotelsData from "../Data/HotelData.jsx";
import ChambreData from "../Data/ChambreData.jsx";
import Contact from "../Section/contact.jsx";
import FadeIn from "../components/fadeIn.jsx";
import AvisSection from "../Section/AvisSection.jsx";


function Accueil() {
    return (
        <>
            <Navbar/>
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <FadeIn>
                    <Header />
                </FadeIn>

                <main className="flex-grow">

                    <FadeIn>
                        {/* Hotels */}
                        <SectionList
                            title="Hôtels Recommandés"
                            sousTitre="Trouvez les meilleurs hébergements pour un séjour inoubliable"
                            data={hotelsData}
                            buttonLink="/pages/hotels"
                            buttonText="Découvrir tous nos hôtels"
                            options={{
                                showStars: true,
                                showImage: true,
                                showPrice: true,
                                showReserve: true,
                            }}
                        />
                    </FadeIn>

                    <FadeIn>
                        {/* Compagnies aériennes */}
                        <SectionList
                            title="Nos Compagnies Aériennes"
                            sousTitre="Voyagez en toute sérénité avec nos partenaires de confiance"
                            data={aeroData}
                            buttonLink="/pages/compagnies"
                            buttonText="Voir toutes les compagnies"
                            options={{
                                showStars: true,
                                showImage: true,
                                showPrice: false,
                                showReserve: true,
                            }}
                        />
                    </FadeIn>

                    <FadeIn>
                        {/* Avis Section */}
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
