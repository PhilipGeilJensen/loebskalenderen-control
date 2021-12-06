import { React, useEffect, useState } from "react";
import CustomAppBar from "../components/appbar";
import './mainpage.css';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import CustomDrawer from "../components/drawer";
import { auth } from "../firebase";



const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function Mainpage({ component: Component, ...rest }) {
    const theme = useTheme();
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState()
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://runner.lyretech.dk/ords/rfidtest/api/events/649").then(response => response.json().then(json => {
            setEvents(json["items"])
            let hasBeenSet = false;
            for (var i = 0; i < json["items"].length; i++) {
                var date = new Date(json["items"][i]["start_date"])
                if (isToday(date)) {
                    setSelectedEvent(i)
                    hasBeenSet = true;
                }
            }
            if (!hasBeenSet) {
                setSelectedEvent(0)
            }
        }))
            .catch(error => {
                let test = '{"items":[{"collection_name":"Costa del Sol Serie 2021","collection_start_date":"2021-10-25T22:00:00Z","collection_end_date":"2021-10-29T22:00:00Z","external_lnk":null,"event_id":2022,"status_id":1,"name":"Gibraltar Marathon","start_date":"2021-10-25T22:00:00Z","start_time":"08:30AM","complementary_refreshments_chk":1,"rfid_tracking_chk":1,"certified_distance_chk":1,"license_rqd_chk":0,"single_start_chk":0,"depot_inroute_chk":1,"members_only_chk":0,"created":"2021-08-05T09:51:51.057Z","created_by":"SA","updated":"2021-10-12T04:51:41.668Z","updated_by":"TRIIBER"},{"collection_name":"Costa del Sol Serie 2021","collection_start_date":"2021-10-25T22:00:00Z","collection_end_date":"2021-10-29T22:00:00Z","external_lnk":null,"event_id":2023,"status_id":1,"name":"Marbella Marathon","start_date":"2021-10-26T22:00:00Z","start_time":"08:30PM","complementary_refreshments_chk":1,"rfid_tracking_chk":1,"certified_distance_chk":1,"license_rqd_chk":0,"single_start_chk":0,"depot_inroute_chk":1,"members_only_chk":0,"created":"2021-08-05T10:08:32.318Z","created_by":"SA","updated":"2021-10-13T00:41:55.497Z","updated_by":"SA"},{"collection_name":"Costa del Sol Serie 2021","collection_start_date":"2021-10-25T22:00:00Z","collection_end_date":"2021-10-29T22:00:00Z","external_lnk":null,"event_id":2024,"status_id":1,"name":"Calahonda/La Cala Marathon","start_date":"2021-10-27T22:00:00Z","start_time":"08:30PM","complementary_refreshments_chk":1,"rfid_tracking_chk":1,"certified_distance_chk":1,"license_rqd_chk":0,"single_start_chk":0,"depot_inroute_chk":1,"members_only_chk":0,"created":"2021-08-05T10:12:56.066Z","created_by":"SA","updated":"2021-10-13T00:54:13.823Z","updated_by":"SA"},{"collection_name":"Costa del Sol Serie 2021","collection_start_date":"2021-10-25T22:00:00Z","collection_end_date":"2021-10-29T22:00:00Z","external_lnk":null,"event_id":2025,"status_id":1,"name":"Fuengirola/Mijas Golf Marathon","start_date":"2021-10-28T22:00:00Z","start_time":"08:30PM","complementary_refreshments_chk":1,"rfid_tracking_chk":1,"certified_distance_chk":1,"license_rqd_chk":0,"single_start_chk":0,"depot_inroute_chk":1,"members_only_chk":0,"created":"2021-08-05T10:13:39.198Z","created_by":"SA","updated":"2021-10-13T00:56:44.984Z","updated_by":"SA"},{"collection_name":"Costa del Sol Serie 2021","collection_start_date":"2021-10-25T22:00:00Z","collection_end_date":"2021-10-29T22:00:00Z","external_lnk":null,"event_id":2026,"status_id":1,"name":"Costa Del Sol Marathon","start_date":"2021-10-29T22:00:00Z","start_time":"08:30PM","complementary_refreshments_chk":1,"rfid_tracking_chk":1,"certified_distance_chk":1,"license_rqd_chk":0,"single_start_chk":0,"depot_inroute_chk":1,"members_only_chk":0,"created":"2021-08-05T10:15:23.983Z","created_by":"SA","updated":"2021-10-13T00:59:16.614Z","updated_by":"SA"}],"hasMore":false,"limit":25,"offset":0,"count":5,"links":[{"rel":"self","href":"https://runner.lyretech.dk/ordsrfidtest/api/events/649"},{"rel":"describedby","href":"https://runner.lyretech.dk/ordsrfidtest/metadata-catalog/api/events/item"},{"rel":"first","href":"https://runner.lyretech.dk/ordsrfidtest/api/events/649"}]}'
                setEvents(JSON.parse(test)["items"])
                setSelectedEvent(0)
            })
        setUser(auth.currentUser)
    }, [])

    const selectEvent = (event) => {
        setSelectedEvent(event)
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomAppBar selectEvent={selectEvent} selectedEvent={selectedEvent} events={events} openDrawer={handleDrawerOpen} open={open}></CustomAppBar>
        <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} theme={theme}></CustomDrawer>
        <Box sx={{
            width: '100%',
            heigth: '100%'
        }}>
            <DrawerHeader />
            <Component key={events[selectedEvent] !== undefined ? events[selectedEvent]["event_id"] : 0} event={events[selectedEvent] !== undefined ? events[selectedEvent]["event_id"] : 0}></Component>
        </Box>
    </Box>
}

export default Mainpage;