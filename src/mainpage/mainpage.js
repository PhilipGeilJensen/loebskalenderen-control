import React from "react";
import CustomAppBar from "../components/appbar";
import './mainpage.css';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import CustomDrawer from "../components/drawer";
import Numbers from "../numbers/numbers";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';



const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Mainpage() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return <Router>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <CustomAppBar openDrawer={handleDrawerOpen} open={open}></CustomAppBar>
                <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} theme={theme}></CustomDrawer>
                <Box sx={{
                    width: '100%',
                    heigth: '100%'
                }}>
                    <DrawerHeader />
                    <Switch>
                        <Route exact path="/">
                            <h1>Hello there</h1>
                        </Route>
                        <Route path="/numbers">
                            <Numbers></Numbers>
                        </Route>
                    </Switch>
                </Box>
            </Box>
        </Router>
}

export default Mainpage;