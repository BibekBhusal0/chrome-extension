import Lock from "./lock";
import { useSelector } from "react-redux";
import { StateType } from "@/redux/store";
import { RemovableToolbarIcons } from "@/types/slice/layout";
import TodoButton from "./todoButton";
import Spaces from "./spaces";
import { ReactNode } from "react";

function RemovableButtons() {
  const { toolBarIcons } = useSelector((state: StateType) => state.layout);
  const iconsMapping: Record<RemovableToolbarIcons, ReactNode> = {
    spaces: <Spaces />,
    todo: <TodoButton />,
    lock: <Lock />,
  };

  return (
    <>
      {Object.entries(iconsMapping).map(([key, component]) => {
        if (toolBarIcons.includes(key as RemovableToolbarIcons)) {
          return <>{component}</>;
        } else {
          return null;
        }
      })}
    </>
  );
}

export default RemovableButtons;
