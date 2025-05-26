import React from "react";
import { Button } from "@mui/material";

const SomeActionButton = ({ text, onClick }) => (
  <Button
    variant="contained"
    onClick={onClick}
    sx={{
      bgcolor: "#063F5C",
      width: "100px",
      textTransform: "none",
      height: "40px",
      fontSize: "16px",
      "&:hover": {
        bgcolor: "#052f45",
      },
    }}
  >
    {text}
  </Button>
);

export default SomeActionButton;
