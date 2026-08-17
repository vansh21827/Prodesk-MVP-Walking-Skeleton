import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Users,
  X,
  Trash2,
} from "lucide-react";

import {
  createProject,
  fetchProjects,
  deleteProjectAsync,
  updateProjectAsync,
} from "../store/projectsSlice";

import "./Projects.css";

function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: projects,
    status,
    error,
  } = useSelector((state) => state.projects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    members: 1,
    dueDate: "",
  });

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectName = project.name || "";
      const projectDescription = project.description || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        projectName.toLowerCase().includes(searchValue) ||
        projectDescription.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      status: "Planning",
      priority: "Medium",
      members: 1,
      dueDate: "",
    });

    setEditingProject(null);
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const handleNewProject = () => {
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditProject = (project) => {
    setEditingProject(project);

    let formattedDueDate = "";

    if (project.dueDate && project.dueDate !== "Not set") {
      const date = new Date(project.dueDate);

      if (!Number.isNaN(date.getTime())) {
        formattedDueDate = date.toISOString().split("T")[0];
      }
    }

    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Planning",
      priority: project.priority || "Medium",
      members: project.members || 1,
      dueDate: formattedDueDate,
    });

    setShowForm(true);
  };

  // ==========================================
  // CREATE / UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (event) => {
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

    const projectData = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      members: Number(form.members) || 1,
      dueDate: formattedDate,
    };

    try {
      // EDIT EXISTING PROJECT
      if (editingProject) {
        const result = await dispatch(
          updateProjectAsync({
            id: editingProject._id,
            ...projectData,
          })
        ).unwrap();

        console.log("Project updated:", result);
      }

      // CREATE NEW PROJECT
      else {
        const result = await dispatch(
          createProject({
            ...projectData,
            progress: 0,
            tasks: 0,
            totalTasks: 0,
          })
        ).unwrap();

        console.log("Project created:", result);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Project operation failed:", err);
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteProjectAsync(project._id)
      ).unwrap();

      console.log("Project deleted successfully");
    } catch (err) {
      console.error("Delete project error:", err);
      alert(err || "Failed to delete project");
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="projects-page">

      {/* ================= HEADER ================= */}

      <div className="projects-header">
        <div>
          <span className="page-eyebrow">
            WORKSPACE
          </span>

          <h1>Projects</h1>

          <p>
            Manage projects, track progress, and keep your
            team aligned.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleNewProject}
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {showForm && (
        <div className="project-form-overlay">
          <div className="project-form-modal">

            <div className="project-form-header">
              <div>
                <span className="page-eyebrow">
                  PROJECT MANAGEMENT
                </span>

                <h2>
                  {editingProject
                    ? "Edit Project"
                    : "Create New Project"}
                </h2>

                <p>
                  {editingProject
                    ? "Update your project details."
                    : "Add a new project to your TaskMatrix workspace."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* PROJECT NAME */}

                <div className="form-group full-width">
                  <label>Project Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="form-group full-width">
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

                {/* STATUS */}

                <div className="form-group">
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

                {/* PRIORITY */}

                <div className="form-group">
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

                {/* MEMBERS */}

                <div className="form-group">
                  <label>Team Members</label>

                  <input
                    type="number"
                    name="members"
                    min="1"
                    value={form.members}
                    onChange={handleChange}
                  />
                </div>

                {/* DUE DATE */}

                <div className="form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* ERROR */}

              {error && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: "16px",
                  }}
                >
                  {error}
                </p>
              )}

              {/* ACTIONS */}

              <div className="project-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={status === "loading"}
                >
                  {editingProject ? (
                    <>
                      <Pencil size={17} />
                      {status === "loading"
                        ? "Saving..."
                        : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      {status === "loading"
                        ? "Creating..."
                        : "Create Project"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= TOOLBAR ================= */}

      <div className="projects-toolbar">

        <div className="projects-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="project-filters">

          {[
            "All",
            "In Progress",
            "Planning",
            "Completed",
          ].map((statusOption) => (
            <button
              key={statusOption}
              className={
                statusFilter === statusOption
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(statusOption)
              }
            >
              {statusOption}
            </button>
          ))}

        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="projects-summary">

        <div>
          <strong>{projects.length}</strong>
          <span>Total Projects</span>
        </div>

        <div>
          <strong>
            {
              projects.filter(
                (project) =>
                  project.status === "In Progress"
              ).length
            }
          </strong>

          <span>In Progress</span>
        </div>

        <div>
          <strong>
            {
              projects.filter(
                (project) =>
                  project.status === "Completed"
              ).length
            }
          </strong>

          <span>Completed</span>
        </div>

        <div>
          <strong>
            {projects.reduce(
              (total, project) =>
                total +
                Number(project.members || 0),
              0
            )}
          </strong>

          <span>Team Members</span>
        </div>

      </div>

      {/* ================= LOADING ================= */}

      {status === "loading" && projects.length === 0 ? (

        <div className="empty-projects">

          <FolderKanban size={40} />

          <h2>Loading projects...</h2>

          <p>
            Fetching your projects from TaskMatrix.
          </p>

        </div>

      ) : filteredProjects.length === 0 ? (

        /* ================= EMPTY ================= */

        <div className="empty-projects">

          <FolderKanban size={40} />

          <h2>No projects found</h2>

          <p>
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        /* ================= PROJECT GRID ================= */

        <div className="projects-grid">

          {filteredProjects.map((project) => (

            <article
              className="project-card"
              key={project._id}
            >

              {/* CARD HEADER */}

              <div className="project-card-header">

                <div className="project-icon">
                  <FolderKanban size={20} />
                </div>

                <span
                  className={`project-status ${(
                    project.status || ""
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {project.status}
                </span>

              </div>

              {/* CARD CONTENT */}

              <div className="project-card-content">

                <h2>{project.name}</h2>

                <p>{project.description}</p>

                {/* PROGRESS */}

                <div className="project-progress-heading">

                  <span>Progress</span>

                  <strong>
                    {project.progress || 0}%
                  </strong>

                </div>

                <div className="project-progress">

                  <div
                    style={{
                      width: `${project.progress || 0}%`,
                    }}
                  />

                </div>

                {/* DETAILS */}

                <div className="project-details">

                  <div>
                    <span>Tasks</span>

                    <strong>
                      {project.tasks || 0}/
                      {project.totalTasks || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Members</span>

                    <strong>
                      <Users size={14} />
                      {project.members || 0}
                    </strong>
                  </div>

                  <div>
                    <span>Due date</span>

                    <strong>
                      <CalendarDays size={14} />
                      {project.dueDate || "Not set"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* CARD FOOTER */}

              <div className="project-card-footer">

                <span>
                  Priority:{" "}

                  <strong
                    className={`priority-${(
                      project.priority || ""
                    ).toLowerCase()}`}
                  >
                    {project.priority}
                  </strong>
                </span>

                <div
                  className="project-card-actions"
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >

                  {/* EDIT */}

                  <button
                    className="project-edit-button"
                    onClick={() =>
                      handleEditProject(project)
                    }
                    aria-label={`Edit ${project.name}`}
                    title="Edit project"
                    type="button"
                  >
                    <Pencil size={17} />
                  </button>

                  {/* DELETE */}

                  <button
                    className="project-delete-button"
                    onClick={() =>
                      handleDeleteProject(project)
                    }
                    aria-label={`Delete ${project.name}`}
                    title="Delete project"
                    type="button"
                  >
                    <Trash2 size={17} />
                  </button>

                  {/* OPEN */}

                  <button
  className="project-open-button"
  aria-label={`Open ${project.name}`}
  title="Open project"
  type="button"
  onClick={() =>
    navigate(`/projects/${project._id}`)
  }
>
  <ArrowUpRight size={18} />
</button>
            
                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

export default Projects;