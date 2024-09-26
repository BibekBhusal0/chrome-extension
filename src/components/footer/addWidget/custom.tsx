import useCurrentLayout from "@/hooks/useCurrentLayout";
import { currentSpaceAddWidget } from "@/redux/slice/layout";
import { StateType } from "@/redux/store";
import { findNextAvailablePosition } from "@/utils/findWidgetPosition";
import { Box, Button, Slider, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/;

function AddCustomWidget() {
  const dispatch = useDispatch();
  const crrLayout = useCurrentLayout();
  const { n_cols, n_rows } = useSelector((state: StateType) => state.layout);
  if (!crrLayout) return null;
  const { widgets } = crrLayout;
  const [text, setText] = useState("");
  const [extractedUrl, setExtractedUrl] = useState("");
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const available_widgets = findNextAvailablePosition(
    widgets,
    n_cols,
    n_rows,
    cols,
    rows
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setText(inputValue);

    const matchedUrl = inputValue.match(urlPattern);
    setExtractedUrl(matchedUrl ? matchedUrl[0] : "");
  };
  const add = () => {
    if (available_widgets !== null && extractedUrl !== "") {
      dispatch(
        currentSpaceAddWidget({
          gridProps: available_widgets,
          type: "custom",
          values: { id: 0, url: extractedUrl },
        })
      );
      setText("");
      setExtractedUrl("");
    }
  };
  return (
    <Box className="size-full">
      <TextField
        autoFocus
        onChange={handleTextChange}
        value={text}
        label="Widget URL"
      />
      <Box className="flex justify-start gap-3 w-full">
        <Box className="text-xl">X:</Box>
        <Slider
          value={cols}
          onChange={(_, value) => setCols(value as number)}
          min={1}
          max={n_cols}
        />
      </Box>
      <Box className="flex justify-start gap-3 w-full">
        <Box className="text-xl">Y :</Box>
        <Slider
          value={rows}
          onChange={(_, value) => setRows(value as number)}
          min={1}
          max={n_cols}
        />
      </Box>
      <Button
        disabled={extractedUrl === "" || available_widgets === null}
        onClick={add}>
        Add
      </Button>
    </Box>
  );
}

export default AddCustomWidget;
