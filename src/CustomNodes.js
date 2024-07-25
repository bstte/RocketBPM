// CustomNodes.js
import React from 'react';

export const RoundNode = ({ data }) => (
  <div style={{ borderRadius: '50%', width: 50, height: 50, background: '#ffcc00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {data.label}
  </div>
);

export const TriangleNode = ({ data }) => (
  <div style={{ width: 0, height: 0, borderLeft: '25px solid transparent', borderRight: '25px solid transparent', borderBottom: '50px solid #ff5733', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {data.label}
  </div>
);
