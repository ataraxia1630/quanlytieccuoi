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

const CustomTable = ({
  data = [],
  columns,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [order, setOrder] = useState(null); // 'asc', 'desc', or null
  const [orderBy, setOrderBy] = useState(null);

  const handleRequestSort = (property) => {
    if (orderBy === property) {
      if (order === "asc") setOrder("desc");
      else if (order === "desc") {
        setOrder(null);
        setOrderBy(null);
      } else {
        setOrder("asc");
      }
    } else {
      setOrder("asc");
      setOrderBy(property);
    }
  };

  const sortedData = useMemo(() => {
    if (!order || !orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (order === "asc") {
        return typeof aValue === "string"
          ? aValue.localeCompare(bValue)
          : aValue - bValue;
      } else {
        return typeof aValue === "string"
          ? bValue.localeCompare(aValue)
          : bValue - aValue;
      }
    });
  }, [data, order, orderBy]);

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
                  {column.id === "index"
                    ? rowIndex + 1
                    : column.render
                    ? column.id === "actions"
                      ? column.render(row, onEdit, onDelete)
                      : column.render(row)
                    : row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
