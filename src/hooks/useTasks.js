import { useState, useCallback } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../api';
import toast from 'react-hot-toast';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await fetchTasks(params);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [res.data.task, ...prev]);
    toast.success('Task created!');
    return res.data.task;
  };

  const editTask = async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    toast.success('Task updated!');
    return res.data.task;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    toast.success('Task deleted');
  };

  const toggleStatus = async (id) => {
    const res = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
  };

  return { tasks, pagination, loading, loadTasks, addTask, editTask, removeTask, toggleStatus };
};

export default useTasks;
