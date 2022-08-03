import Document, {Head, Html, Main, NextScript} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {

    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return <Html>
            <Head>
                <link rel={'manifest'} href={'/manifest.json'}/>
                <link rel={'apple-touch-icon'} href={'/images/pwa/icon_x256.png'}/>
                <link
                    href={'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'}
                    rel={'stylesheet'}/>
                <Script src={'/theme.js'} strategy={'beforeInteractive'} defer={false}/>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>;
    };
}

export default MyDocument;