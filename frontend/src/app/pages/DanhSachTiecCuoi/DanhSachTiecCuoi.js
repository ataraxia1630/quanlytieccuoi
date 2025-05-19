import React, { useState } from 'react';
import './DanhSachTiecCuoi.css';
import '../../components/Customtable'
import CustomTable from '../../components/Customtable';
import DialogButton from '../../components/Dialogbutton';
import DialogTitlecustom from '../../components/Dialogtitlecustom';
import StatusRadio from '../../components/Statusradio';
import { Button } from '@mui/material';
import Searchbar from '../../components/Searchbar'
import FormTextField from '../../components/Formtextfield';
import Rangeinput from '../../components/Rangeinput'
import Dropdown from '../../components/Dropdown';
import FilterButton from '../../components/Filterbutton';
function DanhSachTiecCuoi() {

  const [status, setStatus] = useState("all");

  const data = [
    {
      id: 1,
      tenChuRe: "Nguyen Van A",
      tenCoDau: "Tran Thi B",
      ngayToChuc: "2025-06-01",
    },
    {
      id: 2,
      tenChuRe: "Le Van C",
      tenCoDau: "Nguyen Thi D",
      ngayToChuc: "2025-06-15",
    },
  ];

  const columns = [
    { id: "index", label: "STT", width: 50 },
    { id: "tenChuRe", label: "Tên chú rể", sortable: true },
    { id: "tenCoDau", label: "Tên cô dâu", sortable: true },
    { id: "ngayToChuc", label: "Ngày tổ chức", sortable: true },
    {
      id: "actions",
      label: "Hành động",
      width: 200,
      render: (row, onEdit, onDelete) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => onEdit(row)}
            sx={{ marginRight: 1 }}
          >
            Sửa
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(row)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Đã tổ chức", value: "done" },
    { label: "Chưa tổ chức", value: "pending" },
  ]
const options1 = [
    { label: "Sanh 1", value: "da_to_chuc" },
    { label: "Sanh 2", value: "chua_to_chuc" },
    { label: "Sanh 3", value: "da_huy" },
  ];

  return (
    <div className="danhsachtieccuoi-page">
      <p className='title'>Danh sách tiệc cưới</p>
      <div className='box-search'>
        <Searchbar placeholder='Tim ten co dau hoac chu re...' /> 
      </div>


      <div className='box'>
        <div className='content'>
        <div className='sanh-box'>
        <Dropdown
          className="sanh"
          label="Sảnh"
        
          width={150}
          options={options1}
        />
        <div className="apply" >
         <FilterButton text='Apply'/>
        </div>

        </div>
        
        <div className='ban-box'>
         <Rangeinput label="Số lượng bàn" width={56}/>
        </div>

        <div className='ngay-box'>
          <Rangeinput label = "Ngày" width={56} />
        </div>
        <StatusRadio
            label="Tình trạng"
            value={status}
            onChange={setStatus}
            options={options}
        />
        </div>
        
      </div>
     
      <CustomTable CustomTable data={data} columns={columns}/>
      <div style={{ padding: 24 }}>
      
    </div>
    </div>
  );
}

export default DanhSachTiecCuoi;
