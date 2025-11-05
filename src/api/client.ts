import url from "./url";

export default async function clients(
    token: string,
    Total : number,
    active: number,
    NUM_RESERVATION: number,
    NUM_VOL: number,
    NUM_VOL_RETOURNER: number,
    NUM_CHAMBRE: number,
    ID_HOTEL: number,
    ID_CLIENT: number,
    CODE: string,
    DATE_RESERVATION: string,
    DEBUT_SEJOUR: string,
    DUREE_SEJOUR: number,
) {
    try { 
        const response = await fetch(url + "client", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                Total ,
                active,
                NUM_RESERVATION,
                NUM_VOL,
                NUM_VOL_RETOURNER ,
                NUM_CHAMBRE ,
                ID_HOTEL ,
                ID_CLIENT ,
                CODE,
                DATE_RESERVATION,
                DEBUT_SEJOUR,
                DUREE_SEJOUR,
            }),
        });
        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
