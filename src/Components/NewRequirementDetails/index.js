import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SelectInputField from '../../Common_Components/InputField/SelectInputField';
import InputField from '../../Common_Components/InputField/InputField';
import { toast, ToastContainer } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';

const RequirementDetails = () => {

    const location = useLocation();
    const { data = '' } = location.state || {};

    const requirementDefaultData = data.requirement_details;
    const categoryDefaultData = data.category;
    const requirementTypeDefaultData = data.requirement_type;

    const [grade, setGrade] = useState([]);
    const [finish, setFinish] = useState([]);
    const [make, setMake] = useState([]);
    const [citys, setCitysData] = useState([]);
    const [paymentTermsData, setPaymentTermsData] = useState([]);
    const [RequiredForm, setRequiredForm] = useState({
        grade: "",
        finish: "",
        make: "",
        quantity: "",
        thickness: "",
        payment_terms: "",
        requirement_type: requirementTypeDefaultData,
        requirement_details: requirementDefaultData,
        remarks: "",
        delivery_at: "",
        category: categoryDefaultData,
        length: "",
        width: "",
        weight: "",
        expiration_date: "",
        size: "",
        shape: "",
        diameter: "",
        nb_od: "",
        erw_seamless: "",
        hardness_type: ""
    })


    const InputFiledData = (e) => {
        setRequiredForm({ ...RequiredForm, [e.target.name]: e.target.value });
        console.log({ ...RequiredForm, [e.target.name]: e.target.value });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check if the selected value is 'today'
        if (name === 'expiration_date' && value === 'today') {
            const currentDate = new Date();
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }
        // Check if the selected value is 'oneday'
        else if (name === 'expiration_date' && value === 'oneday') {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1); // Add one day
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }
        // Check if the selected value is 'twoday'
        else if (name === 'expiration_date' && value === 'twoday') {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 2); // Add two days
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }
        // Check if the selected value is 'threeday'
        else if (name === 'expiration_date' && value === 'threeday') {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3); // Add three days
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }
        // Check if the selected value is 'fourday'
        else if (name === 'expiration_date' && value === 'fourday') {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 4); // Add four days
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }

        // Check if the selected value is 'fiveday'
        else if (name === 'expiration_date' && value === 'fiveday') {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 5); // Add four days
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
            const formattedDate = currentDate.toISOString().split('T')[0];
            const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const updatedExpirationDate = formattedDate + ' ' + formattedTime;

            setRequiredForm((prevState) => ({
                ...prevState,
                expiration_date: updatedExpirationDate,
                selected_expiration_date: value, // Add selected value to state
            }));
        }
        // Handle other input changes
        else {
            setRequiredForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    const AddAllRequirements = async (e) => {
        e.preventDefault();

        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        // Check if expiration date is not selected and it's before 16:00
        if (RequiredForm.expiration_date === "" && currentHour < 16) {
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
        } else {
            currentDate.setDate(currentDate.getDate() + 1); // Add one day
            currentDate.setHours(19, 0, 0); // Set the time to 19:00:00
        }

        const formattedDate = currentDate.toISOString().split('T')[0];
        const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        setRequiredForm({
            ...RequiredForm,
            expiration_date: formattedDate + ' ' + formattedTime // Add the formatted date and time to the expiration_date field
        });

        console.log(RequiredForm);

        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        try {
            const response = await fetch(
                "https://steel.smartyerp.in/api/method/steel.api.create_new_requirement",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `token ${key}:${secret}`
                    },
                    body: JSON.stringify(RequiredForm),
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.status_code === 200) {
                toast.success("Requirement submitted successfully!", {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    style: {
                        fontSize: "17px"
                    }
                });
                setTimeout(() => {
                    if (RequiredForm.requirement_type === "I want to Buy") {
                        navigate("/buyerrequirement");
                    } else {
                        navigate("/sellerpost");
                    }
                }, 2000);
            } else {
                toast.error("All The Fields Are Not Filled In, Fill All The Fields First.", {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    style: {
                        fontSize: "15px"
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }

        console.log(RequiredForm)
    }

    const gradeData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_grade', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setGrade(data.data);
            })
            .catch(error => console.error(error));
    }

    const finishData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_finish', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setFinish(data.data);
            })
            .catch(error => console.error(error));
    }

    const PaymentTermData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_payment_terms', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setPaymentTermsData(data.data);
            })
            .catch(error => console.error(error));
    };

    const makeData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_make', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setMake(data.data);
            })
            .catch(error => console.error(error));
    }
    const CityData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_city', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setCitysData(data.data);
            })
            .catch(error => console.error(error));
    }


    useEffect(() => {
        console.log(data);
        CityData();
        finishData();
        PaymentTermData();
        gradeData();
        makeData();
    }, []);

    const navigate = useNavigate()

    const handleBack = () => {
        navigate("/")
    }


    const isFormValid = () => {
        const { expiration_date, remarks, ...otherFields } = RequiredForm;
        return Object.values(otherFields).every(value => value !== "");
    };



    return (
        <>
            <Box sx={{
                width: "auto",
                mt: 10,
                mb: 8,
                ml: { xs: 2, sm: 28 },
                mr: { xs: 2, sm: 10 },
                display: "flex",
                flexDirection: "column",
            }}>
                <ToastContainer />
                <Typography variant='h5' sx={{ textAlign: "left", mt: 1, mb: 3, fontWeight: "bold" }}>
                    Confirm your Submission
                </Typography>
                <ValidatorForm onSubmit={AddAllRequirements}>
                    {/* main box */}
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 5, pb: 5 }}>
                        {/* left side box */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                            <SelectInputField
                                name="grade"
                                label="Grade"
                                selectOptions={grade.map(option => ({
                                    value: option.grade,
                                    label: option.grade
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.grade}
                            />
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 1 } }}>
                                <TextField
                                    label="Width"
                                    variant="outlined"
                                    name='width'
                                    value={RequiredForm.width}
                                    onChange={handleChange}
                                    sx={{ flex: { xs: "auto", sm: 1 } }}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                />
                                <Typography sx={{ mt: { xs: 2, sm: 2 }, ml: { xs: 20, sm: 0 }, fontSize: "24px" }}>*</Typography>
                                <TextField
                                    label="Length"
                                    name="length"
                                    variant="outlined"
                                    value={RequiredForm.length}
                                    onChange={handleChange}
                                    sx={{ flex: { xs: "auto", sm: 1 }, ml: { xs: 0, sm: 1 } }}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                />
                                <Typography sx={{ mt: { xs: 2, sm: 2 }, ml: { xs: 20, sm: 0 }, fontSize: "24px" }}>*</Typography>
                               
                                  <TextField
                                    label="Weight"
                                    variant="outlined"
                                    name='weight'
                                    value={RequiredForm.weight}
                                    sx={{ flex: { xs: "auto", sm: 1 }, ml: { xs: 0, sm: 1 } }}
                                    onChange={handleChange}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                />
                            </Box>
                            <SelectInputField
                                name="finish"
                                label="Finish"
                                selectOptions={finish.map(option => ({
                                    value: option.finish,
                                    label: option.finish
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.finish}
                            />
                            <SelectInputField
                                name="make"
                                label="Make"
                                selectOptions={make.map(option => ({
                                    value: option.make,
                                    label: option.make
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.make}
                            />
                            <InputField
                                name="thickness"
                                label="Thickness"
                                type="text"
                                value={RequiredForm.thickness}
                                handleInput={InputFiledData}
                            />
                            <InputField
                                name="quantity"
                                label="Quantity"
                                type="text"
                                value={RequiredForm.quantity}
                                handleInput={InputFiledData}
                            />
                            <InputField
                                name="size"
                                label="Size"
                                type="text"
                                value={RequiredForm.size}
                                handleInput={InputFiledData}
                            />
                            <InputField
                                name="shape"
                                label="Shape"
                                type="text"
                                value={RequiredForm.shape}
                                handleInput={InputFiledData}
                            />
                            <InputField
                                name="diameter"
                                label="Diameter"
                                type="text"
                                value={RequiredForm.diameter}
                                handleInput={InputFiledData}
                            />
                            <SelectInputField
                                name="payment_terms"
                                label="Payment Terms"
                                selectOptions={paymentTermsData.map(option => ({
                                    value: option.payment_term,
                                    label: option.payment_term
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.payment_terms}
                            />
                        </Box>
                        {/* right side box */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Submitted Requirement Detail (Read Only)"
                                multiline
                                defaultValue={data.requirement_details}
                                InputProps={{
                                    readOnly: true,
                                }}
                                rows={5}
                                sx={{ backgroundColor: "whiteSmoke" }}
                            />
                            <SelectInputField
                                name="delivery_at"
                                label="Delivery at"
                                selectOptions={citys.map(option => ({
                                    value: option.city,
                                    label: option.city
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.delivery_at}
                            />
                            <FormControl>
                                <InputLabel id="demo-select-small-label" sx={{ fontSize: 15 }}>
                                    Expiration Date
                                </InputLabel>
                                <Select
                                    sx={{ width: "100%" }}
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    name="expiration_date"
                                    value={RequiredForm.selected_expiration_date} // Use selected_expiration_date from state
                                    onChange={handleChange}
                                    label="Expiration Date"
                                >
                                    <MenuItem value="today">Today</MenuItem>
                                    <MenuItem value="oneday">One Day</MenuItem>
                                    <MenuItem value="twoday">Two Day</MenuItem>
                                    <MenuItem value="threeday">Three Day</MenuItem>
                                    <MenuItem value="fourday">Four Day</MenuItem>
                                    <MenuItem value="fiveday">Five Day</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography sx={{ fontSize: 13 }}>Expiry Date at 19:30 IST by default. Pre-4 PM posts expire today, while post-4 PM posts expire next day at 19:30 IST.</Typography>
                            <InputField
                                name="nb_od"
                                label="NB OD"
                                type="text"
                                value={RequiredForm.nb_od}
                                handleInput={InputFiledData}
                            />
                             <InputField
                                name="erw_seamless"
                                label="ERW Seamless"
                                type="text"
                                value={RequiredForm.erw_seamless}
                                handleInput={InputFiledData}
                            />
                             <InputField
                                name="hardness_type"
                                label="Hardness Type"
                                type="text"
                                value={RequiredForm.hardness_type}
                                handleInput={InputFiledData}
                            />
                            <TextField
                                name="remarks"
                                id="outlined-multiline-static"
                                label="Remarks"
                                onChange={handleChange}
                                value={RequiredForm.remarks}
                                multiline
                                rows={5}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
                        <Button type='submit' variant="contained" color="success" disabled={!isFormValid()}>Order</Button>
                    </Box>
                </ValidatorForm>
            </Box>

        </>
    )
}
export default RequirementDetails;