import { useState } from "react";
import axios from "axios";

export const useGenerateFeedback = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateFeedback = async (sid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_feedback_from_session`, { sid });
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
            setLoading(false);
            throw error;
        } finally{
            setLoading(false);
        }
    };

    return { generateFeedback, loading, error };
};
