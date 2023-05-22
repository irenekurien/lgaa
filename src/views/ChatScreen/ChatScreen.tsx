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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatState, setChatState] = useState<Array<ChatMessageType>>([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const toggleOverlay = () => {
        setIsOverlayOpen(!isOverlayOpen);
    };

    const { isLoggedIn } = useContext(AuthContext);

    const handleFeedback = () => {
        if (isFeedbackSubmitted) {
            toast.success('Feedback already submitted', { autoClose: 2000 });
            return;
        }
        if (isLoggedIn) {
            toast.success('Submitted your feedback', { autoClose: 2000 });
            setIsFeedbackSubmitted(true)
        } else {
            toggleOverlay()
        }
    }


    const handleHttpError = async (data: string) => {
        if (typeof sessionId === "undefined") {

            const res = ["The relevent IPC Sections based on your case description are"];

            const response2 = await axios.post('https://www.uknowwhoim.me/hosted/legal-project/query', data)
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
        try {
            const res = await axios.post('https://www.uknowwhoim.me/hosted/legal-project/chat', data, {
                params: {
                    session_id: sessionId
                }
            });
            console.log(sessionId)

            setSessionId(res.data.session_id)

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


    const handleFaq = () => {
        for (let i = 0; i < faq.length; i++) {
            const item = faq[i];

            if (item.isQuestion) {
                console.log(item.text); 

                if (item.responses && item.responses.length > 0) {
                    // Iterate through the responses
                    for (let j = 0; j < item.responses.length; j++) {
                        const response = item.responses[j];

                        console.log(response.text); // Print the response

                        // Check if there is a next question
                        if (response.nextQuestion) {
                            // Access the next question
                            const nextQuestion = response.nextQuestion;
                            console.log(nextQuestion.text); // Print the next question

                            // Continue accessing subsequent questions in a similar manner

                            // Check if the next question has responses
                            if (nextQuestion.responses && nextQuestion.responses.length > 0) {
                                // Iterate through the responses
                                for (let k = 0; k < nextQuestion.responses.length; k++) {
                                    const nextResponse = nextQuestion.responses[k];

                                    console.log(nextResponse.text); // Print the response

                                    // Access the answer if available
                                    if (nextResponse.answer) {
                                        console.log(nextResponse.answer); // Print the answer
                                    }

                                    // Continue accessing subsequent questions or responses
                                }
                            }
                        }
                    }
                }
            }
        }

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

                if (isFaqAsked != -1) {
                    const item = faq[i];

                    if(item.text == data) {
                        if (item.isQuestion) {
                            if (item.responses && item.responses.length > 0) {
                                for (let j = 0; j < item.responses.length; j++) {
                                    const response = item.responses[j];
            
                                    if(response.text == data)   {
                                        const f = []
                                        f.push(response.nextQuestion)
                                        setFaq(f)
                                    }
                                }
                            }
                        }
                    } else {
                        await sendRequests(data);
                    } 
                    setIsFaqAsked(-1);
                }
                else {
                    await sendRequests(data);
                }

                setIsMessageLoading(false);

            } catch (error) {
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
                        handleFeedback={handleFeedback}
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
                {isOverlayOpen && <SignInUp />}
            </div>
        </div>
    );
};
