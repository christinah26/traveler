import React, { useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
function header(){
    const animateCounter = useRef((id, target, duration) => {
        const element = document.getElementById(id);
        if (!element) return;
    
        let current = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = `${target}+`;
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(current).toString();
          }
        }, 16);
      }).current;
    
      useEffect(() => {
        animateCounter('nb_destinations', 150, 2000);
        animateCounter('nb_clients', 5000, 2000);
        animateCounter('nb_pays', 50, 2000);
      }, []);

    return(
      <header
        id="accueil"
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          src='/video/qualityVideo.mp4'
          aria-hidden="true"
        />
         <div className="absolute inset-0 bg-black/15 z-0"></div>

        
        <div className="relative z-10 w-full px-4 sm:px-8 text-center ">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight"> 
            IL EST TEMPS DE VOYAGER
          </h1>
          <p className="mb-8 mt-8 md:text-xl font-semibold">
            Bienvenue sur Traveler, votre portail vers des aventures inoubliables à
            travers le monde. Que vous rêviez de plages paradisiaques, de montagnes
            majestueuses ou de villes vibrantes, nous avons tout ce qu'il vous faut
            pour planifier le voyage parfait.
          </p>

          <a
            href="/home"
            className="inline-block bg-blue-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Commencer l'exploration"
          >
            Se connecter 

          </a>

        </div>
    
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-10 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold" id="nb_destinations">
              0
            </div>
            <div className="text-sm">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" id="nb_clients">
              0
            </div>
            <div className="text-sm">Clients Satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" id="nb_pays">
              0
            </div>
            <div className="text-sm">Pays</div>
          </div>
        </div>
      </header>
    )
}

export default header;
