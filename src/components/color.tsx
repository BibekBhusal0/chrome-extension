import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import MenuPopover from "./popoverMenu";
import { HexColorPicker } from "react-colorful";

type colorSwatchProps = {
  color: string;
  showHex?: boolean;
  containerProps?: React.ComponentProps<"div">;
  textProps?: React.ComponentProps<"div">;
} & React.ComponentProps<"div">;

function ColorSwatch({
  color,
  showHex,
  className,
  style,
  containerProps,
  textProps,
  ...props
}: colorSwatchProps) {
  const s = (
    <div
      style={{ backgroundColor: color, ...style }}
      className={cn(
        "size-8 rounded-md border-2 border-text-primary cursor-pointer",
        className
      )}
      {...props}
    />
  );
  if (!showHex) return s;
  return (
    <div
      className={cn(
        "flex flex-center gap-2 p-2 cursor-pointer",
        containerProps?.className
      )}
      {...containerProps}>
      {s}
      <div
        className={cn("text-lg uppercase", textProps?.className)}
        {...textProps}>
        {color}
      </div>
    </div>
  );
}

export interface HexPickerProps {
  color?: string;
  setColor?: (color: string) => any;
}
export function HexPicker({ color, setColor }: HexPickerProps) {
  const colors = ["#ff0000", "#00ff00", "#00ffff", "#0000ff", "#ff00ff"];
  let [_color, sc] = useState("#ff0000");
  const _setColor = (color: string) => {
    sc(color);
    setColor && setColor(color);
  };

  useEffect(() => {
    if (!color) return;
    _setColor(color);
  }, [color]);

  return (
    <MenuPopover
      icon={
        <div className="flex flex-center gap-2">
          <ColorSwatch color={_color} showHex={true} />
        </div>
      }>
      <div className="flex flex-center flex-col gap-2 p-3">
        <HexColorPicker color={_color} onChange={_setColor} />
        <div
          aria-label="color swatches"
          className="w-[192px] flex flex-center flex-wrap gap-2">
          {colors.map((color) => (
            <ColorSwatch
              color={color}
              key={color}
              onClick={() => _setColor(color)}
              aria-label="color"
            />
          ))}
        </div>
      </div>
    </MenuPopover>
  );
}
