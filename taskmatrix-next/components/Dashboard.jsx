import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  Users,
  X,
} from "lucide-react";
import "./Dashboard.css";

import {
  createProject,
  fetchProjects,
  deleteProjectAsync,
  updateProjectAsync,
} from "../store/projectsSlice";

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchProjects());
}, [dispatch]);

  const projects = useSelector(
    (state) => state.projects?.items || []
  );

  const tasks = useSelector(
    (state) => state.tasks?.items || []
  );

  const [showProjectForm, setShowProjectForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    members: 1,
    dueDate: "",
  });

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  );

  const recentTasks = tasks.slice(-5).reverse();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    const formattedDate = form.dueDate
      ? new Date(form.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "Not set";

    dispatch(
      createProject({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        members: Number(form.members) || 1,
        dueDate: formattedDate,
      })
    );

    setForm({
      name: "",
      description: "",
      status: "Planning",
      priority: "Medium",
      members: 1,
      dueDate: "",
    });

    setShowProjectForm(false);
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Dashboard</h1>

          <p className="page-description">
            Welcome back. Here's what's happening across your
            workspace.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowProjectForm(true)}
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showProjectForm && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <div className="dashboard-modal-header">
              <div>
                <p className="eyebrow">
                  PROJECT MANAGEMENT
                </p>

                <h2>Create New Project</h2>

                <p>
                  Add a new project to your TaskMatrix
                  workspace.
                </p>
              </div>

              <button
                className="dashboard-modal-close"
                onClick={() => setShowProjectForm(false)}
                aria-label="Close project form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="dashboard-form-grid">
                <div className="dashboard-form-group full">
                  <label>Project Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. AI Dashboard"
                    required
                  />
                </div>

                <div className="dashboard-form-group full">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the project..."
                    rows="3"
                    required
                  />
                </div>

                <div className="dashboard-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="dashboard-form-group">
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

                <div className="dashboard-form-group">
                  <label>Team Members</label>

                  <input
                    type="number"
                    name="members"
                    min="1"
                    value={form.members}
                    onChange={handleChange}
                  />
                </div>

                <div className="dashboard-form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dashboard-form-actions">
                <button
                  type="button"
                  className="dashboard-cancel-button"
                  onClick={() =>
                    setShowProjectForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Plus size={17} />
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATISTICS */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon purple">
              <FolderKanban size={20} />
            </div>

            <span className="stat-change positive">
              <ArrowUpRight size={13} />
              Live
            </span>
          </div>

          <p>Active Projects</p>

          <h2>{activeProjects.length}</h2>

          <span className="stat-footer">
            Currently active in workspace
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon blue">
              <ListTodo size={20} />
            </div>

            <span className="stat-change positive">
              <ArrowUpRight size={13} />
              Live
            </span>
          </div>

          <p>Total Tasks</p>

          <h2>{tasks.length}</h2>

          <span className="stat-footer">
            Across all projects
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <span className="stat-change positive">
              <ArrowUpRight size={13} />
              Live
            </span>
          </div>

          <p>Completed Tasks</p>

          <h2>{completedTasks.length}</h2>

          <span className="stat-footer">
            Tasks completed successfully
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon orange">
              <Clock3 size={20} />
            </div>

            <span className="stat-change negative">
              Pending
            </span>
          </div>

          <p>Pending Tasks</p>

          <h2>{pendingTasks.length}</h2>

          <span className="stat-footer">
            Requires attention
          </span>
        </div>
      </section>

      {/* PROJECTS + ACTIVITY */}
      <div className="dashboard-grid">
        <section className="dashboard-panel projects-panel">
          <div className="panel-heading">
            <div>
              <h2>Active Projects</h2>

              <p>
                Track progress across your current projects.
              </p>
            </div>

            <a href="/projects">View all</a>
          </div>

          <div className="project-list">
            {activeProjects.slice(0, 4).map((project) => (
              <div
                className="project-item"
                key={project.id}
              >
                <div className="project-title-row">
                  <div>
                    <h3>{project.name}</h3>

                    <p>{project.description}</p>
                  </div>

                  <span className="project-percentage">
                    {project.progress}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>

                <div className="project-meta">
                  <span>
                    {project.tasks}/{project.totalTasks} tasks
                  </span>

                  <span>
                    <Users size={13} />
                    {project.members} members
                  </span>
                </div>
              </div>
            ))}

            {activeProjects.length === 0 && (
              <div className="dashboard-empty">
                <FolderKanban size={30} />

                <p>No active projects yet.</p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowProjectForm(true)
                  }
                >
                  <Plus size={16} />
                  Create Project
                </button>
              </div>
            )}
          </div>
        </section>

        {/* TEAM ACTIVITY */}
        <section className="dashboard-panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Team Activity</h2>

              <p>Recent workspace activity.</p>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar">AS</div>

              <div>
                <p>
                  <strong>Ankit Sharma</strong>{" "}
                  completed a task
                </p>

                <span>8 minutes ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar">RK</div>

              <div>
                <p>
                  <strong>Riya Kapoor</strong> created a
                  new project
                </p>

                <span>34 minutes ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar">AM</div>

              <div>
                <p>
                  <strong>Arjun Mehta</strong> updated a
                  task
                </p>

                <span>1 hour ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar">PS</div>

              <div>
                <p>
                  <strong>Priya Singh</strong> joined the
                  team
                </p>

                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* RECENT TASKS */}
      <section className="dashboard-panel tasks-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Tasks</h2>

            <p>
              Latest tasks requiring your attention.
            </p>
          </div>

          <a href="/tasks">View all</a>
        </div>

        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td className="task-name">
                    {task.title}
                  </td>

                  <td>{task.project}</td>

                  <td>
                    <span
                      className={`status-badge ${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>{task.dueDate}</td>
                </tr>
              ))}

              {recentTasks.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;