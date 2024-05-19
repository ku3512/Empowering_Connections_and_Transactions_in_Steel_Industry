import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { format } from 'date-fns';
import { ToastContainer, toast } from "react-toastify";

const ViewBiding = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [BidData, setBidData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMaxAmount, setNewMaxAmount] = useState("");
  const [autoBidMaxAmount,setAutoBidMaxAmount] = useState("");
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const [buyerUser, setBuyerUser] =useState("");

  const requirementType = "I want to Sale";

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      setNewMaxAmount(inputValue);
    }
  };


  const handleBack = () => {
    if (buyerUser === "I want to Buy") {
      navigate("/liverequirements");
    } else {
      navigate("/livepost");
    }
  }

  const handleEditClick = (auto_bid_max_amount) => {
    setAutoBidMaxAmount(auto_bid_max_amount);
    setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  }

  const handleUpdateMaxAmount = async () => {
    // Validate the newMaxAmount based on requirement_type
    if (requirementType === "I want to Sale" && newMaxAmount <= autoBidMaxAmount) {
      toast.error("Please enter an amount greater than the current max amount.");
      return;
    } else if (requirementType !== "I want to Sale" && newMaxAmount >= autoBidMaxAmount) {
      toast.error("Please enter an amount less than the current max amount.");
      return;
    }
    
    // Proceed with updating the max amount
    const result = await fetch(
      "https://steel.smartyerp.in/api/method/steel.api.update_my_bid",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${key}:${secret}`,
        },
        body: JSON.stringify({
          requirement: params.id,
          auto_bid_max_amount: autoBidMaxAmount,
          new_max_amount: newMaxAmount,
        }),
      }
    );
    const res = await result.json();
    if(res.status_code ===200){
      toast.success("New Max Amount Modified Successfully..!")
    }
    setOpenDialog(false);
  };
  
  

  useEffect(() => {
    AllBidsData();
  }, []);

  const AllBidsData = async () => {
    let result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_bids_by_requirement?requirement=${params.id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${key}:${secret}`
      }
    });
    let res = await result.json();
    setBidData(res.message);
    setBuyerUser(res.message[0].requirement_type);
  }

  return (
    <>
      <Box
        sx={{
          ml: { xs: 0, sm: 27 },
          mt: 10,
          mr: { xs: 0, sm: 2 },
          width: { xs: "auto", sm: "auto" }
        }}
      >
        <ToastContainer/>
        <Button variant="contained" sx={{ ml: 3, mt: 3, mb: 1, borderRadius: 100 }} onClick={handleBack}><ArrowBackIosNewIcon fontSize="small" /></Button>
        {BidData.length === 0 ? (
          <Typography sx={{ fontWeight: "bold", fontSize: 30, color: "#B8390E", textAlign: "center", pb: 5 }}>Opps..! Bid Not Found</Typography>
        ) : (
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            {BidData.map((row, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div key={row.id} style={{ margin: "20px" }}>
                  <Card variant="outlined" sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
                        Bid Amount: {row.bid_amount}
                      </Typography>
                      {/* <Typography color="primary" sx={{ mb: 1.5 }}>
                        Status: {row.status}
                      </Typography> */}
                      <Typography sx={{ mb: 1.5 }}>
                        Creation: {format(new Date(row.creation), 'dd-MM-yyyy HH:mm a')}
                      </Typography>
                      {row.bid_by === "Bid by you" ?
                        <span style={{ color: "green", fontWeight: "bold", marginBottom: 1.5 }}>
                          {row.bid_by}
                        </span>
                        :
                        <span style={{ fontWeight: "bold", marginBottom: 1.5 }}>
                          {row.bid_by}
                        </span>
                      }

                      {row.auto_bid === 1 && row.bid_by === "Bid by you" && (
                        <Button variant="contained" sx={{ float: "right" }} 
                        size="small"
                        onClick={() => handleEditClick(row.auto_bid_max_amount)}
                        >Modify Bid</Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Update New Max Amount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Max Amount"
            type="text"
            fullWidth
            value={newMaxAmount}
            onChange={handleChange}
          />
          <Typography>{autoBidMaxAmount && (
      <Typography variant="body1" sx={{ mt: 2,fontWeight:"bold" }}>
        Current Auto Max Amount: <span style={{color:"green"}}>{autoBidMaxAmount}</span>
      </Typography>
    )}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}size="small">Cancel</Button>
          <Button onClick={handleUpdateMaxAmount} variant="contained" color="primary" size="small">Modify</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewBiding;
