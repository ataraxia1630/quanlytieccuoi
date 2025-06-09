import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import DialogButtons from "../../components/Dialogbutton";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useValidation from '../../validation/validation';


const EditCTDichVuDialog = ({ open, onClose, onSave, title, ctdichvu }) => {
    const { validateNumberField } = useValidation();
    const [formData, setFormData] = useState({
        MaDichVu: ctdichvu?.MaDichVu || "",
        TenDichVu: ctdichvu?.TenDichVu || "",
        SoPhieuDatTiec: ctdichvu?.SoPhieuDatTiec || "",
        SoLuong: ctdichvu?.SoLuong || 1,
        DonGia: ctdichvu?.DonGia || 0
    });

    const [errors, setErrors] = useState({
        SoLuong: "",
        DonGia: "",
    });




    useEffect(() => {

        if (ctdichvu) {

            setFormData({
                MaDichVu: ctdichvu.MaDichVu || "",
                TenDichVu: ctdichvu?.TenDichVu || "",
                SoPhieuDatTiec: ctdichvu.SoPhieuDatTiec || "",
                SoLuong: ctdichvu.SoLuong || 1,
                DonGia: ctdichvu.DonGia || 0,
            });
            console.log("ctdichvu", ctdichvu);

            validateNumberField("SoLuong", ctdichvu.SoLuong, setErrors);
            validateNumberField("DonGia", ctdichvu.DonGia, setErrors);
        } else {
            setFormData({
                MaDichVu: "",
                TenDichVu: "",
                SoPhieuDatTiec: "",
                SoLuong: 0,
                DonGia: 0
            });
            setErrors({ SoLuong: "", DonGia: "" });
        }
    }, [ctdichvu, validateNumberField]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "SoLuong" || name === "DonGia") {

            setFormData({ ...formData, [name]: value });
            validateNumberField(name, value, setErrors);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = async () => {
        const { MaDichVu, TenDichVu, SoPhieuDatTiec, SoLuong, DonGia } = formData;
        if (!MaDichVu || !TenDichVu || !SoPhieuDatTiec || !SoLuong || !DonGia) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formattedData = {
            MaDichVu,
            SoPhieuDatTiec,
            SoLuong,
            DonGia
        };
        onSave(formattedData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    m: 10,
                    p: 0,
                    border: "2px solid #063F5C",
                    width: "100%",
                    maxWidth: "450px",
                },
            }}
        >
            <DialogTitleCustom title={title} onClose={onClose} />

            <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

            <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box display="flex" flexDirection="column" gap={3.5}>
                        <FormTextField
                            label="Mã Dịch vụ"
                            name="MaDichVu"
                            value={formData.MaDichVu}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdichvu}
                        />


                        <FormTextField
                            label="Số phiếu đặt tiệc"
                            name="SoPhieuDatTiec"
                            value={formData.SoPhieuDatTiec}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdichvu}
                        />
                        <FormTextField
                            label="Tên dịch vụ"
                            name="TenDichVu"
                            value={formData.TenDichVu}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdichvu}
                        />

                        <FormTextField
                            label="Số lượng"
                            name="SoLuong"
                            value={formData.SoLuong}
                            onChange={handleChange}
                            format="number"
                            error={!!errors.SoLuong}
                            helperText={errors.SoLuong}
                        />

                        <FormTextField
                            label="Đơn giá"
                            name="DonGia"
                            value={formData.DonGia}
                            onChange={handleChange}
                            format="number"
                            error={!!errors.DonGia}
                            helperText={errors.DonGia}
                            disabled={!!ctdichvu}
                        />
                    </Box>
                </LocalizationProvider>

                <Box mt={4}>
                    <DialogButtons
                        textCancel={"Hủy"}
                        text={"Lưu"}
                        onCancel={onClose}
                        onAction={handleSave}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditCTDichVuDialog;