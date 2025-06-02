import { TextField } from "@mui/material";

const FormTextField = ({ label, value, onChange, ...props }) => (
  <TextField
    label={label}
    value={value ? value : ""}
    onChange={onChange}
    fullWidth
    variant="outlined"
    sx={{
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#063F5C",
        },
        "&:hover fieldset": {
          borderColor: "#063F5C",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#063F5C",
        },
        "& input": {
          color: "black",
        },
      },
      "& .MuiInputLabel-root": {
        color: "black",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#063F5C",
      },
    }}
    {...props}
  />
);

export default FormTextField;
