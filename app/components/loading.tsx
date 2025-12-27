"use client";

import React from "react";
import "../styles/loading.scss";

interface SimpleLoadingProps {
  text?: string;
  type?: "dots" | "progress" | "skeleton";
}

const SimpleLoading: React.FC<SimpleLoadingProps> = ({ text, type }) => {
  const renderLoader = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex space-x-2">
            <div className="loading-dot bg-blue-500"></div>
            <div className="loading-dot bg-blue-500 delay-150"></div>
            <div className="loading-dot bg-blue-500 delay-300"></div>
          </div>
        );

      case "progress":
        return (
          <div className="loading-progress">
            <div className="loading-progress-bar"></div>
          </div>
        );

      case "skeleton":
        return (
          <div className="w-full h-full">
            <div className="skeleton-add-task">
              <div className="skeleton skeleton-input"></div>
              <div className="skeleton skeleton-button"></div>
            </div>

            <div className="board">
              {["todo", "in-progress", "done"].map((column) => (
                <div key={column} className="skeleton-column">
                  <div className="skeleton skeleton-title"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton skeleton-card"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div
            className={` border-4 border-t-transparent rounded-full animate-spin`}
          ></div>
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {text}
        </span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50">
      {type === "skeleton" ? (
        content
      ) : (
        <div className="flex items-center justify-center h-full">{content}</div>
      )}
    </div>
  );
};

export default SimpleLoading;
