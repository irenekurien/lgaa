import { createRef, useState } from 'react';
import clsx from 'clsx';
import { ChatBubble, AlwaysScrollToBottom } from 'components';
import { ChatHeader, ChatButtons } from 'containers';
import { ChatMessageType, ChatQuestionType } from 'types';

export const ChatScreen = (): JSX.Element => {

    const chatWindow = createRef<HTMLDivElement>();

    const [questions, setQuestions] = useState<Array<ChatQuestionType>>([{
        text: "I'm having a dispute with my landlord over the return of my security deposit.",
        responses: [{
            type: 'Text',
            value: "I see.",
            linkText: "string",
        }, {
            type: 'Text',
            value: "In most states, landlords are required to return a tenant's security deposit within a certain number of days after the tenant moves out. ",
            linkText: "string",
        }, {
            type: 'Text',
            value: "Have you tried discussing the issue with your landlord and trying to come to an agreement?",
            linkText: "string",
        }]
    }]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatState, setChatState] = useState<Array<ChatMessageType>>([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    const welcomeMessage: ChatQuestionType = {
        text: "hi",
        responses: [{
            type: 'Text',
            value: "Hey there!",
            linkText: "string",
        }, {
            type: 'Text',
            value: "Thanks for stopping by our legal guidance chat bot.",
            linkText: "string",
        }, {
            type: 'Text',
            value: "I am very knowleguable and can help you with any legal questions or issues you might be dealing with..",
            linkText: "string",
        }, {
            type: 'Text',
            value: "Just let us know what's on your mind and we'll do our best to point you in the right direction.",
            linkText: "string",
        }]
    };

    const oneMsgAtATimeLoader = (newMsgs: ChatMessageType[], delay = 500): Promise<void> =>
        new Promise<void>((resolve) => {
            if (newMsgs.length === 0) {
                resolve();
                return;
            }
            const timer = setTimeout(async () => {
                const newMsg = newMsgs.shift();
                if (typeof newMsg !== 'undefined') {
                    setChatState((chat) => [...chat, newMsg]);
                    await oneMsgAtATimeLoader(newMsgs, 1500);
                    clearTimeout(timer);
                }
                return resolve();
            }, delay);
        });

    const addResponse = async (index: number): Promise<void> => {
        console.log(index)
        if (questions[index]) {
            setIsLoading(true);

            // push question to chat stack
            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Text',
                        value: questions[index].text,
                        direction: 'right',
                    },
                ],
                250
            );

            // show loading indicator after 750ms time
            const msgLoadingTimeout = setTimeout(() => setIsMessageLoading(true), 750);
            const msgs: ChatMessageType[] = [];
            const resp = questions[index].responses
            for (let i = 0; i < resp.length; i += 1) {
                msgs.push({
                    type: resp[i].type,
                    value: resp[i].value,
                    direction: 'left',
                    linkText: resp[i].type === 'Link' ? resp[i].linkText : undefined,
                });
            }
            // push responses to chat stack
            await oneMsgAtATimeLoader(msgs, 250);
            window.clearTimeout(msgLoadingTimeout);
            setIsMessageLoading(false);
            setIsLoading(false);
            setQuestions([{
                text: "Yes, but we haven't been able to resolve the issue.",
                responses: [{
                    type: 'Text',
                    value: " If you're unable to reach an agreement with your landlord, you may need to consider taking legal action.",
                    linkText: "string",
                }, {
                    type: 'Text',
                    value: "Some options could include mediation or filing a lawsuit. It's always a good idea to try and resolve disputes amicably, but sometimes legal action may be necessary.",
                    linkText: "string",
                }, {
                    type: 'Text',
                    value: "Do you have any specific questions about the legal options available to you?",
                    linkText: "string",
                }]
            }])
        }
    };

    return (
        <div className="h-screen bg-chat-bg flex flex-col rounded-lg overflow-hidden relative">
            {/** Chat Window Header */}
            <ChatHeader isLoading={false} />
            {/** Chat Container */}
            <div
                className="grow flex flex-col gap-2 px-4 pt-6 pb-0 overflow-y-auto"
                ref={chatWindow}
            >
                {/** Welcome Messages */}
                {welcomeMessage &&
                    welcomeMessage?.responses.map((item, i) => {
                        return <ChatBubble {...item} direction="left" key={`msg-${item.value}-${i}`} />
                    }
                )}

                {/** Chat Messages */}
                {chatState.map((item, i) => (
                    <ChatBubble
                        {...item}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`msg-${item.value}-${i}`}
                        onLoadStarted={() => {
                            setIsMessageLoading(true);
                        }}
                        onLoadCompleted={() => {
                            setIsMessageLoading(false);
                        }}
                    />
                ))}

                {/** Chat Loading Indicator */}
                <div
                    className={clsx(
                        isMessageLoading && 'flex items-start',
                        !isMessageLoading && 'hidden'
                    )}
                >
                    <ChatBubble type="Loading" value="" direction="left" />
                </div>

                <span className="my-2" />
                <AlwaysScrollToBottom trigger={[chatState.length, isMessageLoading]} />
            </div>

            {/** Chat Footer Action Buttons */}
            <div
                className={clsx(
                    'p-5 pr-0 animate-fade-in-up'
                )}
                style={{
                    boxShadow: '0px -4px 16px 0px #0000000D',
                }}
            >
                <ChatButtons
                    questions={questions}
                    isLoading={isLoading}
                    onClick={(i: number) => addResponse(i)}
                />
            </div>
        </div>
    );
};
