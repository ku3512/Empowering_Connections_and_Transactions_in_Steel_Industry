import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SelectInputField from '../../../Common_Components/InputField/SelectInputField';
import InputField from '../../../Common_Components/InputField/InputField';
import { toast, ToastContainer } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';


const SelectInputFields = ({ name, label, selectOptions, handleInput, value, disabled }) => {
    return (
        <>
            <Box>
                <TextField
                    select
                    name={name}
                    label={label}
                    value={value}
                    onChange={handleInput}
                    fullWidth
                    disabled={disabled}
                >
                    {selectOptions.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </>
    );
};

const Flat = () => {
    const { name } = useParams();

    const [docStatus, setDocStatus] = useState("");
    const [status, setStatus] = useState("");
    const [grade, setGrade] = useState([]);
    const [Finish, setFinish] = useState([]);
    const [uomData, setUomData] = useState([]);
    const [Make, setMake] = useState([]);
    const [citys, setCitysData] = useState([]);
    const [paymentTermsData, setPaymentTermsData] = useState([]);
    const [RequiredForm, setRequiredForm] = useState({
        requirement_name:name,
        grade: '',
        width_value: '',
        thickness: '',
        length_value: '',
        finish: '',
        make: '',
        quantity: '',
        uom: '',
        payment_terms: '',
        requirement_type: '',
        requirement_details: '',
        remarks: '',
        delivery_at: '',
        category: '',
        expiration_date: ""
        // defaultDateTime.format("YYYY-MM-DD HH:mm:ss")
    })
    const handleDateTimeChange = (newDateTime) => {
        setRequiredForm((prevState) => ({
            ...prevState,
            expiration_date: formatDateTime(newDateTime),
        }));
    };
    const formatDateTime = (dateTime) => {
        if (dateTime) {
            return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
        }
        return '';
    };
    const InputFiledData = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            // Check if the input value is a valid positive integer
            const regex = /^\d*\.?\d{0,2}$/;
            if (regex.test(value) || value === '') {
                setRequiredForm({ ...RequiredForm, [name]: value });
            }

        } else {
            setRequiredForm({ ...RequiredForm, [name]: value });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'width_value' || name === 'thickness' || name === 'length_value') {
            // Check if the input value is a valid positive number with up to two decimal places
            const regex = /^\d*\.?\d{0,2}$/;
            if (regex.test(value) || value === '') {
                setRequiredForm({ ...RequiredForm, [name]: value });
            }
        }
        else {
            setRequiredForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    const AddAllRequirements = async (e) => {
        e.preventDefault();

        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        try {
            const response = await fetch(
            "https://steel.smartyerp.in/api/method/steel.api.update_requirement",
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
            if (data.status_code === 200) {
                toast.success("Requirement Updated successfully..!");
                setTimeout(() => {
                    if (RequiredForm.requirement_type === "I want to Buy") {
                        navigate("/buyerrequirement");
                    } else {
                        navigate("/sellerpost");
                    }
                }, 2000);
            } else {
                toast.error("All The Fields Are Not Filled In, Fill All The Fields First..!");
            }
        } catch (error) {
            console.error(error);
        }
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

    const finishData = (CategoryData) => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch(`https://steel.smartyerp.in/api/method/steel.api.get_finish?category=${CategoryData}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const mappedData = data.data.map(item => ({
                    value: item.name,
                    label: item.finish // Adjusted here, now mapping the 'finish' field to the label
                }));

                setFinish(mappedData);
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

    const makeData = (CategoryData) => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch(`https://steel.smartyerp.in/api/method/steel.api.get_make?category=${CategoryData}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const mappedData = data.data.map(item => ({
                    value: item.name,
                    label: item.make // Adjusted here, now mapping the 'finish' field to the label
                }));
                setMake(mappedData);
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

    const UomData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch('https://steel.smartyerp.in/api/method/steel.api.get_uom', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUomData(data.data);
            })
            .catch(error => console.error(error));
    }

    const SingleRequirementData = () => {
        const key = JSON.parse(localStorage.getItem('key'));
        const secret = JSON.parse(localStorage.getItem('secret'));
        fetch(`https://steel.smartyerp.in/api/method/steel.api.get_single_requirement_for_edit?name=${name}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${key}:${secret}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const CategoryData = data.data[0].category;
                setStatus(data.data[0].status);
                setDocStatus(data.data[0].docstatus)
                setRequiredForm(prevState => ({
                    ...prevState,
                    grade: data.data[0].grade,
                    finish:data.data[0].finish,
                    make: data.data[0].make,
                    quantity: data.data[0].quantity,
                    uom: data.data[0].uom,
                    thickness: data.data[0].thickness,
                    width_value: data.data[0].width_value,
                    payment_terms: data.data[0].payment_terms,
                    requirement_type: data.data[0].requirement_type,
                    requirement_details: data.data[0].requirement_details,
                    remarks: data.data[0].remarks,
                    delivery_at: data.data[0].city,
                    length_value: data.data[0].length_value,
                    expiration_date:data.data[0].expiration_date,
                    category:CategoryData
                    // Update other fields as needed
                }));
                finishData(CategoryData);
                makeData(CategoryData);

            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        SingleRequirementData();
        UomData();
        CityData();
        finishData();
        PaymentTermData();
        gradeData();
        makeData();
    }, []);

    const navigate = useNavigate()

    const handleBack = () => {
        if (RequiredForm.requirement_type === "I want to Sale") {
            navigate("/sellerpost");
        } else {
            navigate("/buyerrequirement");
        }
    }
    // const isFormValid = () => {
    //     const { make, delivery_at, expiration_date, remarks,requirement_details,...otherFields } = RequiredForm;
    //     return Object.values(otherFields).every(value => value !== "");
    // };
    
    const isFormValid = () => {
        const { finish, make, delivery_at, remarks, ...otherFields } = RequiredForm;
        // Check if all other fields are empty or null
        return Object.values(otherFields).every(value => value !== "" && value !== null && value !== 0);
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
                <ValidatorForm onSubmit={AddAllRequirements} >
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
                                status={status}
                                docStatus={docStatus} 
                            />
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 1 } }}>
                                <TextField
                                    label="Width(mm)"
                                    variant="outlined"
                                    name='width_value'
                                    value={RequiredForm.width_value}
                                    sx={{ flex: { xs: "auto", sm: 1 } }}
                                    onChange={handleChange}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                    disabled={docStatus === 1 || status === "Withdrawn"}
                                />
                                <Typography sx={{ mt: { xs: 2, sm: 2 }, ml: { xs: 20, sm: 0 }, fontSize: "20px" }}>x</Typography>
                                <TextField
                                    label="Thickness(mm)"
                                    variant="outlined"
                                    name='thickness'
                                    value={RequiredForm.thickness}
                                    onChange={handleChange}
                                    sx={{ flex: { xs: "auto", sm: 1 } }}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                    disabled={docStatus === 1 || status === "Withdrawn"}
                                />
                                <Typography sx={{ mt: { xs: 2, sm: 2 }, ml: { xs: 20, sm: 0 }, fontSize: "20px" }}>x</Typography>
                                <TextField
                                    label="Length(mm)"
                                    name="length_value"
                                    variant="outlined"
                                    value={RequiredForm.length_value}
                                    onChange={handleChange}
                                    sx={{ flex: { xs: "auto", sm: 1 } }}
                                    InputProps={{
                                        sx: {
                                            height: "60px",
                                            fontSize: 15,
                                        },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 15 } }}
                                    disabled={docStatus === 1 || status === "Withdrawn"}
                                />
                            </Box>
                            <SelectInputFields
                                name="finish"
                                label="Finish"
                                selectOptions={Finish}
                                handleInput={InputFiledData}
                                value={RequiredForm.finish}
                                disabled={docStatus === 1 || status === "Withdrawn"}
                            />
                            
                            <SelectInputFields
                                name="make"
                                label="Make"
                                selectOptions={Make}
                                handleInput={InputFiledData}
                                value={RequiredForm.make}
                                disabled={docStatus === 1 || status === "Withdrawn"}
                            />

                            <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "row" }, gap: { xs: 1, sm: 1 } }}>
                                <InputField
                                    name="quantity"
                                    label="Quantity"
                                    type="text"
                                    value={RequiredForm.quantity}
                                    handleInput={InputFiledData}
                                    sx={{ width: "80%" }} // Set width to 70%
                                    status={status}
                                    docStatus={docStatus}
                                    
                                />

                                <FormControl fullWidth variant="outlined" sx={{ width: "20%" }}> {/* Set width to 30% */}
                                    <InputLabel htmlFor="uom">UOM</InputLabel>
                                    <Select
                                        id="uom"
                                        name="uom"
                                        value={RequiredForm.uom}
                                        onChange={InputFiledData}
                                        label="UOM"
                                        disabled={docStatus === 1 || status === "Withdrawn"}
                                    >
                                        {uomData.map(option => (
                                            <MenuItem key={option.uom} value={option.uom}>
                                                {option.uom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <SelectInputField
                                name="payment_terms"
                                label="Payment Terms"
                                selectOptions={paymentTermsData.map(option => ({
                                    value: option.payment_term,
                                    label: option.payment_term
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.payment_terms}
                                status={status}
                                docStatus={docStatus}
                            />
                        </Box>
                        {/* right side box */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                            <SelectInputField
                                name="delivery_at"
                                label="Delivery at"
                                selectOptions={citys.map(option => ({
                                    value: option.city,
                                    label: option.city
                                }))}
                                handleInput={InputFiledData}
                                value={RequiredForm.delivery_at}
                                status={status}
                                docStatus={docStatus}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                                <DateTimePicker
                                        label="Expiration Date"
                                        value={dayjs(RequiredForm.expiration_date)}
                                        onChange={handleDateTimeChange}
                                        disablePast
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        format="DD-MM-YYYY HH:mm A"
                                        renderInput={(props) => <TextField {...props} />}
                                        disabled={status === 1 || docStatus === "Withdrawn"}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <TextField
                                name="remarks"
                                id="outlined-multiline-static"
                                label="Remarks"
                                onChange={handleChange}
                                value={RequiredForm.remarks}
                                multiline
                                rows={5}
                                InputLabelProps={{ style: { fontSize: 15 } }}
                                disabled={status === 1 || docStatus === "Withdrawn"}
                            />
                            <TextField
                                id="outlined-multiline-static"
                                label="Submitted Requirement Detail (Read Only)"
                                multiline
                                disabled
                                value={RequiredForm.requirement_details}
                                InputProps={{
                                    readOnly: true,
                                }}
                                rows={5}
                                sx={{ backgroundColor: "whiteSmoke" }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2,mt:2 }}>
                        <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
                        <Button type='submit' variant="contained" color="success" disabled={!isFormValid() || docStatus === 1 || status ==="Withdrawn"}>Submit</Button>
                    </Box>
                </ValidatorForm>
            </Box>

        </>
    )
}
export default Flat;