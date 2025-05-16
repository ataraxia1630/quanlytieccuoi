import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddButton = ({ onClick = () => {}, text = "Thêm", disabled = false }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      startIcon={<AddIcon fontWeight="bold" />}
      sx={{
        height: "45px",
        textTransform: "none",
        backgroundColor: "#063F5C",
        borderRadius: 0,
        padding: "2px 12px",
        fontSize: "15px",
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
