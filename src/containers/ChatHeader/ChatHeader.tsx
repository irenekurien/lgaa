import { Button } from 'components';
import { updateAuthorizationHeader } from 'config';
import Image from 'next/image';

interface ChatHeaderProps {
    isLoading: boolean;
    isSignedIn: boolean;
    signUp: (x: boolean) => void;
    setIsSignedIn: (x: boolean) => void;
}

export const ChatHeader = ({
    isLoading,
    isSignedIn,
    signUp,
    setIsSignedIn
}: ChatHeaderProps): JSX.Element => {
    const handleLogout = () => {
        updateAuthorizationHeader(null);
        localStorage.removeItem('token');
        localStorage.removeItem('feed');
        setIsSignedIn(false);
        window.location.reload();
    };

    return (
        <header className="px-6 py-4 bg-white flex items-center justify-between border-b border-gray-200 fixed top-0 left-0 right-0 w-full">
            <div className='w-full'>
                <div className='float-left'>
                    <div className="flex items-center gap-4">
                        <div className="border rounded-full overflow-hidden items-center justify-center flex m-4 shadow-md">
                            {isLoading ? (
                                <span className="h-10 w-10 animate-pulse bg-gray-200" />
                            ) : (
                                <Image src="/Vector.png" alt='' width={40} height={40} />
                            )}
                        </div>
                        <div className='w-5 h-2'></div>
                        <p className="mx-8 text-lg font-bold flex items-center">
                            {isLoading ? (
                                <>
                                    <span className="h-3 w-32 rounded-lg animate-pulse bg-gray-200" />
                                    <span className="h-3 w-3 ml-1 rounded-lg animate-pulse bg-gray-200" />
                                </>
                            ) : (
                                <>
                                    <span>Legal Guidance through AI Assistance</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                {isSignedIn ? <div className='float-right'>
                    <Button type='button' variant='outlined' color="black" onClick={handleLogout}>Logout</Button>
                </div> : <div className='float-right'>
                    <Button type='button' variant='outlined' color="black" onClick={() => signUp(true)}>Login</Button>
                </div>}
            </div>
        </header>
    );
};
