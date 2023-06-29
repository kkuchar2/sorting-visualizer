import React, { useEffect, useState } from 'react';

export const AppWrapper = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return <>
        <div style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
            {children}
        </div>
    </>;
};