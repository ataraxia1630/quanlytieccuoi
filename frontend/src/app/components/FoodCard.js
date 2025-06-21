
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
                    onChange={(e) => setNote(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </CardContent>

            {/* Số lượng & Nút Add */}
            <CardActions sx={{ px: 2, pb: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <IconButton size="small" onClick={handleDecrease}>
                        <Remove />
                    </IconButton>
                    <TextField
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        value={quantity.toString()}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        sx={{
                            border: 'none',
                            outline: 'none',
                            width: '25px',
                            height: '30px',
                            fontSize: '30px !important',
                            paddingBottom: '10px',
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
                        bgcolor: 'orange',
                        '&:hover': { bgcolor: 'darkorange' },
                        borderRadius: '999px',
                        textTransform: 'none',
                        paddingX: 3,
                    }}
                    onClick={() => onClick({
                        MaMonAn: food.MaMonAn,
                        SoLuong: quantity,
                        DonGia: food.DonGia,
                        GhiChu: note

                    })}
                >
                    Thêm
                </Button>
            </CardActions>
        </Card>
    );
}

export default FoodCard;