import { AppProps } from 'next/app';
import dynamic from "next/dynamic";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../styles/globals.css';
import { AuthProvider } from 'context';
import { ToastContainer } from 'react-toastify';
import LandingPage from 'views/LandingScreen/LandingScreen';
import { ChatScreen } from 'views';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatScreen />} />
        </Routes>
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