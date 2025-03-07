import api from './api';

export const searchPetByMicrochip = async (microchipNo) => {
    try {
        // Make the request without the Authorization header
        const response = await api.get(`api/search/${microchipNo}/`, {
            headers: {
                Authorization: undefined, // Ensure no Authorization header is sent
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { error: 'No pet with that number found' }; // Match the exact error message
        }
        throw error;
    }
};