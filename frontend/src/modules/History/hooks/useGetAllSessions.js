import { useState } from "react";
import axios from "axios";

export const useGetAllSessions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllSessions = async (uid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_all_sessions`, { uid });
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    return { getAllSessions, loading, error };
};
