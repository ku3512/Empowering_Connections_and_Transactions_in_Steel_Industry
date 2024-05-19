import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Card, Grid, Typography, Box, TextField } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { format } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TablePagination from '@mui/material/TablePagination';


export default function MarketTrande() {

  const [filterStatus, setFilterStatus] = useState('Live');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterType, setFilterType] = useState('');
  const [requirementData, setRequirementData] = useState([]);
  const [CategoryTypeData, setCategoryTypeData] = useState([]);
  const [GradeTypeData, setGradeTypeData] = useState([]);
  const [StatusTypeData, setStatusTypeData] = useState([]);
  const [RequirementType, setRequirementType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState([null, null]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);


  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));

  const RoleProfile = JSON.parse(localStorage.getItem('roleProfile'));

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_market_trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`,
        },
        body: JSON.stringify
          ({
            requirement_type: filterType,
            page: page + 1,
            size: rowsPerPage,
            status: filterStatus,
            category: filterCategory,
            grade: filterGrade,
            type: filterType,
            from_date: filterDate[0],
            to_date: filterDate[1]
          })
      });

      const responseData = await response.json();
      setRequirementData(responseData.data.requirement)
      setTotalCount(responseData.data.total_requirement);
      setLoading(false);
    };

    fetchData();
  }, [page, rowsPerPage, filterCategory, filterStatus, filterGrade, filterDate, filterType]);


  const handleClearFilters = () => {
    setFilterStatus('Live');
    setFilterCategory('');
    setFilterGrade('');
    setFilterType('');
    setFilterDate([null, null]);
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
    const fetchStatusType = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_requirement_status', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setStatusTypeData(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchRequirementType = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_requirement_type', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setRequirementType(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoryType();
    fetchGradeType();
    fetchStatusType();
    fetchRequirementType();

  }, [key, secret]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (date) => {
    if (date && date[0] && date[1]) {
      const formattedStartDate = date[0].format('YYYY-MM-DD');
      const formattedEndDate = date[1].format('YYYY-MM-DD');
      setFilterDate([formattedStartDate, formattedEndDate]); // Update setFilterDate with an array of start and end dates
    }
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
        <Box sx={{ mt: 10, ml: { xs: 2, sm: 27 }, mr: 2, pl: 1, pr: 1, width: "auto", borderRadius: "5px" }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "25px", mb: 2 }}>Market Trends</Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, mb: 1 }}>
            <FormControl sx={{ width: { xs: "100%", sm: "130px" }, mt: 1, mr: { xs: 0, sm: 1 } }}>
              <InputLabel id="demo-multiple-name-label">Status</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                input={<OutlinedInput label="Status" />}
              >
                {StatusTypeData.map((option) => (
                  <MenuItem key={option.status} value={option.status}>
                    {option.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {RoleProfile === "Both" && (
              <FormControl sx={{ width: { xs: "100%", sm: "140px" }, mt: 1, mr: 1 }}>
                <InputLabel id="demo-multiple-name-label">Requirement</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={filterType}
                  onChange={(event) => setFilterType(event.target.value)}
                  input={<OutlinedInput label="Requirement" />}
                >
                  {RequirementType.map((option) => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl sx={{ width: { xs: "100%", sm: "130px" }, mt: 1, mr: 1 }}>
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
            <FormControl sx={{ width: { xs: "100%", sm: "130px" }, mt: 1, mr: 1 }}>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['SingleInputDateRangeField']}>
                <DateRangePicker
                  slots={{ field: SingleInputDateRangeField }}
                  onChange={handleDateChange}
                  format="DD-MM-YYYY"
                  value={filterDate}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Button sx={{ ml: 1, mt: 2, mb: 1, width: "65px", height: "32px" }} variant="contained" color="secondary" onClick={handleClearFilters}>
                Clear
              </Button>
            </Box>

          </Box>
          <Box >
            <Grid container spacing={2}>
              {requirementData.length === 0 ? (
                <Box sx={{ display: "flex", ml: { xs: 2, sm: 35 } }}>
                  <Typography
                    sx={{
                      p: 10,
                      color: "#B8390E",
                      fontSize: 24,
                      fontWeight: 'bold',
                      textAlign: "center",
                    }}
                  >No data Found..!</Typography>
                </Box>
              ) : (
                requirementData.map((row) => (
                  <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                    <Card sx={{ py: 2, px: 2, borderRadius: "5px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", width: "auto",height:{xs:"auto",sm:"350px"} }}>
                      <Typography sx={{ pb: 3, fontSize: 16, fontWeight: "bold", color: "rgba(25,118,210,1)" }}>{row.title}</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Quantity:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.quantity} ({row.uom})</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                              Payment Terms:
                            </Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                              {row.payment_terms}
                            </Grid>
                            {row.category === "Round Pipe" || row.category === "Round Rod" || row.category === "Wire" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Diameter:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.diameter}</Grid>
                              </> :
                              null
                            }
                            {row.category === "Wire" || row.finish === null || row.finish === ""  ? null : <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                            </>}
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
                              <><Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Width(mm):</Grid>
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
                             {row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                              null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Thickness(mm):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.thickness}</Grid>
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
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Expiration:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{format(new Date(row.expiration_date), 'dd-MM-yy HH:mm a')}</Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            {row.category === "Coil" ?
                              null
                              :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Length(mm):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.length_value}</Grid>
                              </>
                            }
                            {row.category === "Square/Hex Rod" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Shape:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.shape}</Grid>
                              </>
                              : null}
                            {row.make === null && row.make === "" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Make:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.make}</Grid>
                              </>
                              : null}
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
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Status:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.status}</Grid>
                            {row.weight === 0 ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Weight(kg):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.weight}</Grid>
                              </>}
                            {row.requirement_type === "I want to Buy" ? (
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Lowest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                              </>
                            ) :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Highest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.highest_bids}</Grid>
                              </>}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))
              )}
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
  );
}


