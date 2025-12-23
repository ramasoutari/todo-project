"use client";
import React, { useState } from "react";
import { useSetAtom } from "jotai";
import toast, { Toaster } from "react-hot-toast";
import { taskStatus } from "../enum/task";
import "../styles/add-task.scss";
import { useLanguage } from "../context/language-context";
import { tasksAtom } from "../atoms/todo-atom";

function AddTask() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const setTasks = useSetAtom(tasksAtom);

  const maxLength = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter a task");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: text,
      status: taskStatus.TODO,
    };

    setTasks((prev) => [...prev, newTask]);
    setText("");
    toast.success("Task Created");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={text}
          maxLength={maxLength}
          onChange={handleChange}
          placeholder={t("tasks:create")}
        />

        <div>
          <span className="char-count">
            {text.length}/{maxLength}
          </span>
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" disabled={!text.trim()} className="submit-btn">
          {t("tasks:create")}{" "}
        </button>
      </div>

      <Toaster />
    </form>
  );
}

export default AddTask;
