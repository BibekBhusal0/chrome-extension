import { allWidgetsType } from "@/types/slice/widgets";
import { Layout } from "react-grid-layout";
import { ControlsProps } from "@/layout/widgets/controls";
import HabitTrackerControls from "@/layout/widgets/habit-tracker/controls";
import ClockControls from "@/layout/widgets/clock/controls";
import TodoControls from "@/layout/widgets/todo/todo-controls";
import { URLChange } from "@/layout/widgets/custom";

export const widgetDimensions: Record<allWidgetsType, Partial<Layout>> = {
  "habit-tracker": { minW: 4, minH: 2, maxH: 2, maxW: 8 },
  "habit-tracker-stats-single": { minW: 4, minH: 3 },
  "habit-tracker-stats-all": { minW: 4, minH: 3 },
  todo: { minW: 3, minH: 4 },
  bookmark: { minW: 2, minH: 2 },
  clock: { maxH: 5, maxW: 8, minH: 1, minW: 2 },
  search: { maxH: 1, minW: 4 },
  custom: { minW: 1, minH: 1 },
  calendar: { minH: 4, minW: 3, isResizable: false },
  navigation: { minH: 2, minW: 4, maxH: 3, maxW: 5 },
};

export const getWidgetControlsProps = (
  widgetType: allWidgetsType,
  id: number
): ControlsProps => {
  const widgetInfo = { id: id, type: widgetType };
  const controlsProps: Record<allWidgetsType, ControlsProps> = {
    "habit-tracker-stats-all": { widgetInfo },
    "habit-tracker-stats-single": { widgetInfo },
    calendar: { widgetInfo },
    navigation: { widgetInfo },
    search: { widgetInfo },
    custom: { deleteButton: true, controls: <URLChange id={id} />, widgetInfo },
    "habit-tracker": {
      deleteButton: false,
      showOn: "hover",
      controls: <HabitTrackerControls id={id} />,
      className: "flex-center flex-col gap-4 p-2 ",
      widgetInfo,
    },
    clock: {
      deleteButton: false,
      showOn: "hover",
      controls: <ClockControls id={id} />,
      widgetInfo,
    },
    todo: {
      deleteButton: false,
      showOn: "hover",
      controls: <TodoControls id={id} />,
      controlsContainerProps: {},
      widgetInfo,
    },
    bookmark: { widgetInfo },
  };

  return controlsProps[widgetType];
};
