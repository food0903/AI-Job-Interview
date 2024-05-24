import { useState } from "react";
import axios from "axios";

export const useClearResponses = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearResponses = async (uid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_PUBLIC_API_URL}/delete_sessions/${uid}`);
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);  
        }
    };

    return { clearResponses, loading, error };
};
