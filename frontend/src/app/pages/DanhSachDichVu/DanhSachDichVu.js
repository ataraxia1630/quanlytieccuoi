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

// SearchFilterAddBar.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";

// This component combines all three components
const SearchFilterAddBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    console.log("Searching for:", value);
    // Implement actual search logic here
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
    // Implement filter logic here
  };

  const handleAdd = () => {
    console.log("Add button clicked");
    // Implement add logic here
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
        placeholder="Tìm tên hoặc mã dịch vụ ..."
      />

      <Box
        sx={{
          display: "flex",
          gap: "17px",
          justifyContent: "flex-end",
        }}
      >
        <FilterButton onClick={handleFilter} text="Filter" />
        <AddButton onClick={handleAdd} text="Thêm" />
      </Box>
    </Box>
  );
};

export default SearchFilterAddBar;
