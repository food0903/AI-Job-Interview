import axios from "axios";

export const useTextToSpeech = () => {
  const textToSpeech = async (text) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/text_to_speech`, { text }, { responseType: 'arraybuffer' });
      return response.data;
    } catch (error) {
      console.error("Error with text to speech:", error);
      throw error;
    }
  };

  return { textToSpeech };
};
