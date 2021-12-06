import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { alpha } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Navn',
    },
    {
        id: 'discipline',
        numeric: true,
        disablePadding: false,
        label: 'Distance',
    },
    {
        id: 'start_no',
        numeric: true,
        disablePadding: false,
        label: 'Nummer',
    }
];


function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {"Check outs: " + props.checkouts + " / " + props.runners.length}
                </Typography>
            )}


            <TextField sx={{ flex: '1 2 100%' }} id="outlined-basic" label="Søg" variant="outlined" onChange={(value) => { props.onSearch(value.target.value) }} />

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function Row(props) {
    const { row, isSelected, labelId, onClick } = props;
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(new Date('1995-12-17T' + row.timer));

    const handleSubmit = (event, id) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let diploma = 0;
        let checkout = 0;
        if (data.get("diploma") !== null) {
            diploma = 1;
        }
        if (data.get("checkout") !== null) {
            checkout = 1;
        }
        fetch("https://runner.lyretech.dk/ords/rfidtest/api/checkout/" + id + "?TIME=" + data.get("time") + "&SEND2EMAIL=" + data.get("email") + "&EMAIL_CHK=" + diploma + "&CHECKOUT_CHK=" + checkout).then(response => {
            if (response.status === 200) {
                props.showSnackbar()
            } else {
                props.showErrorSnackbar(true);
            }
        }).catch(error => {
            props.showErrorSnackbar(true);
        })
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} aria-checked={isSelected} selected={isSelected}>
                <TableCell sx={{ borderBottom: 'unset' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell sx={{ borderBottom: 'unset' }} padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onChange={onClick}
                    />
                </TableCell>
                <TableCell sx={{ borderBottom: 'unset' }} component="th" scope="row" id={labelId}>
                    {row.time_checkout_utc !== null ? <div style={{ display: 'flex', alignItems: 'center' }}> <span>{row.name}</span> <CheckCircleIcon color="green" /> </div> : row.name}
                </TableCell>
                <TableCell sx={{ borderBottom: 'unset' }} align="right">{row.discipline}</TableCell>
                <TableCell sx={{ borderBottom: 'unset' }} align="right">{row.start_no}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Detaljer
                            </Typography>
                            <Typography variant="h6" gutterBottom component="div">
                                {row.id}
                            </Typography>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <Box component="form" onSubmit={(event) => handleSubmit(event, row.id)} noValidate sx={{
                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                }}>
                                    <TextField id="outlined-basic" name="email" label="Email" variant="outlined" defaultValue={row.send2email} />
                                    <TextField id="outlined-basic" name="discipline" disabled label="Disciplin" variant="outlined" defaultValue={row.discipline} />
                                    <TimePicker

                                        ampm={false}
                                        openTo="hours"
                                        views={['hours', 'minutes', 'seconds']}
                                        inputFormat="HH:mm:ss"
                                        mask="__:__:__"
                                        label="Tid"
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                        renderInput={(params) => <TextField name="time" {...params} />}
                                    />
                                    <TimePicker

                                        ampm={false}
                                        openTo="hours"
                                        views={['hours', 'minutes', 'seconds']}
                                        inputFormat="HH:mm:ss"
                                        mask="__:__:__"
                                        label="Go time"
                                        value={row.go_time}
                                        disabled
                                        // onChange={(newValue) => {
                                        //     setValue(newValue);
                                        // }}
                                        renderInput={(params) => <TextField name="time" {...params} />}
                                    />

                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox id="diploma" name="diploma" defaultChecked={row.email_chk === 1} />} label="Ønsker diplom" />
                                        <FormControlLabel control={<Checkbox name="checkout" defaultChecked={row.time_checkout_utc !== null} />} label="Check out" />
                                    </FormGroup>
                                    <Button sx={{ marginLeft: 'auto' }} type="submit" variant="contained">Gem</Button>
                                </Box>

                            </LocalizationProvider>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CustomCollapsibleTable(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('start_no');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("")

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = props.runners.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const containsSearch = (list) => {
        let temp = [];
        list.forEach(element => {
            if (element["name"].toLowerCase().includes(search.toLowerCase())) {
                temp.push(element)
            }
        });
        return temp;
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.runners.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} onSearch={setSearch} checkouts={props.checkouts} runners={props.runners} />
                <TableContainer component={Paper}>
                    <Table
                        aria-label="collapsible table"
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}>

                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={props.runners.length}
                        />
                        <TableBody>
                            {containsSearch(props.runners).slice().sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return <Row key={row.id} row={row} showSnackbar={props.showSnackbar} showErrorSnackbar={props.showErrorSnackbar} isSelected={isItemSelected} labelId={labelId} onClick={(event) => handleClick(event, row.name)} />

                                })}
                        </TableBody>

                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={7} />
                            </TableRow>
                        )}
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.runners.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}