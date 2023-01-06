export const MessageLoadingIndicator = (): JSX.Element => (
    <div>
        <span className="animate-bounce w-2 h-2 mx-1 inline-block bg-gray-400 rounded-full" />
        <span
            className="animate-bounce w-2 h-2 mx-1 inline-block bg-gray-400 rounded-full"
            style={{
                animationDelay: '0.5s',
            }}
        />
        <span className="animate-bounce w-2 h-2 mx-1 inline-block bg-gray-400 rounded-full" />
    </div>
);
