export const request = async (
  url,
  method = "GET",
  body = null,
  headers = {}
) => {
  try {
    if (body){
      body = JSON.stringify(body);
      headers['Content-type'] = "application/json";
    }
    const response = await fetch(url, {method, body, headers} );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Request failed. Reason: ${error}`);
    throw error;
  }
};
