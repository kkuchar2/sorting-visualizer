import React from 'react';
import {StyledSortPage, StyledSortVisualiserWindow2} from "./style.js";

export const SortPageLegacy = () => {

    return <StyledSortPage>
        <StyledSortVisualiserWindow2>
            <div style={{fontSize: '1.3em', color: '#333333'}}>No support for this browser</div>
            <div style={{fontSize: '1em', color: '#333333', marginTop: 20}}>Fallback to legacy version will come soon</div>
        </StyledSortVisualiserWindow2>
    </StyledSortPage>;
};