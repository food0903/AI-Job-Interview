import axios from "axios";

export const useFetchResponse = () => {
  const fetchResponse = async (sid) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/fetch_response`, { sid });
      return response.data;
    } catch (error) {
      console.error("Error fetching response:", error);
      throw error;
    }
  };

  return { fetchResponse };
};
    