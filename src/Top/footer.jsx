import React from 'react';

function footer(){
    return(
        <>
        <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl font-bold mb-4">Autres Contacts</h3>
            <p>Email : <a href="mailto:contact@monagence.com" className="text-blue-400 hover:underline">contact@monagence.com</a></p>
            <p>Téléphone : <a href="tel:+261123456789" className="text-blue-400 hover:underline">+261 12 345 6789</a></p>
            <p>Adresse : 123 Rue Exemple, Fianarantsoa</p>
            <div className="mt-8 border-t border-gray-700 pt-4 text-gray-500 text-sm">
                &copy; 2025 Mon Agence. Tous droits réservés.
            </div>
        </div>
    </footer>
        </>
    )
}

export default footer;