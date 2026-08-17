"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  FolderKanban,
  Plus,
  Search,
  Users,
  CalendarDays,
  Pencil,
  Trash2,
  ArrowUpRight,
  X,
} from "lucide-react";

import {
  fetchProjects,
  createProject,
  updateProjectAsync,
  deleteProjectAsync,
} from "../../store/projectsSlice";

import DashboardLayout from "../../components/DashboardLayout";

import styles from "./Projects.module.css";

function ProjectsContent() {
  const dispatch = useDispatch();

  const projects = useSelector(
    (state) => state.projects?.items || []
  );

  const projectStatus = useSelector(
    (state) => state.projects?.status || "idle"
  );

  const projectError = useSelector(
    (state) => state.projects?.error || null
  );

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    members: 1,
    dueDate: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Projects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getProjectId = (project) => {
    return project?._id || project?.id;
  };

  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Not set";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.completed;

      case "Planning":
        return styles.planning;

      case "In Progress":
      default:
        return styles.inProgress;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;

      case "Low":
        return styles.priorityLow;

      case "Medium":
      default:
        return styles.priorityMedium;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalProjects = projects.length;

  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalMembers = projects.reduce(
    (total, project) =>
      total + (Number(project.members) || 0),
    0
  );

  /*
  |--------------------------------------------------------------------------
  | Filter Projects
  |--------------------------------------------------------------------------
  */

  const filteredProjects = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !searchValue ||
        String(project.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(project.description || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        activeFilter === "All" ||
        project.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, activeFilter]);

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

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

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Planning",
      priority: project.priority || "Medium",
      members: project.members || 1,
      dueDate: formatDateForInput(project.dueDate),
    });

    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Create / Update Project
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim()
    ) {
      return;
    }

    const projectData = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      members: Number(form.members) || 1,
      dueDate: form.dueDate
        ? formatDisplayDate(form.dueDate)
        : "Not set",
    };

    try {
      if (editingProject) {
        const id = getProjectId(editingProject);

        if (!id) {
          throw new Error(
            "Project ID is missing. Cannot update project."
          );
        }

        await dispatch(
          updateProjectAsync({
            id,
            ...projectData,
          })
        ).unwrap();
      } else {
        await dispatch(
          createProject(projectData)
        ).unwrap();
      }

      closeModal();
    } catch (error) {
      console.error(
        "Project operation failed:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Project
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (project) => {
    const id = getProjectId(project);

    if (!id) {
      console.error(
        "Project ID is missing. Cannot delete project."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteProjectAsync(id)
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className={styles.projectsPage}>
      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>
            WORKSPACE
          </p>

          <h1>Projects</h1>

          <p className={styles.pageDescription}>
            Manage projects, track progress, and keep
            your team aligned.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreateModal}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className={styles.filters}>
          {[
            "All",
            "In Progress",
            "Planning",
            "Completed",
          ].map((filter) => (
            <button
              type="button"
              key={filter}
              className={`${styles.filterButton} ${
                activeFilter === filter
                  ? styles.filterActive
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {projectStatus === "failed" &&
        projectError && (
          <div className={styles.errorMessage}>
            {projectError}
          </div>
        )}

      {/* STATISTICS */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h2>{totalProjects}</h2>

          <p>Total Projects</p>
        </div>

        <div className={styles.statCard}>
          <h2>{inProgressProjects}</h2>

          <p>In Progress</p>
        </div>

        <div className={styles.statCard}>
          <h2>{completedProjects}</h2>

          <p>Completed</p>
        </div>

        <div className={styles.statCard}>
          <h2>{totalMembers}</h2>

          <p>Team Members</p>
        </div>
      </section>

      {/* LOADING */}
      {projectStatus === "loading" &&
        projects.length === 0 && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />

            <p>Loading projects...</p>
          </div>
        )}

      {/* PROJECT GRID */}
      {projectStatus !== "loading" ||
      projects.length > 0 ? (
        <>
          {filteredProjects.length > 0 ? (
            <section className={styles.projectGrid}>
              {filteredProjects.map((project) => {
                const projectId =
                  getProjectId(project);

                const progress = Math.min(
                  100,
                  Math.max(
                    0,
                    Number(project.progress) || 0
                  )
                );

                const completedTasks =
                  Number(project.tasks) || 0;

                const totalTasks =
                  Number(project.totalTasks) || 0;

                return (
                  <article
                    className={styles.projectCard}
                    key={projectId}
                  >
                    {/* CARD TOP */}
                    <div
                      className={
                        styles.projectCardTop
                      }
                    >
                      <div
                        className={
                          styles.projectIcon
                        }
                      >
                        <FolderKanban size={21} />
                      </div>

                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status ||
                          "Planning"}
                      </span>
                    </div>

                    {/* PROJECT INFO */}
                    <div
                      className={
                        styles.projectInfo
                      }
                    >
                      <h2>
                        {project.name ||
                          "Untitled Project"}
                      </h2>

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>
                    </div>

                    {/* PROGRESS */}
                    <div
                      className={
                        styles.progressSection
                      }
                    >
                      <div
                        className={
                          styles.progressHeader
                        }
                      >
                        <span>
                          Progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>
                      </div>

                      <div
                        className={
                          styles.progressTrack
                        }
                      >
                        <div
                          className={
                            styles.progressFill
                          }
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* META */}
                    <div
                      className={
                        styles.projectMeta
                      }
                    >
                      <div
                        className={
                          styles.metaItem
                        }
                      >
                        <span>
                          Tasks
                        </span>

                        <strong>
                          {completedTasks}/
                          {totalTasks}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.metaItem
                        }
                      >
                        <span>
                          Members
                        </span>

                        <strong>
                          <Users size={15} />
                          {project.members ??
                            0}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.metaItem
                        }
                      >
                        <span>
                          Due date
                        </span>

                        <strong>
                          <CalendarDays
                            size={15}
                          />
                          {formatDisplayDate(
                            project.dueDate
                          )}
                        </strong>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div
                      className={
                        styles.projectFooter
                      }
                    >
                      <div
                        className={`${styles.priorityText} ${getPriorityClass(
                          project.priority
                        )}`}
                      >
                        Priority:{" "}
                        <strong>
                          {project.priority ||
                            "Medium"}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.projectActions
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.actionButton
                          }
                          onClick={() =>
                            openEditModal(
                              project
                            )
                          }
                          aria-label={`Edit ${project.name}`}
                          title="Edit project"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            handleDelete(
                              project
                            )
                          }
                          aria-label={`Delete ${project.name}`}
                          title="Delete project"
                        >
                          <Trash2 size={17} />
                        </button>

                        <Link
                          href={`/projects/${projectId}`}
                          className={`${styles.actionButton} ${styles.openButton}`}
                          aria-label={`Open ${project.name}`}
                          title="Open project"
                        >
                          <ArrowUpRight
                            size={18}
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            <div className={styles.emptyState}>
              <div
                className={
                  styles.emptyIcon
                }
              >
                <FolderKanban size={28} />
              </div>

              <h2>No projects found</h2>

              <p>
                {search ||
                activeFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Create your first project to get started."}
              </p>

              {!search &&
                activeFilter === "All" && (
                  <button
                    type="button"
                    className={
                      styles.primaryButton
                    }
                    onClick={
                      openCreateModal
                    }
                  >
                    <Plus size={18} />
                    Create Project
                  </button>
                )}
            </div>
          )}
        </>
      ) : null}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div
          className={
            styles.modalOverlay
          }
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className={styles.modal}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div
              className={
                styles.modalHeader
              }
            >
              <div>
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  PROJECT MANAGEMENT
                </p>

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
                type="button"
                className={
                  styles.modalClose
                }
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
            >
              <div
                className={
                  styles.formGrid
                }
              >
                <div
                  className={`${styles.formGroup} ${styles.full}`}
                >
                  <label htmlFor="project-name">
                    Project Name
                  </label>

                  <input
                    id="project-name"
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. AI Dashboard"
                    required
                  />
                </div>

                <div
                  className={`${styles.formGroup} ${styles.full}`}
                >
                  <label htmlFor="project-description">
                    Description
                  </label>

                  <textarea
                    id="project-description"
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Describe the project..."
                    rows={4}
                    required
                  />
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label htmlFor="project-status">
                    Status
                  </label>

                  <select
                    id="project-status"
                    name="status"
                    value={form.status}
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Planning">
                      Planning
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label htmlFor="project-priority">
                    Priority
                  </label>

                  <select
                    id="project-priority"
                    name="priority"
                    value={
                      form.priority
                    }
                    onChange={
                      handleChange
                    }
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

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label htmlFor="project-members">
                    Team Members
                  </label>

                  <input
                    id="project-members"
                    type="number"
                    name="members"
                    min="1"
                    value={
                      form.members
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label htmlFor="project-due-date">
                    Due Date
                  </label>

                  <input
                    id="project-due-date"
                    type="date"
                    name="dueDate"
                    value={
                      form.dueDate
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div
                className={
                  styles.formActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.cancelButton
                  }
                  onClick={
                    closeModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={
                    styles.primaryButton
                  }
                  disabled={
                    projectStatus ===
                    "loading"
                  }
                >
                  <Plus size={18} />

                  {projectStatus ===
                  "loading"
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <ProjectsContent />
    </DashboardLayout>
  );
}