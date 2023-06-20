import { ChatQuestionType } from "types";

export const welcomeMessage: ChatQuestionType = {
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

export const URL = "https://www.uknowwhoim.me/hosted/legal-project/"