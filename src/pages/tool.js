import React, { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Typography } from "@mui/material";
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Layout from '@theme/Layout';

const Input = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 8,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '75vw',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Hello() {
  const [displayStr, setDisplayStr] = useState("");
  const [hiddenStr, setHiddenStr] = useState("");
  const [resultStr, setResultStr] = useState("");

  const zeroWidthEncrypt = () => {
    let encrypted = displayStr;
    for (let i = 0; i < hiddenStr.length; i++) {
      const charCode = hiddenStr.charCodeAt(i);
      const binary = charCode.toString(2).padStart(8, "0");
      for (let j = 0; j < binary.length; j++) {
        encrypted += binary[j] === "1" ? "\u200c" : "\u200d";
      }
    }
    setResultStr(encrypted);
    setDisplayStr("");
    setHiddenStr("");
  };


  const zeroWidthDecrypt = () => {
    let decrypted = "";
    let binaryStr = "";
    for (let i = 0; i < resultStr.length; i++) {
      if (resultStr[i] === "\u200c" || resultStr[i] === "\u200d") {
        binaryStr += resultStr[i] === "\u200c" ? "1" : "0";
        if (binaryStr.length === 8) {
          decrypted += String.fromCharCode(parseInt(binaryStr, 2));
          binaryStr = "";
        }
      } else {
        decrypted += resultStr[i];
      }
    }
    setDisplayStr(decrypted);
    setHiddenStr("");
  };


  return (
    <Layout title="加密小工具" description="加密小工具" >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'warp',
            flexDirection: 'column',
            width: '100vw',
            height: '90vh',
            overflowY: 'auto'
          }}
        >
          <Typography variant="h4" sx={{ margin: '20px', color: '#505050' }}>
            信息加密小工具
          </Typography>
          <FormControl variant="standard" sx={{ margin: '10px' }}>
            <InputLabel shrink sx={{ fontSize: '18px' }}>
              原始信息
            </InputLabel>
            <Input
              type="text"
              value={displayStr}
              onChange={(e) => setDisplayStr(e.target.value)} />
          </FormControl>
          <FormControl variant="standard" sx={{ margin: '10px' }}>
            <InputLabel shrink sx={{ fontSize: '18px' }}>
              隐藏信息
            </InputLabel>
            <Input
              type="text"
              value={hiddenStr}
              onChange={(e) => setHiddenStr(e.target.value)} />
          </FormControl>

          <FormControl variant="standard" sx={{ margin: '10px' }}>
            <InputLabel shrink sx={{ fontSize: '18px' }}>
              加密结果
            </InputLabel>
            <Input
              type="text"
              value={resultStr}
              onChange={(e) => setResultStr(e.target.value)} />
          </FormControl>

          <FormControl variant="standard" sx={{ margin: '10px' }}>
            <InputLabel shrink sx={{ fontSize: '18px' }}>
              解密结果
            </InputLabel>
            <Input
              type="text"
              value={displayStr} />
          </FormControl>

          <Box sx={{ display: 'flex' }}>
            <Button variant="contained" sx={{ width: '12vw', height: '6vh', margin: '30px' }}
              onClick={zeroWidthEncrypt}
            >
              加密
            </Button>

            <Button variant="outlined" sx={{ width: '12vw', height: '6vh', margin: '30px' }}
              onClick={zeroWidthDecrypt}
            >
              解密
            </Button>
          </Box>
        </Box>
      </div>
    </Layout>
  );
}