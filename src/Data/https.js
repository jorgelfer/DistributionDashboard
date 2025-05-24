export async function fetchOpenDSSData(dataURL) {
  const response = await fetch(dataURL);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
}

export async function fetchSchedulingData(payload) {
  const response = await fetch("http://127.0.0.1:8000/es/solve", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const responseData = await response.json();
  return responseData;
}

export async function fetchFBSData(payload) {
  const response = await fetch("http://127.0.0.1:8000/es/qsts", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const responseData = await response.json();
  return responseData;
}
