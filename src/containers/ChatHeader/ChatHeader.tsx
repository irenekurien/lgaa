import Image from 'next/image';

interface ChatHeaderProps {
    isLoading: boolean;
}

export const ChatHeader = ({
    isLoading,
}: ChatHeaderProps): JSX.Element => {
    return (
        <header className="px-4 py-4 bg-white flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
                <div className="border rounded-full overflow-hidden items-center justify-center flex m-4">
                    {isLoading ? (
                        <span className="h-10 w-10 animate-pulse bg-gray-200" />
                    ) : (
                        <Image src="/Vector.png" alt='' width={32} height={32}/>
                    )}
                </div>
                <p className="mx-8 text-sm font-medium flex items-center">
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
        </header>
    );
};
