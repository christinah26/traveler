import React, { useEffect } from "react";
import Swal from "sweetalert2";
// @ts-ignore
import Logo from "../assets/traveler-nobg.png";
import { useLocation, useNavigate } from "react-router-dom";
// import './popup.css';
// import { Result } from "postcss";

const Popup: React.FC<{ token: string }> = ({ token }: { token: string }) => {
    const navigate = useNavigate();
    const handleRetour = () => {
        Swal.fire({
            title: "Voulez-vous vraiment quitter cette page ?",
            icon: "question",
            iconColor: "#fff",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: "custom-popup",
                title: "custom-title",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
            } else if (result.dismiss === "cancel") {
                showPopup();
            }
        });
    };

    const showPopup = () => {
        Swal.fire({
            title: "Bienvenu(e) sur Traveler!",
            text: "Veuillez vous connecter pour continuer.",
            imageUrl: Logo,
            imageWidth: 200,
            imageHeight: 60,
            imageAlt: "Logo Traveler",
            showCancelButton: true,
            confirmButtonText: "Se connecter",
            cancelButtonText: "Quitter le site",
            allowOutsideClick: false,
            allowEscapeKey: false,
            reverseButtons: true,
            customClass: {
                popup: "custom-popup",
                title: "custom-title",
                image: "custom-image",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("../login");
            } else if (result.dismiss === "cancel") {
                handleRetour();
            }
        });
    };

    const location = useLocation();

    // "censer" empêcher le pop up de revenir après connexion
    useEffect(() => {
        if (
            !token &&
            //  location.pathname !== "/login" &&
            //  location.pathname !== "/signin"
            location.pathname === "/home"
        ) {
            showPopup();
        }
    }, [location.pathname, token]);

    return null;
};

export default Popup;
