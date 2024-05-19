import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { Button, Card, Divider, Grid, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


export default function AllDetails() {
  const params = useParams();
  const name = params.id;
  const navigate = useNavigate();


  const handleClick = () => {
    navigate("/requirementlist");
  }

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const key = JSON.parse(localStorage.getItem('key'));
  const secret = JSON.parse(localStorage.getItem('secret'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`https://steel.smartyerp.in/api/method/steel.api.get_single_requirement?name=${name}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `token ${key}:${secret}`,
          }
        });
        const res = await result.json();
        const formattedData = res.data.map((row) => {
          const formattedDate = format(new Date(row.date), 'dd-MM-yyyy');
          const formattedExpirationDate = format(new Date(row.expiration_date), 'dd-MM-yyyy hh:mm:ss a');
          return { ...row, date: formattedDate, expiration_date: formattedExpirationDate };
        });
        setFilteredData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name, key, secret]);

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
        <Box sx={{ mt: 10, ml: { xs: 2, sm: 27 }, mr: 2, width: { xs: "auto", sm: "900px" } }}>
          <Box sx={{ display: "flex", flexDirection: "row", mt: 2, mb: 3 }}>
            <Button variant="contained" onClick={handleClick} sx={{ borderRadius: 100, mr: 3 }}><ArrowBackIosNewIcon fontSize='small' /></Button>
            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", fontSize: 25 }}>All Details</Typography>
          </Box>
          {filteredData.map((row) => (
            <Grid key={row.name} item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{
                py: 2,
                px: 2,
                borderRadius: "5px",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                width: "100%",
              }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2} sx={{ ml: { xs: 0, sm: 0 } }}>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Category:</Grid>
                      <Grid item xs={6} sm={6}>{row.category}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Requirement Details:</Grid>
                      <Grid item xs={6} sm={6}>{row.requirement_details}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Quantity:</Grid>
                      <Grid item xs={6} sm={6}>{row.quantity}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold", }}>Date:</Grid>
                      <Grid item xs={6} sm={6}>{row.date}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Expiration Date:</Grid>
                      <Grid item xs={6} sm={6}>{row.expiration_date}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Required By:</Grid>
                      <Grid item xs={6} sm={6}>{row.required_by}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Certificate Required:</Grid>
                      <Grid item xs={6} sm={6}>{row.finish}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Grade:</Grid>
                      <Grid item xs={6} sm={6}>{row.grade}</Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2} sx={{ ml: { xs: 0, sm: 2 } }}>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Payment Terms:</Grid>
                      <Grid item xs={6} sm={6}>{row.payment_terms}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Status:</Grid>
                      <Grid item xs={6} sm={6}>{row.status}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Make:</Grid>
                      <Grid item xs={6} sm={6}>{row.make}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Length:</Grid>
                      <Grid item xs={6} sm={6}>{row.length} {row.uom}</Grid>
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Thickness:</Grid>
                      <Grid item xs={6} sm={6}>{row.thickness}</Grid>
                      {/* <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Minimum Order Quantity:</Grid>
                      <Grid item xs={6} sm={6}>{row.minimum_order_quantity}</Grid> */}
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Requirement Type:</Grid>
                      <Grid item xs={6} sm={6}>{row.requirement_type}</Grid>
                      {/* <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Certificate Required:</Grid>
                      <Grid item xs={6} sm={6}>{row.certificate_required}</Grid> */}
                      <Grid item xs={6} sm={6} sx={{ fontWeight: "bold" }}>Finish:</Grid>
                      <Grid item xs={6} sm={6}>{row.finish}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Box>
      )}
    </>
  );
}