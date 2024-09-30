import { cn } from "@/utils/cn";
import { Paper, PaperProps } from "@mui/material";

function WidgetControls(props: PaperProps) {
  return (
    <Paper
      {...props}
      className={cn("absolute right-0 top-0 px-2 py-1 z-20", props?.className)}
      sx={{
        borderRadius: 0,
        borderBottomLeftRadius: 4,
        backgroundColor: "surfaceVariant.main",
        ...props?.sx,
      }}
      //
    />
  );
}

export default WidgetControls;