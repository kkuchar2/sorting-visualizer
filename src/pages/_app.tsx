import {useEffect} from 'react';

import {ChakraProvider} from '@chakra-ui/react';
import {logEvent} from 'firebase/analytics';
import Head from 'next/head';

import {AppWrapper} from '../context/state';
import {initAnalytics, initFirebase} from '../firebase';
import theme from '../theme';

const App = function ({ Component, pageProps }) {

    useEffect(() => {
        const app = initFirebase();
        const analytics = initAnalytics(app);
        if (analytics) {
            logEvent(analytics, 'hello_there');
        }
    }, []);

    return <AppWrapper>
        <Head>
            <title>{'Sorting Visualizer'}</title>
        </Head>
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    </AppWrapper>;
};

export default App;
