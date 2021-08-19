import { firebaseConfig } from "firebaseConfig.js";
import firebase from 'firebase/app';
import 'firebase/analytics';
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { SortPage } from "SortPage";

import "styles/App.scss";

firebase.initializeApp(firebaseConfig);
firebase.analytics();

function App() {
    return <div className={"app"}>
        <BrowserRouter>
            <SortPage/>
        </BrowserRouter>
    </div>;
}

export default App;