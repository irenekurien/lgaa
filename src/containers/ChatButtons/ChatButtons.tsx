import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { Button } from 'components';
import React from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { ChatQuestionType } from 'types';

interface ChatButtonsProps {
    questions: ChatQuestionType[];
    isLoading: boolean;
    onClick: (index: number) => void;
}

const ChatBtn = ({
    index,
    isLastButton,
    question,
    isLoading,
    onClick,
}: {
    index: number;
    isLastButton: boolean;
    question: ChatQuestionType;
    isLoading: boolean;
    onClick: (index: number) => void;
}): JSX.Element => {
    // const swiper = useSwiper();
    const onBtnClick = (): void => {
        // if (!isLastButton) swiper.slideTo(index + 1);
        onClick(index);
    };

    return (
        <Button
            type="button"
            color="custom"
            disabled={isLoading}
            className={clsx(
                'bg-white focus:ring-0 active:bg-gray-200 text-gray-900 text-sm font-normal rounded opacity-100',
                'flex items-center',
                isLoading && 'opacity-80 text-gray-600',
                isLastButton && 'mr-5'
            )}
            size="xs"
        onClick={onBtnClick}
        >

            <span>{question.text}</span>
        </Button>
    );
};

export const ChatButtons = ({ questions, isLoading, onClick }: ChatButtonsProps): JSX.Element => {
    return (
        // <NoSSRWrapper>
        // <Swiper spaceBetween={12} slidesPerView="auto">
        // {questions.map((question, i) => (
        // <SwiperSlide style={{ width: 'auto' }} className="cursor-pointer" key={question.id}>
        <ChatBtn
            index={0}
            isLoading={isLoading}
            isLastButton={10 === questions.length - 1}
            question={questions[0]}
            onClick={() => { 
                console.log("hi");
                onClick(0) 
            }}
        />
        // </SwiperSlide>
        // ))}
        // </Swiper>
        // </NoSSRWrapper>
    );
};
