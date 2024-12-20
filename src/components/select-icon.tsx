import { Icon, listIcons } from "@iconify/react";
import { CSSProperties, useDeferredValue, useEffect, useState } from "react";
import type { IconifyInfo, IconifyJSON } from "@iconify/types";
import { iconPackNames, IconPacks } from "@/theme/icons";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import MenuPopover, { MenuPopoverProps } from "./popoverMenu";
import { cn } from "@/utils/cn";

const SelectIcon = ({ icon, setIcon }: SelectIconProps) => {
  const [currentMode, setCurrentMode] = useState("Loaded");
  const [selected, setSelected] = useState(icon);
  const [iconsList, setIconsList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(
          `https://api.iconify.design/collection?prefix=${currentMode}`
        );

        if (!response.ok || !response || response.status !== 200) {
          return;
        }

        const data: APIv2CollectionResponse = await response.json();

        const formattedIcons: string[] = [];

        if (data.categories) {
          for (const category in data.categories) {
            formattedIcons.push(
              ...data.categories[category].map(
                (iconName) => `${data.prefix}:${iconName}`
              )
            );
          }
        }
        if (data.uncategorized) {
          formattedIcons.push(
            ...data.uncategorized.map(
              (iconName) => `${data.prefix}:${iconName}`
            )
          );
        }
        if (data.hidden) {
          formattedIcons.push(
            ...data.hidden.map((iconName) => `${data.prefix}:${iconName}`)
          );
        }

        setIconsList(formattedIcons);
      } catch (error) {
        console.error("Error fetching icons:", error);
      }
    };

    if (currentMode === "Loaded") {
      setIconsList(listIcons());
    } else if (currentMode !== "Search") fetchIcons();
  }, [currentMode]);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await fetch(
          `https://api.iconify.design/search?query=${deferredSearchTerm}&limit=999`
        );
        if (!response.ok || !response || response.status !== 200) {
          return;
        }
        const data: APISearchResponse = await response.json();
        setIconsList(data.icons);
      } catch (error) {
        console.error("Error searching icons:", error);
      }
    };
    if (currentMode === "Search") {
      if (deferredSearchTerm.trim().length === 0) setIconsList([]);
      else search();
    }
  }, [currentMode, deferredSearchTerm]);

  return (
    <div className="size-full flex flex-col items-center gap-3">
      <div
        className="flex flex-col items-center gap-3 w-full"
        onClick={(e) => {
          e.preventDefault();
        }}
        //
      >
        <SelectIconType
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
        />
        {currentMode === "Search" && (
          <TextField
            autoFocus
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Icon"
          />
        )}
        <IconsGrid
          iconsList={iconsList}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <Button variant="contained" onClick={() => setIcon(selected)}>
        Change
      </Button>
    </div>
  );
};

export const SelectIconMenu = ({
  icon,
  setIcon,
  children,
  buttonProps,
  ...props
}: SelectIconMenuProps) => {
  return (
    <MenuPopover
      key={icon}
      icon={icon}
      {...props}
      buttonProps={{
        ...buttonProps,
        sx: { p: 0.5, m: 0, flexGrow: 0, ...buttonProps?.sx },
      }}
      menuProps={{
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "bottom", horizontal: "left" },
        ...props.menuProps,
      }}>
      <SelectIcon icon={icon} setIcon={setIcon} />
    </MenuPopover>
  );
};

export function IconsGrid({ iconsList, selected, setSelected }: IconGridProps) {
  const columnCount = 5;
  const width = 40;

  return (
    <Grid
      columnCount={columnCount}
      rowCount={Math.ceil(iconsList.length / columnCount)}
      columnWidth={width}
      rowHeight={width}
      height={300}
      width={columnCount * width + 20}>
      {({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
        const iconIndex = rowIndex * columnCount + columnIndex;
        const icon = iconsList[iconIndex];

        if (!icon) return null;

        return (
          <SingleIcon
            icon={icon}
            selected={selected === icon}
            style={style}
            setSelected={setSelected}
          />
        );
      }}
    </Grid>
  );
}

function SingleIcon({ icon, selected, style, setSelected }: singleIconProps) {
  return (
    <div
      className={cn("p-2 hover:bg-primary-6", { "bg-primary-5": selected })}
      onClick={() => setSelected(icon)}
      style={{
        ...style,
      }}>
      <Icon className="size-full" icon={icon} />
    </div>
  );
}

function SelectIconType({
  currentMode,
  setCurrentMode,
}: {
  currentMode: string;
  setCurrentMode: (mode: string) => void;
}) {
  return (
    <Select
      size="small"
      value={currentMode}
      MenuProps={{ style: { maxHeight: "300px" } }}
      onChange={(e) => setCurrentMode(e.target.value)}>
      <MenuItem value="Loaded">Loaded</MenuItem>
      <MenuItem value="Search">Search</MenuItem>
      {IconPacks.map((pack: string) => (
        <MenuItem key={pack} value={pack}>
          {iconPackNames[pack] || pack}
        </MenuItem>
      ))}
    </Select>
  );
}

export type SelectIconMenuProps = SelectIconProps & Partial<MenuPopoverProps>;
export interface SelectIconProps {
  icon: string;
  setIcon: (icon: string) => void;
}
interface IconGridProps {
  iconsList: string[];
  selected: string;
  setSelected: (icon: string) => void;
}
interface singleIconProps {
  style: CSSProperties;
  icon: string;
  selected: boolean;
  setSelected: (icon: string) => void;
}
export interface APIv2CollectionResponse {
  prefix: string;
  total: number;
  title?: string;
  info?: IconifyInfo;
  uncategorized?: string[];
  categories?: Record<string, string[]>;
  hidden?: string[];
  aliases?: Record<string, string>;
  chars?: Record<string, string>;
  themes?: IconifyJSON["themes"];
  prefixes?: IconifyJSON["prefixes"];
  suffixes?: IconifyJSON["suffixes"];
}
export interface APISearchResponse {
  icons: string[];
}
export default SelectIcon;
