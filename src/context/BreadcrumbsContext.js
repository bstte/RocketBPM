import React, { createContext, useState, useCallback } from 'react';

export const BreadcrumbsContext = createContext();

export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]); 

  const addBreadcrumb = useCallback((label, path,state) => {
    setBreadcrumbs((prev) => {
      // Avoid duplicate breadcrumbs
      if (prev.some((crumb) => crumb.path === path)) return prev;
      return [...prev, { label, path ,state}];
    });
  }, []);

  const removeBreadcrumbsAfter = useCallback((index) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]); // Reset to an empty state
  }, []);

  return (
    <BreadcrumbsContext.Provider
      value={{ breadcrumbs, addBreadcrumb, removeBreadcrumbsAfter, resetBreadcrumbs }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
};
