import React from 'react';
import type { Task } from '../../utils/PerformanceSystem';

interface AnalysisViewProps {
  currentMonth: number;
  config: {
    title: string;
    color: string;
  };
  dimData: {
    monthlyTasks: Task[][];
    progress: number;
    totalTasks: number;
    completedTasks: number;
    totalScore: number;
  };
}

const months = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

const AnalysisView: React.FC<AnalysisViewProps> = ({ currentMonth, config, dimData }) => {
  return (
    <div className="view-animate" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 月度进度概览卡片 */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#262626' }}>
            {months[currentMonth]} 完成度分析
          </h3>
        </div>
        
        {/* 进度圆环 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            {/* SVG 圆环 */}
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* 背景圆环 */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" strokeWidth="20" />
              {/* 进度圆环 */}
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke={config.color} 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 80}`} 
                strokeDashoffset={`${2 * Math.PI * 80 * (100 - (dimData.progress || 0)) / 100}`} 
                strokeLinecap="round" 
                transform="rotate(-90 100 100)" 
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            {/* 中心文字 */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: config.color }}>
                {dimData.progress || 0}%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#8c8c8c' }}>完成度</div>
            </div>
          </div>
        </div>
        
        {/* 进度条 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#595959' }}>本月进度</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: config.color }}>{dimData.progress || 0}%</span>
          </div>
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            borderRadius: '10px', 
            height: '12px', 
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div 
              style={{ 
                width: `${dimData.progress || 0}%`, 
                backgroundColor: config.color, 
                height: '100%',
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }}
            ></div>
          </div>
        </div>
        
        {/* 统计数据卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ 
            backgroundColor: '#fafafa', 
            borderRadius: '10px', 
            padding: '20px', 
            textAlign: 'center',
            border: `1px solid ${config.color}15`
          }}>
            <div style={{ fontSize: '0.9rem', color: '#8c8c8c', marginBottom: '8px' }}>总任务数</div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#262626' }}>{dimData.totalTasks || 0}</div>
          </div>
          <div style={{ 
            backgroundColor: '#fafafa', 
            borderRadius: '10px', 
            padding: '20px', 
            textAlign: 'center',
            border: `1px solid ${config.color}15`
          }}>
            <div style={{ fontSize: '0.9rem', color: '#8c8c8c', marginBottom: '8px' }}>已完成</div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#52c41a' }}>{dimData.completedTasks || 0}</div>
          </div>
          <div style={{ 
            backgroundColor: '#fafafa', 
            borderRadius: '10px', 
            padding: '20px', 
            textAlign: 'center',
            border: `1px solid ${config.color}15`
          }}>
            <div style={{ fontSize: '0.9rem', color: '#8c8c8c', marginBottom: '8px' }}>自评均分</div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#faad14' }}>{dimData.totalScore || 0}</div>
          </div>
        </div>
      </div>
      
      {/* 年度趋势分析 */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', padding: '24px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', fontWeight: '600', color: '#262626' }}>
          年度趋势分析
        </h3>
        
        {/* 月度进度图表 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '240px', padding: '20px 0' }}>
          {Array(12).fill(0).map((_, monthIndex) => {
            const monthTasks = dimData.monthlyTasks[monthIndex] || [];
            const completedTasks = monthTasks.filter((t: Task) => t.status === 'completed').length;
            const monthProgress = monthTasks.length > 0 ? Math.round((completedTasks / monthTasks.length) * 100) : 0;
            
            return (
              <div key={monthIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '40px', 
                  height: `${monthProgress}%`, 
                  backgroundColor: monthIndex === currentMonth ? config.color : '#d9d9d9',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}></div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: monthIndex === currentMonth ? config.color : '#8c8c8c',
                  fontWeight: monthIndex === currentMonth ? '600' : '400'
                }}>
                  {months[monthIndex].replace('月', '')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;