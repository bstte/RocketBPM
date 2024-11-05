// src/context/BreadcrumbsContext.jsx
import React, { createContext, useState, useCallback } from 'react';

// Create the BreadcrumbsContext
export const BreadcrumbsContext = createContext();

// Create a provider component
export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', path: '/' },
  ]);

  // Function to add a new breadcrumb
  const addBreadcrumb = useCallback((label, path) => {
    setBreadcrumbs((prev) => {
      // Prevent duplicate breadcrumbs
      if (prev.some((crumb) => crumb.path === path)) {
        return prev;
      }
      return [...prev, { label, path }];
    });
  }, []);

  // Function to remove breadcrumbs after a certain index
  const removeBreadcrumbsAfter = useCallback((index) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  // Function to reset breadcrumbs to initial state
  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbs([{ label: 'Home', path: '/' }]);
  }, []);

  return (
    <BreadcrumbsContext.Provider
      value={{ breadcrumbs, addBreadcrumb, removeBreadcrumbsAfter, resetBreadcrumbs }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
};
