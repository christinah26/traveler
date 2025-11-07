import url from "./url";

export default async function clients(token: string, id_client: number) {
  try {
    const response = await fetch(url + "client", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify({
        id_client,
      }),
    });
    
    const data = await response.json()
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}