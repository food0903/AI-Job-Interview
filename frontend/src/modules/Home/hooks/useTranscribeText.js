import axios from "axios";

export const useTranscribeText = () => {
  const transcribeText = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/transcribe_text`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data.text;
    } catch (error) {
      console.error("Error transcribing text:", error);
      throw error;
    }
  };

  return { transcribeText };
};
