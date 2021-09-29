import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth() {
  const [age, setAge] = React.useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const items = [
      {
          name: "Sportigan løbet 2021",
          id: 1
      },
      {
          name: "Spanien 2021",
          id: 2
      }
  ]

  React.useEffect(() => {
    setAge(items[0].id)
  }, [])

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Løb</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="Løb"
        >
          <MenuItem value={10}>Sportigan løbet</MenuItem>
          <MenuItem value={21}>Spanien løb 1</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}