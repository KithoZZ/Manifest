import React from 'react';
import { Modal } from 'antd';

interface DeleteTaskModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ open, onCancel, onOk }) => {
  return (
    <Modal
      title="确认删除"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="删除"
      cancelText="取消"
      okType="danger"
    >
      <p>确定要删除该任务吗？此操作不可撤销。</p>
    </Modal>
  );
};

export default DeleteTaskModal;