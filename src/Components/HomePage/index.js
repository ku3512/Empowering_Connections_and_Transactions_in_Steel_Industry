import { Box, Card, Grid, Typography } from '@mui/material';
import React from 'react';

const HomePage = () => {


    return (
        <>
   <Box sx={{ width:{xs:"100%",sm:"1000px"}, ml: { xs:0, sm: 28} }}>
      <Box sx={{ mt: 10, mx: 2 }}>
        <Typography variant='h4' sx={{ fontWeight: "bold", mb: 2 }}>
          Your Online Brokerage Platform for Stainless Steel Raw Material
        </Typography>
        <Typography>
          Perfect Dalal is a cutting-edge online brokerage platform that specializes in buying and selling stainless
          steel raw material. With our transparent, cost-effective, and on-time services, we are revolutionizing the way stainless steel raw material is traded in the market.
        </Typography>
      </Box>

      <Box sx={{ width: "100%", m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: "100%"}}>
              <Typography variant='h5' sx={{ fontWeight: "bold" }}>Transparency</Typography>
              <Typography>
                Transparency is at the core of our business philosophy. We believe in providing our clients with complete visibility into the buying and selling process. Our state-of-the-art online platform allows you to access real-time pricing empowering you to make informed decisions. You can easily compare prices from multiple suppliers and select the best option that meets your requirements.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant='h5' sx={{ fontWeight: "bold" }}>Cost-Effectiveness</Typography>
              <Typography>
                Cost-effectiveness is another key aspect of our service. We understand that every penny counts in today's competitive business environment. That's why we strive to offer the most competitive prices in the market without compromising on the quality of stainless steel raw material. Our strong network of suppliers enables us to negotiate favorable pricing, which we pass on to our clients, helping them save on their procurement costs.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant='h5' sx={{ fontWeight: "bold" }}>Time Efficiency</Typography>
              <Typography>
                Time is of the essence in the business world, and we value your time. Our streamlined and efficient processes ensure that your orders are processed promptly.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Typography variant='h5' sx={{ fontWeight: "bold" }}>Who We Cater To</Typography>
              <Typography>
                At Perfect Dalal, we cater to a wide range of traders who rely on us for their stainless steel raw material needs. Our user-friendly online platform makes it easy for you to purchase and sell stainless steel raw material. Our responsive customer service team is always available to assist you with any queries or concerns you may have.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 2, mb: 8, mx: 2 }}>
        <Typography>
          Perfect Dalal is your trusted online brokerage platform for buying and selling stainless steel raw material. With our commitment to transparency, cost-effectiveness, and timely services, we are the preferred choice for businesses looking to procure stainless steel raw material hassle-free. Experience the convenience and efficiency of our online platform and let us be your reliable partner for all your stainless steel raw material needs.
        </Typography>
      </Box>
    </Box>
</>
      
    );
};

export default HomePage;