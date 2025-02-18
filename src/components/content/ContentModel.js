import React, { useState } from 'react';
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

// 공연명 리스트 (API 연동 가능)
const performanceList = [
  { id: 1, name: '오페라의 유령' },
  { id: 2, name: '레미제라블' },
  { id: 3, name: '캣츠' },
];

const ContentModal = ({ open, handleClose, title, onSubmit }) => {
  const [performanceName, setPerformanceName] = useState('');
  const [role, setRole] = useState('');
  const [actorName, setActorName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      performanceName,
      role,
      actorName,
    };
    await onSubmit(formData);
    setPerformanceName('');
    setRole('');
    setActorName('');
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
            {/* 공연명 선택 드롭다운 */}
            <FormControl fullWidth required>
              <InputLabel>공연명</InputLabel>
              <Select
                value={performanceName}
                onChange={(e) => setPerformanceName(e.target.value)}
                label="공연명"
              >
                {performanceList.map((performance) => (
                  <MenuItem key={performance.id} value={performance.name}>
                    {performance.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="배역"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="성명"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#FFB7F2', '&:hover': { bgcolor: '#ff99e6' } }}
            >
              등록
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ContentModal;
