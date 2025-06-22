import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../Dialogtitlecustom";
import DialogButtons from "../Dialogbutton";

const EditDialog = ({ open, onClose, onEdit, title }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "2px solid #063F5C",
          width: "100%",
          maxWidth: "360px",
        },
      }}
    >
      <DialogTitleCustom title={title} onClose={onClose} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      <DialogContent sx={{ pt: 1, px: 3.5, pb: 5 }}>
        <Box mt={4}>
          <DialogButtons
            textCancel={"Hủy"}
            text={"Sửa"}
            onCancel={onClose}
            onAction={onEdit}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
