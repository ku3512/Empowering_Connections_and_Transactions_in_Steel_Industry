import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const BuyerAllBids = () => {
  const params = useParams();

  const navigate = useNavigate();
  const [BidData, setBidData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const UserId = JSON.parse(localStorage.getItem("userId"));

  const handleBack = () => {
    navigate("/buyerhistory")
  }

  useEffect(() => {
  
  const AllBidsData = async () => {
    const key = JSON.parse(localStorage.getItem('key'));
    const secret = JSON.parse(localStorage.getItem('secret'));
    let result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_bids_by_requirement?requirement=${params.id}&user=${UserId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${key}:${secret}`
      }
    });
    let res = await result.json();
    setBidData(res.message);
    setLoading(false);
  }

  AllBidsData();
}, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  

  return (
    <>
    {loading ? (
        <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h5" color="inherit" sx={{ ml: 2,color:"white" }}>
          Please Wait...
        </Typography>
      </Box>
      ) : (
    <Card sx={{
  ml: { xs: 0, sm: 27 },
  mt: 10,
  mr:{xs:0,sm:2},
  width: { xs: "auto", sm: "auto" }
}}>
  <Button variant="contained" sx={{ ml:3,mt:3,mb:1,borderRadius:100 }} onClick={handleBack}><ArrowBackIosNewIcon fontSize="small"/></Button>
  {BidData.length === 0 ? (
    <Typography sx={{ fontWeight: "bold", fontSize: 30, color: "#B8390E", textAlign: "center", pb: 5 }}>Opps..! Bid Not Found</Typography>
  ) : (
    <>
      <Box style={{ display: "inline" }}></Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {BidData.map((row, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <div key={row.id} style={{ margin: "20px" }}>
                <Card variant="outlined" sx={{ width: "auto" }}>
                  <CardContent>
                    <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
                      Bid Amount: {row.bid_amount}
                    </Typography>
                    {/* <Typography color="primary" sx={{ mb: 1.5 }}>
                      Status: {row.status}
                    </Typography> */}
                    <Typography sx={{ mb: 1.5 }}>
                      Creation: {formatDate(row.creation)}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", mb: 1.5,color:"green" }}>
                      {row.bid_by}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )}
</Card>
   )}
    </>
  )
}

export default BuyerAllBids;
