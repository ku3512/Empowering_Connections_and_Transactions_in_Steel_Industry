import React, { useState,useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { BiDetail } from "react-icons/bi";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from 'axios';

const drawerWidth = 200;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const auth = localStorage.getItem("result");
  const userRole = JSON.parse(localStorage.getItem("roleProfile"));
  const [activeButton, setActiveButton] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [BuyerMenuOpen, setBuyerMenuOpen] = useState(false);
  const [SellerMaterialOpen, SetSellerMaterialOpen] = useState(false);
  const [sellerMenuOpen, setSellerMenuOpen] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [userIsActive, setUserIsActive] = useState(true);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const apiUrl = 'https://steel.smartyerp.in/api/method/steel.api.get_session_expiry_time';

    // Function to reset the session timeout timer
    const resetSessionTimeout = () => {
      clearTimeout(timeoutRef.current);
      if (sessionTimeout) {
        const timeoutMilliseconds = sessionTimeout * 60000;
        timeoutRef.current = setTimeout(() => {
          if (isComponentMounted) {
            // Clear the session data from local storage
            localStorage.removeItem('result');
            localStorage.removeItem('secret');
            localStorage.removeItem('key');
            localStorage.removeItem('mobile');
            localStorage.removeItem("roleProfile");
            localStorage.removeItem('userId');
            
            // Navigate to the login page
            navigate('/login');
          }
        }, timeoutMilliseconds);
      }
    };

    // Fetch the session timeout and set the timer
    axios.get(apiUrl)
      .then(response => {
        const timeout = response.data.data.desktop;
        setSessionTimeout(timeout);
        resetSessionTimeout(); // Initial setup of the timer

        // Event listeners for user activity
        document.addEventListener('mousemove', resetSessionTimeout);
        document.addEventListener('keydown', resetSessionTimeout);

        return () => {
          // Cleanup: Remove event listeners and clear the timer
          document.removeEventListener('mousemove', resetSessionTimeout);
          document.removeEventListener('keydown', resetSessionTimeout);
          clearTimeout(timeoutRef.current);
          setIsComponentMounted(false);
        };
      })
      .catch(error => {
        console.error('Error fetching session timeout:', error);
      });
  }, [isComponentMounted, sessionTimeout]);

  // Add a new function to close the sidebar when a list item is clicked
  const handleListItemClick = () => {
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const handleBuyerMenuToggle = () => {
    setBuyerMenuOpen(!BuyerMenuOpen);
  };

  const handleSellerMenuToggle = () => {
    setSellerMenuOpen(!sellerMenuOpen);
  };

  const handleSellerMaterialMenuToggle = () => {
    SetSellerMaterialOpen(!SellerMaterialOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/gst");
  };

  const logOutUser = () => {
    localStorage.removeItem("result");
    localStorage.removeItem("key");
    localStorage.removeItem("secret");
    localStorage.removeItem("roleProfile");
    localStorage.removeItem("mobile");
    localStorage.removeItem("userId");
    navigate("/login");
  }
  const ShowUserProfile = () => {
    navigate("/profile");
  }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: "rgba(25,118,210,1)", color: "white", boxShadow: "0 0 10px rgba(0, 0, 0, 2)" }}> <Typography noWrap component="div" style={{ fontSize: "22px", fontWeight: "bold",cursor:"pointer" }} onClick={() => { navigate('/'); handleListItemClick();}}>
        Perfect Dalal
      </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ backgroundColor: "#F5F5F5" }}>


        {/* Buyer menu start */}
        {userRole === "Buyer" || userRole === "Both" ? (
          <>
            {userRole === "Both" ?
              <Typography sx={{ ml: 2, mb: 1, mt: 1, fontSize: 14, fontWeight: "bold", cursor: "pointer" }} onClick={handleMenuToggle}>
                Requirement Posting and Tracking {menuOpen ? <ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
              </Typography>
              : <Typography sx={{ ml: 2, mb: 1, mt: 1, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Requirement Posting and Tracking</Typography>}
            <Divider />
            {(menuOpen || (userRole === "Buyer")) && (
              <>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/newrequirement'); handleListItemClick(); }}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "teal"
                      }}
                    >
                      <PostAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Dashboard' sx={{ fontSize: 13 }}>Post Requirement</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/buyerrequirement'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "#c62828"
                      }}
                    >
                      <BiDetail />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>My Requirements</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/buyertransaction'); handleListItemClick();  }}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "#01579b"
                      }}
                    >
                      <ReceiptIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>Transaction History</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}
          </>
        ) : null}
        {userRole === "Buyer" || userRole === "Both" ? (
          <>
            {userRole === "Both" ?
              <Typography sx={{ ml: 2, mb: 1, mt: 1, fontSize: 14, fontWeight: "bold", cursor: "pointer" }} onClick={handleSellerMenuToggle}>
                Seller’s Listing {sellerMenuOpen ?<ArrowDropUpIcon/>:<ArrowDropDownIcon /> }
              </Typography>
              : <Typography sx={{ ml: 2, mb: 1, mt: 1, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Seller’s Listing</Typography>}
            <Divider />
            {(sellerMenuOpen || (userRole === "Buyer")) && (
              <>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/livepost'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "#3d5afe"
                      }}
                    >
                      <ListAltIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Requirements' sx={{ fontSize: 13 }}>Live Posts From Sellers</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/buyerbids'); handleListItemClick();  }}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "orange"
                      }}
                    >
                      <WysiwygIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>My Bids</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/buyerhistory'); handleListItemClick(); }}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "teal"
                      }}
                    >
                      <MoveToInboxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Dashboard' sx={{ fontSize: 13 }}>Bid History</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}
          </>
        ) : null}
        {/* Buyer menu end */}

        {/* Sellers menu start*/}
        {userRole === "Seller" || userRole === "Both" ? (
          <>
            {userRole === "Both" ?
              <Typography sx={{ m: 2, fontSize: 14, fontWeight: "bold", cursor: "pointer" }} onClick={handleBuyerMenuToggle}>
                Buyer’s Listing {BuyerMenuOpen ? <ArrowDropUpIcon />:<ArrowDropDownIcon />}</Typography>
              : <Typography sx={{ m: 2, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Buyer’s Listing </Typography>}
            <Divider />
            {(BuyerMenuOpen || (userRole === "Seller")) && (
              <>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/liverequirements'); handleListItemClick();  }}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "#3d5afe"
                      }}
                    >
                      <ListAltIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Requirements' sx={{ fontSize: 13 }}>Live Requirements</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/bidstatus'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "orange"
                      }}
                    >
                      <WysiwygIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>Bid Status</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/sellerbidhistory'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "teal"
                      }}
                    >
                      <MoveToInboxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Dashboard' sx={{ fontSize: 13 }}>Bid History</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}
          </>
        ) : null}
        {userRole === "Seller" || userRole === "Both" ? (
          <>
            {userRole === "Both" ?
              <Typography sx={{ m: 2, fontSize: 14, fontWeight: "bold", cursor: "pointer" }} onClick={handleSellerMaterialMenuToggle}>
                Material Selling {SellerMaterialOpen ? <ArrowDropUpIcon/>:<ArrowDropDownIcon />}</Typography>
              : <Typography sx={{ m: 2, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>Material Selling</Typography>}
            <Divider />
            {(SellerMaterialOpen || (userRole === "Seller")) && (
              <>
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/postnewrequirement'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "teal"
                      }}
                    >
                      <PostAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Dashboard' sx={{ fontSize: 13 }}>Post Material For Sale</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/sellerpost'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "purple"
                      }}
                    >
                      <LocalActivityIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>My Posts</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/sellertransaction'); handleListItemClick();}}>
                  <ListItemButton>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1,
                        justifyContent: 'start',
                        color: "#01579b"
                      }}
                    >
                      <ReceiptIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={
                      <Typography variant='Biding' sx={{ fontSize: 13 }}>My Transactions</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            )}
          </>
        ) : null}
        {/* Sellers menu end */}
        {userRole ?
          <>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate('/markettrends'); handleListItemClick();}}>
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1,
                    justifyContent: 'start',
                    color: "teal"
                  }}
                >
                  <StorefrontIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant='Biding' sx={{ fontSize: 13 }}>Market Trends</Typography>
                } />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
          : null}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Typography noWrap component="div" style={{ fontSize: "25px", fontWeight: "bold" }}>
            Perfect Dalal
          </Typography> */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
             {/* <Link to="/support"> */}
              <SupportAgentIcon sx={{ m: 2,color:"white" }}/>
              {/* </Link>  */}
              <Typography variant="h6" noWrap>
                {auth ? <div>
                  <Button
                    onClick={handleMenuOpen}
                    variant="text"
                    style={{ color: "white", fontFamily: 'lato' }}
                    aria-controls="menu"
                    aria-haspopup="true"
                  >
                    <Avatar src="/broken-image.jpg" />
                    <span style={{ marginLeft: '0.5rem' }}>
                      {auth ? JSON.parse(auth).full_name : null}
                    </span>
                  </Button>
                  {
                    userRole === "Buyer" ? (
                      <Typography sx={{ mt: -2, display: "flex", justifyContent: "flex-start", fontSize: 12, ml: 7 }}>
                        Buyer
                      </Typography>
                    ) : userRole === "Seller" ? (
                      <Typography sx={{ mt: -2, display: "flex", justifyContent: "flex-start", fontSize: 12, ml: 7 }}>
                        Seller
                      </Typography>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "row", marginLeft: "50px", marginTop: "-10px" }}>
                        <Typography sx={{ fontSize: 12, ml: 1 }}>
                          Buyer and
                        </Typography>
                        <Typography sx={{ fontSize: 12, ml: 1 }}>
                          Seller
                        </Typography>
                      </div>
                    )
                  }

                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'right',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      style: {
                        width: '150px'
                      }
                    }}
                  >
                    <MenuItem onClick={() => { handleMenuClose(); logOutUser(); }}>
                      Logout
                    </MenuItem>

                    <MenuItem onClick={() => { handleMenuClose(); ShowUserProfile(); }}>
                      Profile
                    </MenuItem>
                  </Menu>
                </div> : <Box sx={{ display: "inline-flex" }}>
                  <Button
                    size="small"
                    variant={activeButton === 'login' ? 'contained' : 'outlined'}
                    onClick={() => {
                      handleButtonClick('login');
                      handleLoginClick();
                    }}
                    style={{
                      backgroundColor: activeButton === 'login' ? '#18A558' : 'white',
                      color: activeButton === 'login' ? 'white' : 'black',
                      marginRight: '4px',
                      marginTop: "12px"
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    size="small"
                    variant={activeButton === 'register' ? 'contained' : 'outlined'}
                    onClick={() => {
                      handleButtonClick('register');
                      handleRegisterClick();
                    }}
                    style={{
                      // backgroundColor: "white",
                      // color: "black",
                      backgroundColor: activeButton === 'register' ? '#18A558' : 'white',
                      color: activeButton === 'register' ? 'white' : 'black',
                      marginTop: "12px"
                    }}
                  >
                    Register
                  </Button>
                </Box>
                }
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, //Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Typography paragraph>

          </Typography>
          <Typography paragraph>

          </Typography>
        </Box>
      </Box>
    </>
  );
}

Sidebar.propTypes = {
  window: PropTypes.func,
};

export default Sidebar;




