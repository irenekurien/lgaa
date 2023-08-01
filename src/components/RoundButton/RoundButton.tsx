import React from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';

type RoundButtonProps = {
    handleClick: () => void
}

export const RoundButton = ({ handleClick }: RoundButtonProps): JSX.Element => {
    return (
        <button className="flex items-center justify-center mx-2 w-10 h-10 rounded-full bg-chat-bg shadow-lg border outline-none cursor-pointer" onClick={handleClick}>
            <RiSendPlaneFill className="w-5 h-5" />
        </button>
    );
};
