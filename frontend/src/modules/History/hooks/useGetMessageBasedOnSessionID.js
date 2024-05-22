import { useState } from "react";
import axios from "axios";

export const useGetMessageBasedOnSessionID = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMessageBasedOnSessionID = async (sid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_sid_details`, { sid });
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    return { getMessageBasedOnSessionID, loading, error };
};
