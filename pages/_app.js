import Head from "next/head";
import {Provider} from "react-redux";
import store from "@storage/index";
import "@styles/globals.scss";

export default function App({Component, pageProps}) {
    return (
        <Provider store={store}>
            <Head>
                <meta charSet="UTF-8"/>
                <meta name="viewport"
                      content="width=device-width, user-scalable=yes, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>

                <title>Wordiddily</title>

                <meta name="subject" content="Wordiddily"/>
                <meta name="description" content="It's Wordiddily-idily"/>
                <meta name="copyright" content="brtweed"/>
                <meta name="url" content="https://wordiddily.vercel.app"/>
                <meta name="identifier-URL" content="https://wordiddily.vercel.app"/>
                <meta name="language" content="en"/>
                <meta name="owner" content="brtweed"/>
                <meta name="rating" content="General"/>
                <meta name="MobileOptimized" content="420"/>
                <meta name="revised" content="Thursday, August 1st, 2024, 09:00am"/>
                <meta name="revisit-after" content="7 days"/>
                <meta name="theme-color" content="#345774"/>
                <meta name="msapplication-TileColor" content="#345774"/>

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#345774"/>

                <link rel="preconnect" href="https://fonts.google.com"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900display=swap"/>
            </Head>

            <Component {...pageProps} />

        </Provider>
    );
}
