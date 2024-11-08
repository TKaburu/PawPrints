import api from './api';

export const searchPetByMicrochip = async (microchipNo) => {
    try {
        const response = await api.get(`api/search/${microchipNo}/`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { error: 'No pet with this microchip number found.' };
        }
        throw error;
    }
};

export const fetchVetClinics = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/pets/vet-clinics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching vet clinics:', error);
      throw error;
    }
  };