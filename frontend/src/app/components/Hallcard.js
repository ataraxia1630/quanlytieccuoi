import React, { useState } from 'react';
import { Button, Box, Typography, Card, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';


const TagButton = styled(Button)({
    flex: '0 0 auto',
    paddingLeft: '20px',
    paddingRight: '20px',
    background: '#063F5C',
    borderRadius: '100px',
    color: 'white',
    fontSize: '0.8rem',
    outlineOffset: '-1px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    display: 'inline-flex',
    textTransform: 'none', // Không viết hoa chữ
});


const HallCard = ({ hall, shifts, index, onClick }) => {
    const [chosingShift, setChoosingShift] = useState(null)
    const handleSave = () => {
        if (!chosingShift) {
            alert("Vui lòng chọn một ca trước khi đặt sảnh!");
            return;
        }
        onClick({ target: { name: "sanhCa", value: { MaSanh: hall.MaSanh, MaCa: chosingShift } } });
        setChoosingShift(null);
    }
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '85%', border: 'none', mt: 'auto', boxShadow: 'none' }} >
            <Box sx={{
                fontSize: '3rem',
                display: 'flex',
                justifyContent: 'space-between',
                whiteSpace: 'wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'Bold', marginBottom: 0 }}>{hall.TenSanh}</Typography>
                <TagButton>
                    {hall.TenLoaiSanh}</TagButton>
            </Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', marginBottom: 0 }}>Số lượng bàn tối đa: {hall.SoLuongBanToiDa}</Typography>
            <CardMedia
                component="img"

                image={hall.HinhAnh}
                alt={`introduction-hall-${index}`}
                sx={{ height: "192px", objectFit: 'cover' }}
                className='hall-img-show'
            />
            <div className='container'
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    paddingright: '10px',
                    gap: '10px',
                }}>
                {hall.CaAvailability.map((ca) => (
                    <TagButton
                        key={ca.MaCa}
                        sx={{ background: ca.TrangThai === 'Trống' ? '#063F5C' : '#DFDFDF', marginRight: 1, marginBottom: 1 }}
                        onClick={() => setChoosingShift(ca.MaCa)}
                        disabled={!(ca.TrangThai === "Trống")}
                    >
                        {(shifts.find(shift => shift.MaCa === ca.MaCa) || {}).TenCa || ""}
                    </TagButton>
                ))}
            </div>

            <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', height: '75px', overflowY: 'auto', overflowX: 'hidden' }}>
                Ghi chú: {(hall.GhiChu === null) ? "Không" : hall.GhiChu}
            </Typography>
            <Button
                onClick={() => handleSave()}
                variant="contained"
                size="small"
                sx={{
                    bgcolor: 'orange',
                    '&:hover': { bgcolor: 'darkorange' },
                    borderRadius: '999px',
                    textTransform: 'none',
                    marginBottom: '10px',

                }}
            >
                Đặt sảnh
            </Button>

        </Card>
    );
}

export default HallCard;