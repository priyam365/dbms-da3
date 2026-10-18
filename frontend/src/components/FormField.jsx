import React from 'react';

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  options = [],
  placeholder = '',
  rows = 3,
  hint,
  disabled = false,
  min,
  max,
}) {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      {isSelect ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          className={`form-select ${error ? 'has-error' : ''}`}
        >
          <option value="">{placeholder || `-- Select ${label || 'Option'} --`}</option>
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      ) : isTextarea ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`form-textarea ${error ? 'has-error' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`form-input ${error ? 'has-error' : ''}`}
        />
      )}

      {hint && !error && <div className="form-hint">{hint}</div>}
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  );
}

export default FormField;
