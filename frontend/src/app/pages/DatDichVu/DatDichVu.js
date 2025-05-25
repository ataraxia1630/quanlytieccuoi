import './DatDichVu.css';

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Cancelbutton from '../../components/Cancelbutton';
import ServiceCard from '../../components/ServiceCard';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';



function DatDichVu() {

  const [services, setServices] = useState([]);
  const { handleNav } = useContext(StepContext);
  //mock data
  const mockItems = [
    {
      TenDichVu: 'Dịch vụ 1',
      DonGia: '500,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 2',
      DonGia: '600,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 3',
      DonGia: '700,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 4',
      DonGia: '800,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 5',
      DonGia: '900,000',
      TinhTrang: 'AVAILABLE',

    },

    // Add more items as needed
  ];

  useEffect(() => {
    setServices(mockItems);
  }, [])
    ;
  return (
    <div className="page">
      <box className='intro-box'>
        <div className="dichvu-container">
          <h1 className="dichvu-title">Dich vu</h1>
          <p className="dichvu-description">
            Chúng tôi cam kết mang đến những dịch vụ
            chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.
            Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi luôn
            đồng hành cùng bạn trong mọi hành trình.
          </p>
        </div>
        <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747794536/Group_169_1_rdx0ok.png" alt="background" className='background-image' />
      </box>
      <div className='selection-container' >
        {services.map((item, index) => (
          <ServiceCard key={index} srv={item} />
        ))}
      </div>
      <div className='button-container'>
        <Cancelbutton onClick={() => handleNav()} textCancel="Hoàn Thành" />
      </div>
    </div>
  );
}

export default DatDichVu;
