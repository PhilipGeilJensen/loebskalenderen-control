import React, { useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import { auth } from '../firebase';
import jwt_decode from 'jwt-decode';
import Mainpage from '../mainpage/mainpage';

const GuardedRoute = ({ component: Component, subComponent: SubComponent, ...rest }) => {
    console.log(rest)
    let result = false;
    let token = window.localStorage.getItem("token");
    let decodedToken;
    if (token !== null) {
        try {
            decodedToken = jwt_decode(token);
            window.localStorage.setItem("decoded_token", JSON.stringify(decodedToken))
            let currentDate = new Date();
            // JWT exp is in seconds
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                window.localStorage.removeItem("token")
            } else {
                result = true;
            }
        } catch (error) {
            result = false;
        }
    }
    return (
        <Route {...rest} render={(props) => (
            result === true
                ? <Component component={SubComponent} {...props} child={rest.child} ></Component>
                : <Redirect to="/auth" />
        )}></Route>
    )
}

export default GuardedRoute;