import React, { useState } from 'react';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
}
    from 'mdb-react-ui-kit';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Card, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AdminTransaction from './data';

function Transactions() {

    const [selectedValue, setSelectedValue] = useState('');
    // const [loading, setLoading] = useState(true);

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
        console.log(event.target.value);
      };
    return (
        <>
        {/* {loading ? (
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
    
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : ( */}
        <Box sx={{
            ml: 15,
            mt: 10,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px"
        }}>
            <MDBContainer fluid className="p-3 my-5">
                <MDBRow>
                    <MDBCol col='10' md='6'>
                            <Box sx={{m:1}}>
                                <FormControl>
                                    <InputLabel id="demo-multiple-name-label">Filter</InputLabel>
                                    <Select
                                        sx={{ width: "280px" }}
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        input={<OutlinedInput label="Filter" />}
                                        value={selectedValue}
                                        onChange={handleSelectChange}
                                    >
                                        {AdminTransaction.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Typography sx={{ fontSize: 30,fontWeight: "bold",m:1}}>Transactions</Typography>
                            <Card sx={{ width: 500, display: "flex", borderRadius: "20px" }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center' sx={{ fontWeight: "bold", fontSize: 20}}>Recent Transactions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align='center' sx={{ fontSize: 18 }}> Transaction 1</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' sx={{ fontSize: 18 }}> Transaction 2</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' sx={{ fontSize: 18 }}> Transaction 3</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' sx={{ fontSize: 18 }}> Transaction 4</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                    </MDBCol>
                    <MDBCol col='4' md='6'>
                        <img src="https://www.themedixpress.com/login/svg/chemist-img.svg" class="img-fluid" alt="Sample image" style={{marginTop:"20px"}}/>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Box>
         {/* )} */}
        </>
    );
}

export default Transactions;