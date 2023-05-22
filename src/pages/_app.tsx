import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from 'context';
import { ToastContainer } from 'react-toastify';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <AuthProvider>
            <Component {...pageProps} />
            <ToastContainer />
        </AuthProvider>
    );
};

export default MyApp;
