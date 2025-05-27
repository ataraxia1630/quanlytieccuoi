import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';


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
export default TagButton;