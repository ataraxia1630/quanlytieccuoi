import { Dialog, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import DichVuService from "../../service/dichvu.service";
import DialogTitleCustom from "../Dialogtitlecustom";
import FormTextField from "../Formtextfield";
import DialogButtons from "../Dialogbutton";

const DanhSachDichVuDialog = ({
  open,
  onClose,
  onSave,
  title,
  onSelect,
  initialData = null,
  mode = "add",
}) => {
 
  const [errors, setErrors] = useState({});

  const [danhSachDichVu, setDanhSachDichVu] = useState([]);

  useEffect(() => {
    if (open) {
      DichVuService.getAllDichVu()
        .then((data) => setDanhSachDichVu(data))
        .catch((err) => console.error(err));
    }
  }, [open]);

  const handleSelect = (dichVu) => {
    onSelect(dichVu);
    onClose();
  };

//   const handleSave = () => {
//     if (validateForm()) {
//       const formData = {
//         name: (initialData?.DichVu?.TenDichVu && initialData.DichVu.TenDichVu) || '',
//         price: Number(price),
//         sl: sl,
//       };
//       onSave(formData);
//     }
//   };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };
  return (
   


<Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 10,
          p: 0,
          border: "2px solid #063F5C",
          width: "100%",
          maxWidth: "430px",
        },
      }}
    >
      <DialogTitleCustom title={title} onClose={handleCancel} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      <DialogContent sx={{ pt: 4.5, px: 5, pb: 3.5 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
        
          <List>
          {danhSachDichVu.map((dv) => (
            <ListItem button key={dv.MaDichVu} onClick={() => handleSelect(dv)}>
              <ListItemText primary={dv.TenDichVu} secondary={`Giá: ${dv.DonGia}`} />
            </ListItem>
          ))}
        </List>
        </Box>

        {/* <Box mt={4.5}>
          <DialogButtons
            textCancel="Hủy"
            text="Lưu"
            onCancel={handleCancel}
            onAction={handleSave}
          />
        </Box> */}
      </DialogContent>
    </Dialog>
  );
};

export default DanhSachDichVuDialog;
