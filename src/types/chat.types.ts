export type ChatResponseType = {
    type: 'Text' | 'Image' | 'Video' | 'Link' | 'Loading' | 'Button';
    value: string;
    linkText: string;
    id?: number;
};

export type ChatQuestionType = {
    question?: string;
    text: string;
    responses: Array<ChatResponseType> | string[];
    id?: number;
    isWelcome?: boolean;
};

export type ChatMessageType = {
    type: ChatResponseType['type'];
    value: string;
    direction: 'left' | 'right';
    linkText?: string;
};

export type ChatFaqType = {
    id?: number;
    text: string;
    isQuestion: boolean;
    responses: Array<ChatFaqType>;
    nextQuestion: ChatFaqType;
}
