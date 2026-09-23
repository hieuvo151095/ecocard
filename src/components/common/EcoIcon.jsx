import React from 'react';
import { Icon as DesignSystemIcon } from '../../../Design System/assets/icons/Icon.jsx';

/**
 * EcoIcon wrapper for ECO Design System 1.0 SVG Icons
 * @param {string} name - icon identifier (e.g. 'search', 'filter', 'calendar', 'settings')
 * @param {number|string} size - dimensions in px (default: 16)
 * @param {string} className - optional Tailwind classes
 */
export function EcoIcon({ name, size = 16, className = '', ...props }) {
  if (!name) return null;
  
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <DesignSystemIcon name={name} size={size} {...props} />
    </span>
  );
}

export default EcoIcon;
