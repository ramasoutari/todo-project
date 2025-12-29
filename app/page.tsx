"use client";
import { useAtom } from "jotai";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import "./styles/main.scss";
import Column from "./components/column";
import AddTask from "./components/add-task";
import { useState } from "react";
import { ITask } from "./types/task";
import { taskStatus } from "./enum/task";
import { tasksAtom } from "./atoms/todo-atom";
import TaskCard from "./components/task-card";
import { arrayMove } from "@dnd-kit/sortable";

function App() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [activeTask, setActiveTask] = useState<ITask | null>();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );
  const STATUSES = Object.values(taskStatus);
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === over.id);

    if (overTask) {
      const targetStatus = overTask.status;

      if (activeTask.status === targetStatus) {
        const columnTasks = tasks.filter((t) => t.status === activeTask.status);

        const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
        const newIndex = columnTasks.findIndex((t) => t.id === over.id);

        const reordered = arrayMove(columnTasks, oldIndex, newIndex);

        setTasks((prev) => [
          ...prev.filter((t) => t.status !== activeTask.status),
          ...reordered,
        ]);
      } else {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === active.id ? { ...task, status: targetStatus } : task
          )
        );
      }

      return;
    }

    const targetStatus = over.id as taskStatus;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: targetStatus } : task
      )
    );
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <div className="app-container">
      <AddTask />

      <DndContext
        sensors={sensors}
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
              tasks={tasks.filter((t) => t.status === status)}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 500,
          }}
        >
          {activeTask && <TaskCard key={activeTask.id} task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
