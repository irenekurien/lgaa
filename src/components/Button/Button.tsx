import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { HiOutlineRefresh } from 'react-icons/hi';

type SizeProps = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type ColorProps = 'brand' | 'success' | 'danger' | 'black' | 'white' | 'custom';
type VariantProps = 'base' | 'text' | 'outlined';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    children?: ReactNode;
    color?: ColorProps;
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: SizeProps;
    variant?: VariantProps;
    rounded?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
};
const colorMappingByVariant: Record<ColorProps, Record<VariantProps, string>> = {
    brand: {
        base: 'bg-brand-700 text-white hover:bg-brand-800 border-transparent',
        text: 'text-gray-700 hover:bg-gray-200',
        outlined: 'text-brand-700 border-brand-600 hover:bg-brand-50',
    },
    success: {
        base: 'bg-green-500 text-white hover:bg-green-600 border-transparent',
        text: 'text-green-600 hover:bg-gray-200',
        outlined: 'text-green-550 border-green-400 hover:bg-green-50',
    },
    danger: {
        base: 'bg-red-500 text-white hover:bg-red-600 border-transparent',
        text: 'text-red-600 hover:bg-gray-200',
        outlined: 'text-red-500 border-red-400 hover:bg-red-50',
    },
    black: {
        base: 'bg-gray-900 text-white hover:bg-black border-transparent',
        text: 'text-gray-900',
        outlined: 'text-gray-800 border-gray-600 hover:bg-gray-50',
    },
    white: {
        base: 'bg-white text-gray-900 hover:bg-gray-100 border-transparent',
        text: 'text-white',
        outlined: 'text-white border-white hover:bg-gray-200',
    },
    custom: {
        base: '',
        text: '',
        outlined: '',
    },
};
const paddingMappingBySize: Record<SizeProps, string> = {
    xs: 'px-3 py-2',
    sm: 'px-4 py-2',
    base: 'px-5 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-4',
};

const paddingMappingBySizeForRounded: Record<SizeProps, string> = {
    xs: 'p-2',
    sm: 'p-3',
    base: 'p-4',
    lg: 'p-4',
    xl: 'p-5',
};

const fontsizeMappingBySize: Record<SizeProps, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
};

export type Ref = HTMLButtonElement | null;

export const Button = forwardRef<Ref, ButtonProps>(
    (
        {
            children,
            color = 'brand',
            className,
            disabled,
            fullWidth,
            size = 'sm',
            variant = 'base',
            rounded = false,
            type = 'button',
            loading = false,
            ...props
        }: ButtonProps,
        ref
    ): JSX.Element => {
        return (
            <button
                ref={ref}
                // eslint-disable-next-line react/button-has-type
                type={type}
                className={clsx(
                    'font-medium focus:ring',
                    'relative inline-flex items-center justify-center  cursor-pointer',
                    fullWidth && 'w-full',
                    disabled && 'bg-gray-300 cursor-not-allowed',
                    variant === 'outlined' && 'border-2',
                    fontsizeMappingBySize[size],
                    rounded ? paddingMappingBySizeForRounded[size] : paddingMappingBySize[size],
                    !disabled && colorMappingByVariant[color][variant],
                    rounded ? 'rounded-full' : ' rounded',
                    className
                )}
                disabled={disabled}
                {...props}
            >
                <span
                    className={clsx(
                        loading && 'opacity-0',
                        'inline-flex items-center justify-center'
                    )}
                >
                    {children}
                </span>{' '}
                <span
                    className={clsx(
                        loading
                            ? 'absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2'
                            : 'hidden'
                    )}
                >
                    <HiOutlineRefresh className="animate-spin" />
                </span>
            </button>
        );
    }
);

Button.displayName = 'Button';
