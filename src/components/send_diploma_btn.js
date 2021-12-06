import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function SendDiplomaButton(props) {
    const [waiting, setWaiting] = useState(false);
    const [finished, setFinished] = useState(false);
    console.log(props.runner)

    const onClick = () => {
        setWaiting(true);
        fetch("https://localhost:44381/api/Convert", {
            method: 'POST',
            body: JSON.stringify({
                filename: "diplom.pdf",
                event: props.runner["eventId"].toString(),
                memberId: props.runner["memberId"].toString(),
                language: props.runner["language"],
                email: props.runner["email"],
                name: props.runner["name"],
                eventName: props.runner["title"],
                values: {
                    "DATE": props.runner["date"],
                    "TIME": props.runner["timer"],
                    "NAME": props.runner["name"],
                    "DISCIPLINE": props.runner["discipline"],
                    "TITLE": props.runner["title"]
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status === 200) {
                setWaiting(false);
                setFinished(true);
            }
        })
    }

    return <Button edge="end" aria-label="delete" disabled={waiting} onClick={onClick}>
        {finished ? "Send igen" : !waiting ? "Send diplom" : <CircularProgress />}
    </Button>
}