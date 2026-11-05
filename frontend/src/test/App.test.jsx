import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { taskApi } from '../api';

vi.mock('../api', () => ({
  taskApi: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTaskStatus: vi.fn(),
    deleteTask: vi.fn()
  }
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays tasks', async () => {
    taskApi.getTasks.mockResolvedValue([
      {
        id: 1,
        title: 'Prepare statement',
        description: '',
        status: 'TODO',
        dueDateTime: '2099-01-01T10:00:00'
      }
    ]);

    render(<App />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    expect(await screen.findByText('Prepare statement')).toBeInTheDocument();
  });

  it('validates title before create', async () => {
    taskApi.getTasks.mockResolvedValue([]);

    render(<App />);

    await screen.findByText('No tasks yet.');

    fireEvent.click(screen.getByRole('button', { name: 'Create task' }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });

  it('creates a task', async () => {
    taskApi.getTasks.mockResolvedValue([]);
    taskApi.createTask.mockResolvedValue({
      id: 2,
      title: 'Call court user',
      description: 'Follow up',
      status: 'TODO',
      dueDateTime: '2099-01-01T10:00:00'
    });

    render(<App />);

    await screen.findByText('No tasks yet.');
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Call court user' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Follow up' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }));

    expect(await screen.findByText('Call court user')).toBeInTheDocument();
    expect(taskApi.createTask).toHaveBeenCalled();
  });

  it('updates status', async () => {
    taskApi.getTasks.mockResolvedValue([
      {
        id: 5,
        title: 'Review file',
        description: '',
        status: 'TODO',
        dueDateTime: '2099-01-01T10:00:00'
      }
    ]);
    taskApi.updateTaskStatus.mockResolvedValue({
      id: 5,
      title: 'Review file',
      description: '',
      status: 'DONE',
      dueDateTime: '2099-01-01T10:00:00'
    });

    render(<App />);

    await screen.findByText('Review file');
    fireEvent.change(screen.getByLabelText('status-5'), { target: { value: 'DONE' } });

    await waitFor(() => {
      expect(taskApi.updateTaskStatus).toHaveBeenCalledWith(5, 'DONE');
    });
  });

  it('deletes task', async () => {
    taskApi.getTasks.mockResolvedValue([
      {
        id: 9,
        title: 'Archive case',
        description: '',
        status: 'TODO',
        dueDateTime: '2099-01-01T10:00:00'
      }
    ]);
    taskApi.deleteTask.mockResolvedValue(null);

    render(<App />);

    await screen.findByText('Archive case');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(taskApi.deleteTask).toHaveBeenCalledWith(9);
    });
  });
});

