export async function fetchQstsData(dataURL) {

    const response = await fetch(dataURL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('An error occurred while fetching the data');
    }

    return data;
};

export async function fetchSchedulingData(payload) {

    const response = await fetch('http://127.0.0.1:8000/es/solve', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Failed to post the data');
    }

    return responseData;
};