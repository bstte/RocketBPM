import React, { createContext, useState, useCallback, useEffect } from 'react';

export const BreadcrumbsContext = createContext();

export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState(() => {
    // Local Storage se data load karo (agar available ho)
    const savedBreadcrumbs = localStorage.getItem("breadcrumbs");
    return savedBreadcrumbs ? JSON.parse(savedBreadcrumbs) : [];
  });

  // Jab bhi breadcrumbs change ho, localStorage me update karo
  useEffect(() => {
    localStorage.setItem("breadcrumbs", JSON.stringify(breadcrumbs));
  }, [breadcrumbs]);

  const addBreadcrumb = useCallback((label, path, state) => {
    setBreadcrumbs((prev) => {
      if (prev.some((crumb) => crumb.label === label)) {
        return prev; // Avoid adding duplicate breadcrumbs
      }
      return [...prev, { label, path, state }];
    });
  }, []);

  const removeBreadcrumbsAfter = useCallback((index) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const resetBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]); 
    localStorage.removeItem("breadcrumbs");
  }, []);

  return (
    <BreadcrumbsContext.Provider
      value={{ breadcrumbs, addBreadcrumb, removeBreadcrumbsAfter, resetBreadcrumbs ,setBreadcrumbs}}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
};
