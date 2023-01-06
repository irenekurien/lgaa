import clsx from 'clsx';
import { HiExternalLink } from 'react-icons/hi';
import ReactPlayer from 'react-player';
import { useMemo, useState } from 'react';
import { ChatMessageType } from 'types';
import { MessageLoadingIndicator } from 'components';

export const ChatBubble = ({
    direction = 'left',
    type,
    value,
    linkText = 'Visit Link',
    onLoadStarted = () => { },
    onLoadCompleted = () => { },
}: ChatMessageType & {
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
                return value;
            case 'Link':
                return (
                    <button
                        type="button"
                        className="flex items-center text-blue-900"
                        onClick={() => window.open(value, '_blank')}
                    >
                        <span className="mr-1">{linkText}</span> <HiExternalLink />
                    </button>
                );
            case 'Image':
                setIsLoadingCompleted(false);
                onLoadStarted();
                return (
                    <img
                        src={value}
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
                            url={value}
                            width="100%"
                            height="auto"
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
};
