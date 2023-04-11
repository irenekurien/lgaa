import { createRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChatBubble, AlwaysScrollToBottom, Input, Button } from 'components';
import { ChatHeader, ChatButtons } from 'containers';
import { ChatMessageType, ChatQuestionType, ChatResponseType } from 'types';
import { RiSendPlaneFill } from 'react-icons/ri';
import { Ref } from 'components/InputField/Input';
import axios from 'axios';


export const ChatScreen = (): JSX.Element => {

    const chatWindow = createRef<HTMLDivElement>();
    const inputRef = useRef<Ref>(null);

    const [faq, setFaq] = useState<ChatQuestionType[]>([]);

    const updateFaq = (faq: ChatQuestionType[]) => {
        setFaq(faq)
    }

    const handleFaqClick = async (i: number) => {
        await oneMsgAtATimeLoader(
            [
                {
                    type: 'Text',
                    value: faq[i].question as string,
                    direction: 'right',
                },
            ],
            2000
        );
        addResponse(faq[i].responses as string[], 3000);
    }

    const handleClick = async () => {
        if (inputRef.current) {
            const data = inputRef.current.value;
            console.log(data)

            // push question to chat stack
            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Text',
                        value: data,
                        direction: 'right',
                    },
                ],
                2000
            );

            try {
                const response = await axios.post('https://www.uknowwhoim.me/hosted/legal-project/query', data);
                inputRef.current.value = "";

                if(response.status > 300)
                    return;
                const res = ["The relevent IPC Sections based on your case description are"];

                for (let i = 0; i < response.data.length; i++) {
                    const obj = response.data[i];

                    res.push(`Section ${obj.section}`);
                    res.push(`Section ${obj.section} states that ${obj.description.quotedText}`);
                    res.push(obj.description.explanation);
                    res.push(obj.description.examples);

                    updateFaq(obj.faq[0]);
                }

                addResponse(res);
            } catch (error) {
                console.log(error)
            }
        }
    }

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

    const oneMsgAtATimeLoader = (newMsgs: ChatMessageType[], delay = 750): Promise<void> =>
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
 
    const addResponse = async (resp: Array<string>, delay: number = 1000): Promise<void> => {
        // show loading indicator after 750ms time
        const msgLoadingTimeout = setTimeout(() => setIsMessageLoading(true));
        const msgs: ChatMessageType[] = [];
        for (let i = 0; i < resp.length; i += 1) {
            if (typeof resp[i] === "object" && resp[i].length === 0) {
                continue;
            }
            msgs.push({
                type: 'Text',
                value: resp[i],
                direction: 'left',
                linkText: undefined,
            });
        }
        // push responses to chat stack
        await oneMsgAtATimeLoader(msgs, delay);
        window.clearTimeout(msgLoadingTimeout);
        setIsMessageLoading(false);
        setIsLoading(false);
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
                        const k = typeof item !== "string" ? `msg-${item.value}-${i}` : "";
                        return <ChatBubble {...item as ChatResponseType} direction="left" key={k} />
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
                    'p-5 animate-fade-in-up'
                )}
                style={{
                    boxShadow: '0px -4px 16px 0px #0000000D',
                }}
            >
                {faq.length !== 0 &&
                    <ChatButtons
                        key={``}
                        questions={faq}
                        isLoading={isLoading}
                        onClick={(i: number) => handleFaqClick(i)}
                    />                    
                }
                
                <Input iconAppend={RiSendPlaneFill} ref={inputRef} onClickIconAppend={handleClick} />
            </div>
        </div>
    );
};
