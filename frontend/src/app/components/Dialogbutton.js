import { Box } from "@mui/material";
import CancelButton from "./Cancelbutton";
import ActionButton from "./Someactionbutton";

const DialogButtons = ({ textCancel, text, onCancel, onAction }) => (
  <Box display="flex" justifyContent="center" gap={4} sx={{ mb: 1.5 }}>
    <CancelButton textCancel={textCancel} onClick={onCancel} />
    <ActionButton text={text} onClick={onAction} />
  </Box>
);

export default DialogButtons;
