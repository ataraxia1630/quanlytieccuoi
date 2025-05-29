import { Button, Box } from "@mui/material";

const FilterButton = ({
  onClick = () => {},
  text = "Filter",
  disabled = false,
  colorVariant = "primary",
}) => {
  const styles = {
    primary: {
      borderColor: "#063F5C",
      color: "#063F5C",
      "&:hover": {
        backgroundColor: "rgba(10, 62, 101, 0.04)",
      },
    },
    reset: {
      borderColor: "#888",
      color: "#555",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    },
  };

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      sx={{
        height: "45px",
        textTransform: "none",
        borderWidth: "2px",
        padding: "2px 12px",
        fontSize: "15px",
        fontWeight: "bold",
        borderRadius: 0,
        ...styles[colorVariant],
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.1668 3H2.03491L10.0877 12.46V19L14.1141 21V12.46L22.1668 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {text}
      </Box>
    </Button>
  );
};

export default FilterButton;
