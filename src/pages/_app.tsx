import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from 'context';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
};

export default MyApp;
