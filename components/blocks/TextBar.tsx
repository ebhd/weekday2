type TestBarText = {
  text: string;
  width?: number;
};

export function TestBar(props: TestBarText) {
  const widthStyle = props.width ? { width: `${props.width}rem` } : {};

  return (
    <div
      style={widthStyle}
      className="h-8 lg:h-10 px-2 rounded-full bg-white/5 border border-muted-fg/40 flex items-center w-fit "
    >
      <span className="mx-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"></span>
      <p className="text-[0.6rem] lg:text-sm  font-light font-sans">
        {props.text}
      </p>
    </div>
  );
}
