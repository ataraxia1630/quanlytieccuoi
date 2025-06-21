
import { useState } from 'react';

import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    TextField,
    Button,
    Box
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';


function FoodCard({ food, onClick }) {
    const [quantity, setQuantity] = useState(0);
    const [note, setNote] = useState(null);

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(0, prev - 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    return (
        <Card sx={{ width: '85%', borderRadius: 2, boxShadow: 3 }}>
            {/* Ảnh */}
            <CardMedia
                component="img"
                height="192"
                image={food.HinhAnh || "https://via.placeholder.com/50"}
                alt="food image"
                sx={{ objectFit: 'cover' }}
            />

            {/* Tiêu đề & Giá */}
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="h2" sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '60%',
                    }}>
                        {food.TenMonAn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {food.DonGia} <Typography variant="caption">vnđ</Typography>
                    </Typography>
                </Box>

                {/* Ghi chú */}
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Thêm ghi chú ....."
                    variant="outlined"
                    onChange={(e) => { if (e.target.value.length < 200) setNote(e.target.value) }}
                    sx={{ mt: 2 }}
                />
            </CardContent>

            {/* Số lượng & Nút Add */}
            <CardActions sx={{ px: 2, pb: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: "start" }}>
                <Box display="flex" alignItems="start">
                    <IconButton size="small" onClick={handleDecrease}>
                        <Remove />
                    </IconButton>
                    <TextField
                        variant="outlined"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        value={quantity.toString()}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if ((value === "" || isNaN(value))) return;
                            if (value < 0) return;
                            setQuantity(value);
                        }}
                        inputProps={{
                            style: {
                                padding: '6px', // chỉnh padding bên trong
                                textAlign: 'center', // căn giữa
                                fontSize: '1.2rem',
                            }
                        }}
                        sx={{
                            border: 'none',
                            outline: 'none',
                            width: '55px',
                            textAlign: 'center'
                        }}
                    />
                    <IconButton size="small" onClick={handleIncrease}>
                        <Add />
                    </IconButton>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        bgcolor: quantity > 0 ? 'orange' : 'gray',
                        '&:hover': { bgcolor: 'darkorange' },
                        borderRadius: '999px',
                        textTransform: 'none',
                        paddingX: 3,
                        marginTop: 0.2
                    }}
                    onClick={() => {
                        if (quantity > 0)
                            onClick({
                                MaMonAn: food.MaMonAn,
                                SoLuong: quantity,
                                DonGia: food.DonGia,
                                GhiChu: note

                            })
                    }}
                >
                    Thêm
                </Button>
            </CardActions>
        </Card>
    );
}

export default FoodCard;