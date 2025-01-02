// src/components/Breadcrumbs.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbsContext } from '../context/BreadcrumbsContext'; 

const Breadcrumbs = () => {
  const { breadcrumbs } = useContext(BreadcrumbsContext); 

  return (
    <div style={styles.breadcrumbs}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={crumb.path}>
            {index !== 0 && ' > '}
            {isLast ? (
              <span style={styles.active}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} style={styles.link}>{crumb.label}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

// Define styles
const styles = {
  breadcrumbs: {
    padding: '10px',
    fontSize: '14px',
    background: '#f1f1f1',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
  },
  active: {
    color: '#6c757d',
  },
};

export default Breadcrumbs;
