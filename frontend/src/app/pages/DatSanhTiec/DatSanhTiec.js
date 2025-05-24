import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DatSanhTiec.css';
import { Button, Grid, Typography, IconButton, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
import { KeyboardDoubleArrowDown } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';


const TagButton = styled(Button)(({ }) => ({
  paddingLeft: '25px',
  paddingRight: '25px',
  background: '#063F5C',
  borderRadius: '100px',
  color: 'white',
  outlineOffset: '-1px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  display: 'inline-flex',
  textTransform: 'none', // Không viết hoa chữ
}));

const HallCard = ({ hall, index, onClick }) => {
  return (
    <Card className='hall-card' sx={{ display: 'flex', flexDirection: 'column', gap: 2, }} >
      <div className='hall-card-header'>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 'Bold', marginBottom: 0 }}>{hall.TenSanh}</Typography>
        <TagButton>
          {hall.LoaiSanh}</TagButton>
      </div>
      <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', marginBottom: 0 }}>Số lượng bàn tối đa: {hall.SoLuongBanToiDa}</Typography>
      <CardMedia
        component="img"
        height="192"
        image={hall.HinhAnh}
        alt={`introduction-hall-${index}`}
        sx={{ objectFit: 'cover' }}
        className='hall-img-show'
      />
      <div>
        {hall.Ca.map((ca) => (
          <TagButton key={ca.TenCa} sx={{ background: ca.TinhTrang === 'Đang trống' ? '#063F5C' : '#3C3C43', marginRight: 1 }}>
            {ca.TenCa}
          </TagButton>
        ))}
      </div>

      <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', height: '10vh', overflowY: 'auto', overflowX: 'hidden' }}>Ghi chú: {hall.GhiChu}</Typography>
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
      >
        Đặt sảnh
      </Button>

    </Card>
  );
}
function DatSanhTiec() {
  const [halls, setHalls] = useState([]);
  const { handleNav } = useContext(StepContext);
  const sectionRef = useRef(null);

  // Hàm xử lý khi nhấn nút
  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  //introduction
  const introductionHalls = [
    {
      title: 'Sang Trọng',
      description: 'Sảnh tiệc cưới sang trọng, rộng rãi với thiết kế tinh tế, tạo không gian ấm cúng và đẳng cấp cho ngày trọng đại.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      title: 'Cổ Điển',
      description: 'Sảnh tiệc cưới cổ điển sang trọng, với các chi tiết hoa văn tinh xảo và nội thất quý phái, mang đến không gian trang nhã và đẳng cấp cho lễ cưới.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730641/Image-1_u1ebzb.png',
    },
    {
      title: 'lãng Mạn',
      description: 'Sảnh tiệc cưới lãng mạn với sắc hoa tươi thắm và thiết kế mềm mại, tạo nên không gian ấm áp, dịu dàng cho ngày trọng đại.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image-2_sc6ztt.png',
    },
  ];
  // Mock data
  const mockItems = [
    {
      TenSanh: 'Sảnh A',
      LoaiSanh: 'Sảnh nhỏ',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    }, {
      TenSanh: 'Sảnh B',
      LoaiSanh: 'Sảnh nhỏ',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh cótr dfghjkdsf ghjkkjhgfd ghjklkjhgfd ghjklkj hgfdgh jklkj hgfdsf ghjkjvchjk jhgjk hsjok pdfoljksh jiokij khjgkj nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      TenSanh: 'Sảnh C',
      LoaiSanh: 'Sảnh lớn',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      TenSanh: 'Sảnh D',
      LoaiSanh: 'Sảnh trung',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      TenSanh: 'Sảnh E',
      LoaiSanh: 'Sảnh lớn',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      TenSanh: 'Sảnh F',
      LoaiSanh: 'Sảnh trung',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      TenSanh: 'Sảnh G',
      LoaiSanh: 'Sảnh trung',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          TenCa: 'Ca trưa',
          TinhTrang: 'Đang trống',
        },
        {
          TenCa: 'Ca tối',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    }
  ];

  useEffect(() => {
    setHalls(mockItems.map((item) => ({
      TenSanh: item.TenSanh,
      LoaiSanh: item.LoaiSanh,
      SoLuongBanToiDa: item.SoLuongBanToiDa,
      HinhAnh: item.HinhAnh,
      Ca: item.Ca,
      GhiChu: item.GhiChu,
    })));
  }, []);


  return (
    <div className="page">
      <div className='hall-introduction-container'>
        {introductionHalls.map((hall, index) => (
          <div className='hall-card' key={hall.title}>
            {(index === 1) ? (
              <>

                <img src={hall.imageUrl} alt={`introduction-hall-${index}`} className='hall-img-show' />
                <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
                  <Typography sx={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}><b>{hall.title}</b></Typography>
                  <p>{hall.description}</p>
                </Grid>


              </>
            ) : (
              <>
                <Typography><b>{hall.title}</b></Typography>
                <p>{hall.description}</p>
                <img src={hall.imageUrl} alt={`introduction-hall-${index}`} className='hall-img-show' />
              </>
            )}
          </div>
        ))}
        <IconButton sx={{ position: 'absolute', bottom: 20 }} onClick={() => handleScroll()}>
          <KeyboardDoubleArrowDown />
        </IconButton>
      </div>
      <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747733599/Group_64_wwly0x.png" style={{
        width: '40%', margin: 100
      }} />
      <div className='selection-container' ref={sectionRef}>
        {halls.map((item, index) => (
          <HallCard key={index} hall={item} index={index} onClick={() => handleNav()} />
        ))}

      </div>
    </div >
  );
}

export default DatSanhTiec;
