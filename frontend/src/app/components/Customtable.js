import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
} from "@mui/material";
import { useState, useMemo } from "react";
import { memo } from "react";

const CustomTable = memo(
  ({
    data = [],
    columns,
    keyField = "id",
    onEdit = () => {},
    onDelete = () => {},
  }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(null);

    const handleRequestSort = (property) => {
      if (orderBy === property) {
        // Đảo thứ tự hoặc reset về null nếu đã "desc"
        const nextOrder =
          order === "asc" ? "desc" : order === "desc" ? "asc" : "asc";
        setOrder(nextOrder);
        setOrderBy(property);
      } else {
        setOrder("asc");
        setOrderBy(property);
      }
    };

    const getNumericValue = (value) => {
      if (value == null) return 0;
      if (typeof value !== "string") return value;
      const isPriceFormat =
        /^\d{1,3}(\.\d{3})*$/.test(value) || /^\d+\.?\d*$/.test(value);
      if (isPriceFormat) {
        return parseFloat(value.replace(/\./g, "").replace(/\.00$/, ""));
      }
      return value;
    };

    const sortedData = useMemo(() => {
      if (!order || !orderBy) return data;
      return [...data].sort((a, b) => {
        const aValue = getNumericValue(a[orderBy]);
        const bValue = getNumericValue(b[orderBy]);
        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue)
            : aValue - bValue;
        return order === "asc" ? comparison : -comparison;
      });
    }, [data, order, orderBy]);

    const renderCell = (column, row, rowIndex) => {
      if (column.id === "index") return rowIndex + 1;
      if (column.render) {
        return column.id === "actions"
          ? column.render(row, onEdit, onDelete)
          : column.render(row);
      }
      return row[column.id];
    };

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#063F5C" }}>
              {columns.map((column, index) => {
                const isSorted = orderBy === column.id;
                return (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      width: column.width,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "13.5px",
                      borderRight:
                        index !== columns.length - 1
                          ? "1px solid rgb(111, 111, 111)"
                          : "none",
                    }}
                    sortDirection={isSorted ? order : false}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                        sx={{
                          color: "white !important",
                          "& .MuiTableSortLabel-icon": {
                            opacity: isSorted ? 1 : 0.4,
                            color: "white !important",
                            marginLeft: 1,
                          },
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          width: "100%",
                          color: "white",
                        }}
                      >
                        {column.label}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      borderRight:
                        index !== columns.length - 1
                          ? "1px solid #e0e0e0"
                          : "none",
                    }}
                  >
                    {renderCell(column, row, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

export default CustomTable;
