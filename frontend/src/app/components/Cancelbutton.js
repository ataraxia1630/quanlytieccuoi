import { Button } from "@mui/material";

const CancelButton = ({ textCancel, onClick }) => (
  <Button
    onClick={onClick}
    variant="outlined"
    sx={{
      width: "100px",
      height: "40px",
      borderColor: "#063F5C",
      textTransform: "none",
      color: "black",
      fontSize: "16px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      "&:hover": {
        borderColor: "#063F5C",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
      },
    }}
  >
    {textCancel}
  </Button>
);

export default CancelButton;
