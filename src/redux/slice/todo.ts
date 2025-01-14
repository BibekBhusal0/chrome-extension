import {
  changeTaskType,
  TaskTodoID,
  TaskType,
  todoStateType,
} from "@/types/slice/todo";
import { getNextId } from "@/utils/next_id";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialTodoState } from "./initialStates";

export const todoSlice = createSlice({
  name: "todo",
  initialState: { ...initialTodoState },
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.Tasks.push({
        filtered: false,
        id: getNextId(state.Tasks.map(({ id }) => id)),
        title: action.payload,
        todos: [],
        icon: "fluent:task-list-square-16-filled",
      });
    },
    setTasks: (state, action: PayloadAction<TaskType[]>) => {
      const existingTasksMap = new Map<number, TaskType>(
        state.Tasks.map((p) => [p.id, p])
      );
      action.payload.forEach((task) => {
        existingTasksMap.set(task.id, task);
      });
      state.Tasks = Array.from(existingTasksMap.values());
    },
    addTodo: (
      state,
      action: PayloadAction<{ task_id: number; task: string }>
    ) => {
      const task = state.Tasks.find((p) => p.id === action.payload.task_id);
      if (task) {
        task.todos.push({
          id: getNextId(task.todos.map(({ id }) => id)),
          task: action.payload.task,
          checked: false,
        });
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.Tasks = state.Tasks.filter((p) => p.id !== action.payload);
      if (state.pinnedTodo === action.payload) {
        state.pinnedTodo = null;
      }
    },
    deleteTodo: (state, action: PayloadAction<TaskTodoID>) => {
      const task = state.Tasks.find((p) => p.id === action.payload.task_id);
      if (task) {
        task.todos = task.todos.filter((t) => t.id !== action.payload.todo_id);
      }
    },
    changeTask(state, action: PayloadAction<changeTaskType>) {
      const task = state.Tasks.find((p) => p.id === action.payload.task_id);
      if (task) {
        const type = action.payload.change_item;
        if (type === "todo") {
          if (task.filtered) {
            task.todos = [
              ...action.payload.todo,
              ...task.todos.filter((a) => a.checked),
            ];
          } else {
            task.todos = action.payload.todo;
          }
        } else if (type === "title") task.title = action.payload.title;
        else if (type === "icon") task.icon = action.payload.icon;
      }
    },
    changeTodo(state, action: PayloadAction<TaskTodoID & { task: string }>) {
      const task = state.Tasks.find((p) => p.id === action.payload.task_id);
      if (task) {
        const todo = task.todos.find((t) => t.id === action.payload.todo_id);
        if (todo) {
          todo.task = action.payload.task;
        }
      }
    },
    toggleTodo(state, action: PayloadAction<TaskTodoID>) {
      const task = state.Tasks.find((p) => p.id === action.payload.task_id);
      if (task) {
        const todo = task.todos.find((t) => t.id === action.payload.todo_id);
        if (todo) {
          todo.checked = !todo.checked;
        }
      }
    },
    toggleFiltered: (state, action: PayloadAction<{ id: number }>) => {
      const task = state.Tasks.find((p) => p.id === action.payload.id);
      if (task) {
        task.filtered = !task.filtered;
      }
    },
    changePinnedTodo: (state, action: PayloadAction<number>) => {
      if (state.pinnedTodo === action.payload) state.pinnedTodo = null;
      else state.pinnedTodo = action.payload;
    },
    resetTodoSlice: (state) => Object.assign(state, initialTodoState),
    setState: (
      state,
      action: PayloadAction<{ value: todoStateType; check?: boolean }>
    ) => {
      const { value, check = true } = action.payload;
      const val = value;
      if (!val) return;
      if (!val.Tasks) return;
      if (!Array.isArray(val.Tasks)) return;
      if (!check) return Object.assign(state, value);
      const tasks = state.Tasks;
      val.Tasks.forEach((task) => {
        const t = tasks.find((p) => p.id === task.id && p.title === task.title);
        if (t) Object.assign(t, task);
        else {
          const id = getNextId(tasks.map(({ id }) => id));
          if (task.id === val.pinnedTodo) state.pinnedTodo = id;
          tasks.push({ ...task, id });
        }
      });
      state.Tasks = tasks;
    },
  },
});

export const {
  addTask,
  addTodo,
  deleteTask,
  deleteTodo,
  changeTask,
  changeTodo,
  toggleTodo,
  toggleFiltered,
  setTasks,
  changePinnedTodo,
  resetTodoSlice,
  setState,
} = todoSlice.actions;
export default todoSlice.reducer;
