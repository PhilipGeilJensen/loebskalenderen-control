import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth(props) {
  const handleChange = (event) => {
    props.selectEvent(props.events.indexOf(event.target.value))

  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Løb</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={props.events[props.selectedEvent]}
          onChange={handleChange}
          autoWidth
          label="Løb"
        >
          {
            props.events.map(item => (
              <MenuItem key={item["event_id"]} value={item}>{item["name"]}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </div>
  );
}