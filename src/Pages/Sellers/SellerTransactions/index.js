import React, { useEffect, useState } from "react";
import { Button,CardContent, Grid,Typography,Card, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

const SellerTransaction = () => {

  const [TransactionData, setTransactionData] = useState([]); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);


  const applyFilter = () => {
    setIsFilterApplied(true);
  };

  const filteredData = TransactionData.filter((row) => {
    if (isFilterApplied) {
      if (startDate && endDate) {
        const rowDate = new Date(row.date);
        rowDate.setHours(0, 0, 0, 0); // Set the time of rowDate to midnight
        const endDateTime = endDate instanceof Date ? endDate.getTime() : null;
        if (rowDate < startDate || (endDateTime && rowDate > endDateTime)) {
          return false;
        }
      }
    }
    return true;
  });

  useEffect(() => {
  
  const fetchTransactionData = async () => {
    const key = JSON.parse(localStorage.getItem('key'));
    const secret = JSON.parse(localStorage.getItem('secret'));
    let result = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_user_bids", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${key}:${secret}`
      }
    });
    let res = await result.json();
    setTransactionData(res.data);
  }

  fetchTransactionData();
}, []);

  

  return (
    <>
    <Box sx={{
  ml: { xs: 0, sm: 27 },
  mt: 10,
  mr:{xs:0,sm:2},
  width: { xs: "auto", sm: "auto" }
}}>
  <Typography sx={{ fontWeight: "bold", fontSize: 25,ml:2}}>My Transactions</Typography>
  <Box sx={{ display: "flex", alignItems: "start", m: 3, flexDirection: { xs: "column", sm: "row" } }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['SingleInputDateRangeField']}>
                <DateRangePicker
                  slots={{ field: SingleInputDateRangeField }}
                  onChange={(newValue) => {
                    setStartDate(newValue[0]);
                    setEndDate(newValue[1]);
                  }}
                  format="DD-MM-YYYY"
                  renderInput={(props) => <TextField {...props} />}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button sx={{ m: 2 }} variant="contained" color="primary" onClick={applyFilter}>
              Apply
            </Button>
          </Box>
  {filteredData.length === 0 ? (
    <Typography sx={{ fontWeight: "bold", fontSize: 25, color: "#B8390E", textAlign: "center", mt: 5 }}>Opps..! Transaction Not Found</Typography>
  ) : (
    <>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
          {filteredData.map((row, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <div key={row.id} style={{ margin: "20px" }}>
                <Card variant="outlined" sx={{ width: "100%" }}>
                  <CardContent>
                    <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
                      Requirement ID : {row.requirement}
                    </Typography>
                    <Typography color="primary" sx={{ mb: 1.5,fontWeight:"bold" }}>
                      Status: <span style={{fontWeight:"lighter"}}>{row.status}</span>
                    </Typography>
                    <Typography sx={{ mb: 1.5,fontWeight:"bold" }}>
                      Bid Amount : <span style={{fontWeight:"lighter"}}>{row.bid_amount}</span>
                    </Typography>
                    <Typography sx={{ mb: 1.5,fontWeight:"bold" }}>
                      Bid Date : <span style={{fontWeight:"lighter"}}>{format(new Date(row.bid_time_date), 'dd-MM-yyyy HH:mm a')}</span> 
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
    </>
  )}
</Box>

    </>
  )
}

export default SellerTransaction;
