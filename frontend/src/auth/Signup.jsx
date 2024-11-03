import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, checkEmailExists, checkPhoneExists } from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Avatar,
  CssBaseline,
  Paper,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#E9E9E9',
    },
  },
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [educationBackground, setEducationBackground] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setEmail(email);
    if (email) {
      const exists = await checkEmailExists(email);
      setEmailError(exists ? 'Email already exists' : '');
    }
  };

  const handlePhoneChange = async (phone) => {
    setPhone(phone);
    if (phone) {
      const exists = await checkPhoneExists(phone);
      setPhoneError(exists ? 'Phone number already exists' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || phoneError) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('role', role);
    if (role === 'EXPERT') {
      formData.append('educationBackground', educationBackground);
      formData.append('cv', cvFile);
    }

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon position="start" />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon position="start" />
                    ),
                  }}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <VpnKeyIcon position="start" />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <PhoneInput
                  country={'rw'}
                  value={phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    paddingLeft: '48px',
                    height: '56px',
                    boxSizing: 'border-box',
                  }}
                  containerStyle={{ width: '100%' }}
                />
                {phoneError && (
                  <Typography color="error" variant="caption">
                    {phoneError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <HomeIcon position="start" />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="FARMER">Farmer</MenuItem>
                    <MenuItem value="EXPERT">Expert</MenuItem>
                    <MenuItem value="COMMUNITYMEMBER">Community Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {role === 'EXPERT' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="educationBackground"
                      label="Education Background"
                      name="educationBackground"
                      value={educationBackground}
                      onChange={(e) => setEducationBackground(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <SchoolIcon position="start" />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      accept=".pdf,.doc,.docx"
                      id="cvFile"
                      type="file"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="cvFile">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 2, width: '100%' }}
                      >
                        Upload CV
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Your account needs to be approved by an admin before you can log in. You will be notified once approved.
                    </Alert>
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
