import clsx from 'clsx';
import { Button } from 'components';
import React from 'react';
// import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { ChatFaqType, ChatQuestionType } from 'types';

interface ChatButtonsProps {
    questions: ChatFaqType[];
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
    question: ChatFaqType;
    isLoading: boolean;
    onClick: (index: number) => void;
}): JSX.Element => {
    // const swiper = useSwiper();
    const onBtnClick = (): void => {
        // if (!isLastButton) swiper.slideTo(index + 1);
        onClick(index);
    };

    console.log(question.text)

    return (
        <Button
            type="button"
            color="custom"
            disabled={isLoading}
            className={clsx(
                'm-6 bg-white focus:ring-0 active:bg-gray-200 text-gray-900 text-sm font-normal rounded opacity-100',
                'flex items-center',
                isLoading && 'opacity-80 text-gray-600',
                isLastButton && 'mr-5'
            )}
            size="xs"
            onClick={onBtnClick}
            style={{
                margin: '0 4px 16px 4px',
            }}
        >
            <span>{question.text}</span>
        </Button>
    );
};

export const ChatButtons = ({ questions, isLoading, onClick }: ChatButtonsProps): JSX.Element => {
    return (
        <div className='flex'>
        {questions.map((question, i) => (
            // <SwiperSlide className="cursor-pointer" key={question.id}>
                <ChatBtn
                    key={question.id}
                    index={i}
                    isLoading={isLoading}
                    isLastButton={10 === questions.length - 1}
                    question={questions[i]}
                    onClick={(i) => {
                        onClick(i)
                    }}
                />
                
            // </SwiperSlide>
        ))}
        </div>
    //     <Swiper spaceBetween={12} slidesPerView="auto" direction="horizontal" className='flex'>
        
    //  </Swiper>
    );
};
