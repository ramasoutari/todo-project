"use client";
import { useAtom } from "jotai";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import "./styles/main.scss";
import Column from "./components/column";
import AddTask from "./components/add-task";
import { useState } from "react";
import { ITask } from "./types/task";
import { taskStatus } from "./enum/task";
import { tasksAtom } from "./atoms/todo-atom";

function App() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [activeTask, setActiveTask] = useState<ITask | null>();
  const STATUSES = Object.values(taskStatus);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    const taskId = active.id;
    const newStatus = over.id;

    if (
      newStatus === "todo" ||
      newStatus === "in-progress" ||
      newStatus === "done"
    ) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus as taskStatus }
            : task
        )
      );
    }
    // If dropping on another task, reorder within same column
    else if (overTask && activeTask && activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex) {
        setTasks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <div className="app-container">
      <AddTask />

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="board">
          {STATUSES.map((status) => (
            <Column
              key={status}
              id={status}
              title={status}
              tasks={tasks.filter((t) => t.status === status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="drag-overlay-card">
              <p className="drag-overlay-text">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
