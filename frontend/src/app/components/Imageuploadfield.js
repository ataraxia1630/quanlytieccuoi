import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const ImageUploadField = ({ imagePath, onClear, onSelect }) => (
  <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
    <Button
      component="label"
      variant="contained"
      sx={{
        bgcolor: "#a4c1d0",
        color: "black",
        textTransform: "none",
        "&:hover": {
          bgcolor: "#8baebe",
          boxShadow: "none",
        },
        height: "55px",
        boxShadow: "none",
        borderRadius: "4px 0 0 4px",
        minWidth: "130px",
				fontSize: "14.5px",
      }}
    >
      Chọn hình ảnh
      <input type="file" hidden accept="image/*" onChange={onSelect} />
    </Button>
    <TextField
      fullWidth
      value={imagePath || ""}
      InputProps={{
        readOnly: true,
        endAdornment: imagePath && (
          <IconButton onClick={onClear} edge="end" size="small">
            <CancelIcon sx={{ color: "#aaa", width: "20px", height: "20px" }} />
          </IconButton>
        ),
        sx: {
          bgcolor: "white",
          height: "55px",
          borderRadius: "0 4px 4px 0",
          "& input": {
            color: "black",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderLeft: 0,
            borderColor: "#063F5C",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#063F5C",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#063F5C",
            borderWidth: "1px",
            borderLeft: "0px",
          },
        },
      }}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          paddingRight: imagePath ? "8px" : "14px",
        },
      }}
    />
  </Box>
);

export default ImageUploadField;
