import React from 'react';
import logo from './logo.svg';
import './App.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Mainpage from './mainpage/mainpage';
import { Switch } from '@mui/material';
import Numbers from "./numbers/numbers";
import { BrowserRouter as Router, Switch as RouterSwitch, Route } from 'react-router-dom';
import Diplomas from "./diplomas/diplomas";
import GuardedRoute from "./auth/guardedRoute";
import Login from './login/login';
import Dashboard from './dashboard/dashboard';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <RouterSwitch>
          <Route path="/auth">
            <Login></Login>
          </Route>
          <GuardedRoute path="/numbers" component={Mainpage} subComponent={Numbers}>
          </GuardedRoute>
          <GuardedRoute path="/diploma" component={Mainpage} subComponent={Diplomas}></GuardedRoute>
          <GuardedRoute path="/" component={Mainpage} subComponent={Dashboard}></GuardedRoute>
        </RouterSwitch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
