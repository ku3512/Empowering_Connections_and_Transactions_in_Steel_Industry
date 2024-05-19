import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';

const BidStatus = () => {
  const newName = JSON.parse(localStorage.getItem('result'));
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const name = newName.user_details[0].name;
  const [loading, setLoading] = useState(true);
  const [BestBidData, setBestBidData] = useState([]);
  const [OtherBidData, setOtherBidData] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableData, setAvailableData] = useState(true);


  const type = "I want to Buy"

  useEffect(() => {
    const fetchBestBidData = async () => {
      try {
        const result = await fetch(
          `https://steel.smartyerp.in/api/method/steel.api.get_buyer_best_bid?user=${name}&type=${type}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `token ${key}:${secret}`,
            },
          }
        );
        const res = await result.json();
        setBestBidData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setAvailableData(false);
        setLoading(false);
      }
    };
    fetchBestBidData();
  }, []);

  useEffect(() => {
    const fetchOtherBidData = async () => {
      try {
        const result = await fetch(
          `https://steel.smartyerp.in/api/method/steel.api.get_buyer_other_bid?user=${name}&type=${type}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `token ${key}:${secret}`,
            },
          }
        );
        const res = await result.json();
        setOtherBidData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOtherBidData();
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const result = await fetch(
        `https://steel.smartyerp.in/api/method/steel.api.get_single_requirement?name=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${key}:${secret}`,
          },
        }
      );
      const res = await result.json();
      setSelectedRequirement(res.data);
      setDialogOpen(true); // Open the dialog
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setAvailableData(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
  };

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
          <Typography variant="h5" color="inherit" sx={{ ml: 2, color: "white" }}>
            Please Wait...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ ml: { xs: 1, sm: 30 }, mr: 1, mt: 10, width: { xs: "auto", sm: "1000px" } }}>
            <Typography sx={{ fontSize: 25, mb: 2, fontWeight: 'bold' }}>My Bids</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 5 }}>
              <Card sx={{ width: '100%', display: 'flex' }}>
                <TableContainer component={Paper}>
                  <Typography sx={{ fontWeight: 'bold', color: "rgba(25,118,210,1)", fontSize: { xs: 16, sm: 20 }, m: 2 }}>My Current Best Bids (L1)</Typography>
                  <hr />
                  <Table sx={{ mt: -2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Req. ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Bid Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: 15 }}>More Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableData ? (
                        <>
                          <CircularProgress style={{ padding: "10px" }} />
                          <Typography color="primary" sx={{ fontWeight: "bold", p: 1 }}>Please Wait...</Typography>
                        </>
                      ) : (
                        BestBidData.map((bid, index) => (
                          <TableRow
                            key={index} // Add a key prop for each mapped element
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {bid.category}
                            </TableCell>
                            <TableCell>{bid.name}</TableCell>
                            <TableCell>{bid.your_bid}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleDetailsClick(bid.name)}>Detail</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {!availableData && BestBidData.length === 0 && (
                        <TableRow>
                          <Typography colSpan={4} sx={{ color: "red", p: 1, fontSize: 15 }}>
                            No Data Available...
                          </Typography>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
              <Card sx={{ width: '100%', display: 'flex' }}>
                <TableContainer component={Paper}>
                  <Typography sx={{ fontWeight: 'bold', color: "rgba(25,118,210,1)", fontSize: { xs: 16, sm: 20 }, m: 2 }}>My Submitted Bids ( L2 and Lower)</Typography>
                  <hr />
                  <Table sx={{ mt: -2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Bid Level</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Req. ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: 15 }}>Bid Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: 15 }}>More Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableData ? (
                        <>
                          <CircularProgress style={{ padding: "10px" }} />
                          <Typography color="primary" sx={{ fontWeight: "bold", p: 1 }}>Please Wait...</Typography>
                        </>
                      ) : (
                        OtherBidData.map((otherbid, index) => (
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {otherbid.bid_level}
                            </TableCell>
                            <TableCell>{otherbid.requirement}</TableCell>
                            <TableCell>{otherbid.bid_amount}</TableCell>
                            <TableCell><Button onClick={() => handleDetailsClick(otherbid.requirement)}>Detail</Button></TableCell>
                          </TableRow>
                        ))
                      )}
                      {!availableData && OtherBidData.length === 0 && (
                        <TableRow>
                          <Typography colSpan={4} sx={{ color: "red", p: 1, fontSize: 15 }}>
                            No Data Available...
                          </Typography>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          </Box>
        </Box>
      )}

      {/* Dialog to display selected requirement */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Requirement Details</DialogTitle>
        <DialogContent>
          {/* Render the details from selectedRequirement state */}
          {selectedRequirement.map((row) => (
            <Box key={row.name}>
              <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                <Typography sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)", mt: 1, mb: 2, fontSize: 15 }}>
                  {row.title}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Grade:</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.grade}</Grid>
                      {row.category === "Wire" || row.finish === null || row.finish === "" ? null : <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                      </>}
                      {row.category === "Square/Hex Rod" ?
                        <>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Shape:</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.shape}</Grid>
                        </>
                        : null}
                      {row.category === "Coil" ?
                        null
                        :
                        <>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Length(mm):</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.length_value}</Grid>
                        </>
                      }

                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Best Bid:</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                      <Grid item xs={6} sm={4} sx={{ fontWeight: "bold", fontSize: 14 }}>Expiry:</Grid>
                      <Grid item xs={6} sm={8} sx={{ fontSize: 14 }}>{format(new Date(row.expiration_date), 'dd-MM-yyyy HH:mm a')}</Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                      {row.make === "" && row.make === null ?
                        <>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Make:</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.make}</Grid>
                      </> : null}
                    <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Quantity:</Grid>
                    <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.quantity} ({row.uom})</Grid>
                    {row.category === "Round Pipe" || row.category === "Round Rod" || row.category === "Wire" ?
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Diameter(mm):</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.diameter}</Grid>
                      </> :
                      null
                    }
                    {row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                      null :
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Thickness(mm):</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.thickness}</Grid>
                      </>
                    }
                    {row.category === "Wire" ?
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Hardness Type:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.hardness_type}</Grid>
                      </> :
                      null}
                    <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Status:</Grid>
                    <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.status}</Grid>

                    {row.category === "Round Pipe" ?
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>ERW/Seamless:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.erw_seamless}</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>NB/OD:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.nb_od}</Grid>
                      </> :
                      null}

                    {row.category === "Square Pipe" || row.category === "Square/Hex Rod" ?
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Size:</Grid>
                        {row.category === "Square/Hex Rod" ?
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}</Grid> :
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}x{row.size_2}</Grid>
                        }
                      </>
                      : null}

                    {row.category === "Round Pipe" || row.category === "Square Pipe" || row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                      null :
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Width(mm):</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.width_value}</Grid>
                      </>
                    }
                    {row.weight === 0 ? null :
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Weight:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.weight}</Grid>
                      </>}

                    {row.remarks === "" && row.remarks === null ?
                      <>
                        <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Remarks:</Grid>
                        <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.remarks}</Grid>
                      </> :
                      null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            </Box>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog >
    </>
  );
};

export default BidStatus;
