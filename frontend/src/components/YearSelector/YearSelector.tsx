import React from 'react';
import { Calendar } from 'lucide-react';
import { Select } from 'antd';
import { performanceSystem } from '../../utils/PerformanceSystem';

interface YearSelectorProps {
  currentYear: string;
  onChange: (year: string) => void;
  className?: string;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  currentYear,
  onChange,
  className = ''
}) => {
  const availableYears = performanceSystem.getAvailableYears();

  const handleYearChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={`year-selector ${className}`}>
      <Calendar size={16} style={{ marginRight: '10px', color: '#3498db' }} />
      <Select
        value={currentYear}
        onChange={handleYearChange}
        style={{ width: '120px' }}
      >
        {availableYears.map(year => (
          <Select.Option key={year} value={year}>
            {year}年
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default YearSelector;
