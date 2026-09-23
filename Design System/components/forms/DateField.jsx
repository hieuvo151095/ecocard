import React from 'react';
import { TextField } from './TextField.jsx';

export function DateField({ label = 'Ngày', value = '', placeholder = 'DD/MM/YYYY', disabled = false, error = false, message, onChange, trailingIcon, style, ...rest }) {
  return (
    <TextField
      label={label}
      value={value}
      placeholder={placeholder}
      state={value ? 'filled' : 'empty'}
      disabled={disabled}
      error={error}
      message={message}
      onChange={onChange}
      suffix={trailingIcon || <span style={{ fontSize: 'var(--font-size-base)' }}>▾</span>}
      style={style}
      {...rest}
    />
  );
}

export default DateField;
