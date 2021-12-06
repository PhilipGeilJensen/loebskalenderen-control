import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CustomCollapsibleTable from "../components/collapsible_table";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Numbers(props) {
    const [runners, setRunners] = useState([])
    const [checkouts, setCheckouts] = useState(0)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        // fetch("https://runner.lyretech.dk/ords/rfidtest/api/event/1705").then(response => response.json().then(json => {
        //     setRunners(json["items"])
        // }))
        fetchRunners();
    }, [props.event])

    const fetchRunners = () => {
        fetch("https://runner.lyretech.dk/ords/rfidtest/api/event/" + props.event).then(response => response.json().then(json => {
            let checkoutAmount = 0;
            json["items"].forEach(element => {
                if (element["time_checkout_utc"] !== null) {
                    checkoutAmount++;
                }
            });
            setRunners(json["items"])
            setCheckouts(checkoutAmount)
        }))

    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    const handleOpen = () => {
        setOpen(true);
        fetchRunners();
    }

    return <Box sx={{
        width: '900px',
        height: '100%',
        margin: 'auto',
        marginTop: '30px'
    }}>
        <Typography variant="h4">Oversigt over løbere</Typography>
        <CustomCollapsibleTable showSnackbar={handleOpen} showErrorSnackbar={setError} runners={runners} checkouts={checkouts}></CustomCollapsibleTable>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Update was successful!
            </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={4000} onClose={handleErrorClose}>
            <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                Update was unsuccessful!
            </Alert>
        </Snackbar>
    </Box>
}