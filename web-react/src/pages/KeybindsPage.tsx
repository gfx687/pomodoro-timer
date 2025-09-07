export function KeybindsPage() {
  return (
    <div className="mt-2">
      <KeybindsRow desc="Start / Pause" keys="Space" />
      <KeybindsRow desc="Reset" keys="R" />
      <KeybindsRow desc="Fullscreen view" keys={["f", "F"]} />
      <KeybindsRow desc="Switch to Work mode" keys="1" />
      <KeybindsRow desc="Switch to Break mode" keys="2" />
      <KeybindsRow desc="Switch to Long Break mode" keys="3" />
    </div>
  );
}

const KeybindsRow = ({
  desc,
  keys,
}: {
  desc: string;
  keys: string | string[];
}) => {
  if (typeof keys === "string") keys = [keys];

  return (
    <div className="border-bg-alt flex items-center gap-2 border-b-1 pt-2.5 pb-2.5 last:border-b-0">
      <label className="mr-auto">{desc}</label>
      {keys.map((x) => (
        <span key={x} className="bg-bg-alt rounded-lg pt-1 pr-2 pb-1 pl-2">
          {x}
        </span>
      ))}
    </div>
  );
};
