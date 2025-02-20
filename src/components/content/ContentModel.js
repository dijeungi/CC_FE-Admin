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
import { getFestivalId } from '../../api/contentApi';
import { register } from '../../api/contentApi';

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

const ContentModal = ({ open, handleClose, title, onSubmit }) => {
  const [festivalId, setFestivalId] = useState('');
  const [actorCharacter, setActorCharacter] = useState('');
  const [actorName, setActorName] = useState('');
  const [festivalIds, setFestivalIds] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const idList = await getFestivalId();
        setFestivalIds(idList);
      } catch (error) {
        console.error('카테고리 목록을 불러오는데 실패했습니다:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      festivalId: festivalId,
      actorCharacter: actorCharacter,
      actorName: actorName,
    };
    // await onSubmit(formData);
    try {
      console.log('📌 등록할 배우 데이터:', formData);
      await register(formData);

      alert('배우가 성공적으로 등록되었습니다!');
      setFestivalId('');
      setActorCharacter('');
      setActorName('');
      handleClose();
    } catch (error) {
      console.error('배우 등록 실패:', error);
    }
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
                value={festivalId}
                onChange={(e) => setFestivalId(e.target.value)}
                label="공연명"
              >
                {festivalIds.map((festival, index) => (
                  <MenuItem key={index} value={festival.festivalId}>
                    {festival.festivalName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="배역"
              value={actorCharacter}
              onChange={(e) => setActorCharacter(e.target.value)}
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
