import useCurrentTheme from "@/hooks/useCurrentTheme";
import { useDispatch } from "react-redux";
import { Icon2RN, iconPackNames, SelectedIconPacks } from "@/icons";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { compactionType } from "@/types/slice/layout";
import { changeIconPack } from "@/redux/slice/theme";
import ListItemIcon from "@mui/material/ListItemIcon";

function SelectIconPack({ showLabel = true }: { showLabel?: boolean }) {
  const { iconPack } = useCurrentTheme();
  const dispatch = useDispatch();
  const reformatName = (name: string) => iconPackNames[name] || name;
  const getSampleIcon = (name: string) => {
    const needsPrefix = iconPackNames[name];
    var icon = SelectedIconPacks[name].settings;
    if (needsPrefix && typeof icon === "string") icon = `${name}:${icon}`;
    return <Icon2RN icon={icon} />;
  };

  const selectItem = (
    <Select
      className="w-full capitalize icon-xl"
      MenuProps={{ style: { maxHeight: 350 } }}
      renderValue={(selected) => (
        <div className="flex-center gap-4">
          {getSampleIcon(selected)}
          {reformatName(selected)}
        </div>
      )}
      value={iconPack}
      onChange={(e) =>
        dispatch(changeIconPack(e.target.value as compactionType))
      }>
      {Object.keys(SelectedIconPacks).map((c) => (
        <MenuItem className="capitalize icon-xl" key={c} value={c}>
          <ListItemIcon>{getSampleIcon(c)}</ListItemIcon>
          {reformatName(c)}
        </MenuItem>
      ))}
    </Select>
  );
  if (!showLabel) return selectItem;
  return (
    <div className="full-between">
      <div className="text-xl">Select Icon Pack</div>
      {selectItem}
    </div>
  );
}

export default SelectIconPack;
