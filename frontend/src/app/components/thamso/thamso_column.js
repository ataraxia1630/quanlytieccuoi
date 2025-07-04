import { Box, IconButton, Typography } from '@mui/material';

const EditIcon = ({ disabled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
      stroke={disabled ? '#999' : '#063F5C'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThamSoColumn = [
  {
    id: 'index',
    label: 'STT',
    sortable: false,
    width: 100,
  },
  {
    id: 'displayName',
    label: 'Tên quy định',
    sortable: true,
    width: 300,
  },
  {
    id: 'GiaTri',
    label: 'Giá trị',
    sortable: false,
    width: 150,
    render: (row) => {
      if (row.TenThamSo === 'TyLePhat') {
        return `${row.GiaTri}%`;
      }
      if (row.TenThamSo === 'ApDungQDPhatThanhToanTre') {
        return row.GiaTri === 1 ? 'Áp dụng' : 'Không áp dụng';
      }
      return `${row.GiaTri}`;
    },
  },
  {
    id: 'actions',
    label: 'Thao tác',
    sortable: false,
    width: 100,
    render: (row, onEdit, onDelete, disabledEdit = false, disabledDelete = false) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <IconButton
          onClick={() => onEdit(row)}
          disabled={disabledEdit}
          sx={{
            opacity: disabledEdit ? 0.5 : 1,
            cursor: disabledEdit ? 'not-allowed' : 'pointer',
          }}
        >
          <EditIcon disabled={disabledEdit} />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              color: disabledEdit ? '#999' : '#000',
            }}
          >
            Sửa
          </Typography>
        </IconButton>
      </Box>
    ),
  },
];

export default ThamSoColumn;
