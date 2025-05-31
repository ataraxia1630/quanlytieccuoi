import { Dialog, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import MonAnService from "../../service/monan.service";
import DialogTitleCustom from "../Dialogtitlecustom";
import FormTextField from "../Formtextfield";
import DialogButtons from "../Dialogbutton";

const DanhSachMonAnDialog = ({
  open,
  onClose,
  onSave,
  title,
  onSelect,
  initialData = null,
  mode = "add",
}) => {
 
  const [errors, setErrors] = useState({});

  const [thucDon, setThucDon] = useState([]);

  useEffect(() => {
  if (open) {
    const fetchData = async () => {
      try {
        const kq = await MonAnService.getAll();
        console.log("Dữ liệu từ API:", kq);

        // Kiểm tra nếu kq.data là array
        if (Array.isArray(kq.data)) {
          setThucDon(kq.data);
        } else {
          setThucDon([]); // fallback nếu không phải mảng
          console.error("Dữ liệu trả về không phải array:", kq.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi MonAnService.getAll():", error);
        setThucDon([]); // fallback nếu lỗi
      }
    };

    fetchData();
  }
}, [open]);

  const handleSelect = (monan) => {
    onSelect(monan);
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
          {thucDon.map((ma) => (
            <ListItem button key={ma.MaMonAn} onClick={() => handleSelect(ma)}>
              <ListItemText primary={ma.TenMonAn} secondary={`Giá: ${ma.DonGia}`} />
            </ListItem>
          ))}
        </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DanhSachMonAnDialog;
