import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CategoryModal = ({ open, handleClose, title, category, onSubmit }) => {
  const [name, setName] = useState('');
  const [useYn, setUseYn] = useState('Y');

  useEffect(() => {
    if (open) {
      setName(category.name);
      setUseYn(category.useYn);
    }
  }, [open, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', category.id);
    formData.append('name', name);
    formData.append('useYn', useYn);

    await onSubmit(formData);
    setName('');
    setUseYn('Y');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="코드명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>사용유무</InputLabel>
              <Select
                value={useYn}
                onChange={(e) => setUseYn(e.target.value)}
                label="사용유무"
              >
                <MenuItem value="Y">Y (사용)</MenuItem>
                <MenuItem value="N">N (미사용)</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#ffa48c', '&:hover': { bgcolor: '#ff8364' } }}
            >
              수정
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CategoryModal;
