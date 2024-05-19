import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { CircularProgress } from '@mui/material';

function OtpRegister() {
    const [NewOtp, setNewOtp] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { mobile } = location.state;
    const { allData } = location.state;
    const lastFourDigits = mobile.slice(-4);
    const maskedMobileNumber = "******" + lastFourDigits;

    const fullData = allData;

    useEffect(() => {
    })

    const handleChangeOtp = (event) => {
        setNewOtp(event.target.value);
    };

    const handleClick = () => {
        setIsLoading(true);
        fetch(`https://steel.smartyerp.in/api/method/steel.v1.login.verify_new_user?mobile=${mobile}&otp=${NewOtp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status_code === 200) {
                    fetch(`https://steel.smartyerp.in/api/method/steel.api.create_new_profile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(fullData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status_code === 200) {
                                // handle success response from the create_new_profile API
                                setDialogOpen(true);
                                navigate('/login', { state: {mobile}});
                            } else {
                                toast.error(data.message, {
                                    position: "top-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark",
                                    style: {
                                        fontSize: "15px"
                                    }
                                })
                            }
                        })
                        .catch(error => console.error(error));
                } else {
                    toast.error("wrong otp enter correct otp")
                }
            })
            .catch(error => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };


    return (
        <Box sx={{
            ml: { xs: 0,sm: 40},
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
                    <Typography sx={{ fontSize: "17px", color: "green", fontWeight: "bold", pb: 2 }}>
                        OTP sent on your whatsapp {maskedMobileNumber}
                    </Typography>
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
                        Verify OTP
                    </Typography>
                    <TextField
                        sx={{
                            width: '300px'
                        }}
                        autoComplete="off"
                        fullWidth
                        id="otp"
                        label="Enter OTP.."
                        name="NewOtp"
                        value={NewOtp}
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
                    <Dialog open={dialogOpen} sx={{ textAlign: "center" }}>
                        <DialogTitle>Congratulations Registration successfully !</DialogTitle>
                        <DialogContent>
                            <CheckCircleOutlineIcon sx={{ color: "green", fontSize: "50px" }} />
                        </DialogContent>
                        <DialogActions style={{ justifyContent: 'center' }}>
                            <Button onClick={() => navigate('/register', { state: { mobile } })} variant="contained" sx={{ mx: 'auto' }}>Go To Login</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}

export default OtpRegister;
