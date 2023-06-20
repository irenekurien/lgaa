import { createRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { ChatBubble, AlwaysScrollToBottom, Input } from 'components';
import { ChatHeader, ChatButtons, PreviousSessions } from 'containers';
import { ChatFaqType, ChatMessageType, ChatResponseType } from 'types';
import { Ref } from 'components/InputField/Input';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignInUp } from 'views/Auth';
import { RoundButton } from 'components/RoundButton';
import { welcomeMessage, URL } from 'const/constants';
import { axiosInstance } from 'config';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const ChatScreen = (): JSX.Element => {

    const chatWindow = createRef<HTMLDivElement>();
    const inputRef = useRef<Ref>(null);

    const [message, setMessage] = useState('');

    const [faq, setFaq] = useState<ChatFaqType[]>([]);
    const [isFaqAsked, setIsFaqAsked] = useState<number>(-1);
    const [sessionId, setSessionId] = useState<string>();
    const [resData, setResData] = useState<string>();
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [updatePreviousSessions, setUpdatePreviousSessions] = useState<number>(0);


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatState, setChatState] = useState<Array<ChatMessageType>>([]);
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            setUpdatePreviousSessions(updatePreviousSessions + 1)
        }
    }, [isSignedIn])

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const toggleOverlay = () => {
        setIsOverlayOpen(!isOverlayOpen);
    };

    const recorderControls = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
        },
        (err) => console.table(err) // onNotAllowedOrFound
    );

    const addAudioElement = async (blob: Blob) => {
        await oneMsgAtATimeLoader(
            [
                {
                    type: 'Audio',
                    value: blob,
                    direction: 'right',
                },
            ],
            2000
        );
    };

    const handleAudioData = async (recordedData: Blob) => {
        try {
            await addAudioElement(recordedData);
            if (recordedData) {
                const formData = new FormData();
                formData.append('file', recordedData, 'recording.mp3');

                const res = await axiosInstance.post(`chat-audio`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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
                setSessionId(res.data.session_id)
                setResData(res.data.message)
                setVideoFeedbackButtons();
            }
        } catch (error) {
            toast.error('Unable to send audio', { autoClose: 2000 });
        }
    };

    const setVideoFeedbackButtons = async () => {
        console.log("j")
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
    }

    const handleFeedback = () => {
        const f = localStorage.getItem("token");
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

            const response2 = await axiosInstance.post(`query`, data)
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
            const res = await axiosInstance.post('chat', data, {
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

            setVideoFeedbackButtons()
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
        if (faq[i].answer) {
            await oneMsgAtATimeLoader(
                [
                    {
                        type: 'Text',
                        value: faq[i]?.answer as string,
                        direction: 'left',
                    },
                ],
                2000
            );
        }
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
            let flag = false;
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

                                console.log(response.text, data)
                                if (response.text === data) {
                                    if (response.answer) {
                                        await oneMsgAtATimeLoader(
                                            [
                                                {
                                                    type: 'Text',
                                                    value: response?.answer as string,
                                                    direction: 'left',
                                                },
                                            ],

                                        );
                                    }
                                    const f = []
                                    if (response.next_question) {
                                        f.push(response.next_question)
                                        setFaq(f)
                                    }
                                    flag = false;
                                    break;
                                } else {
                                    console.log("u")
                                    flag = true;
                                }
                            }
                        } else {
                            flag = true;
                        }
                    }
                } else {
                    flag = true;
                }
                console.log(flag)
                if (flag) {
                    setIsFaqAsked(-1);
                    setFaq([]);
                    await sendRequests(data);
                    flag = false;
                }
                setIsMessageLoading(false)
            }
            catch (error) {
                console.log(error)
            }
        }
    }

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
        console.log(resData)
        const res = await axios.post(`${URL}video`, {
            context: resData
        }, {
            params: {
                session_id: sessionId
            }
        });

        const msgLoadingTimeout = setTimeout(() => setIsMessageLoading(true));
        const msgs: ChatMessageType[] = [];

        const videos = JSON.parse(res.data)

        for (let i = 0; i < videos.length; i++) {
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

    const updateSession = async (sessionId: string) => {
        try {
            setChatState([])
            setFaq([])
            setUpdatePreviousSessions(updatePreviousSessions + 1)
            setSessionId(sessionId)
            if (sessionId !== '') {
                const sessionRes = await axiosInstance.get(`sessions/${sessionId}`);

                sessionRes.data.forEach(async (item: { type: string; data: { content: string }; }, index: string) => {
                    const { type, data } = item;
                    const { content } = data;

                    let direction: 'left' | 'right' = "right";

                    if (type === 'ai') {
                        direction = "left"
                    }

                    await oneMsgAtATimeLoader(
                        [
                            {
                                type: 'Text',
                                value: content,
                                direction,
                            },
                        ],
                        2000
                    );
                })
            }
        } catch (e) {
            toast.error("Couldn't load session", { autoClose: 2000 })
        }
    }

    return (
        <div className="h-screen w-screen bg-chat-bg flex flex-col rounded-lg overflow-hidden">
            {/** Chat Window Header */}
            <ChatHeader isLoading={false} signUp={setIsOverlayOpen} isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            <div className='flex-grow grow overflow-y-auto mt-16 mb-16 pb-16'>
                <PreviousSessions updatePreviousSessions={updatePreviousSessions} updateSession={updateSession} />
                <div>
                    {/** Chat Container */}
                    <div
                        className="flex flex-col gap-2 px-4 pt-6 pb-0 overflow-y-auto w-2/5 m-auto"
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
                            'p-5 animate-fade-in-up w-full shadow-md fixed bottom-0 left-0 right-0'
                        )}
                        style={{
                            boxShadow: '0px -4px 16px 0px #0000000D',
                        }}
                    >
                        <div className="w-2/5 m-auto">
                            {(faq?.length ?? 0) !== 0 &&
                                <ChatButtons
                                    key={``}
                                    questions={faq}
                                    isLoading={isLoading}
                                    onClick={(i: number) => handleFaqClick(i)}
                                />
                            }
                            {!recorderControls.isRecording && <Input ref={inputRef} onChange={handleMessageChange} className='float-left w-5/6 xl:mx-4' />}
                            <div className={clsx(!recorderControls.isRecording && 'float-right xl:mx-4')}>
                                {message === '' ? <AudioRecorder
                                    onRecordingComplete={(blob: Blob) => handleAudioData(blob)}
                                    recorderControls={recorderControls}
                                    showVisualizer={true}
                                /> :
                                    <RoundButton handleClick={handleClick} />}
                            </div>
                        </div>
                        {isOverlayOpen && <SignInUp closeOverlay={toggleOverlay} isSignedIn={setIsSignedIn} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
