import { useEffect, useMemo, useState } from 'react';
import { taskApi } from './api';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];

function toDateTimeLocalString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function initialFormState() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return {
    title: '',
    description: '',
    status: 'TODO',
    dueDateTime: toDateTimeLocalString(tomorrow)
  };
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime)),
    [tasks]
  );

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const result = await taskApi.getTasks();
      setTasks(result);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function onInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onCreateTask(event) {
    event.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const createdTask = await taskApi.createTask({
        ...form,
        title: form.title.trim(),
        dueDateTime: new Date(form.dueDateTime).toISOString().slice(0, 19)
      });
      setTasks((current) => [...current, createdTask]);
      setForm(initialFormState());
    } catch (createError) {
      setFormError(createError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onStatusChange(taskId, status) {
    setError('');
    try {
      const updated = await taskApi.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function onDeleteTask(taskId) {
    setError('');
    try {
      await taskApi.deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <main className="container">
      <h1>HMCTS Task Manager</h1>

      <section className="card">
        <h2>Create task</h2>
        <form onSubmit={onCreateTask} className="task-form">
          <label>
            Title
            <input name="title" value={form.title} onChange={onInputChange} placeholder="Enter task title" />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onInputChange}
              placeholder="Optional"
            />
          </label>

          <label>
            Status
            <select name="status" value={form.status} onChange={onInputChange}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Due date/time
            <input type="datetime-local" name="dueDateTime" value={form.dueDateTime} onChange={onInputChange} />
          </label>

          {formError ? <p className="error">{formError}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create task'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Tasks</h2>
        {error ? <p className="error">{error}</p> : null}
        {loading ? <p>Loading tasks...</p> : null}
        {!loading && sortedTasks.length === 0 ? <p>No tasks yet.</p> : null}

        {!loading && sortedTasks.length > 0 ? (
          <ul className="task-list">
            {sortedTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || 'No description provided.'}</p>
                  <p>
                    Due: <strong>{new Date(task.dueDateTime).toLocaleString()}</strong>
                  </p>
                </div>

                <div className="actions">
                  <select
                    aria-label={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) => onStatusChange(task.id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => onDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

