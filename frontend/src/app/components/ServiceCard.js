import { useState } from 'react';
import {
    Card,
    Typography,
    IconButton,
    Button,
    Box,
    Stack
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';


function ServiceCard({ srv, onClick }) {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity((prev) => prev + 1);

    return (
        <Card
            sx={{
                width: '85%',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fffaf0', // gần giống nền ảnh
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 1,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={'Bold'} >{srv.TenDichVu}</Typography>
                {/* Dots */}
                <Stack direction="row" spacing={0.5}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#cbd5d8', borderRadius: '50%' }} />
                    <Box sx={{ width: 8, height: 8, bgcolor: '#9aaeb8', borderRadius: '50%' }} />
                    <Box sx={{ width: 8, height: 8, bgcolor: '#5e7c8a', borderRadius: '50%' }} />
                    <Box sx={{ width: 8, height: 8, bgcolor: '#003f5c', borderRadius: '50%' }} />
                </Stack>
            </Box>

            <Typography fontWeight="bold" fontSize={'1,2rem'}>
                {srv.DonGia} <Typography component="span" fontSize={'1rem'}>vnđ</Typography>
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* Số lượng */}
                <Box display="flex" alignItems="center">
                    <IconButton size="small" onClick={handleDecrease}>
                        <Remove fontSize="small" />
                    </IconButton>
                    <Typography mx={1} sx={{ marginBottom: 0 }}>{quantity}</Typography>
                    <IconButton size="small" onClick={handleIncrease}>
                        <Add fontSize="small" />
                    </IconButton>
                </Box>

                {/* Nút Add */}
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
                    onClick={() => onClick({ ...srv, SoLuong: quantity })}
                >
                    Thêm
                </Button>
            </Box>
        </Card>
    );
}
export default ServiceCard;