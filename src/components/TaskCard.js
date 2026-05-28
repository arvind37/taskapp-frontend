import React from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiClock, FiCalendar } from 'react-icons/fi';
import styles from './TaskCard.module.css';

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.top}>
        <span className={`${styles.badge} badge-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={onEdit} title="Edit">
            <FiEdit2 />
          </button>
          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={onDelete} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>

      <h3 className={`${styles.title} ${isCompleted ? styles.striked : ''}`}>{task.title}</h3>

      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}

      <div className={styles.bottom}>
        {task.dueDate && (
          <span className={styles.meta}>
            <FiCalendar size={12} /> {formatDate(task.dueDate)}
          </span>
        )}
        <button
          className={`${styles.statusBtn} ${isCompleted ? styles.statusComplete : styles.statusPending}`}
          onClick={onToggle}
        >
          {isCompleted ? <><FiCheck size={12} /> Completed</> : <><FiClock size={12} /> Pending</>}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
