import { AppProps } from 'next/app';
import dynamic from "next/dynamic";

import '../styles/globals.css';
import { AuthProvider } from 'context';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Component {...pageProps} />
                <ToastContainer />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default dynamic(() => Promise.resolve(MyApp), {
    ssr: false,
  });