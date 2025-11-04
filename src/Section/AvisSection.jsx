import React, { useState } from "react";
import SectionList from "./SectionList";
import AvisHotels from "../Data/AvisHotel";
import AvisVol from "../Data/AvisCompagnie";
import { Hotel, Plane } from "lucide-react";


function AvisSection(){
    const [activeButton, setActiveButton] = useState("hotel");
    const AvisCompagnie = AvisVol;
    const AvisHotel = AvisHotels;

    const data = activeButton === "hotel" ? AvisHotel : AvisCompagnie;

    return(

          <div className="bg-gray-300  mx-auto px-4">
        

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 pt-4">
            Avis des Clients
          </h2>
          <p className="text-gray-600 text-lg">
            Découvrez ce que nos voyageurs pensent de nos services
          </p>
        </div>

    
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveButton("hotel")}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${
              activeButton === "hotel"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Hotel className="w-5 h-5" />
            Avis Hôtels
          </button>

          <button
            onClick={() => setActiveButton("compagnie")}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 ${
              activeButton === "compagnie"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Plane className="w-5 h-5" />
            Avis Compagnies Aériennes
          </button>
        </div>

        <SectionList
          title={
            activeButton === "hotel"
              ? " les Hôtels"
              : " les Compagnies Aériennes"
          }
          sousTitre={
            activeButton === "hotel"
              ? "Les retours de nos clients sur nos hôtels partenaires"
              : "Les retours de nos passagers sur nos compagnies partenaires"
          }
          data={data}
          buttonLink="/login"
          buttonText="Donner votre avis ★"
          options={{ showStars: true, showDate: true }}
       
        />
         </div>
    )
}

export default AvisSection;
