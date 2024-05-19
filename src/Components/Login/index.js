import { useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import OtpLogin from '../OtpLogin';
import GstRegistration from '../GstRegistration';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';

function MobileLogin() {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
    setError(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(event.target.value));
  };

  const handleSendOTPClick = () => {
    setIsLoading(true);
    fetch(`https://steel.smartyerp.in/api/method/steel.v1.login.login?mobile=${mobileNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status_code === 200) {
          navigate('/otplogin', { state: { mobileNumber } })
        } else {
          // navigate('/gst', 
          // { state: { mobileNumber } }
          // )
          toast.warn("Your mobile number is not registered please register first!", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: {
                fontSize: "18px",
            }
        });
        setTimeout(() => {
          navigate("/gst");
      }, 4000);
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });

  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendOTPClick(event);
    }
  }

  return (
    <Box
      sx={{
        ml: { xs:0, sm:50},
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '700px',
        width: "700px",
        backgroundImage: `url('https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-tablet-8374728-6666071.png?f=webp')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
       <ToastContainer/>
      <Box
        sx={{
          backgroundColor: "white",
          mb: 23,
          ml: 1,
          height: '280px',
          width: "385px",
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: {
            xs: 2,
            sm: 5
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography
            sx={{
              textAlign: 'start',
              fontWeight: 'bold',
              mb: 2,
              fontSize: {
                xs: '24px',
                sm: '30px'
              }
            }}
          >
            Login
          </Typography>
          <TextField
          onKeyPress={(e) => handleKeyPress(e)}
            sx={{
              width: '300px'
            }}
            autoComplete="off"
            fullWidth
            id="MobileNumber"
            label="Enter Mobile No.."
            name="MobileNumber"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            InputLabelProps={{ style: { fontSize: 15 } }}
            InputProps={{
              sx: {
                height: '50px',
                fontSize: '15px'
              }
            }}
            error={error}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSendOTPClick}
            disabled={error || isLoading}
            sx={{
              width: '120px',
              mt: 2,
              fontSize: {
                xs: '15px',
                sm: 'inherit'
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Send OTP'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default MobileLogin;
