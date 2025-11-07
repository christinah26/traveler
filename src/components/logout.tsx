import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LogoutUser from "../api/Logout";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import { useContext } from "react";

export default function Logout() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const context = useContext(AuthContext);

    const handleLogout = () => {
        Swal.fire({
            title: "Déconnexion",
            text: "Voulez-vous vraiment vous déconnecter ?",
            icon: "warning",
            iconColor: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, me déconnecter",
            cancelButtonText: "Annuler",
            reverseButtons: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            customClass: {
                popup: "custom-popup",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
            });
    
        const logout = async () => {
            // SOLUTION TEMPORAIRE : Clear manuellement
            localStorage.removeItem('token'); 
            localStorage.removeItem('refreshToken');
          
        
            Swal.fire({
                title: "Déconnecté avec succès!",
                icon: "success",
                iconColor: "#ffff",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    confirmButton: "custom-confirm-button",
                },
            }).then((result) => {
                navigate("/");
                window.location.reload();
            });
        };
    
        logout();
    };

    return <button onClick={handleLogout}>Déconnexion</button>;
}
