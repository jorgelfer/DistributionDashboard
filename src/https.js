export async function actualFetchData(dataURL) {

    const response = await fetch(dataURL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('An error occurred while fetching the data');
    }

    return data;
};