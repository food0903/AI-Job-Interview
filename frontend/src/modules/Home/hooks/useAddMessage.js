import axios from "axios";

export const useAddMessage = () => {
  const addMessage = async (uid, content, role, sid) => {
    try {
      await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/add_message`, { uid, content, role, sid });
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  };

  return { addMessage };
};
