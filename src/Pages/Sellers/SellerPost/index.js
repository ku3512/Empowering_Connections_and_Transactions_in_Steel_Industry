import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TablePagination from '@mui/material/TablePagination';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const SellerPost = () => {

  const navigate = useNavigate();
  const [AllData, setAllData] = useState([]);
  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const newName = JSON.parse(localStorage.getItem("result"));
  const name = newName.user_details[0].name;
  const [loading, setLoading] = useState(true);
  const [requirementType, setRequirementType] = useState('');
  const [statusData, setStatusData] = useState([]);
  const [CategoryTypeData, setCategoryTypeData] = useState([]);
  const [GradeTypeData, setGradeTypeData] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [dateRange, setDateRange] = useState(['', '']);


  const fetchData = async () => {
    try {

      const [startDate, endDate] = dateRange;
      const result = await fetch(
        `https://steel.smartyerp.in/api/method/steel.api.get_requirement_by_seller?user=${name}&requirement_type=${requirementType}&page=${page + 1}&size=${rowsPerPage}&status=${filterStatus}&category=${filterCategory}&grade=${filterGrade}&from_date=${startDate}&to_date=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
      const res = await result.json();
      const dataWithHoursLeft = res.data.requirement.map((row) => {
        const expirationDate = new Date(row.expiration_date);
        const currentDate = new Date();
        const timeDiff = expirationDate.getTime() - currentDate.getTime();
        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesLeft = Math.floor(
          (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
        );
        return { ...row, hoursLeft, minutesLeft };
      });
      setAllData(dataWithHoursLeft);
      setTotalCount(res.data.total_requirement[0].count);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false); // Set loading to false when the data is fetched
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setAllData((prevData) => {
        const updatedData = prevData.map((row) => {
          if (row.hoursLeft > 0 || row.minutesLeft > 0) {
            if (row.minutesLeft === 0) {
              if (row.hoursLeft === 0) {
                row.hoursLeft = 0;
                row.minutesLeft = 0;
              } else {
                row.hoursLeft -= 1;
                row.minutesLeft = 59;
              }
            } else {
              row.minutesLeft -= 1;
            }
          }
          return row;
        });
        return updatedData;
      });
    }, 60000); // Update every minute (60,000 milliseconds)

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [AllData]);


  useEffect(() => {
    const fetchRequirementType = async () => {
      try {
        const response = await fetch('https://steel.smartyerp.in/api/method/steel.api.get_requirement_type', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        });
        const data = await response.json();
        setRequirementType(data.data[1].type); // Set the requirementType state
      } catch (error) {
        console.error(error);
      }
    };
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

    const fetchStatus = async () => {
      try {
        const result = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_requirement_status", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
        const res = await result.json();
        setStatusData(res.data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false); // Set loading to false when the data is fetched
      }
    };

    fetchRequirementType();
    fetchStatus();
    fetchGradeType();
    fetchCategoryType();
  }, []);

  useEffect(() => {
    if (requirementType) {
      fetchData();
    }
  }, [requirementType, filterStatus, filterCategory, filterGrade, dateRange, page, rowsPerPage]);

  const handleClearFilters = () => {
    setFilterStatus('');
    setFilterCategory('');
    setFilterGrade('');
    setDateRange(['', '']);
    fetchData();
  };


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
      setDateRange([formattedStartDate, formattedEndDate]);
    }
  };

  const EditRequirementData = (cardId) => {
    const selectedCardData = AllData.find((row) => row.name === cardId);

    if (selectedCardData) {
      const category = selectedCardData.category;
      switch (category) {
        case "Sheet/Plate":
          navigate(`/sheetplate/${cardId}`, { state: { selectedCardData } });
          break;
        case "Coil":
          navigate(`/coil/${cardId}`, { state: { selectedCardData } });
          break;
        case "Round Pipe":
          navigate(`/roundpipe/${cardId}`, { state: { selectedCardData } });
          break;
        case "Square Pipe":
          navigate(`/squarepipe/${cardId}`, { state: { selectedCardData } });
          break;
        case "Flat":
          navigate(`/flat/${cardId}`, { state: { selectedCardData } });
          break;
        case "Angle":
          navigate(`/angle/${cardId}`, { state: { selectedCardData } });
          break;
        case "Round Rod":
          navigate(`/roundrod/${cardId}`, { state: { selectedCardData } });
          break;
        case "Square/Hex Rod":
          navigate(`/squarerod/${cardId}`, { state: { selectedCardData } });
          break;
        case "Wire":
          navigate(`/wire/${cardId}`, { state: { selectedCardData } });
          break;
        default:
          // Handle the case when the category doesn't match any of the specified categories.
          break;
      }
    }
  };

  const DeleteRequirementData = (cardId) => {
    const apiUrl = `https://steel.smartyerp.in/api/method/steel.api.withdraw_requirement?requirement_name=${cardId}`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Successfully withrown requirement..")
          setTimeout(() => {
            window.location.reload();
          }, 2000)

        } else {
          toast.warn("Failed to withrown requirement..!");
        }
      })
      .catch((error) => {
        toast.warn("Network error:", error);
      });
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
          <ToastContainer style={{ fontSize: "13px" }} />
          <Typography sx={{ fontSize: 25, fontWeight: "bold", ml: 3 }}>My Posts</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              m: 3,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormControl
              sx={{
                width: { xs: "95%", sm: "150px" },
                mt: { xs: 2, sm: 1 },
                mr: { xs: 0, sm: 1 },
              }}
            >
              <InputLabel id="demo-multiple-name-label">Status</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                input={<OutlinedInput label="Status" />}
                sx={{ width: "100%" }}
              >
                {statusData.map((option) => (
                  <MenuItem key={option.status} value={option.status}>
                    {option.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                width: { xs: "95%", sm: "150px" },
                mt: 1,
                mr: { xs: 0, sm: 1 },
              }}
            >
              <InputLabel id="demo-multiple-name-label">Category</InputLabel>
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
            <FormControl
              sx={{ width: { xs: "95%", sm: "150px" }, mt: 1, mr: 1 }}
            >
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
                  value={dateRange}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button
              sx={{ ml: 1, mt: 2 }}
              size="small"
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </Box>
          <Box sx={{ mt: 2, px: 3, pb: 5 }}>
            <Grid container spacing={2}>
              {AllData.length === 0 ? (
                <Box sx={{ display: "flex", ml: { xs: 0, sm: 20 } }}>
                  <Typography
                    sx={{
                      p: 5,
                      color: "#B8390E",
                      fontSize: 24,
                      fontWeight: 'bold',
                      textAlign: "center",
                    }}
                  >No data Found..! Please Post the Requirement</Typography>
                </Box>
              ) : (
                AllData.map((row) => (
                  <Grid key={row.name} item xs={12} sm={6} md={3} lg={6}>
                    <Card
                      sx={{
                        py: 2,
                        px: 2,
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                        minWidth: "auto",
                        width: "auto",
                        height:{xs:"auto",sm:"470px"}
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", color: "rgba(25,118,210,1)", mt: 1, mb: 2, fontSize: 15 }}>
                        {row.title}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Grade:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.grade}</Grid>
                            {row.category === "Wire" || row.finish === null ? null : <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                            </>}

                            {row.category === "Wire" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Hardness Type:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.hardness_type}</Grid>
                              </> :
                              null}
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Status:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.status}</Grid>
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
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                              Payment Terms:
                            </Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                              {row.payment_terms}
                            </Grid>
                            {row.city === null || row.city === "" ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                                  Delivery at:
                                </Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                  {row.city}
                                </Grid>
                              </>}
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Best Bid:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Expiry:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 12 }}>{format(new Date(row.expiration_date), 'dd-MM-yyyy HH:mm a')}</Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            {row.make === null ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Make:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.make}</Grid>
                              </>}
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
                            {row.weight === 0 ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Weight(kg):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.weight}</Grid>
                              </>}
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                              Time Left:
                            </Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14, color: "#EE4B2B" }}>
                              {row.hoursLeft > 0 ? (
                                row.hoursLeft > 24 ? (
                                  `${Math.floor(row.hoursLeft / 24)} days ${row.hoursLeft % 24} hours ${row.minutesLeft} minutes`
                                ) : (
                                  `${row.hoursLeft} hours ${row.minutesLeft} minutes`
                                )
                              ) : (
                                "Expired"
                              )}
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              {
                                row.docstatus === 0 && row.status !== "Withdrawn" && row.hoursLeft > 0 ? (
                                  <Button size="small" variant="contained" onClick={() => EditRequirementData(row.name)}>
                                    Edit
                                  </Button>
                                ) : null
                              }

                              {row.highest_bids === 'NO BIDS' && row.hoursLeft > 0 && row.status === 'Live' && (
                                <Button
                                  variant='contained'
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                  onClick={() => DeleteRequirementData(row.name)}
                                >
                                  Withdraw
                                </Button>
                              )}
                            </Grid>
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
  )
}

export default SellerPost;