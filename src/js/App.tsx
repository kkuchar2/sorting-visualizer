import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { SortPageLegacy } from "./SortPageLegacy";
import {SortPage} from "./SortPage";

import 'firebase/analytics';

import "styles/App.scss";

// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const App = () => {

    const [sharedArrayBufferSupported, setSharedArrayBufferSupported] = useState(false);

    useEffect(() => {
        setSharedArrayBufferSupported(crossOriginIsolated);
    }, []);

    const renderSortPage = useCallback(() => {
        if (sharedArrayBufferSupported) {
            return <SortPage/>;
        }
        else {
            // Fallback to sort page without SharedArrayBuffer
            return <SortPageLegacy />;
        }
    }, [sharedArrayBufferSupported]);

    return <div className={"app"}>
        <BrowserRouter>
            {renderSortPage()}
        </BrowserRouter>
    </div>;
};