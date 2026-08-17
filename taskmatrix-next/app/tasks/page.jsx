"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Search,
  X,
} from "lucide-react";

import { addTask } from "../../store/tasksSlice";
import DashboardLayout from "../../components/DashboardLayout";

import "./Tasks.css";

/*
|--------------------------------------------------------------------------
| Tasks Content
|--------------------------------------------------------------------------
*/

function TasksContent() {
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */

  const tasks = useSelector(
    (state) => state.tasks?.items || []
  );

  const projects = useSelector(
    (state) => state.projects?.items || []
  );

  const teamMembers = useSelector(
    (state) => state.team?.members || []
  );

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project: "",
    assignee: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Safe Helpers
  |--------------------------------------------------------------------------
  */

  const getId = (item) => {
    return item?._id || item?.id;
  };

  const getString = (value) => {
    return value == null ? "" : String(value);
  };

  /*
  |--------------------------------------------------------------------------
  | Task Statistics
  |--------------------------------------------------------------------------
  */

  const todoCount = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const progressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const reviewCount = tasks.filter(
    (task) => task.status === "Review"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Filter Tasks
  |--------------------------------------------------------------------------
  */

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const title = getString(task.title).toLowerCase();
      const project = getString(task.project).toLowerCase();
      const assignee = getString(task.assignee).toLowerCase();
      const status = getString(task.status).toLowerCase();
      const priority = getString(task.priority).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        project.includes(query) ||
        assignee.includes(query) ||
        status.includes(query) ||
        priority.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Form Handlers
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      project: "",
      assignee: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    });
  };

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Create Task
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = form.title.trim();

    if (!title || !form.project) {
      return;
    }

    const formattedDate = form.dueDate
      ? new Date(
          `${form.dueDate}T00:00:00`
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not set";

    const taskData = {
      title,
      project: form.project,
      assignee:
        form.assignee.trim() || "Unassigned",
      status: form.status,
      priority: form.priority,
      dueDate: formattedDate,
    };

    dispatch(addTask(taskData));

    handleCloseForm();
  };

  /*
  |--------------------------------------------------------------------------
  | CSS Classes
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {
    return getString(status)
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getPriorityClass = (priority) => {
    return getString(priority).toLowerCase();
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="tasks-page">
      {/* ================================================================
          PAGE HEADER
      ================================================================= */}

      <div className="tasks-header">
        <div>
          <p className="tasks-eyebrow">
            WORK MANAGEMENT
          </p>

          <h1>Tasks</h1>

          <p className="tasks-description">
            Manage, organize, and track tasks across your
            workspace.
          </p>
        </div>

        <button
          type="button"
          className="tasks-primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          New Task
        </button>
      </div>

      {/* ================================================================
          CREATE TASK MODAL
      ================================================================= */}

      {showForm && (
        <div
          className="tasks-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseForm();
            }
          }}
        >
          <div className="tasks-modal">
            {/* Modal Header */}

            <div className="tasks-modal-header">
              <div>
                <p className="tasks-eyebrow">
                  WORK MANAGEMENT
                </p>

                <h2>Create New Task</h2>

                <p>
                  Add a task and assign it to your
                  workspace.
                </p>
              </div>

              <button
                type="button"
                className="tasks-modal-close"
                onClick={handleCloseForm}
                aria-label="Close task form"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>
              <div className="tasks-form-grid">
                {/* Task Title */}

                <div className="tasks-form-group full">
                  <label htmlFor="task-title">
                    Task Title
                  </label>

                  <input
                    id="task-title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Build authentication API"
                    required
                  />
                </div>

                {/* Project */}

                <div className="tasks-form-group">
                  <label htmlFor="task-project">
                    Project
                  </label>

                  <select
                    id="task-project"
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select project
                    </option>

                    {projects.map((project) => {
                      const projectId =
                        getId(project);

                      return (
                        <option
                          key={projectId}
                          value={project.name}
                        >
                          {project.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Assignee */}

                <div className="tasks-form-group">
                  <label htmlFor="task-assignee">
                    Assignee
                  </label>

                  <select
                    id="task-assignee"
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {teamMembers.map((member) => {
                      const memberId =
                        getId(member);

                      return (
                        <option
                          key={memberId}
                          value={member.name}
                        >
                          {member.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Status */}

                <div className="tasks-form-group">
                  <label htmlFor="task-status">
                    Status
                  </label>

                  <select
                    id="task-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Todo">
                      Todo
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Review">
                      Review
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                {/* Priority */}

                <div className="tasks-form-group">
                  <label htmlFor="task-priority">
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>
                  </select>
                </div>

                {/* Due Date */}

                <div className="tasks-form-group">
                  <label htmlFor="task-due-date">
                    Due Date
                  </label>

                  <input
                    id="task-due-date"
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Modal Actions */}

              <div className="tasks-form-actions">
                <button
                  type="button"
                  className="tasks-secondary-button"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="tasks-primary-button"
                >
                  <Plus size={17} />
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          TASK STATISTICS
      ================================================================= */}

      <section className="tasks-stats-grid">
        {/* Total */}

        <div className="tasks-stat-card">
          <div className="tasks-stat-top">
            <div className="tasks-stat-icon purple">
              <ListTodo size={20} />
            </div>
          </div>

          <p>Total Tasks</p>

          <h2>{tasks.length}</h2>

          <span>
            Across all projects
          </span>
        </div>

        {/* Todo */}

        <div className="tasks-stat-card">
          <div className="tasks-stat-top">
            <div className="tasks-stat-icon blue">
              <Clock3 size={20} />
            </div>
          </div>

          <p>To Do</p>

          <h2>{todoCount}</h2>

          <span>
            Tasks waiting to start
          </span>
        </div>

        {/* In Progress */}

        <div className="tasks-stat-card">
          <div className="tasks-stat-top">
            <div className="tasks-stat-icon orange">
              <Clock3 size={20} />
            </div>
          </div>

          <p>In Progress</p>

          <h2>{progressCount}</h2>

          <span>
            Currently being worked on
          </span>
        </div>

        {/* Completed */}

        <div className="tasks-stat-card">
          <div className="tasks-stat-top">
            <div className="tasks-stat-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <p>Completed</p>

          <h2>{completedCount}</h2>

          <span>
            Tasks completed successfully
          </span>
        </div>
      </section>

      {/* ================================================================
          TASK PANEL
      ================================================================= */}

      <section className="tasks-panel">
        {/* Toolbar */}

        <div className="tasks-toolbar">
          <div>
            <h2>All Tasks</h2>

            <p>
              Latest tasks across your projects.
            </p>
          </div>

          <div className="tasks-toolbar-controls">
            {/* Search */}

            <div className="tasks-search">
              <Search size={17} />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tasks..."
                aria-label="Search tasks"
              />
            </div>

            {/* Status Filter */}

            <select
              className="tasks-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter by status"
            >
              <option value="All">
                All Status
              </option>

              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            {/* Priority Filter */}

            <select
              className="tasks-filter"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
              aria-label="Filter by priority"
            >
              <option value="All">
                All Priority
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>
        </div>

        {/* Table */}

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
              {filteredTasks.map((task) => {
                const taskId = getId(task);

                const statusClass =
                  getStatusClass(
                    task.status
                  );

                const priorityClass =
                  getPriorityClass(
                    task.priority
                  );

                return (
                  <tr key={taskId}>
                    <td className="task-title-cell">
                      <strong>
                        {task.title ||
                          "Untitled Task"}
                      </strong>
                    </td>

                    <td>
                      {task.project ||
                        "No project"}
                    </td>

                    <td>
                      <div className="task-assignee">
                        <div className="task-avatar">
                          {getString(
                            task.assignee ||
                              "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {task.assignee ||
                            "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`task-priority ${priorityClass}`}
                      >
                        {task.priority ||
                          "Medium"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`task-status ${statusClass}`}
                      >
                        {task.status ||
                          "Todo"}
                      </span>
                    </td>

                    <td>
                      {task.dueDate ||
                        "Not set"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}

          {filteredTasks.length === 0 && (
            <div className="tasks-empty">
              <div className="tasks-empty-icon">
                <ListTodo size={28} />
              </div>

              <h3>
                {tasks.length === 0
                  ? "No tasks yet"
                  : "No tasks found"}
              </h3>

              <p>
                {tasks.length === 0
                  ? "Create your first task to start managing your workspace."
                  : "Try changing your search or filters."}
              </p>

              {tasks.length === 0 && (
                <button
                  type="button"
                  className="tasks-primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  <Plus size={16} />
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}

        {filteredTasks.length > 0 && (
          <div className="tasks-panel-footer">
            <span>
              Showing{" "}
              <strong>
                {filteredTasks.length}
              </strong>{" "}
              of{" "}
              <strong>
                {tasks.length}
              </strong>{" "}
              tasks
            </span>

            {reviewCount > 0 && (
              <span className="review-count">
                {reviewCount} awaiting review
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Tasks Page
|--------------------------------------------------------------------------
|
| DashboardLayout owns:
| - Sidebar
| - Top Header
| - Workspace structure
|
*/

export default function Tasks() {
  return (
    <DashboardLayout>
      <TasksContent />
    </DashboardLayout>
  );
}