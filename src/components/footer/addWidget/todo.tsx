import AddItem from "@/components/addItem";
import useAvailablePosition from "@/hooks/useAvailablePosition";
import useCurrentLayout from "@/hooks/useCurrentLayout";
import { currentSpaceAddWidget } from "@/redux/slice/layout";
import { addTask } from "@/redux/slice/todo";
import { StateType } from "@/redux/store";
import { widgetDimensions } from "@/utils/getWidget";
import { getNextId } from "@/utils/next_id";
import { Box, List, ListItemButton } from "@mui/material";
import { BsPinAngleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

function AddTodo() {
  const dispatch = useDispatch();
  const { Tasks, pinnedTodo } = useSelector((state: StateType) => state.todo);
  const layout = useCurrentLayout();

  const todoDimensions = widgetDimensions["todo"];
  const { minH, minW } = todoDimensions;
  const availablePosition = useAvailablePosition(minW, minH);
  if (!layout) return null;
  const { widgets } = layout;
  const presentTodos = widgets.filter(({ type }) => type === "todo");
  const presentTodosId = presentTodos.map(({ values: { id } }) => id);

  const addWidget = (id: number) => {
    if (!availablePosition) return;
    dispatch(
      currentSpaceAddWidget({
        type: "todo",
        values: {
          id,
        },
        gridProps: {
          ...todoDimensions,
          ...availablePosition,
          i: `todo-${id}`,
        },
      })
    );
  };

  const addTodo = (title: string) => {
    if (!availablePosition) return;
    const newId = getNextId(Tasks.map(({ id }) => id));
    dispatch(addTask(title));
    addWidget(newId);
  };

  return (
    <div className="text-xl size-full">
      <List>
        {Tasks.map(({ id, title }) => (
          <ListItemButton
            sx={{ justifyContent: "space-between" }}
            disabled={!availablePosition || presentTodosId.includes(id)}
            key={id}
            onClick={() => addWidget(id)}
            //
          >
            {title}
            {id === pinnedTodo && <BsPinAngleFill />}
          </ListItemButton>
        ))}
      </List>
      <AddItem
        inputProps={{ label: "Todo title", placeholder: "Todo title" }}
        addButtonProps={{ children: "Add Todo", disabled: !availablePosition }}
        clickEvent={addTodo}
        word_limit={undefined}
      />
      {!availablePosition && (
        <Box color="error.main" className="text-lg pt-3">
          Not Enough Space For Todo
        </Box>
      )}
    </div>
  );
}

export default AddTodo;
