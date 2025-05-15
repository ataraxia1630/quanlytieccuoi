import React from "react";
import { Box, TextField } from "@mui/material";

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
        maxWidth: "610px",
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
            height: "48px",
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
            fontSize: "18px",
            boxSizing: "border-box",
          },
        }}
      />
      <button
        onClick={() => onSearch(value)}
        disabled={disabled}
        className="flex items-center justify-center"
        style={{
          backgroundColor: "#063F5C",
          height: "48px",
          borderRadius: "0 20px 20px 0",
          border: "none",
          width: "59px",
          flexShrink: 0, // Không co lại
        }}
      >
        <svg
          width="29"
          height="24"
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
      </button>
    </Box>
  );
};

export default SearchBar;
