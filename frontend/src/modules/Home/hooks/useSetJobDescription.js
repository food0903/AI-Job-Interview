import axios from "axios";
import { useState } from "react";

export const useSetJobDescription = () => {
  const [loading, setLoading] = useState(false);
  const setJobDescriptionForUser = async (text, uid, sid) => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/set_job_description_for_user`, {
        text, uid, sid
      });
    } catch (error) {
      console.error("Error setting job description:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { setJobDescriptionForUser, loading };
};
