import React, { useEffect, useState } from "react";
import { Card, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Biding = () => {

  const [BidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userprofile();
  }, []);

  const userprofile = async () => {
    const key = JSON.parse(localStorage.getItem('key'));
    const secret = JSON.parse(localStorage.getItem('secret'));
    let result = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_biding", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${key}:${secret}`
      }
    });
    let res = await result.json();
    setBidData(res.data);
    setLoading(false);
  }

  return (
    <>
      <Box sx={{
        mt: 10,
        pl: 2,
        pr: 2,
        pb: 3,
        ml: { xs: 60, sm: 25},
        width: { xs: "100%", sm: "600px", md: "800px", lg: "1050px" },
      }}>
        <Box style={{ display: "inline" }}>
          <Typography variant="h6" component="h2" sx={{ textAlign: "start", fontWeight: "bold", margin: "20px", fontSize: "25px", float: "left" }}>Bidings</Typography>

          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>User</StyledTableCell>
            <StyledTableCell align="center">Requirement</StyledTableCell>
            <StyledTableCell align="center">Bid Amount</StyledTableCell>
            <StyledTableCell align="center">Bid Date Time</StyledTableCell>
            <StyledTableCell align="center">Profile</StyledTableCell>
            <StyledTableCell align="center">Winning Bid</StyledTableCell>
          </TableRow>
        </TableHead>
        {loading ? (
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={loading}

                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
        <TableBody>
          {BidData.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
              {row.user}
              </StyledTableCell>
              <StyledTableCell align="center">{row.requirement}</StyledTableCell>
              <StyledTableCell align="center">{row.bid_amount}</StyledTableCell>
              <StyledTableCell align="center"> {new Date(row.bid_time_date).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        }).split('/').join('-')}</StyledTableCell>
              <StyledTableCell align="center">{row.profile}</StyledTableCell>
              <StyledTableCell align="center">{row.winning_bid}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
         )}
      </Table>
    </TableContainer>

        </Box>
      </Box>
    </>
  )
}

export default Biding;
