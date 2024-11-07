import { StateType } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import { cn } from "@/utils/cn";
import useCurrentIcons from "@/hooks/useCurrentIcons";
import Note from "../widgets/note";
import { addNoteWithTitle } from "@/redux/slice/note";

function NotesPage() {
  const { add } = useCurrentIcons();
  const { allNotes } = useSelector((state: StateType) => state.note);

  const dispatch = useDispatch();
  const commonCls = "h-80 overflow-hidden";

  return (
    <div className="grid gap-3 grid-cols-1 p-3 overflow-auto sm:grid-cols-2 md:grid-cols-3">
      {allNotes.map((p) => (
        <Paper
          key={p.id}
          sx={{ backgroundColor: "secondaryContainer.paper" }}
          className={commonCls}>
          <Note {...p} />
        </Paper>
      ))}
      <Paper
        onClick={() => dispatch(addNoteWithTitle(""))}
        className={cn(commonCls, "flex-center group cursor-pointer")}>
        <div className="group-hover:scale-[6] scale-[3] transition-all">
          {add}
        </div>
      </Paper>
    </div>
  );
}

export default NotesPage;
