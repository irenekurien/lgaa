import { createRef, useContext, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChatBubble, AlwaysScrollToBottom, Input, Button } from 'components';
import { ChatHeader, ChatButtons } from 'containers';
import { ChatFaqType, ChatMessageType, ChatQuestionType, ChatResponseType } from 'types';
import { RiSendPlaneFill } from 'react-icons/ri';
import { Ref } from 'components/InputField/Input';
import axios from 'axios';
import { AuthContext } from 'context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignInUp } from 'views/Auth';

export const ChatScreen = (): JSX.Element => {

    const chatWindow = createRef<HTMLDivElement>();
    const inputRef = useRef<Ref>(null);

    const [faq, setFaq] = useState<ChatFaqType[]>([]);
    const [isFaqAsked, setIsFaqAsked] = useState<number>(-1);
    const [sessionId, setSessionId] = useState<string>();
    const [resData, setResData] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatState, setChatState] = useState<Array<ChatMessageType>>([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOverlayOpen(!isOverlayOpen);
    };

    const handleFeedback = () => {
        const f = localStorage.getItem("isLoggedIn");
        const feed = localStorage.getItem("feedback")
        if (feed) {
            toast.success('Feedback already submitted', { autoClose: 2000 });
            return;
        }
        if (f) {
            toast.success('Submitted your feedback', { autoClose: 2000 });
            localStorage.setItem("feedback", "true");
        } else {
            toggleOverlay()
        }
    }


    const handleHttpError = async (data: string) => {
        if (typeof sessionId === "undefined") {

            const res = ["The relevent IPC Sections based on your case description are"];

            const response2 = await axios.post('https://uknowwhoim.me/hosted/legal-project/query', data)
            if (response2.status > 300)
                return;

            for (let i = 0; i < response2.data.length; i++) {
                const obj = response2.data[i];

                res.push(`Section ${obj.section}`);
                res.push(`Section ${obj.section} states that ${obj.description.quotedText}`);
                res.push(obj.description.explanation);
                res.push(obj.description.examples);
            }

            if (res.length > 1)
                addResponse(res);
        } else {
            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Text',
                        value: "Soory, I'm having some issues at my end, please try again after sometime",
                        direction: 'left',
                    },
                ],
                2000
            );
        }
    }

    const sendRequests = async (data: string) => {
        console.log(data)
        try {
            const res = await axios.post('https://uknowwhoim.me/hosted/legal-project/chat', data, {
                params: {
                    session_id: sessionId
                }
            });
            console.log(sessionId)

            setSessionId(res.data.session_id)
            setResData(res.data.message)

            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Text',
                        value: res.data.message,
                        direction: 'left',
                    },
                ],
                2000
            );

            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Request Video',
                        value: '',
                        direction: 'left',
                    },
                ],
                2000
            );

            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Button',
                        value: '',
                        direction: 'left',
                    },
                ],
                2000
            );
            setFaq(res.data.faq);
        } catch (error) {
            await handleHttpError(data)
        }
        return [];
    }

    const handleFaqClick = async (i: number) => {
        await oneMsgAtATimeLoader(
            [
                {
                    type: 'Text',
                    value: faq[i].text as string,
                    direction: 'left',
                },
            ],
            2000
        );
        setIsFaqAsked(i)
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
                inputRef.current.value = "";

                setChatState((chat) => [...chat,
                {
                    type: 'Text',
                    value: "",
                    direction: 'right',
                },
                ]);
                setIsMessageLoading(true);

                const i = isFaqAsked;

                console.log(isFaqAsked, faq);

                if (isFaqAsked != -1) {
                    const item = faq[i];

                    console.log(item)

                    if (item.is_question) {
                        console.log(item.is_question)
                        if (item.responses && item.responses.length > 0) {
                            for (let j = 0; j < item.responses.length; j++) {
                                const response = item.responses[j];
                                console.log(response)

                                if (response.text == data) {
                                    const f = []
                                    if (response.next_question) {
                                        f.push(response.next_question)
                                        setFaq(f)
                                    }
                                    console.log(f)
                                    if (response.answer) {
                                        await oneMsgAtATimeLoader(
                                            [
                                                {
                                                    type: 'Text',
                                                    value: response.answer,
                                                    direction: 'left',
                                                },
                                            ],
                                            2000
                                        );
                                    }
                                    if (item.answer) {
                                        await oneMsgAtATimeLoader(
                                            [
                                                {
                                                    type: 'Text',
                                                    value: item.answer,
                                                    direction: 'left',
                                                },
                                            ],
                                            2000
                                        );
                                    }
                                } else {
                                    // setIsFaqAsked(-1)
                                    // await sendRequests(data);
                                }
                            }
                        }
                        
                    }
                } else {
                    setIsFaqAsked(-1)
                    await sendRequests(data);
                }
                setIsMessageLoading(false)
            }
            catch (error) {
                console.log(error)
            }
        }
    }

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
            value: "I am very knowledgeable and can help you with any legal questions or issues you might be dealing with..",
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
        setIsMessageLoading(false);        // `https://www.youtube.com${}`

        setIsLoading(false);
    };

    const handleVideoReq = async () => {
        const res = await axios.post('http://localhost:8001/query', resData);

        console.log(res)
        const msgLoadingTimeout = setTimeout(() => setIsMessageLoading(true));
        const msgs: ChatMessageType[] = [];

        const videos = JSON.parse(res.data);

        for (let i = 0; i < videos.length; i ++) {
            msgs.push({
                type: 'Video',
                value: `https://www.youtube.com${videos[i]}`,
                direction: 'left',
                linkText: undefined,
            });
        }
        
        await oneMsgAtATimeLoader(msgs, 2000);
        window.clearTimeout(msgLoadingTimeout);
        setIsMessageLoading(false);
        setIsLoading(false);
    }

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
                        handleFeedback={handleFeedback}
                        handleVideoReq={handleVideoReq}
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
                {faq?.length !== 0 &&
                    <ChatButtons
                        key={``}
                        questions={faq}
                        isLoading={isLoading}
                        onClick={(i: number) => handleFaqClick(i)}
                    />
                }

                <Input iconAppend={RiSendPlaneFill} ref={inputRef} onClickIconAppend={handleClick} />
                {isOverlayOpen && <SignInUp closeOverlay={toggleOverlay} />}
            </div>
        </div>
    );
};
