import { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { IconType } from 'react-icons';

export type InputFieldProps = {
    label?: string;
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    iconAppend?: IconType | null;
    iconPrepend?: IconType | null;
    onClickIconAppend?: () => void;
    onClickIconPrepend?: () => void;
    slotAppend?: ReactNode;
    slotPrepend?: ReactNode;
    className?: string;
    isList?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type Ref = HTMLInputElement;

export const Input = forwardRef<Ref, InputFieldProps>(
    (
        {
            label,
            fullWidth,
            error = false,
            helperText,
            className,
            isList = false,
            iconAppend = null,
            iconPrepend = null,
            slotAppend = null,
            slotPrepend = null,
            onClickIconAppend,
            onClickIconPrepend,
            ...props
        }: InputFieldProps,
        ref
    ): JSX.Element => {
        const AppendIcon = iconAppend;
        const PrependIcon = iconPrepend;
        return (
            <div className="relative">
                {label && <label className='block'>{label}</label>}
                <input
                    className={clsx(
                        'px-3 py-3 rounded-md text-sm',
                        'text-black placeholder-gray-400 relative bg-white',
                        'peer focus:outline-none focus:ring border-2 focus:z-10 hover:border-gray-300 focus:border-gray-400',
                        !helperText && !isList && 'mb-2',
                        error && 'mb-1 ring-1 ring-red-600',
                        fullWidth && 'w-full',
                        props.disabled && '!bg-gray-200 cursor-not-allowed',
                        props.readOnly && '!bg-gray-100 cursor-not-allowed',
                        (slotAppend || AppendIcon) && 'pr-10',
                        (slotPrepend || PrependIcon) && 'pl-10',
                        className
                    )}
                    {...props}
                    ref={ref}
                />
                {(slotAppend || AppendIcon) && (
                    <span
                        className={clsx(
                            'w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-4 peer-focus:z-10',
                            !helperText && !isList && '-mt-1'
                        )}
                    >
                        {slotAppend ||
                            (AppendIcon && (
                                <AppendIcon
                                    onClick={onClickIconAppend}
                                    className={clsx(
                                        'text-base',
                                        typeof onClickIconAppend !== 'undefined'
                                            ? 'text-gray-400 hover:text-black cursor-pointer'
                                            : 'text-gray-800 pointer-events-none'
                                    )}
                                />
                            ))}
                    </span>
                )}

                {(slotPrepend || PrependIcon) && (
                    <span
                        className={clsx(
                            'w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-4 peer-focus:z-10',
                            !helperText && !isList && '-mt-1'
                        )}
                    >
                        {slotPrepend ||
                            (PrependIcon && (
                                <PrependIcon
                                    onClick={onClickIconPrepend}
                                    className={clsx(
                                        'text-base',
                                        typeof onClickIconPrepend !== 'undefined'
                                            ? 'text-gray-400 hover:text-black cursor-pointer'
                                            : 'text-gray-800 pointer-events-none'
                                    )}
                                />
                            ))}
                    </span>
                )}
            </div>
        );
    }
);
