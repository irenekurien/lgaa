import clsx from 'clsx';
import { HiExternalLink } from 'react-icons/hi';
import ReactPlayer from 'react-player';
import { useMemo, useRef, useState } from 'react';
import { ChatMessageType } from 'types';
import { MessageLoadingIndicator } from 'components';

export const ChatBubble = ({
    direction = 'left',
    type,
    value,
    linkText = 'Visit Link',
    handleVideoReq = () => { },
    handleFeedback = () => { },
    onLoadStarted = () => { },
    onLoadCompleted = () => { },
}: ChatMessageType & {
    handleVideoReq?: () => void;
    handleFeedback?: () => void;
    onLoadStarted?: () => void;
    onLoadCompleted?: () => void;
}): JSX.Element => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(true);

    const msgCssClasses = useMemo(() => {
        return clsx(
            'transition-all animate-fade-in-up',
            'bg-white text-chat-text text-sm',
            !isLoadingCompleted && 'invisible h-0 m-0 p-0',
            type === 'Image' || type === 'Video' ? 'p-2' : 'p-4',
            direction === 'left' && 'self-start rounded-tl-md rounded-r-md',
            direction === 'right' && 'mt-2 mb-2 self-end rounded-md'
        );
    }, [direction, type, isLoadingCompleted]);

    /* memoized chat message to avoid rerender */
    const renderChatMessage = useMemo(() => {
        switch (type) {
            case 'Text':
                if (typeof value === 'string' && value.length !== 0)  {
                        return value;
                } 
                break;
            case 'Button':
                return (
                    <div className="flex items-center">
                        <button
                            className="flex items-center text-green-500 mr-4"
                            onClick={handleFeedback}
                        >
                            Upvote
                        </button>
                        <button className="text-red-500" onClick={handleFeedback}>
                            Downvote
                        </button>
                    </div>
                )
            case 'Request Video':
                    return (
                        <button
                            className="flex items-center text-green-500 mr-4"
                            onClick={handleVideoReq}
                        >
                            Request Video
                        </button>
                    );
            case 'Link':
                return (
                    <button
                        type="button"
                        className="flex items-center text-blue-900"
                        onClick={() => window.open(typeof value === 'string' ? value : '', '_blank')}
                    >
                        <span className="mr-1">{linkText}</span> <HiExternalLink />
                    </button>
                );
            case 'Image':
                setIsLoadingCompleted(false);
                onLoadStarted();
                return (
                    <img
                        src={typeof value === 'string' ? value : ''}
                        alt=""
                        className="rounded-md"
                        onLoad={() => {
                            setIsLoadingCompleted(true);
                            onLoadCompleted();
                        }}
                    />
                );
            case 'Video':
                setIsLoadingCompleted(false);
                onLoadStarted();
                return (
                    <div className="rounded-md overflow-hidden">
                        <ReactPlayer
                            url={typeof value === 'string' ? value : ''}
                            width="100%"
                            height="auto"
                            onReady={() => {
                                setIsLoadingCompleted(true);
                                onLoadCompleted();
                            }}
                        />
                    </div>
                );
                case 'Audio':
                    setIsLoadingCompleted(false);
                    onLoadStarted();
                    const audioSource = URL.createObjectURL(value as Blob);
                    return (
                        <div className="rounded-md overflow-hidden">
                            <ReactPlayer
                                url={audioSource}
                                controls
                                width="300px"
                                height="50px"
                                onReady={() => {
                                    setIsLoadingCompleted(true);
                                    onLoadCompleted();
                                }}
                            />
                        </div>
                    );
            case 'Loading':
                return <MessageLoadingIndicator />;
            default:
                return '';
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkText, value, type]);
 

    if(typeof renderChatMessage !== "undefined") 
        return (
            <div
                className={msgCssClasses}
                style={{
                    maxWidth: '78%',
                }}
            >
                {/* Parse message to elements */}
                {renderChatMessage}
            </div>
        );
        
    return <></>
};
