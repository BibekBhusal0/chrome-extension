import {
  CurrentSpaceType,
  DynamicSpaceType,
  LayoutSliceType,
} from "@/types/slice/layout";
import { WidgetType } from "@/types/slice/widgets";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "react-grid-layout";

const getEmptySpace = (): DynamicSpaceType => {
  return {
    compaction: "none",
    id: uuidv4(),
    locked: false,
    widgets: [],
    delete_able: true,
  };
};

const initialState: LayoutSliceType = {
  n_rows: 8,
  n_cols: 12,
  currentSpace: { type: "dynamic", id: "1" },
  allSpaces: [{ ...getEmptySpace(), id: "1", delete_able: false }],
};

export const layoutSlice = createSlice({
  name: "layouts",
  initialState,
  reducers: {
    changeCurrentSpace: (state, action: PayloadAction<CurrentSpaceType>) => {
      if (JSON.stringify(state.currentSpace) === JSON.stringify(action.payload))
        return;
      if (action.payload.type === "dynamic") {
        if (!state.allSpaces.find((p) => p.id === action.payload.id)) return;
      }
      state.currentSpace = action.payload;
    },
    deleteSpace: (state, action: PayloadAction<string>) => {
      const space = state.allSpaces.find((p) => p.id === action.payload);
      if (space?.delete_able) {
        state.allSpaces = state.allSpaces.filter(
          (p) => p.id !== action.payload
        );
      }
    },
    addSpace: (state) => {
      const newID = uuidv4();
      state.allSpaces.push({ ...getEmptySpace(), id: newID });
      state.currentSpace = { type: "dynamic", id: newID };
    },
    currentSpaceAddWidget: (state, action: PayloadAction<WidgetType>) => {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        space.widgets.push(action.payload);
      }
    },
    currentSpaceDeleteWidget(state, action: PayloadAction<string>) {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        space.widgets = space.widgets.filter(
          (p) => p.values.id !== action.payload
        );
      }
    },
    currentSpaceChangeGridProps(
      state,
      action: PayloadAction<{ widget_id: string; layout: Layout }>
    ) {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        const widget = space.widgets.find(
          (p) => p.values.id === action.payload.widget_id
        );
        if (widget) {
          widget.gridProps = action.payload.layout;
        }
      }
    },
    currentStateDeleteState: (state) => {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        if (space.delete_able) {
          state.allSpaces = state.allSpaces.filter((p) => p.id !== space.id);
        }
      }
    },
    currentSpaceToggleLocked: (state) => {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        space.locked = !space.locked;
      }
    },
    currentSpaceChangeCompaction: (
      state,
      action: PayloadAction<"horizontal" | "vertical" | "none">
    ) => {
      const space = state.allSpaces.find((p) => p.id === state.currentSpace.id);
      if (space) {
        space.compaction = action.payload;
      }
    },
  },
});
