import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Card, Grid,Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { format } from 'date-fns';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function RequirementList() {

  const bidAmountRef = useRef();
  const autoBidTillRef = useRef();
  const [requirementData, setRequirementData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [bid_amount, setBid_Amount] = useState('');
  const [AutoBidAmount, setAutoBidAmount] = useState('');
  const [showBidAmount, setShowBidAmount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoBidValue, setAutoBidValue] = useState(null);

  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const UserId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    const mobile = JSON.parse(localStorage.getItem("mobile"));
    const fetchData = async () => {
      const result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_single_profile?mobile=${mobile}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`,
        }
      })
      const res = await result.json();
      const valuesArray = res.data[0].category.reduce((arr, obj) => {
        return arr.concat(Object.values(obj));
      }, []);

      const response = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_requirement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`,
        },
        body: JSON.stringify({ categories: valuesArray, page: 1, size: 100 })
      });

      const responseData = await response.json();
      setRequirementData(responseData.data.requirement)
      setLoading(false);
    };

    fetchData();
  }, []);


  const InputFieldData = (e) => {
    setBid_Amount(e.target.value);
  };

  const toggleButtonData = (event, cardId) => {
    const autobidValue = event.target.checked ? 1 : 0;
    setAutoBidValue(autobidValue);
    setShowBidAmount(event.target.checked);
    setSelectedCard(cardId);
    setAutoBidAmount('');

    if (autobidValue) {
      setTimeout(() => {
        autoBidTillRef.current.focus();
      }, 0);
    }

  };

  //bid now button function
  const BidNewData = async (e, row, autoBidValue) => {
    e.preventDefault();

    if (autoBidValue && AutoBidAmount === '') {
      toast.warn('You have not entered any value in auto bid');
      return;
    }

    const newBidAmount = parseFloat(bid_amount);
    const newAutoBidAmount = parseFloat(AutoBidAmount);

    if (isNaN(newBidAmount) || newBidAmount <= 0) {
      toast.error('Please enter a valid bid amount!');
      return;
    }

    const parsedValue = parseFloat(newBidAmount);
    if (isNaN(parsedValue)) {
      setBid_Amount('');
    } else {
      const roundedValue = Math.round(parsedValue * 100) / 100; // Round to two decimal places
      const isValid = roundedValue % 0.25 === 0; // Check if value is a multiple of 0.25

      if (isValid) {
        setBid_Amount(roundedValue.toFixed(2)); // Set the valid value with two decimal places
      } else {
        toast.error('Please enter a valid bid amount! Only multiples of 0.25 are allowed.');
        return;
      }
    }

    const newParsedValue = parseFloat(newAutoBidAmount);
    if (isNaN(newParsedValue)) {
      setAutoBidAmount('');
    } else {
      const newRoundedValue = Math.round(newParsedValue * 100) / 100; // Round to two decimal places
      const isNewValid = newRoundedValue % 0.25 === 0; // Check if value is a multiple of 0.25

      if (isNewValid) {
        setAutoBidAmount(newRoundedValue.toFixed(2)); // Set the valid value with two decimal places
      } else {
        toast.error('Please enter a valid auto bid amount! Only multiples of 0.25 are allowed.');
        return;
      }
    }


    const lowestBidAmount = parseFloat(row.lowest_bid);
    const highestBidAmount = parseFloat(row.highest_bids)
    if (row.requirement_type === "I want to Sale") {
      if (newBidAmount <= highestBidAmount) {
        toast.warn(`Your bid amount must be greater than the highest bid (${highestBidAmount})`);
        return;
      }
      if (newBidAmount <= highestBidAmount + 0.24) {
        toast.warn(`Your bid amount must be at least 0.25 greater than the highest bid (${highestBidAmount + 0.25})`);
        return;
      }
      if (newAutoBidAmount <= newBidAmount) {
        toast.warn(`Your auto bid amount must be greater than the highest bid (${newBidAmount})`);
        return;
      }

    } else if (row.requirement_type === "I want to Buy") {
      if (newBidAmount >= lowestBidAmount) {
        toast.warn(`Your bid amount must be less than the lowest bid (${lowestBidAmount})`);
        return;
      }
      if (newBidAmount >= lowestBidAmount - 0.24) {
        toast.warn(`Your bid amount must be at least 0.25 less than the lowest bid (${lowestBidAmount - 0.25})`);
        return;
      }
      if (newAutoBidAmount >= newBidAmount) {
        toast.warn(`Your auto bid amount must be greater than the lowest bid (${newBidAmount})`);
        return;
      }

    }
    const confirmed = window.confirm(`Your Bid Amount is ${bid_amount} for the item ${row.category}`);
    if (!confirmed) {
      return;
    }
    try {
      const MobileData = JSON.parse(localStorage.getItem("mobile"));
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // format date as YYYY-MM-DD
      const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
      const user = localStorage.getItem("email");
      const response = await fetch(
        "https://steel.smartyerp.in/api/method/steel.api.create_new_bid",
        {
          method: "POST",
          body: JSON.stringify({
            bid_amount: newBidAmount,
            requirement: row.name,
            bid_time_date: `${formattedDate} ${formattedTime}`, // use formatted date instead of row.date
            user: user,
            profile: MobileData,
            auto_bid: autoBidValue,
            auto_bid_max_amount: newAutoBidAmount
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        }
      );
      const data = await response.json();
      if (data.status_code === 404) {
        toast.error(data.message);
      } else {
        toast.success("Congratulations! Bid Created Successfully");
        setTimeout(() => {
          window.location.reload();
          setBid_Amount('');
          setAutoBidAmount('');
          bidAmountRef.current.value = '';
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event, row) => {
    if (event.key === 'Enter') {
      BidNewData(event, row);
    }
  }

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ mt: 10, ml: { xs: 2, sm: 27 }, mr: 2, pl: 1, pr: 1, width: "auto", borderRadius: "5px" }}>
          <ToastContainer/>
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "25px", mb: 2 }}>Market Requirements</Typography>
          <Box >
            <Grid container spacing={2}>
              {requirementData.length === 0 ? (
                <Box sx={{ display: "flex", ml: { xs: 2, sm: 20 } }}>
                  <Typography
                    sx={{
                      p: 10,
                      color: "#B8390E",
                      fontSize: 24,
                      fontWeight: 'bold',
                      textAlign: "center",
                    }}
                  >No data Found..! Please Post the Requirement</Typography>
                </Box>
              ) : (
                requirementData.map((row) => (
                  <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                    <Card sx={{ py: 2, px: 2, borderRadius: "5px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", width: "auto", }}>
                      <Typography sx={{ pb: 3, fontSize: 16, fontWeight: "bold", color: "rgba(25,118,210,1)" }}>{row.title}</Typography>
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Grade:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.grade}</Grid>
                            {row.category === "Wire" ? null : <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                            </>}
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Quantity:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.quantity} ({row.uom})</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Payment:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.payment_terms}</Grid>
                            {row.category === "Wire" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Hardness Type:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.hardness_type}</Grid>
                              </> :
                              null}
                            {row.category === "Round Pipe" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>ERW/Seamless:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.erw_seamless}</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>NB/OD:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.nb_od}</Grid>
                              </> :
                              null}
                            {row.category === "Round Pipe" || row.category === "Square Pipe" || row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                              null :
                              <><Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Width:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.width_value}</Grid>
                              </>
                            }

                            {row.requirement_type === "I want to Buy" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Lowest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                              </> :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Highest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                              </>
                            }
                            {row.category === "Round Rod" || row.category === "Square/Hex Rod" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Shape:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.shape}</Grid>
                              </>
                              : null}
                            {row.category === "Coil" ?
                              null
                              :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Length:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.length}</Grid>
                              </>
                            }
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Status:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14,mb:1 }}>{row.status}</Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{mb:1}}>
                          <form onSubmit={(e) => BidNewData(e, bid_amount)}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>
                                <input
                                  onKeyPress={(e) => handleKeyPress(e, row)}
                                  onChange={InputFieldData}
                                  disabled={
                                    (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                    (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                  }
                                  ref={bidAmountRef}
                                  placeholder="Bid Amount"
                                  type="text"
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "5px",
                                    width: "100%",
                                    padding: "5px",
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14,mb:1 }}>
                                <Button
                                variant="contained"
                                size='small'
                                onClick={(e) => BidNewData(e, row, autoBidValue)}
                                disabled={
                                  (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                  (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                }
                              >
                                Bid Now
                              </Button>
                              </Grid>
                              <Grid item xs={6} sm={7} sx={{mb:1}}> 
                              <Box sx={{display:"flex",flexDirection:"row"}}>
                              <Typography sx={{fontSize:14,m:1}}>Auto Bid</Typography>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                  <Android12Switch 
                                  disabled={
                                    (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                    (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                  }
                                  onChange={(event) => toggleButtonData(event, row.name)}
                                  checked={selectedCard === row.name && showBidAmount}
                                   />
                                 
                                }
                                />
                              </FormGroup>
                              </Box>
                              </Grid>
                              
                              <Grid item xs={6} sm={5} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>
                              {showBidAmount && selectedCard === row.name && (
                                <input
                                ref={autoBidTillRef}
                                  placeholder="Bid Till"
                                  type="text"
                                  value={AutoBidAmount}
                                  onChange={(e) => setAutoBidAmount(e.target.value)}
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "5px",
                                    width: "100%",
                                    padding: "5px",
                                    marginLeft:"-20px"
                                  }}
                                />
                              )}
                              </Grid>
                             

                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>
                              {row.requirement_type === "I want to Buy" ? (
                                  <Typography sx={{ color: "#7272FF", fontSize: 14 }}>
                                    {row.lowest_bid !== "NO BIDS" ? (
                                      `Allowable: ${row.lowest_bid - 0.25}`
                                    ) : (
                                      "No Bid Now"
                                    )}
                                  </Typography>
                                ) : (
                                  <Typography sx={{ color: "#7272FF", fontSize: 14 }}>
                                    {row.highest_bids !== "NO BIDS" ? (
                                      `Allowable: ${row.highest_bids + 0.25}`
                                    ) : (
                                      "No Bid Now"
                                    )}
                                  </Typography>
                                )}
                                </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14,mb:1 }}>
                              <Link to={"/viewbiding/" + row.name} style={{ textDecoration: "none" }}><Button variant="outlined" size='small' color="success">All Bids</Button></Link>
                             </Grid>
                              {row.category === "Round Pipe" || row.category === "Round Rod" || row.category === "Wire" ?
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>Diameter:</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.diameter}</Grid>
                                </> :
                                null
                              }
                              {row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                                null :
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>Thickness:</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.thickness}</Grid>
                                </>
                              }
                              {row.category === "Square Pipe" || row.category === "Square/Hex Rod" ?
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14,mb:1 }}>Size:</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}</Grid>
                                </>
                                : null}

                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Requirement Type:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.requirement_type}</Grid>
                              <Grid item xs={6} sm={4} sx={{ fontWeight: "bold", fontSize: 14, mt: 1 }}>Expiration:</Grid>
                              <Grid item xs={6} sm={8} sx={{ fontSize: 14, mt: 1 }}>{format(new Date(row.expiration_date), 'dd-MM-yy HH:mm a')}</Grid>
                            </Grid>
                          </form>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
}


