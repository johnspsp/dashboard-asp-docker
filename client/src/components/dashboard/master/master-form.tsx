"use client"

import React, { useState, useRef } from 'react';
import { uploadFile } from './master-service';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Grid,
  IconButton,
  Divider,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';

const Input = styled('input')({
  display: 'none',
});

const MasterDataUpload: React.FC = () => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    companyCode: null,
    expenseGLAccounts: null,
    costCenter: null,
    actualExpense2024: null,
    accountManagers: null,
    Material: null,
    Customer: null,
    customerGroup: null,
    assetClass: null,
    capexType: null,
    carryOverProjects: null,
  });

  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (event.target.files && event.target.files[0]) {
      setFiles({ ...files, [key]: event.target.files[0] });
      if (inputRefs.current[key]) {
        inputRefs.current[key].value = '';
      }
    }
  };

  const handleUpload = async (key: string) => {
    if (files[key]) {
      setLoading({ ...loading, [key]: true });
      try {
        await uploadFile(key, files[key]);
        setSnackbarMessage(`${key} file uploaded successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setFiles({ ...files, [key]: null });
        if (inputRefs.current[key]) {
          inputRefs.current[key].value = '';
        }
      } catch (error) {
        console.error(`Error uploading ${key} file:`, error);
        setSnackbarMessage(`Error uploading ${key} file. Please try again.`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading({ ...loading, [key]: false });
      }
    }
  };

  const handleRemoveFile = (key: string) => {
    setFiles({ ...files, [key]: null });
    if (inputRefs.current[key]) {
      inputRefs.current[key].value = '';
    }
  };

  const renderFileInput = (label: string, key: string) => (
    <Box key={key} mb={3}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="subtitle1" gutterBottom>
            {label}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="text"
            onClick={() => handleDownloadTemplate(key)}
          >
            Download Template
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={0.5} alignItems="center" mb={1}>
        <Grid item xs={12} sm={4}>
          <label htmlFor={`file-upload-${key}`}>
            <Input
              id={`file-upload-${key}`}
              type="file"
              onChange={(e) => handleFileChange(e, key)}
              ref={(el: HTMLInputElement | null) => { inputRefs.current[key] = el; }}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ borderRadius: 1 , height: 40}}
            >
              Choose File
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            variant="outlined"
            value={files[key] ? files[key].name : 'No file chosen'}
            InputProps={{
              readOnly: true,
              sx: { height: 40, fontSize: 13 },
              endAdornment: files[key] && (
                <IconButton size="small" onClick={() => handleRemoveFile(key)}>
                  <DeleteIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3}>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={() => handleUpload(key)}
          loading={loading[key]}
          disabled={!files[key]}
          fullWidth
          sx={{ height: 35, borderRadius: 1 }}
        >
          Upload
        </LoadingButton>
      </Grid>
    </Box>
  );

  const renderSection = (title: string, keys: string[]) => (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {keys.map((key) => renderFileInput(key, key))}
    </Paper>
  );

  const handleDownloadTemplate = (key: string) => {
    // NEED TO HANDLE DOWNLOAD TEMPLATE
    console.log(`Download template for ${key}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4 }}>
        Master Data Upload
      </Typography>

      {renderSection('Global', ['Company Code', 'Expense GL Accounts'])}
      {renderSection('Expense Entry', ['Cost Center', 'Actual Expense 2024'])}
      {renderSection('Sales Entry', [
        'Account Managers (per company)',
        'Material',
        'Customer',
        'Customer Group',
      ])}
      {renderSection('Capex Entry', [
        'Asset Class',
        'Capex Type',
        '2024 Carry-Over Projects',
      ])}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MasterDataUpload;
