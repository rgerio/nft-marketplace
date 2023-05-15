interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  outline?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactElement;
}

export function Button({
  outline,
  size = 'medium',
  icon,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={`
        disabled:bg-slate-300
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-full
        hover:opacity-80
        transition
        w-full
        px-4
        ${outline ? 'bg-white' : 'bg-sky-500'}
        ${outline ? 'border-black' : 'bg-sky-500'}
        ${outline ? 'text-black' : 'text-white'}
        ${size === 'small' ? 'text-sm' : 'text-md'}
        ${size === 'small' ? 'py-1' : size === 'medium' ? 'py-2' : 'py-3'}
        ${size === 'small' ? 'font-light' : 'font-semibold'}
        ${size === 'small' ? 'border-[1px]' : 'border-2'}
        ${rest.className ?? ''}
      `}
    >
      {icon}
      {children}
    </button>
  );
}
