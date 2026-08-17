import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  X,
} from "lucide-react";

import { addTask } from "../store/tasksSlice";
import "./Tasks.css";

const Tasks = () => {
  const dispatch = useDispatch();

  const tasks = useSelector(
    (state) => state.tasks?.items || []
  );

  const projects = useSelector(
    (state) => state.projects?.items || []
  );

  const teamMembers = useSelector(
    (state) => state.team?.members || []
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project: "",
    assignee: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  });

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return tasks;
    }

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query)
    );
  }, [tasks, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.project) {
      return;
    }

    const formattedDate = form.dueDate
      ? new Date(form.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not set";

    dispatch(
      addTask({
        ...form,
        title: form.title.trim(),
        dueDate: formattedDate,
        assignee:
          form.assignee || "Unassigned",
      })
    );

    setForm({
      title: "",
      project: "",
      assignee: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    });

    setShowForm(false);
  };

  const todoCount = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const progressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <span className="page-eyebrow">
            WORK MANAGEMENT
          </span>

          <h1>Tasks</h1>

          <p>
            Manage, organize, and track tasks across your
            workspace.
          </p>
        </div>

        <button
          className="new-task-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          New Task
        </button>
      </div>

      {showForm && (
        <div className="task-form-overlay">
          <div className="task-form-modal">
            <div className="task-form-header">
              <div>
                <span className="page-eyebrow">
                  WORK MANAGEMENT
                </span>

                <h2>Create New Task</h2>

                <p>
                  Add a task and assign it to your workspace.
                </p>
              </div>

              <button
                className="task-modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="task-form-grid">
                <div className="task-form-group full-width">
                  <label>Task Title</label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Build authentication API"
                    required
                  />
                </div>

                <div className="task-form-group">
                  <label>Project</label>

                  <select
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select project
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.name}
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="task-form-group">
                  <label>Assignee</label>

                  <select
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {teamMembers.map((member) => (
                      <option
                        key={member.id}
                        value={member.name}
                      >
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="task-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="task-form-group">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="task-form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="task-form-actions">
                <button
                  type="button"
                  className="task-cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="new-task-button"
                >
                  <Plus size={17} />
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="task-stats">
        <div className="task-stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="task-stat-card">
          <span>To Do</span>
          <strong>{todoCount}</strong>
        </div>

        <div className="task-stat-card">
          <span>In Progress</span>
          <strong>{progressCount}</strong>
        </div>

        <div className="task-stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      <section className="tasks-panel">
        <div className="tasks-toolbar">
          <div>
            <h2>All Tasks</h2>

            <p>
              Latest tasks across your projects.
            </p>
          </div>

          <div className="task-search-wrapper">
            <Search size={16} />

            <input
              type="search"
              placeholder="Search tasks..."
              className="task-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <div className="tasks-table-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                  </td>

                  <td>{task.project}</td>

                  <td>{task.assignee}</td>

                  <td>
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="tasks-empty">
              <h3>No tasks found</h3>

              <p>
                Try changing your search or create a new
                task.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tasks;