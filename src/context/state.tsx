import React, {useEffect, useState} from 'react';

import {DefaultSeo} from 'next-seo';

import SEO from '../../next-seo.config';

export const AppWrapper = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return <>
        <DefaultSeo {...SEO} />

        {/*Prevent FOUC*/}
        <div style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
            {children}
        </div>
    </>;
};