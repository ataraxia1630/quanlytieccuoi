import { Box } from "@mui/material";
import CancelButton from "./Cancelbutton";
import SaveButton from "./Saveandprintbutton";

const DialogButtons = ({ textCancel, text, onCancel, onSave }) => (
  <Box display="flex" justifyContent="center" gap={4} sx={{ mb: 1.5 }}>
    <CancelButton textCancel={textCancel} onClick={onCancel} />
    <SaveButton text={text} onClick={onSave} />
  </Box>
);

export default DialogButtons;
