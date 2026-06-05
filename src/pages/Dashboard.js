import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import styles from './Dashboard.module.css';

const FILTERS = ['all', 'pending', 'completed'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { tasks, pagination, loading, loadTasks, addTask, editTask, removeTask, toggleStatus } = useTasks();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const load = useCallback(() => {
    loadTasks({ status: filter, search, page, limit: 9 });
  }, [filter, search, page, loadTasks]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  const handleAdd = async (data) => {
    await addTask(data);
    setShowModal(false);
    load();
  };

  const handleEdit = async (data) => {
    await editTask(editingTask._id, data);
    setEditingTask(null);
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await removeTask(id);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleStatus(id);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>✦</span>
          <h1>TaskFlow</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>Hi, {user?.name?.split(' ')[0]}</span>
          <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
          <button className={styles.iconBtn} onClick={logout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{pagination.total ?? 0}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: 'var(--warning)' }}>{stats.pending}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum} style={{ color: 'var(--success)' }}>{stats.completed}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => handleFilterChange(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            <FiPlus /> New Task
          </button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className={styles.empty}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className={styles.empty}>
            <p>No tasks found.</p>
          
          </div>
        ) : (
          <div className={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDelete(task._id)}
                onToggle={() => handleToggle(task._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span>{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showModal && (
        <TaskModal
          onSubmit={handleAdd}
          onClose={() => setShowModal(false)}
          title="New Task"
        />
      )}
      {editingTask && (
        <TaskModal
          onSubmit={handleEdit}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
