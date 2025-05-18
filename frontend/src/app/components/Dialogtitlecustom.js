import { DialogTitle, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogTitleCustom = ({ title, onClose }) => (
  <DialogTitle
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 2,
      fontSize: "18px",
      fontWeight: "bold",
    }}
  >
    <Box component="span">{title}</Box>

    {onClose && (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          color: "black",
        }}
      >
        <CloseIcon />
      </IconButton>
    )}
  </DialogTitle>
);

export default DialogTitleCustom;
