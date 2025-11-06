
// ====== Fichier : api/rating.ts (AMÉLIORÉ) ======
import url from "./url";

export interface RatingPayload {
    num_reservation: number;
    note_hotel: number;
    avis_hotel: string;
    note_compagnie_aerienne_aller: number;
    avis_compagnie_aerienne_aller: string;
    note_compagnie_aerienne_retour: number;
    avis_compagnie_aerienne_retour: string;
    // Champs optionnels pour plus de contexte
    num_chambre?: number;
    date_reservation?: string;
    hotel_nom?: string;
    destination?: string;
}

export default async function rating(
    token: string,
    userRating: RatingPayload
) {
    try {
        // Envoie les données exactement comme le backend les attend
        const minimumPayload = {
            num_reservation: Number(userRating.num_reservation) || 0,
            note_hotel: Number(userRating.note_hotel) || 0,
            avis_hotel: String(userRating.avis_hotel).trim() || "",
            note_compagnie_aerienne_aller: Number(userRating.note_compagnie_aerienne_aller) || 0,
            avis_compagnie_aerienne_aller: String(userRating.avis_compagnie_aerienne_aller).trim() || "",
            note_compagnie_aerienne_retour: Number(userRating.note_compagnie_aerienne_retour) || 0,
            avis_compagnie_aerienne_retour: String(userRating.avis_compagnie_aerienne_retour).trim() || "",
        };

        console.log("📤 Données envoyées à l'API rating:");
        console.log(JSON.stringify(minimumPayload, null, 2));
        console.log("🔑 Token utilisé:", token?.substring(0, 30) + "...");
        console.log("📋 Types vérifiés:");
        console.log("  - num_reservation:", typeof minimumPayload.num_reservation, minimumPayload.num_reservation);
        console.log("  - note_hotel:", typeof minimumPayload.note_hotel, minimumPayload.note_hotel);
        console.log("  - avis_hotel:", typeof minimumPayload.avis_hotel, "longueur:", minimumPayload.avis_hotel.length);
        console.log("  - note_compagnie_aerienne_aller:", typeof minimumPayload.note_compagnie_aerienne_aller, minimumPayload.note_compagnie_aerienne_aller);
        console.log("  - avis_compagnie_aerienne_aller:", typeof minimumPayload.avis_compagnie_aerienne_aller, "longueur:", minimumPayload.avis_compagnie_aerienne_aller.length);
        console.log("  - note_compagnie_aerienne_retour:", typeof minimumPayload.note_compagnie_aerienne_retour, minimumPayload.note_compagnie_aerienne_retour);
        console.log("  - avis_compagnie_aerienne_retour:", typeof minimumPayload.avis_compagnie_aerienne_retour, "longueur:", minimumPayload.avis_compagnie_aerienne_retour.length);

        const response = await fetch(url + "rating", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify(minimumPayload),
        });

        console.log("📊 Statut réponse:", response.status, response.statusText);
        console.log("📊 Type réponse:", response.headers.get("content-type"));
        console.log("📊 URL appelée:", url + "rating");

        if (!response.ok) {
            let errorText = "";
            try {
                errorText = await response.text();
                console.error("❌ Erreur API:", response.status);
                console.error("📋 Corps erreur:", errorText);
                console.error("📋 URL:", response.url);
                console.error("📋 Payload envoyé:", JSON.stringify(minimumPayload, null, 2));
            } catch (e) {
                errorText = "Impossible de lire la réponse d'erreur";
            }
            
            return {
                success: false,
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                url: response.url,
                payload: minimumPayload,
            };
        }

        const data = await response.json();
        console.log("✅ Réponse API rating:", data);

        return data;
    } catch (err) {
        console.error("❌ Erreur fetch rating:", err);
        console.error("❌ Stack trace:", err instanceof Error ? err.stack : "");
        return {
            success: false,
            error: err instanceof Error ? err.message : "Erreur inconnue",
        };
    }
}