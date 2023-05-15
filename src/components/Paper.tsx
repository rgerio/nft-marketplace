export type PaperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Paper(props: PaperProps) {
  return (
    <div
      {...props}
      className={`
        bg-white
        rounded-2xl
        border-[1px]
        ${props.className ?? ''}
      `}
    />
  );
}
