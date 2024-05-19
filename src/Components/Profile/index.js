import React, { useState, useEffect } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
} from 'mdb-react-ui-kit';
import { Card, Checkbox, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';


export default function Profile() {
    const [profileData, setProfileData] = useState({ account_type: [] });
    const [categories, setCategories] = useState([]);
    const [categoryitem, setCategoryItem] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const key = JSON.parse(localStorage.getItem('key'));
    const secret = JSON.parse(localStorage.getItem('secret'));
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const RoleProfile = JSON.parse(localStorage.getItem('roleProfile'));
    const [avatarImage, setAvatarImage] = useState(null);

    const [buyerChecked, setBuyerChecked] = useState(() => {
        const savedBuyerChecked = localStorage.getItem('buyerChecked');
        return savedBuyerChecked === 'true' || profileData.account_type === 'Both';
    });

    const [sellerChecked, setSellerChecked] = useState(() => {
        const savedSellerChecked = localStorage.getItem('sellerChecked');
        return savedSellerChecked === 'true' || profileData.account_type === 'Both';
    });

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarImage(URL.createObjectURL(file));
        }
    };

    const handleBuyerChange = () => {
        const newBuyerChecked = !buyerChecked;
        setBuyerChecked(newBuyerChecked);
        localStorage.setItem('buyerChecked', newBuyerChecked.toString());
        setCheckboxChecked(true);
    };

    const handleSellerChange = () => {
        const newSellerChecked = !sellerChecked;
        setSellerChecked(newSellerChecked);
        localStorage.setItem('sellerChecked', newSellerChecked.toString());
        setCheckboxChecked(true);
    };
    const handleChange = (event) => {
        setCategoryItem(event.target.value);
    };

    const handleCheckboxChange = (index, rowIndex) => {
        const isChecked = checkedItems.find((item) => item.index === index && item.rowIndex === rowIndex);

        if (isChecked) {
            // Item is already checked, remove it from the checkedItems array
            setCheckedItems((prevState) => prevState.filter((item) => !(item.index === index && item.rowIndex === rowIndex)));
        } else {
            // Item is not checked, add it to the checkedItems array
            setCheckedItems((prevState) => [...prevState, { index, rowIndex }]);
        }
    };

    useEffect(() => {
        const categoryData = () => {
            const key = JSON.parse(localStorage.getItem('key'));
            const secret = JSON.parse(localStorage.getItem('secret'));
            setLoading(true);
            fetch('https://steel.smartyerp.in/api/method/steel.api.get_category', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${key}:${secret}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setCategoryData(data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error)
                    setLoading(false);
                });

        };
        categoryData();
    }, [])

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
            setProfileData(res.data[0]);
            setCategories(res.data[0].category);
            setLoading(false);
        };
        fetchData();
    }, []);

    //account type update function
    const handleSaveProfile = async () => {
        if (!checkboxChecked && !isUpdateDisabled) {
            toast.warn("You haven't updated anything yet!");
            return;
        }

        const updatedProfileData = { ...profileData, account_type: getAccountType() };
        const result = await fetch(
            "https://steel.smartyerp.in/api/method/steel.api.update_profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `token ${key}:${secret}`,
                },
                body: JSON.stringify(updatedProfileData),
            }
        );
        const res = await result.json();
        toast.success(`Account successfully Updated..!`);
        const roleProfile = JSON.stringify(getAccountType());
        localStorage.setItem("roleProfile", roleProfile);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const getAccountType = () => {
        if (buyerChecked && sellerChecked) {
            return "Both";
        } else if (buyerChecked) {
            return "Buyer";
        } else if (sellerChecked) {
            return "Seller";
        } else {
            return "";
        }
    };

    const isUpdateDisabled = RoleProfile === "Both";



    //categories update function
    const handleSaveCategory = async () => {
        if (categoryitem === "") {
            toast.warn("Please first select any item..!");
            return;
        }

        // Check if the selected category item already exists in categories
        if (categories.find((item) => item.category === categoryitem)) {
            toast.error('This category item already exists..!');
            setCategoryItem("");
            return;
        }

        const updatedCategories = [...categories, { category: categoryitem }];
        setCategories(updatedCategories);
        toast.success('Items Added successfully..!');
        setCategoryItem("");

        const updatedProfileData = { ...profileData, category: updatedCategories };

        const result = await fetch(
            'https://steel.smartyerp.in/api/method/steel.api.update_profile',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${key}:${secret}`,
                },
                body: JSON.stringify(updatedProfileData),
            }
        );
        const res = await result.json();
        localStorage.setItem("ProfileCategryData", JSON.stringify(updatedProfileData.category));
    };


    //category delete function
    const handleDeleteItems = async () => {
        if (checkedItems.length === 0) {
            toast.error('Please select items to delete..!');
            return;
        }

        const updatedCategories = categories.filter((category, index) => {
            return !checkedItems.some((item) => item.rowIndex === Math.floor(index / 5) && item.index === index % 5);
        });

        try {
            // Send the updated category data to the server for deletion
            const result = await fetch(
                'https://steel.smartyerp.in/api/method/steel.api.update_profile',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `token ${key}:${secret}`,
                    },
                    body: JSON.stringify({ ...profileData, category: updatedCategories }),
                }
            );
            const res = await result.json();

            // Update the local state with the deleted items
            setCategories(updatedCategories);
            setCheckedItems([]);

            toast.success('Items deleted successfully..!');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting items..!');
        }
    };
    return (
        <>
            <Card sx={{
                mt: 10,
                ml: { xs: 2, sm: 30 },
                mr: { xs: 2, sm: 10 },
                maxWidth: 'auto',
                width: 'auto',
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                borderRadius: "5px",
            }}>
                <ToastContainer />
                <Box sx={{ px: 3 }}>
                    <Grid container spacing={2}>
                        <MDBContainer className="py-5">
                            <MDBRow>
                                <Grid item xs={12} sm={3}>
                                    <MDBCol>
                                        <MDBCardBody className="text-center">
                                            <MDBCardImage
                                                src={avatarImage ? avatarImage : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                                                alt="avatar"
                                                className="rounded-circle"
                                                style={{ width: '150px', height: "150px" }}
                                                fluid />
                                        </MDBCardBody>
                                        <MDBCardBody className="p-0">
                                            <label htmlFor="avatarInput">
                                                <Button variant="outlined" component="span" sx={{ ml: { xs: 10, sm: 7 }, mt: 3, mb: 2 }}>
                                                    Add Profile
                                                </Button>
                                            </label>
                                            <input
                                                id="avatarInput"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleAvatarUpload}
                                            />
                                        </MDBCardBody>
                                    </MDBCol>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    {loading ? (
                                        <Backdrop
                                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                            open={loading}
                                        >
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                    ) : (
                                        <MDBCol>
                                            <MDBCardBody>
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Company Name</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{profileData.company_name}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Account Type</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <Checkbox
                                                            checked={buyerChecked}
                                                            onChange={handleBuyerChange}
                                                        />
                                                        Buyer
                                                        <Checkbox
                                                            checked={sellerChecked}
                                                            onChange={handleSellerChange}
                                                        />
                                                        Seller
                                                        <Button
                                                            sx={{ float: "right", mt: 1 }}
                                                            variant="outlined"
                                                            onClick={handleSaveProfile}
                                                            size='small'
                                                        >
                                                            Update
                                                        </Button>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Mobile</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{profileData.mobile}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>GST NO</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{profileData.gst_no}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Address</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <MDBCardText className="text-muted">{profileData.address}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="3">
                                                        <MDBCardText>Item Your Deal In</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol sm="9">
                                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                            {categories.slice(0, 5).map((category, index) => (
                                                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                                                    <Checkbox
                                                                        checked={checkedItems.some((item) => item.index === index && item.rowIndex === 0)}
                                                                        onChange={() => handleCheckboxChange(index, 0)}
                                                                    />
                                                                    <Typography variant="body2">{category.category}</Typography>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                            {categories.slice(5, 9).map((category, index) => (
                                                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                                                    <Checkbox
                                                                        checked={checkedItems.some((item) => item.index === index && item.rowIndex === 1)}
                                                                        onChange={() => handleCheckboxChange(index, 1)}
                                                                    />
                                                                    <Typography variant="body2">{category.category}</Typography>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {categories.length === 10 && (
                                                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                                {categories.slice(9).map((category, index) => (
                                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                                                        <Checkbox
                                                                            checked={checkedItems.some((item) => item.index === index && item.rowIndex === 2)}
                                                                            onChange={() => handleCheckboxChange(index, 2)}
                                                                        />
                                                                        <Typography variant="body2">{category.category}</Typography>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <FormControl sx={{ minWidth: 120 }} size="small">
                                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={categoryitem}
                                                                label="Category"
                                                                onChange={handleChange}
                                                                size="small"
                                                                autoWidth
                                                            >
                                                                {categoryData.map((category) => (
                                                                    <MenuItem key={category.id} value={category.name}>
                                                                        {category.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <Box sx={{ float: "right" }}>
                                                            <Button sx={{ ml: 1, mt: 1 }} size='small' variant="outlined" onClick={handleSaveCategory}>
                                                                Add Item
                                                            </Button>
                                                            <Button size='small' sx={{ ml: 1, mt: 1 }} color='error' variant="outlined" onClick={() => handleDeleteItems()}>
                                                                Delete
                                                            </Button>
                                                        </Box>
                                                    </MDBCol>

                                                </MDBRow>
                                                <hr />
                                                {RoleProfile === "Buyer" || RoleProfile === "Both" ? (
                                                    <>
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>Wallet Balance</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{profileData.wallet_balance}</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    </>
                                                ) : null}
                                            </MDBCardBody>
                                        </MDBCol>
                                    )}
                                </Grid>
                            </MDBRow>
                        </MDBContainer>
                    </Grid>
                </Box>
            </Card>
        </>
    );
}