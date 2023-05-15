export type ContainerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Container(props: ContainerProps) {
  return (
    <div
      {...props}
      className={`
        max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4
        ${props.className ?? ''}
      `}
    />
  );
}
