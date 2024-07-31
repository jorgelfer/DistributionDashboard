export async function actualFetchData(dataURL) {

    const response = await fetch(dataURL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('An error occurred while fetching the data');
    }

    return data;
};

export async function actualPostData(data) {

    const response = await fetch('http:/http://127.0.0.1:5000/qsts/', {
        method: 'POST',
        body: JSON.stringify(data),
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