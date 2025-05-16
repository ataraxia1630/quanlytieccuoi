import { Box, Button, TextField } from "@mui/material";

const SearchBar = ({
  value = "",
  onChange = () => {},
  onSearch = () => {},
  placeholder = "Tìm kiếm ...",
  disabled = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "590px",
      }}
    >
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        sx={{
          flexGrow: 1,
          "& .MuiOutlinedInput-root": {
            height: "45px",
            borderRadius: "20px 0 0 20px",
            "& fieldset": {
              borderRight: "none",
              borderColor: "#063F5C",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#063F5C",
              borderWidth: "1.3px",
            },
          },
          "& .MuiInputBase-input": {
            height: "40px",
            padding: "0 23px",
            fontSize: "16px",
            boxSizing: "border-box",
          },
        }}
      />
      <Button
        onClick={() => onSearch(value)}
        disabled={disabled}
        className="flex items-center justify-center"
        style={{
          backgroundColor: "#063F5C",
          height: "45px",
          borderRadius: "0 20px 20px 0",
          border: "none",
          width: "55px",
        }}
      >
        <svg
          width="27"
          height="22"
          viewBox="0 0 29 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.1494 19C18.2761 19 22.4321 15.4183 22.4321 11C22.4321 6.58172 18.2761 3 13.1494 3C8.02272 3 3.8667 6.58172 3.8667 11C3.8667 15.4183 8.02272 19 13.1494 19Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24.7528 20.9999L19.7053 16.6499"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </Box>
  );
};

export default SearchBar;
