import useCurrentLayout from "@/hooks/useCurrentLayout";
import SettingHeader from "../settings-header";
import DuplicateThisSpace from "./duplicateSpace";
import DeleteThisSpace from "./deleteSpace";
import ChangeCompaction from "./changeCompaction";
import AddSpace from "./addSpace";
import RenameItem from "@/components/renameItem";
import { useDispatch } from "react-redux";
import {
  currentSpaceChangeIcon,
  currentSpaceRename,
  currentSpaceToggleLocked,
} from "@/redux/slice/layout";
import { SelectIconMenu } from "@/components/select-icon";
import MenuSwitch, { MenuSwitchProps } from "@/components/menuSwitch";

function CurrentSpaceSetting() {
  const layout = useCurrentLayout();
  const dispatch = useDispatch();
  const space = useCurrentLayout();

  const toggle: MenuSwitchProps["items"] = [
    {
      onChange: () => dispatch(currentSpaceToggleLocked()),
      title: "Lock Widgets",
      checked: space?.locked,
    },
  ];

  if (!layout) return null;

  return (
    <>
      <SettingHeader>Current Space</SettingHeader>
      <div
        aria-label="Current Space Settings"
        className="w-full flex flex-col items-center gap-5">
        <ChangeCompaction />
        <MenuSwitch plain items={toggle} />

        <div aria-label="Icons" className="full-between icon-xl">
          <div className="text-xl">Change Icons</div>
          <div className="w-14 flex-center">
            <SelectIconMenu
              icon={layout.icon}
              setIcon={(icon: string) => dispatch(currentSpaceChangeIcon(icon))}
            />
          </div>
        </div>

        <div aria-label="rename" className="full-between">
          <div className="text-xl">Rename Space</div>
          <RenameItem
            initialText={layout.name}
            handleChange={(e: string) => {
              dispatch(currentSpaceRename(e));
            }}
            inputProps={{ placeholder: "Rename Space" }}
            wordLimit={20}
          />
        </div>

        <DuplicateThisSpace />
        <AddSpace />
        <DeleteThisSpace />
      </div>
    </>
  );
}

export default CurrentSpaceSetting;
