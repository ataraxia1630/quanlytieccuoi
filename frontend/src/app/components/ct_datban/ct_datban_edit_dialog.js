import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import DialogButtons from "../../components/Dialogbutton";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useValidation from '../../validation/validation';


const EditCTDatBanDialog = ({ open, onClose, onSave, title, ctdatban }) => {
    const { validateNumberField } = useValidation();
    const [formData, setFormData] = useState({
        MaMonAn: ctdatban?.MaMonAn || "",
        TenMonAn: ctdatban?.TenMonAn || "",
        SoPhieuDatTiec: ctdatban?.SoPhieuDatTiec || "",
        SoLuong: ctdatban?.SoLuong || 1,
        DonGia: ctdatban?.DonGia || 0,
        GhiChu: ctdatban?.GhiChu || ""
    });

    const [errors, setErrors] = useState({
        SoLuong: "",
        DonGia: "",
    });

    useEffect(() => {

        if (ctdatban) {

            setFormData({
                MaMonAn: ctdatban.MaMonAn || "",
                TenMonAn: ctdatban?.TenMonAn || "",
                SoPhieuDatTiec: ctdatban.SoPhieuDatTiec || "",
                SoLuong: ctdatban.SoLuong || 1,
                DonGia: ctdatban.DonGia || 0,
                GhiChu: ctdatban.GhiChu,
            });
            console.log("ctdatban", ctdatban);

            validateNumberField("SoLuong", ctdatban.SoLuong, setErrors);
            validateNumberField("DonGia", ctdatban.DonGia, setErrors);
        } else {
            setFormData({
                MaMonAn: "",
                TenMonAn: "",
                SoPhieuDatTiec: "",
                SoLuong: 0,
                DonGia: 0,
                GhiChu: ""
            });
            setErrors({ SoLuong: "", DonGia: "" });
        }
    }, [ctdatban, validateNumberField]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "SoLuong") {

            setFormData({ ...formData, [name]: value });
            validateNumberField(name, value, setErrors);
            if (value < 1)
                setErrors({ SoLuong: "Số lượng phải là một số dương" });
        } else {
            setFormData({ ...formData, [name]: value });
            console.log(`${name}: `, { value });
        }
    };
    const hasErrors = () => {
        return Object.values(errors).some(error => error !== "");
    };
    const handleSave = async () => {
        const { MaMonAn, TenMonAn, SoPhieuDatTiec, SoLuong, DonGia, GhiChu } = formData;
        if (!MaMonAn || !TenMonAn || !SoPhieuDatTiec || !SoLuong || !DonGia || hasErrors()) {
            toast.warn("Vui lòng nhập đầy đủ và chi tiết thông tin!");
            return;
        }

        const formattedData = {
            MaMonAn,
            SoPhieuDatTiec,
            SoLuong,
            DonGia,
            GhiChu
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
                            label="Mã Món Ăn"
                            name="MaMonAn"
                            value={formData.MaMonAn}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdatban}
                        />


                        <FormTextField
                            label="Số phiếu đặt tiệc"
                            name="SoPhieuDatTiec"
                            value={formData.SoPhieuDatTiec}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdatban}
                        />
                        <FormTextField
                            label="Tên món ăn"
                            name="TenMonAn"
                            value={formData.TenMonAn}
                            onChange={handleChange}
                            fullWidth
                            disabled={!!ctdatban}
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
                            label="Dơn giá"
                            name="DonGia"
                            value={formData.DonGia}
                            onChange={handleChange}
                            format="number"
                            error={!!errors.DonGia}
                            helperText={errors.DonGia}
                            disabled={!!ctdatban}
                        />
                        <FormTextField
                            label="Ghi chú"
                            name="GhiChu"
                            value={formData.GhiChu}
                            onChange={handleChange}
                            error={!!errors.DonGia}
                            helperText={errors.DonGia}
                            fullWidth
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

export default EditCTDatBanDialog;