// import React from 'react';
// import './DanhSachDichVu.css';

// function DanhSachDichVu() {
//   return (
//     <div className="danhsachdichvu-page">
//       <h1>DanhSachDichVu Page</h1>
//     </div>
//   );
// }

// export default DanhSachDichVu;

import { useState } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import FilterPanel from "./Filterpanel";
import defaultColumns from "./DefaultColumn";

// Main component
function DanhSachDichVu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleAdd = () => {
    console.log("Add button clicked");
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (filterData) => {
    console.log("Applied filters:", filterData);
    // Here you would typically filter your data based on the filter settings
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
  };

  const sampleData = [
    {
      id: "M001",
      name: "Cá quả chiên sốt Thái",
      image:
        "https://product.hstatic.net/200000561069/product/ca_chem_sot_goi_xoai-compressed_27089c6f57b4492782a554b74e414b2f_master.jpg",
      price: 115000,
      status: "Còn hàng",
    },
    {
      id: "M002",
      name: "Súp gà nấm hương",
      image: "/path/to/image2.jpg",
      price: 65000,
      status: "Hết hàng",
    },
    {
      id: "M003",
      name: "Salad hoàng đế",
      image: "/path/to/image3.jpg",
      price: 145000,
      status: "Còn hàng",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          mb: 3, // margin bottom
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Tìm tên hoặc mã dịch vụ ..."
        />

        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      <CustomTable
        data={sampleData}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default DanhSachDichVu;
