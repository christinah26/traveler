import {useState} from "react";
import Card from "../cards/Card";
import { Link } from "react-router-dom";

export default function SectionList({ title, sousTitre, data, buttonLink, buttonText, options = {} }) {
    const [visibleCount, setVisibleCount] = useState(3);

  const handleVoirPlus = () => {
    if (visibleCount < data.length) {
      setVisibleCount((prev) => prev + 3);
    } else {
      setVisibleCount(3);
    }
  };
    return (
    <section className="p-8 md:p-16 bg-gradient-to-b from-gray-300 to-white-500 text-center " id="section">
      <h2 className="text-3xl font-bold text-blue-900 ">{title}</h2>
        <p className="p-4  font-semibold text-center text-blue-900"> {sousTitre}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.slice(0,visibleCount).map((item, index) => (
          <Card
            key={index}
            nom={item.nom}
            image={item.image}
            desc={item.desc}
            pays={item.pays}
            ville={item.ville}
            categorie={item.categorie_chambre}
            prix={item.prix}
            etoiles={item.nb_etoiles}
            date={item.date}
            type={item.type}
            {...options}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleVoirPlus}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          {visibleCount < data.length ? "Voir plus ↓" : "Voir moins ↑"}
        </button>
        </div>

      {buttonLink && (
        <div className="mt-6">
            <Link
            to={buttonLink}
            className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            {buttonText}
            </Link>
        </div>
      )}
    </section>
  );
}

