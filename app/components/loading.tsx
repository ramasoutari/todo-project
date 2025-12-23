'use client'

import React from 'react';

interface SimpleLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  type?: 'spinner' | 'dots' | 'progress';
}

const SimpleLoading: React.FC<SimpleLoadingProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  type = 'spinner',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    success: 'border-green-500',
    danger: 'border-red-500',
    warning: 'border-yellow-500',
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className="loading-dot bg-blue-500"></div>
            <div className="loading-dot bg-blue-500 delay-150"></div>
            <div className="loading-dot bg-blue-500 delay-300"></div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="loading-progress">
            <div className="loading-progress-bar"></div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} border-4 ${colorClasses[color as keyof typeof colorClasses]} border-t-transparent rounded-full animate-spin`}></div>
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

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default SimpleLoading;