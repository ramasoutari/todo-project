'use client'

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { useState } from "react";
import "../styles/task-card.scss";
import ConfirmationDialog from "./confirmation-dialog";
import { ITask } from "../types/task";
import { tasksAtom } from "../atoms/todo-atom";

type Props = {
  task: ITask;
};

function TaskCard({ task }: Props) {
  const setTasks = useSetAtom(tasksAtom);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmRemoveTask = () => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    toast.success("Task Removed");
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="task-card">
        <p {...listeners} {...attributes} style={{ cursor: "grab" }}>
          {task.title}
        </p>

        <button className="remove-icon" onClick={handleRemoveClick}>
          <RemoveCircleOutlineIcon color="disabled" />
        </button>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Confirm Removal"
        message={`Are you sure you want to remove "${task.title}"? This action cannot be undone.`}
        confirmText="Remove Task"
        onConfirm={confirmRemoveTask}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
}

export default TaskCard;
