// AddButton.jsx
import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddButton = ({ onClick = () => {}, text = "Thêm", disabled = false }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      startIcon={<AddIcon fontSize="small" fontWeight="bold" />}
      sx={{
        height: "48px",
        textTransform: "none",
        backgroundColor: "#063F5C",
        borderRadius: 0,
        padding: "2px 12px",
        fontSize: "17px",
        fontWeight: "bold",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#072D4A",
          boxShadow: "none",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default AddButton;
