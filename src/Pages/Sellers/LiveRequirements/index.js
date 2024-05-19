import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Card, Grid, TextField, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { format } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import TablePagination from '@mui/material/TablePagination';
import { Tooltip as ReactTooltip } from "react-tooltip";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function LiveRequirements() {

  const bidAmountRef = useRef();
  const autoBidTillRef = useRef();
  const [filterStatus, setFilterStatus] = useState('Live');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [requirementData, setRequirementData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [bid_amount, setBid_Amount] = useState({});
  const [AutoBidAmount, setAutoBidAmount] = useState({});
  const [showBidAmount, setShowBidAmount] = useState(false);
  const [CategoryTypeData, setCategoryTypeData] = useState([]);
  const [GradeTypeData, setGradeTypeData] = useState([]);
  const [StatusTypeData, setStatusTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoBidValue, setAutoBidValue] = useState(null);
  const [filterDate, setFilterDate] = useState([null, null]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const Type = "I want to Buy"

  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));
  const UserId = JSON.parse(localStorage.getItem('userId'));

  useEffect(() => {
    const mobile = JSON.parse(localStorage.getItem("mobile"));
    const fetchData = async () => {
      const result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_single_profile?mobile=${mobile}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`,
        }
      })
      const res = await result.json();
      const valuesArray = res.data[0].category.reduce((arr, obj) => {
        return arr.concat(Object.values(obj));
      }, []);

      const response = await fetch("https://steel.smartyerp.in/api/method/steel.api.get_requirement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `token ${key}:${secret}`,
        },
        body: JSON.stringify
          ({
            categories: valuesArray,
            page: page + 1,
            size: rowsPerPage,
            type: Type,
            status: filterStatus,
            category: filterCategory,
            grade: filterGrade,
            from_date: filterDate[0],
            to_date: filterDate[1]
          })
      });

      const responseData = await response.json();
      setRequirementData(responseData.data.requirement)
      setTotalCount(responseData.data.total_requirement[0].count);
      setLoading(false);
    };

    fetchData();
  }, [page, rowsPerPage, filterCategory, filterStatus, filterGrade, filterDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilterStatus('Live');
    setFilterCategory('');
    setFilterGrade('');
    setFilterDate([null, null])
  };

  const handleDateChange = (date) => {
    if (date && date[0] && date[1]) {
      const formattedStartDate = date[0].format('YYYY-MM-DD');
      const formattedEndDate = date[1].format('YYYY-MM-DD');
      setFilterDate([formattedStartDate, formattedEndDate]); // Update setFilterDate with an array of start and end dates
    }
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
    fetchCategoryType();
    fetchGradeType();
    fetchStatusType();

  }, [key, secret]);


  const InputFieldData = (e, cardId) => {
    const { name, value } = e.target;
    if (name === 'bid_amount') {
      if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
        setBid_Amount(prevBidAmounts => ({
          ...prevBidAmounts,
          [cardId]: value
        }));
      }
    }
  };

  const NewInputFieldData = (e, cardId) => {
    const { name, value } = e.target;
    if (name === 'AutoBidAmount') {
      if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
        setAutoBidAmount(prevAutoBidAmounts => ({
          ...prevAutoBidAmounts,
          [cardId]: value
        }));
      }
    }
  };

  const toggleButtonData = (event, cardId) => {
    const autobidValue = event.target.checked ? 1 : 0;
    setAutoBidValue(autobidValue);
    setShowBidAmount(event.target.checked);
    setSelectedCard(cardId);
    setAutoBidAmount('');

    if (autobidValue) {
      setTimeout(() => {
        autoBidTillRef.current.focus();
      }, 0);
    }
  };

  //bid now button function
  const BidNewData = async (e, row, autoBidValue) => {
    e.preventDefault();

    if (autoBidValue && AutoBidAmount === '') {
      toast.warn('You have not entered any value in auto bid');
      return;
    }

    const newBidAmount = parseFloat(bid_amount[row.name]);
    const newAutoBidAmount = parseFloat(AutoBidAmount[row.name]);

    if (isNaN(newBidAmount) || newBidAmount <= 0) {
      toast.error('Please enter a valid bid amount!');
      return;
    }

    const parsedValue = parseFloat(newBidAmount);
    if (isNaN(parsedValue)) {
      setBid_Amount('');
    } else {
      const roundedValue = Math.round(parsedValue * 100) / 100; // Round to two decimal places
      const isValid = roundedValue % 0.25 === 0; // Check if value is a multiple of 0.25

      if (isValid) {
        setBid_Amount(roundedValue.toFixed(2)); // Set the valid value with two decimal places
      } else {
        toast.error('Please enter a valid bid amount! Only multiples of 0.25 are allowed.');
        return;
      }
    }

    const newParsedValue = parseFloat(newAutoBidAmount);
    if (isNaN(newParsedValue)) {
      setAutoBidAmount('');
    } else {
      const newRoundedValue = Math.round(newParsedValue * 100) / 100; // Round to two decimal places
      const isNewValid = newRoundedValue % 0.25 === 0; // Check if value is a multiple of 0.25

      if (isNewValid) {
        setAutoBidAmount(newRoundedValue.toFixed(2)); // Set the valid value with two decimal places
      } else {
        toast.error('Please enter a valid auto bid amount! Only multiples of 0.25 are allowed.');
        return;
      }
    }


    const lowestBidAmount = parseFloat(row.lowest_bid);
    const highestBidAmount = parseFloat(row.highest_bids)
    if (row.requirement_type === "I want to Sale") {
      if (newBidAmount <= highestBidAmount) {
        toast.warn(`Your bid amount must be greater than the highest bid (${highestBidAmount})`);
        return;
      }
      if (newBidAmount <= highestBidAmount + 0.24) {
        toast.warn(`Your bid amount must be at least 0.25 greater than the highest bid (${highestBidAmount + 0.25})`);
        return;
      }
      if (newAutoBidAmount <= newBidAmount) {
        toast.warn(`Your auto bid amount must be greater than the highest bid (${newBidAmount})`);
        return;
      }

    } else if (row.requirement_type === "I want to Buy") {
      if (newBidAmount >= lowestBidAmount) {
        toast.warn(`Your bid amount must be less than the lowest bid (${lowestBidAmount})`);
        return;
      }
      if (newBidAmount >= lowestBidAmount - 0.24) {
        toast.warn(`Your bid amount must be at least 0.25 less than the lowest bid (${lowestBidAmount - 0.25})`);
        return;
      }
      if (newAutoBidAmount >= newBidAmount) {
        toast.warn(`Your auto bid amount must be less than the lowest bid (${newBidAmount})`);
        return;
      }

    }
    let message = `Your Bid Amount is ${newBidAmount} for the item ${row.category}`;
    if (newAutoBidAmount) {
      message += `\nAutobid Amount: ${newAutoBidAmount}`;
    }
    const confirmed = window.confirm(message);
    if (!confirmed) {
      return;
    }
    try {
      const MobileData = JSON.parse(localStorage.getItem("mobile"));
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // format date as YYYY-MM-DD
      const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: false });
      const user = localStorage.getItem("email");
      const response = await fetch(
        "https://steel.smartyerp.in/api/method/steel.api.create_new_bid",
        {
          method: "POST",
          body: JSON.stringify({
            bid_amount: newBidAmount,
            requirement: row.name,
            bid_time_date: `${formattedDate} ${formattedTime}`, // use formatted date instead of row.date
            user: user,
            profile: MobileData,
            auto_bid: autoBidValue,
            auto_bid_max_amount: newAutoBidAmount
          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`
          }
        }
      );
      const data = await response.json();
      if (data.status_code === 404) {
        toast.error(data.message);
      } else {
        toast.success("Congratulations! Bid Created Successfully..!");
        setTimeout(() => {
          window.location.reload();
          setBid_Amount('');
          setAutoBidAmount('');
          bidAmountRef.current.value = '';
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event, row) => {
    if (event.key === 'Enter') {
      BidNewData(event, row);
    }
  }

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
          <ToastContainer style={{ fontSize: "13px" }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: "25px", mb: 2 }}>Live Requirements</Typography>
          <Box sx={{ display: "flex", alignItems: "start", mt: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <FormControl sx={{ width: { xs: "90%", sm: "150px" }, mt: { xs: 2, sm: 1 }, mr: { xs: 0, sm: 1 } }}>
              <InputLabel id="demo-multiple-name-label">Status</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                input={<OutlinedInput label="Status" />}
                sx={{ width: "100%" }}
              >
                {StatusTypeData.map((option) => (
                  <MenuItem key={option.status} value={option.status}>
                    {option.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: { xs: "90%", sm: "150px" }, mt: 1, mr: { xs: 0, sm: 1 } }}>
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
            <FormControl sx={{ width: { xs: "90%", sm: "150px" }, mt: 1, mr: 1 }}>
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

              <Button sx={{ ml: 1, mt: { xs: 2, sm: 3 } }} size='small' variant="contained" color="secondary" onClick={handleClearFilters}>
                Clear
              </Button>
            </Box>
          </Box>
          <Box >
            <Grid container spacing={2}>
              {requirementData.length === 0 ? (
                <Box sx={{ display: "flex", ml: { xs: 2, sm: 40 } }}>
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
                    <Card sx={{ py: 2, px: 2, borderRadius: "5px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", width: "auto", height: { xs: "auto", sm: "450px" } }}>
                      <Typography sx={{ pb: 3, fontSize: 16, fontWeight: "bold", color: "rgba(25,118,210,1)" }}>{row.title}</Typography>
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Grade:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.grade}</Grid>
                            {row.category === "Wire" || row.finish === "" || row.finish === null ? null : <>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Finish:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.finish}</Grid>
                            </>}
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Quantity:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.quantity} ({row.uom})</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb:1 }}>
                                Payment Terms:
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                {row.payment_terms}
                              </Grid>
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
                            {row.category === "Round Pipe" || row.category === "Square Pipe" || row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                              null :
                              <><Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Width(mm):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.width_value}</Grid>
                              </>
                            }

                            {row.requirement_type === "I want to Buy" ?
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Lowest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.lowest_bid}</Grid>
                              </> :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Highest Bid:</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.highest_bids}</Grid>
                              </>
                            }
                            {row.category === "Round Rod" || row.category === "Square/Hex Rod" ? (
                              row.shape !== null ? (
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Shape:</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.shape}</Grid>
                                </>
                              ) : null
                            ) : null}
                            {row.category === "Coil" ?
                              null
                              :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Length(mm):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.length_value}</Grid>
                              </>
                            }
                            {row.remarks === "" || row.remarks === null ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>
                                  Remarks:
                                </Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                  {row.remarks}
                                </Grid>
                              </>
                            }
                            <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14 }}>Status:</Grid>
                            <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.status}</Grid>
                            {row.weight === 0 ? null :
                              <>
                                <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Weight(kg):</Grid>
                                <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.weight}</Grid>
                              </>}
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                          <form onSubmit={(e) => BidNewData(e, bid_amount)}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>
                                <input
                                  onKeyPress={(e) => handleKeyPress(e, row)}
                                  disabled={
                                    (row.status !== "Live") ||
                                    (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                    (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                  }
                                  ref={bidAmountRef}
                                  placeholder="Bid Amount"
                                  name='bid_amount'
                                  onChange={(e) => InputFieldData(e, row.name)}
                                  value={bid_amount[row.name] || ''}
                                  type="text"
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "5px",
                                    width: "100%",
                                    padding: "5px",
                                  }}
                                  data-tooltip-id={(row.status !== "Live") ||
                                    (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                    (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId) ? "my-tooltip-1" : null}
                                />
                                <ReactTooltip
                                  id="my-tooltip-1"
                                  place="right"
                                  variant="info"
                                  content="Your bid is the best at the moment"
                                />
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14, mb: 1 }}>
                                <Button
                                  variant="contained"
                                  size='small'
                                  onClick={(e) => BidNewData(e, row, autoBidValue)}
                                  disabled={
                                    (row.status !== "Live") ||
                                    (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                    (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                  }
                                >
                                  Bid Now
                                </Button>
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ mb: 1 }}>
                                <Box sx={{ display: "flex", flexDirection: "row" }}>
                                  <Typography sx={{ fontSize: 14, mt: 1, mb: 1 }}>Auto Bid</Typography>
                                  <FormGroup sx={{ ml: 1 }}>
                                    <FormControlLabel
                                      control={
                                        <Android12Switch
                                          disabled={
                                            (row.status !== "Live") ||
                                            (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                            (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId)
                                          }
                                          onChange={(event) => toggleButtonData(event, row.name)}
                                          checked={selectedCard === row.name && showBidAmount}
                                        />

                                      }
                                    />
                                  </FormGroup>
                                </Box>
                              </Grid>

                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>
                                {showBidAmount && selectedCard === row.name && (
                                  <input
                                    ref={autoBidTillRef}
                                    placeholder="Bid Till"
                                    type="text"
                                    name='AutoBidAmount'
                                    value={AutoBidAmount[row.name] || ''} // Use the autoBidAmounts object for value
                                    onChange={(e) => NewInputFieldData(e, row.name)}
                                    style={{
                                      border: "1px solid black",
                                      borderRadius: "5px",
                                      width: "100%",
                                      padding: "5px",
                                      marginLeft: "-20px"
                                    }}
                                  />
                                )}
                              </Grid>

                              {
                                (row.status !== "Live") ||
                                  (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                  (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId) ?
                                  null
                                  :
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>
                                    {row.requirement_type === "I want to Buy" ? (
                                      <Typography sx={{ color: "#7272FF", fontSize: 14 }}>
                                        {row.lowest_bid !== "NO BIDS" ? (
                                          `Allowable: ${row.lowest_bid - 0.25}`
                                        ) : (
                                          "No Bid Now"
                                        )}
                                      </Typography>
                                    ) : (
                                      <Typography sx={{ color: "#7272FF", fontSize: 14 }}>
                                        {row.highest_bids !== "NO BIDS" ? (
                                          `Allowable: ${row.highest_bids + 0.25}`
                                        ) : (
                                          "No Bid Now"
                                        )}
                                      </Typography>
                                    )}
                                  </Grid>
                              }
                              <Grid item xs={(row.status !== "Live") ||
                                (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId) ? 12 : 6} sm={(row.status !== "Live") ||
                                  (row.requirement_type === "I want to Sale" && row.highest_bid_user === UserId) ||
                                  (row.requirement_type === "I want to Buy" && row.lowest_bid_user === UserId) ? 12 : 6} sx={{ fontSize: 14, mb: 1 }}>
                                <Link to={"/selleruserallbids/" + row.name} style={{ textDecoration: "none" }}><Button variant="outlined" size='small' color="success">All Bids</Button></Link>
                              </Grid>
                              {row.category === "Round Pipe" || row.category === "Round Rod" || row.category === "Wire" ?
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Diameter(mm):</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.diameter}</Grid>
                                </> :
                                null
                              }
                              {row.all_bids.length > 0 ?
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Auto Bid Amount:</Grid>
                                  {row.all_bids.map((item) => {
                                    return (
                                      <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{item.auto_bid_max_amount}</Grid>
                                    )
                                  })}
                                </>
                                : null
                              }
                              {row.category === "Round Rod" || row.category === "Square/Hex Rod" || row.category === "Wire" ?
                                null :
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Thickness(mm):</Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.thickness}</Grid>
                                </>
                              }
                              {row.category === "Square Pipe" || row.category === "Square/Hex Rod" ?
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Size:</Grid>
                                  {row.category === "Square/Hex Rod" ?
                                    <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}</Grid> :
                                    <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.size}x{row.size_2}</Grid>
                                  }
                                </>
                                : null}
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Requirement Type:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>{row.requirement_type}</Grid>
                              {row.city === "" || row.city === null ? null :
                                <>
                                  <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>
                                    Delivery at:
                                  </Grid>
                                  <Grid item xs={6} sm={6} sx={{ fontSize: 14 }}>
                                    {row.city}
                                  </Grid>
                                </>}
                              <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", fontSize: 14, mb: 1 }}>Expiration:</Grid>
                              <Grid item xs={6} sm={6} sx={{ fontSize: 14, mt: 1 }}>{format(new Date(row.expiration_date), 'dd-MM-yy HH:mm a')}</Grid>
                            </Grid>
                          </form>
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


