import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';
import SendDiplomaButton from '../components/send_diploma_btn';

export default function Diplomas(props) {
    const [createNew, setCreateNew] = useState(false)
    const [selectedFile, setSelectedFile] = useState("")
    const [files, setFiles] = useState([])
    const [languages, setLanguages] = useState([])
    const [lang, setLang] = useState("")
    const [runners, setRunners] = useState([])
    const Input = styled('input')({
        display: 'none',
    });
    const [checked, setChecked] = React.useState([0]);
    const [amount, setAmount] = React.useState(0)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    useEffect(() => {
        async function FetchData() {
            await getLanguages();
            await getFiles();
            await getRunners();
        }
        FetchData();
    }, [])

    const onInput = (event) => {
        var data = new FormData()
        data.append("file", event.target.files[0])


        fetch("https://localhost:44381/api/Templates/eventId?eventId=" + props.event, {
            method: 'POST',
            body: data,
        }).then(response => {
            if (response.status === 200) {
                getFiles();
            }
        }).catch(error => console.log(error))
    }

    const getFiles = async () => {
        let response = await fetch("https://localhost:44381/api/Templates/eventId?eventId=" + props.event);
        let json = await response.json();
        setFiles(json);
        setSelectedFile(json[0])
    }

    const getLanguages = async () => {
        let response = await fetch("https://localhost:44381/api/Templates/languages/eventId?eventId=" + props.event)
        let json = await response.json();
        setLanguages(json);
    }

    const getRunners = async () => {
        let response = await fetch("https://runner.lyretech.dk/ords/rfidtest/api/event/" + props.event)
        let json = await response.json();
        setRunners(json["items"]);
        setAmount(sortRunners(json["items"]).length)
    }

    const onDelete = (file) => {
        let del = window.confirm("Are you sure you want to delete this?")
        if (del) {
            // window.alert("Just kidding - That doesn't work yet :-)")
            fetch("https://localhost:44381/api/Upload", {
                method: 'DELETE',
                body: JSON.stringify({
                    "filename": file,
                    "eventId": props.event.toString(),
                    "folder": "Templates"
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if (response.status === 200) {
                    getFiles();
                }
            }).catch(error => console.log(error))
        }
    }

    const downloadTemplate = (file) => {
        fetch("https://localhost:44381/api/Upload/filename?filename=" + props.event + "/" + file).then(response => response.blob().then((blob) => {
            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', file); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })).catch(error => console.log(error))
    }

    const handleChange = (event) => {
        setSelectedFile(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(lang)

        fetch("https://localhost:44381/api/Templates", {
            method: 'POST',
            body: JSON.stringify({
                filename: selectedFile,
                language: lang.toLowerCase(),
                eventId: props.event
            }),
            headers: {
                "Content-Type": "application/json"
            }

        }).then(response => {
            if (response.status === 200) {
                setCreateNew(false);
                getLanguages();
            }
        })
    }

    const sortRunners = (runnerList) => {
        let temp = [];
        runnerList.forEach(runner => {
            if (runner["email_chk"] === 1 && runner["time_checkout_utc"] !== null && runner["send2email"] !== null) {
                temp.push(runner)
            }
        });
        if (temp.length === 0) {
            temp.push({
                discipline: "Marathon",
                email_chk: 1,
                id: 1,
                language: "da",
                name: "Philip Jensen",
                personal_best_chk: 0,
                send2email: "pgj@individualisterne.dk",
                start_date: "2021-10-25T22:00:00Z",
                start_date_txt: "26. Okt 2021",
                start_no: 1,
                time_checkout_utc: "25-10-2021",
                timer: "03:05:07",
                title: "Gibraltar Marathon",
            })
        }
        return temp;
    }

    return <div>
        <Box sx={{
            width: '900px',
            height: '100%',
            margin: 'auto',
            marginTop: '30px'
        }}>
            <Paper sx={{ marginBottom: '20px', textAlign: 'center' }}>
                <Typography
                    sx={{ flex: '1 1 100%', marginLeft: '10px', textAlign: 'start' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Uploadede filer
                </Typography>
                <List dense={false}>
                    {
                        files.length !== 0 ? files.map((file, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <div>
                                        <IconButton sx={{ margin: '0 10px' }} edge="end" aria-label="delete" onClick={() => downloadTemplate(file)}>
                                            <DownloadIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(file)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={file}
                                // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        )) : <span style={{ opacity: '70%' }}>Der er ingen filer...</span>
                    }
                </List>
            </Paper>
            <label htmlFor="contained-button-file">
                <Input accept=".docx" id="contained-button-file" multiple={false} type="file" onInput={onInput} />
                <Button variant="contained" component="span">
                    Upload
                </Button>
            </label>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Paper sx={{ margin: '40px 0 20px 0', textAlign: 'center' }}>
                    <Typography
                        sx={{ flex: '1 1 100%', marginLeft: '10px', textAlign: 'start' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Valgte sprog
                    </Typography>
                    <List dense={false}>
                        {
                            languages.length !== 0 ? languages.map((file, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(file)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Typography>
                                            {file["language"].toUpperCase()}
                                        </Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={file["filename"]}
                                    // secondary={secondary ? 'Secondary text' : null}
                                    />
                                </ListItem>
                            )) : <span style={{ opacity: '70%' }}>Der er ingen filer...</span>
                        }
                        {
                            createNew ? <ListItem
                                key={"new"}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => setCreateNew(false)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <TextField
                                        sx={{ width: '50px' }}
                                        label="XX"
                                        name="lang"
                                        onChange={(value) => setLang(value.target.value)}
                                    />
                                </ListItemAvatar>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={selectedFile}
                                    onChange={handleChange}
                                    label="Age"
                                >
                                    {
                                        files.map((file, index) => (
                                            <MenuItem value={file} key={index}>
                                                {file}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </ListItem> : <div></div>
                        }
                    </List>
                </Paper>
                {
                    createNew ? <Button variant="contained" component="span" onClick={handleSubmit}>
                        Gem
                    </Button> : <Button variant="contained" component="span" onClick={() => setCreateNew(true)}>
                        Tilføj ny
                    </Button>
                }
            </Box>
            <Paper sx={{ margin: '40px 0 20px 0', textAlign: 'center' }}>
                <Typography
                    sx={{ flex: '1 1 100%', marginLeft: '10px', textAlign: 'start' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Løbere
                </Typography>
                <Typography
                    sx={{ flex: '1 1 100%', marginLeft: '10px', textAlign: 'start' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {amount + " / " + runners.length}
                </Typography>
                <List dense={false}>
                    {
                        sortRunners(runners).length !== 0 ? sortRunners(runners).map((runner, index) => {
                            if (runner["email_chk"] === 1 && runner["time_checkout_utc"] !== null) {
                                return (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <SendDiplomaButton runner={{
                                                name: runner["name"],
                                                email: runner["send2email"],
                                                timer: runner["timer"],
                                                date: runner["start_date_txt"],
                                                discipline: runner["discipline"],
                                                title: runner["title"],
                                                memberId: runner["id"],
                                                language: runner["language"],
                                                eventId: props.event,
                                            }}></SendDiplomaButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Typography>
                                                {runner["start_no"]}
                                            </Typography>
                                        </ListItemAvatar>
                                        <ListItemAvatar sx={{ marginRight: '20px' }}>
                                            <Typography>
                                                {runner["timer"]}
                                            </Typography>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={runner["name"]}
                                            secondary={runner["discipline"]}
                                        />
                                    </ListItem>
                                )
                            }
                        }) : <span style={{ opacity: '70%' }}>Der er ingen løbere som både ønsker diplom og er check out</span>
                    }
                </List>
            </Paper>
        </Box>
    </div>
}