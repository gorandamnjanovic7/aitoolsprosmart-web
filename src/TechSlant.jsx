// TechSlant.jsx
import React from 'react';

// Početak funkcije TechSlant
export default function TechSlant() {
  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 10, marginTop: '-120px' }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '120px' }}
      >
        {/* Namenski V-izrez koji preseca crninu */}
        <path
          d="M0 0 L600 120 L1200 0 L1200 120 L0 120 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
// Kraj funkcije TechSlant