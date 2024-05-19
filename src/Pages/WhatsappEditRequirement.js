import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import { Button} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const WhatsappEditRequirement = () => {

  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [AllData, setAllData] = useState([]);
  const secret = JSON.parse(localStorage.getItem("secret"));
  const key = JSON.parse(localStorage.getItem("key"));
  const newName = JSON.parse(localStorage.getItem("result"));
  const name = newName.user_details[0].name;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

  return (
    <>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"center",margin:"50px"}}>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Update Requirement
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Card sx={{ minWidth: 275, width:500,height:300 }}>
      <CardContent>
        <Typography sx={{fontSize:20,fontWeight:"bold"}}>If You Want to edit your requirement, click on the edit button</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained">Edit Now</Button>
      </CardActions>
    </Card>

        </BootstrapDialog>
      </div>
    </>
  );
};

export default WhatsappEditRequirement;