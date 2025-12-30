/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Form } from 'antd';

import { performanceSystem } from '../utils/PerformanceSystem';
import type { Task } from '../utils/PerformanceSystem';

// 导入提取的组件
import SubSidebar from '../components/Dimension/SubSidebar';
import PageHeader from '../components/Dimension/PageHeader';
import PlanningView from '../components/Dimension/PlanningView';
import TasksView from '../components/Dimension/TasksView';
import AnalysisView from '../components/Dimension/AnalysisView';
import AddTaskModal from '../components/Dimension/AddTaskModal';
import DeleteTaskModal from '../components/Dimension/DeleteTaskModal';


interface DimensionPageProps {
  dimensionKey: string;
  currentYear: string;
  onYearChange: (year: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// 定义二级菜单类型
type ViewTab = 'planning' | 'tasks' | 'analysis';

const DimensionPage: React.FC<DimensionPageProps> = ({ dimensionKey, currentYear, onYearChange, darkMode, toggleDarkMode }) => {
  // --- 状态管理 ---
  const [activeTab, setActiveTab] = useState<ViewTab>('tasks');
  const [currentMonth, setCurrentMonth] = useState(performanceSystem.getCurrentMonth());

  const [yearData, setYearData] = useState(performanceSystem.getCurrentYearData());
  const [selectedDimension, setSelectedDimension] = useState(dimensionKey);
  const [showAddDimension, setShowAddDimension] = useState(false);
  const [newDimensionName, setNewDimensionName] = useState('');
  const [newDimensionColor, setNewDimensionColor] = useState('#673ab7');
  
  // 新增任务模态框
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  // 删除任务确认模态框
  const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] = useState(false);
  // 当前要删除的任务ID
  const [taskIdToDelete, setTaskIdToDelete] = useState('');
  // 新增任务表单
  const [addTaskForm] = Form.useForm();
  // 最小化的任务ID列表
  const [minimizedTasks, setMinimizedTasks] = useState<Set<string>>(new Set());
  // 显示烟花效果的任务ID
  // const [_, setFireworkTaskId] = useState<string | null>(null);
  
  // 获取所有维度配置
  const [allDimensions, setAllDimensions] = useState(performanceSystem.getAllDimensionConfigs());

  // --- 数据获取 ---
  const config = performanceSystem.getDimensionConfig(selectedDimension) || {
    title: '未知维度',
    icon: 'Cube',
    color: '#95a5a6'
  };

  const dimData = yearData.dimensions?.[selectedDimension] || { 
    annualGoal: '',
    quarterlyGoals: ['', '', '', ''],
    monthlyTasks: Array(12).fill(null).map(() => []),
    totalScore: 0,
    completedTasks: 0,
    totalTasks: 0,
    progress: 0,
    settings: { scoring: { completedScore: 100, inProgressScore: 50, notStartedScore: 0 } }
  }


  // --- 业务逻辑处理 ---
  const handleAnnualGoalChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    await performanceSystem.updateDimensionAnnualGoal(selectedDimension, e.target.value);
    setYearData(performanceSystem.getCurrentYearData());
  };

  const handleQuarterlyGoalChange = async (quarter: number, e: React.ChangeEvent<HTMLInputElement>) => {
    await performanceSystem.updateDimensionQuarterlyGoal(selectedDimension, quarter, e.target.value);
    setYearData(performanceSystem.getCurrentYearData());
  };

  const addTask = () => {
    setIsAddTaskModalVisible(true);
  };

  // 切换任务最小化状态
  const toggleTaskMinimize = (taskId: string) => {
    setMinimizedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // 任务完成时的烟花效果
  const showFirework = (taskId: string) => {
    console.log('firework----->', taskId);
  };

  const updateTask = async (taskId: string, field: keyof Task, value: any) => {
    // 如果任务状态变为已完成，记录下来
    const shouldMinimize = field === 'status' && value === 'completed';
    
    await performanceSystem.updateMonthlyTask(selectedDimension, currentMonth, taskId, { [field]: value });
    setYearData(performanceSystem.getCurrentYearData());
    
    // 如果任务完成，自动最小化并显示烟花
    if (shouldMinimize) {
      toggleTaskMinimize(taskId);
      showFirework(taskId);
    }
  };

  const deleteTask = (taskId: string) => {
    setTaskIdToDelete(taskId);
    setIsDeleteTaskModalVisible(true);
  };


  
  // 添加新维度
  const handleAddDimension = async () => {
    if (!newDimensionName.trim()) return;
    
    const newDimension = await performanceSystem.addDimension({
      title: newDimensionName.trim(),
      icon: 'Cube',
      color: newDimensionColor,
      isDefault: false
    });
    
    if (newDimension) {
      setSelectedDimension(newDimension);
      setNewDimensionName('');
      setShowAddDimension(false);
      setYearData(performanceSystem.getCurrentYearData());
      // 更新维度列表
      setAllDimensions(performanceSystem.getAllDimensionConfigs());
    }
  };


  // --- 内部样式对象 ---
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f0f2f5',
      marginLeft: '-30px' // 抵消main-content的padding，让二级sidebar紧贴主sidebar
    },
    subSidebar: {
      width: '260px',
      backgroundColor: '#fff',
      borderRight: '1px solid #e8e8e8',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '20px 0',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
    },
    mainContent: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '24px',
      position: 'relative' as const
    },
    navItem: (isActive: boolean) => ({
      padding: '14px 24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.95rem',
      fontWeight: isActive ? '600' : '400',
      color: isActive ? config.color : '#595959',
      backgroundColor: isActive ? `${config.color}0D` : 'transparent',
      borderRight: `3px solid ${isActive ? config.color : 'transparent'}`,
      transition: 'all 0.3s'
    }),
    monthGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      padding: '15px'
    }
  };

  return (
    <div style={styles.container}>
      {/* --- 1. 二级侧边栏 (Sub-Sidebar) --- */}
      <SubSidebar 
        activeTab={activeTab}
        currentMonth={currentMonth}
        setActiveTab={setActiveTab}
        setCurrentMonth={setCurrentMonth}
        allDimensions={allDimensions}
        selectedDimension={selectedDimension}
        setSelectedDimension={setSelectedDimension}
        showAddDimension={showAddDimension}
        setShowAddDimension={setShowAddDimension}
        newDimensionName={newDimensionName}
        setNewDimensionName={setNewDimensionName}
        newDimensionColor={newDimensionColor}
        setNewDimensionColor={setNewDimensionColor}
        handleAddDimension={handleAddDimension}
      />

      {/* --- 2. 主内容区域 (Main Content) --- */}
      <main style={styles.mainContent}>
        {/* 顶部通栏 */}
        <PageHeader 
          activeTab={activeTab}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onYearChange={onYearChange}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />



        {/* --- 视图按需渲染 --- */}
        
        {/* 视图一：规划视图 */}
        {activeTab === 'planning' && (
          <PlanningView
            currentYear={currentYear}
            config={config}
            dimData={dimData}
            handleAnnualGoalChange={handleAnnualGoalChange}
            handleQuarterlyGoalChange={handleQuarterlyGoalChange}
          />
        )}

        {/* 视图二：任务视图 */}
        {activeTab === 'tasks' && (
          <TasksView
            currentMonth={currentMonth}
            config={config}
            dimData={dimData}
            addTask={addTask}
            minimizedTasks={minimizedTasks}
            toggleTaskMinimize={toggleTaskMinimize}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}

        {/* 视图三：统计分析视图 */}
        {activeTab === 'analysis' && (
          <AnalysisView
            currentMonth={currentMonth}
            config={config}
            dimData={dimData}
          />
        )}

        {/* 新增任务模态框 */}
        <AddTaskModal
          open={isAddTaskModalVisible}
          onCancel={() => setIsAddTaskModalVisible(false)}
          onOk={() => addTaskForm.submit()}
          form={addTaskForm}
        />

        {/* 删除任务确认模态框 */}
        <DeleteTaskModal
          open={isDeleteTaskModalVisible}
          onCancel={() => setIsDeleteTaskModalVisible(false)}
          onOk={async () => {
            await performanceSystem.deleteMonthlyTask(selectedDimension, currentMonth, taskIdToDelete);
            setYearData(performanceSystem.getCurrentYearData());
            setIsDeleteTaskModalVisible(false);
          }}
        />
      </main>
    </div>
  );
};

export default DimensionPage;