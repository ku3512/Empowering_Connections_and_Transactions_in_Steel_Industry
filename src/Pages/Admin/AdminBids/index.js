import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Divider, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RequirementType from './data';

// const colors = ['lightBlue', 'darkCyan', 'lightGreen', 'cornflowerBlue', 'lavender','lightCoral'];

const AdminBids = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [AllData, setAllData] = useState([]);
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const newName = JSON.parse(localStorage.getItem("result"));
  const name = newName.user_details[0].name;
  const [loading, setLoading] = useState(true);


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_requirement_by_seller?user=${name}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
        const res = await result.json();
        console.log(res.data);
        setAllData(res.data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false); // Set loading to false when the data is fetched
      }
    };
    fetchData();
  }, []);



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
        <Box sx={{ mt: 10, ml: { xs: 50, sm: 15 }, mr: 2, pl: 3, pr: 3, maxWidth: "1050px", width: "auto" }}>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: 30, fontWeight: "bold", ml: { xs: 15,sm:2 }, p: 2 }}>Admin Dasboard</Typography>
            <Box sx={{ ml: { xs: 5, sm: 50 }, p: 2 }}>
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
                  {RequirementType.map((option) => (
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
          </Box>
          <Box sx={{ mt: 2, px: 3, pb: 5, ml: { xs: 10, sm: 0 } }}>
            <Grid container spacing={2}>
              {AllData.map((row,index) => (
                <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                  <Card
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: "5px",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      width: "auto",
                    
                      // backgroundColor: colors[index % colors.length]
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={2} sx={{ml:{xs:0,sm:0}}}>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Name:</Grid>
                          <Grid item xs={6} sm={6}>{row.name}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Category:</Grid>
                          <Grid item xs={6} sm={6}>{row.category}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Grade:</Grid>
                          <Grid item xs={6} sm={6}>{row.grade}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Finish:</Grid>
                          <Grid item xs={6} sm={6}>{row.finish}</Grid>

                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}  sx={{ml:{xs:0,sm:2}}}>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Make:</Grid>
                          <Grid item xs={6} sm={6}>{row.make}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Quantity:</Grid>
                          <Grid item xs={6} sm={6}>{row.quantity}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Length:</Grid>
                          <Grid item xs={6} sm={6}>{row.length} {row.uom}</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", mb: 1 }}>Thickness:</Grid>
                          <Grid item xs={6} sm={6}>{row.thickness}</Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ border: "1px solid black" }} />
                      </Grid>
                      <Box sx={{ mt:2}}>
                        <Grid item xs={12} sm={12} sx={{ml:3}}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)" }}>Current Best Bid:</Grid>
                            <Grid item xs={6} sm={6}>{row.lowest_bid}</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)" }}>Expiry:</Grid>
                            <Grid item xs={6} sm={6}>{row.expiration_date}</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)" }}>Buyer:</Grid>
                            <Grid item xs={6} sm={6}>No value</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)" }}>Seller With Best Bid:</Grid>
                            <Grid item xs={6} sm={6}>No Bids</Grid>
                          </Grid>
                        </Grid>

                      </Box>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  )
}

export default AdminBids;