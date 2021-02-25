// const cache = new Map(); // stale-while-revalidate

export const request = async (
  url,
  method = "GET",
  body = null,
  headers = {},
  contentType = "application/json"
) => {
  try {
    headers["Content-Type"] = contentType;

    // if (body) {
    //   body = JSON.stringify(body);
    // }
    // if (type === "folder") {
    // } else {
    // headers["Content-type"] =
    // "multipart/form-data";
    
    // }
    const response = await fetch(url, { method, body, headers });
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
