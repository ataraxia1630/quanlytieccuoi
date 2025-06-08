import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Link,
  Box,
  List,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function GroupAccordion({ group = {} }) {
  return (
    <Accordion sx={{ marginBottom: '30px' }}>
      <AccordionSummary
        expandIcon={
          <Box sx={{ display: 'flex', direction: 'row' }}>
            {/* <Typography
              sx={{
                color: '#063F5C',
                textDecoration: 'underline',
                fontSize: '0.9rem',
                '&:hover': { cursor: 'pointer' },
              }}
            >
              Xem chi tiết quyền
            </Typography> */}
            <ExpandMoreIcon sx={{ color: '#063F5C' }} />
          </Box>
        }
      >
        <Typography>
          {group.MaNhom} - {group.TenNhom}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {group.QUYENs.map((quyen) => (
            <ul>
              {quyen.MaQuyen} - {quyen.TenQuyen}
            </ul>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
