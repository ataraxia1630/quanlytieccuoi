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

const DeleteIcon = ({ disabled = false }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6H5H21"
      stroke={disabled ? '#999' : '#063F5C'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
      stroke={disabled ? '#999' : '#063F5C'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActionButtons = ({
  row,
  onEdit,
  onDelete,
  disabledEdit = false,
  disabledDelete = false,
}) => {
  return (
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

      <IconButton
        onClick={() => onDelete(row)}
        disabled={disabledDelete}
        sx={{
          opacity: disabledDelete ? 0.5 : 1,
          cursor: disabledDelete ? 'not-allowed' : 'pointer',
        }}
      >
        <DeleteIcon disabled={disabledDelete} />
        <Typography
          variant="body2"
          sx={{
            ml: 1,
            color: disabledDelete ? '#999' : '#000',
          }}
        >
          Xoá
        </Typography>
      </IconButton>
    </Box>
  );
};

export default ActionButtons;
