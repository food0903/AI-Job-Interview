import { Modal, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function ShowJobDescriptionModal({ jobDescription, open, handleClose }) {
    return (<Modal
        open={open}
        onClose={handleClose}
        sx={{justifyContent: "center", alignItems: "center", display: "flex"}}
    >
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: "10px", maxWidth: 0.75, maxHeight: 0.75, outline: 'none', display: "flex", flexDirection: "column" }}>
            <Box className="flex flex-row items-center w-full">
            <IconButton size="sm"  onClick={handleClose} sx={{ borderRadius: "20px", color: "black", marginLeft: "auto" }}><CloseIcon /></IconButton>
            </Box>
            <Typography className="font-nunito" id="modal-modal-title" variant="body" component="h2">
                {jobDescription.trimStart().split('\n').map((line) => (
                    <>
                        {line}
                        <br />
                    </>))}
            </Typography>
        </Box>
    </Modal>)
}