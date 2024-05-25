import axios from "axios";

export const useSetJobDescription = () => {
  const setJobDescriptionForUser = async (text, uid, sid) => {
    try {
      await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/set_job_description_for_user`, {
        text, uid, sid
      });
    } catch (error) {
      console.error("Error setting job description:", error);
      throw error;
    } finally {
    }
  };

  return { setJobDescriptionForUser};
};
