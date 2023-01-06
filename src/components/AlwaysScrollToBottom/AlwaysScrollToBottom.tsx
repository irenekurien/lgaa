import { useEffect, useRef } from 'react';

export const AlwaysScrollToBottom = ({ trigger }: { trigger: Array<unknown> }): JSX.Element => {
    // https://stackoverflow.com/a/61266099
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(
        () =>
            elementRef.current?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        trigger
    );
    return <div ref={elementRef} />;
};
