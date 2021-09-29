import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CustomCollapsibleTable from "../components/collapsible_table";

export default function Numbers() {
    return <Box sx={{
        width: '900px',
        height: '100%',
        margin: 'auto',
        marginTop: '30px'
    }}>
        <Typography variant="h4">Oversigt over løbsnumre</Typography>
        <CustomCollapsibleTable></CustomCollapsibleTable>
    </Box>
}