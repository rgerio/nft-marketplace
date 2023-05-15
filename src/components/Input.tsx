import { forwardRef } from 'react';

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean;
  helperText?: string;
  label?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, label, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          ref={ref}
          {...props}
          className={`
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          pl-4
          ${error ? 'border-rose-500' : 'border-neutral-300'}
          ${error ? 'focus:border-rose-500' : 'focus:border-black'}
          ${props.className ?? ''}
        `}
        />
        <label
          className={`
          absolute 
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          left-4
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${error ? 'text-rose-500' : 'text-zinc-400'}
        `}
        >
          {label}
        </label>
        {helperText && (
          <span
            className={`
              text-sm
              ${error ? 'text-rose-500' : 'text-zinc-400'}
          `}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
