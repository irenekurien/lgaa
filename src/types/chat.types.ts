export type ChatResponseType = {
    type: 'Text' | 'Image' | 'Video' | 'Link' | 'Loading' | 'Button' | 'Request Video';
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
    is_question: boolean;
    responses?: Array<ChatFaqType>;
    next_question?: ChatFaqType;
    answer?: string;
}
