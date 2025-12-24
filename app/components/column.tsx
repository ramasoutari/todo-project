"use client";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./task-card";
import { ITask } from "../types/task";
import "../styles/column.scss";
import { useLanguage } from "../context/language-context";

type Props = {
  tasks: ITask[];
  id: string;
  title: string;
};

function Column({ title, id, tasks }: Props) {
  console.log("title",title)
  const {language} = useLanguage();
  const { setNodeRef } = useDroppable({
    id: id,
  });
  const { t } = useLanguage();

  return (
    <div ref={setNodeRef} className={`column column--${id}`}>
      <div className={`card-title card-title--${id}`}>
        {t(`column:${id}`).toUpperCase()}
        <sup  className={`
      count-dot
      ${language === 'ar' ? 'mr-2' : 'ml-2'}
    `}>{tasks.length}</sup>
      </div>
      <div className="task-list">
        {tasks.map((task: ITask) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="empty-msg">{t("column:noTasks")}</p>
      )}
    </div>
  );
}

export default Column;
