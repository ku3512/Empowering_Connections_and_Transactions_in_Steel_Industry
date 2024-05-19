import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

function OtpLogin() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber = '' } = location.state || {};
  const lastFourDigits = mobileNumber.slice(-4);
  const maskedMobileNumber = "******" + lastFourDigits;
  

  const handleChangeOtp = (event) => {
    setOtp(event.target.value);
  };

  const handleClick = () => {
    setIsLoading(true);
    fetch(`https://steel.smartyerp.in/api/method/steel.v1.login.verify_otp_code?mobile=${mobileNumber}&otp=${otp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Logged In successfully') {
          localStorage.setItem("result", JSON.stringify(data));
          localStorage.setItem("key", JSON.stringify(data.key_details.api_key));
          localStorage.setItem("secret", JSON.stringify(data.key_details.api_secret));
          localStorage.setItem("mobile", JSON.stringify(data.profile_details[0].mobile));
          localStorage.setItem("userId", JSON.stringify(data.user_details[0].name));
          let userProfileData = data.user_details[0].role_profile_name;
          if(userProfileData === 'Buyer and Seller'){
            localStorage.setItem("roleProfile", JSON.stringify("Both"));
          }
          else if(userProfileData === 'Buyer'){
            localStorage.setItem("roleProfile", JSON.stringify("Buyer"));
          }
          else if(userProfileData === 'Seller'){
            localStorage.setItem("roleProfile", JSON.stringify("Seller"));
          }
          navigate("/");
        } else {
          toast.error("wrong otp enter correct otp")
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleClick(event);
    }
  }

  return (
    <Box sx={{
      ml: { xs: 0, sm:50},
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '700px',
      width: "700px",
      backgroundImage: `url('https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-tablet-8374728-6666071.png?f=webp')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }}>
      <ToastContainer
      position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
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
        <Typography sx={{fontSize:"17px",color:"green",pb:2}}>
            OTP sent on your whatsapp {maskedMobileNumber}
          </Typography>
          <Typography
            sx={{
              textAlign: 'start',
              fontWeight: 'bold',
              mb: 2,
              fontSize: {
                xs: '24px',
                sm: '28px'
              }
            }}
          >
            Verify OTP
          </Typography>
          <TextField
          onKeyPress={(e) => handleKeyPress(e)}
            sx={{
              width: '300px'
            }}
            autoComplete="off"
            fullWidth
            id="otp"
            label="Enter OTP.."
            name="otp"
            value={otp}
            onChange={handleChangeOtp}
            InputLabelProps={{ style: { fontSize: 15 } }}
            InputProps={{
              sx: {
                height: '50px',
                fontSize: '15px',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleClick}
            enabled={isLoading}
            color="success"
            sx={{
              width: '120px',
              mt: 2,
              fontSize: {
                xs: '15px',
                sm: 'inherit'
              }
            }}
          >
           {isLoading ? <CircularProgress size={20} /> : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default OtpLogin;
