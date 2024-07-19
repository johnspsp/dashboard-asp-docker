import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/salesentry`;

export const getSalesEntry = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching SalesEntry entry:', error);
        throw error;
    }
};

export const getSalesEntryEntryById = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching SalesEntry with ID ${id}:`, error);
        throw error;
    }
};

export const createSalesEntry = async (SalesEntry: any) => {
    try {
        const response = await axios.post(BASE_URL, SalesEntry);
        return response.data;
    } catch (error) {
        console.error('Error creating SalesEntry:', error);
        throw error;
    }
};

export const updateSalesEntry = async (
    id: number,
    updatedData: Partial<SalesEntry>
) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating SalesEntry entry with ID ${id}:`, error);
        throw error;
    }
};

export const deleteSalesEntry = async (id: number) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting SalesEntry entry with ID ${id}:`, error);
        throw error;
    }
};


interface SalesEntry {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    ip_address: string;
}