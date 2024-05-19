import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import TablePagination from '@mui/material/TablePagination';


const BuyerHistory = () => {
  const [AllData, setAllData] = useState([]);
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const [loading, setLoading] = useState(true);
  const [CategoryTypeData, setCategoryTypeData] = useState([]);
  const [GradeTypeData, setGradeTypeData] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const requirementType = "I want to Sale";

  const resetFilters = () => {
    setFilterCategory('');
    setFilterGrade('');
  };

  useEffect(() => {
    const fetchCategoryType = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_category', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setCategoryTypeData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGradeType = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_grade', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setGradeTypeData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGradeType();
    fetchCategoryType();
  }, []);

  useEffect(() => {
    const fetchRequirementData = async () => {
      try {
        const result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_requirements_from_bids?page=${page + 1}&size=${rowsPerPage}&grade=${filterGrade}&category=${filterCategory}&type=${requirementType}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
        const res = await result.json();
        setAllData(res.data.requirement)
        setTotalCount(res.data.total_requirement[0].count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the data is fetched
      }
    };

    fetchRequirementData();
  }, [page, rowsPerPage, filterCategory, filterGrade]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <Box sx={{ mt: 10, ml: { xs: 0, sm: 25 }, mr: 2, maxWidth: "auto", width: "auto" }}>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: 25, fontWeight: "bold", ml: 3 }}>Bid History</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "start", m: 3, flexDirection: { xs: "column", sm: "row" } }}>
            <FormControl sx={{ width: { xs: "100%", sm: "180px" }, mt: 1, mr: { xs: 0, sm: 1 } }}>
              <InputLabel id="demo-multiple-name-label" >Category</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                input={<OutlinedInput label="Category" />}
              >
                {CategoryTypeData.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: { xs: "100%", sm: "180px" }, mt: 1, mr: 1 }}>
              <InputLabel id="demo-multiple-name-label">Grade</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={filterGrade}
                onChange={(event) => setFilterGrade(event.target.value)}
                input={<OutlinedInput label="Grade" />}
              >
                {GradeTypeData.map((option) => (
                  <MenuItem key={option.grade} value={option.grade}>
                    {option.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Button sx={{ ml: 1, mt: { xs: 2, sm: 3 } }} size='small' variant="contained" color="secondary" onClick={resetFilters}>
                Clear
              </Button>
            </Box>
          </Box>
          <Box sx={{ mt: 2, px: 3, pb: 5 }}>
            <Grid container spacing={2}>
              {AllData.filter(row => row.requirement_type === "I want to Sale").map((row) => (
                <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                  <Card
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: "5px",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      width: "auto",
                      height: { xs: "auto", sm: "400px" }

                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)", mt: 1, mb: 3, fontSize: 17 }}>{row.title}
                      <Link to={"/buyerallbids/" + row.name} style={{ textDecoration: "none" }}>
                        <Button variant='contained' color='primary' size='small' sx={{ float: "right" }}>My Bids</Button></Link>
                    </Typography>

                    <Grid container>
                      <Grid
                        item xs={12} sm={6}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Grade:</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.grade}</Grid>
                          {row.category === "Wire" ? null : <>
                            <Grid item xs={6} sm={5} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                            <Grid item xs={6} sm={7} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                          </>}
                          {row.category === "Coil" ?
                            null
                            :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Length(mm):</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.length_value}</Grid>
                            </>
                          }
                          {row.category === "Square Pipe" || row.category === "Square/Hex Rod" ?
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Size:</Grid>
                              {row.category === "Square/Hex Rod" ?
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}</Grid> :
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}x{row.size_2}</Grid>
                              }
                            </>
                            : null}
                          {row.category === "Square/Hex Rod" ?
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Shape:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.shape}</Grid>
                            </>
                            : null}
                          {row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                            null :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Thickness(mm):</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.thickness}</Grid>
                            </>
                          }
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                            Payment Terms:
                          </Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                            {row.payment_terms}
                          </Grid>
                          {row.weight === 0 ? null :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Weight(kg):</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.weight}</Grid>
                            </>}
                          <Grid item xs={6} sm={4} sx={{ fontWeight: "bold", fontSize: 14 }}>Expiry:</Grid>
                          <Grid item xs={6} sm={8} sx={{ fontSize: 14 }}>{format(new Date(row.expiration_date), 'dd-MM-yy HH:mm a')}</Grid>

                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={2}>
                          {row.make === "" || row.make === null ? null :
                            <>
                              <Grid item xs={6} sm={5} sx={{ fontWeight: "bold", fontSize: 14 }}>Make:</Grid>
                              <Grid item xs={6} sm={7} sx={{ fontSize: 14 }}>{row.make}</Grid>
                            </>
                          }
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Quantity:</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.quantity} ({row.uom})</Grid>
                          {row.category === "Round Pipe" || row.category === "Square Pipe" || row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                            null :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Width(mm):</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.width_value}</Grid>
                            </>
                          }
                          {row.remarks === null || row.remarks === "" ? null :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                                Remarks:
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                {row.remarks}
                              </Grid>
                            </>
                          }
                          {row.city === null || row.city === "" ? null :
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                                Delivery at:
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                {row.city}
                              </Grid>
                            </>}
                          {row.category === "Wire" ?
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Hardness Type:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.hardness_type}</Grid>
                            </> :
                            null}
                          {row.category === "Round Pipe" || row.category === "Round Rod" || row.category === "Wire" ?
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Diameter(mm):</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.diameter}</Grid>
                            </> :
                            null
                          }
                          {row.category === "Round Pipe" ?
                            <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>ERW/Seamless:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.erw_seamless}</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>NB/OD:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.nb_od}</Grid>
                            </> :
                            null}
                          <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Best Bid:</Grid>
                          <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.highest_bids}</Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* pagination  */}
          <Box sx={{ mt: 2 }}>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      )}
    </>
  )
}

export default BuyerHistory;