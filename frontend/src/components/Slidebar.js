import React from 'react';

const SliderBar = ({ value, onChange }) => {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>
        Amount Slider
      </label>
      <input
        type="range"
        min="0"
        max="1000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: '10px',
          background: '#CBD5E0',
          borderRadius: '5px',
          outline: 'none',
          appearance: 'none', // Remove default styling
          WebkitAppearance: 'none', // For Safari
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '0.5rem' }}>
        <span>$0</span>
        <span>${value}</span>
        <span>$1000</span>
      </div>
    </div>
  );
};

export default SliderBar;