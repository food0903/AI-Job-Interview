import React, { useState } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ReactMediaRecorder } from "react-media-recorder";

function Homepage() {
  const [blobURL, setBlobURL] = useState(null);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-1/3 h-96 rounded-2xl drop-shadow-lg bg-slate-100 relative p-4">
        <Typography sx={{ fontWeight: "bold" }}>
          Question: Tell me about yourself
        </Typography>
        <TextField
          sx={{ width: "100%", mt: 1 }}
          id="response"
          label="Response"
          multiline
          rows={4}
          defaultValue="Default Value"
          inputProps={{ style: { fontSize: "0.8rem" } }}
        />

        <Pagination
          sx={{
            position: "absolute",
            bottom: 3,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
          count={5}
          renderItem={(item) => (
            <PaginationItem
              slots={{
                previous: ArrowBackIosNewIcon,
                next: ArrowForwardIosIcon,
              }}
              {...item}
            />
          )}
        />

        <div>
          <ReactMediaRecorder
            audio
            render={({
              status,
              startRecording,
              stopRecording,
              mediaBlobUrl,
            }) => (
              <div>
                <p>{status}</p>
                <button
                  onClick={
                    status === "recording" ? stopRecording : startRecording
                  }
                  className="mt-2 border-2 flex justify-center p-1 rounded-full"
                >
                  <KeyboardVoiceIcon />
                </button>

                <video src={mediaBlobUrl} controls autoPlay loop />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
