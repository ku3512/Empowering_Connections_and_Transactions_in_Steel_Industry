import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Card, Typography } from '@mui/material';
import SelectInputField from '../../../Common_Components/InputField/SelectInputField';
import { ValidatorForm } from 'react-material-ui-form-validator';
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

export default function Members() {
  const [accountType, setAccountType] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [allProfileData, setAllProfileData] = useState([]);
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const [loading, setLoading] = useState(true);

  const handleAccountTypeChange = (event) => {
    setSelectedAccountType(event.target.value);
  };

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_account_type', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setAccountType(data.message);
      } catch (error) {
        console.error(error)
      }
    };

    fetchAccountTypes();
  }, [key, secret]);

  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_profile', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
        const data = await response.json();
        setAllProfileData(data.data);
        setLoading(false);
        console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllProfiles();
  }, [key, secret]);

  const filteredData = selectedAccountType ? allProfileData.filter((data) => data.account_type === selectedAccountType) : allProfileData;

  return (
    <>
      <Card sx={{
        mt: 10,
        ml: { xs: 0, sm: 27 },
        pb: 3,
        pl: 2,
        pr: 2,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "5px",
        mx: "auto",
        width: { xs: "100%", sm: "82%" },
      }}>
        <Box>
          <Typography variant="h6" component="h2" sx={{ textAlign: "start", fontWeight: "bold", fontSize: "25px", mt: 2, mb: 1 }}>Members</Typography>
          <Box sx={{ width: "100%", maxWidth: "300px", mb: 2 }}>
            <ValidatorForm>
              <SelectInputField
                name="account_type"
                label="Filter Members..."
                value={selectedAccountType}
                selectOptions={accountType.map(option => ({
                  value: option,
                  label: option
                }))}
                handleInput={handleAccountTypeChange}
              />
            </ValidatorForm>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Account Type</StyledTableCell>
                  <StyledTableCell align="center">Company Name</StyledTableCell>
                  <StyledTableCell align="center">Mobile</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">City</StyledTableCell>
                  <StyledTableCell align="center">GST No.</StyledTableCell>
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
                  {filteredData.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row" align="center">
                        {row.full_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.account_type}</StyledTableCell>
                      <StyledTableCell align="center">{row.company_name}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.city ? row.city : row.other_city}</StyledTableCell>
                      <StyledTableCell align="center">{row.gst_no}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Card>



    </>
  );
}
