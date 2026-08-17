"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const projects = [
  {
    name: "Website Redesign",
    description: "Marketing website redesign",
    progress: 82,
    tasks: 18,
    members: 4,
  },
  {
    name: "Mobile Application",
    description: "Customer mobile application",
    progress: 64,
    tasks: 24,
    members: 6,
  },
  {
    name: "Analytics Platform",
    description: "Business analytics dashboard",
    progress: 47,
    tasks: 16,
    members: 3,
  },
  {
    name: "Customer Portal",
    description: "Self-service customer portal",
    progress: 31,
    tasks: 12,
    members: 5,
  },
];

const activities = [
  {
    initials: "AS",
    text: "Ankit Sharma completed a task",
    time: "8 minutes ago",
  },
  {
    initials: "RK",
    text: "Riya Kapoor created a new project",
    time: "34 minutes ago",
  },
  {
    initials: "AM",
    text: "Arjun Mehta updated a task",
    time: "1 hour ago",
  },
  {
    initials: "PS",
    text: "Priya Singh joined the project team",
    time: "2 hours ago",
  },
];

const tasks = [
  {
    name: "Finalize dashboard UI",
    project: "Website Redesign",
    assignee: "Ankit Sharma",
    status: "In Progress",
    priority: "High",
  },
  {
    name: "Create authentication API",
    project: "Mobile Application",
    assignee: "Riya Kapoor",
    status: "Review",
    priority: "High",
  },
  {
    name: "Setup analytics database",
    project: "Analytics Platform",
    assignee: "Arjun Mehta",
    status: "Completed",
    priority: "Medium",
  },
  {
    name: "Prepare design system",
    project: "Customer Portal",
    assignee: "Priya Singh",
    status: "Planning",
    priority: "Low",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* PAGE HEADER */}
        <div className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>

            <h1>Dashboard</h1>

            <p className="page-description">
              Welcome back. Here&apos;s what&apos;s happening across
              your workspace.
            </p>
          </div>

          <Link href="/projects" className="primary-button">
            <Plus size={16} />
            New Project
          </Link>
        </div>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon purple">
                <FolderKanban size={18} />
              </div>

              <span className="stat-change positive">
                +12%
              </span>
            </div>

            <p>Total Projects</p>

            <h2>12</h2>

            <span className="stat-footer">
              Compared to last month
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon blue">
                <ListTodo size={18} />
              </div>

              <span className="stat-change positive">
                +8%
              </span>
            </div>

            <p>Active Tasks</p>

            <h2>48</h2>

            <span className="stat-footer">
              Currently in progress
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon green">
                <CheckCircle2 size={18} />
              </div>

              <span className="stat-change positive">
                +16%
              </span>
            </div>

            <p>Completed Tasks</p>

            <h2>126</h2>

            <span className="stat-footer">
              Completed this month
            </span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon orange">
                <Users size={18} />
              </div>

              <span className="stat-change positive">
                +4%
              </span>
            </div>

            <p>Team Members</p>

            <h2>18</h2>

            <span className="stat-footer">
              Active workspace members
            </span>
          </div>
        </section>

        {/* PROJECTS + ACTIVITY */}
        <div className="dashboard-grid">
          {/* PROJECTS */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Project Progress</h2>

                <p>
                  Track progress across your active projects
                </p>
              </div>

              <Link href="/projects">
                View all
              </Link>
            </div>

            <div>
              {projects.map((project) => (
                <div
                  className="project-item"
                  key={project.name}
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
                      {project.tasks} tasks
                    </span>

                    <span>
                      <Users size={11} />
                      {project.members} members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIVITY */}
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent Activity</h2>

                <p>
                  Latest workspace updates
                </p>
              </div>

              <Link href="/team">
                Team
              </Link>
            </div>

            <div className="activity-list">
              {activities.map((activity) => (
                <div
                  className="activity-item"
                  key={`${activity.initials}-${activity.time}`}
                >
                  <div className="activity-avatar">
                    {activity.initials}
                  </div>

                  <div>
                    <p>
                      <strong>
                        {activity.text.split(" ")[0]}
                      </strong>{" "}
                      {activity.text
                        .split(" ")
                        .slice(1)
                        .join(" ")}
                    </p>

                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* TASKS */}
        <section className="dashboard-panel tasks-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Tasks</h2>

              <p>
                Latest tasks from your workspace
              </p>
            </div>

            <Link href="/tasks">
              View all
            </Link>
          </div>

          <div className="task-table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.name}>
                    <td className="task-name">
                      {task.name}
                    </td>

                    <td>{task.project}</td>

                    <td>{task.assignee}</td>

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>

              <p>
                Navigate directly to your workspace
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <Link
              href="/projects"
              className="primary-button"
              style={{ textDecoration: "none" }}
            >
              <FolderKanban size={16} />
              Projects
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/tasks"
              className="primary-button"
              style={{ textDecoration: "none" }}
            >
              <ListTodo size={16} />
              Tasks
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/team"
              className="primary-button"
              style={{ textDecoration: "none" }}
            >
              <Users size={16} />
              Team
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/tasks"
              className="primary-button"
              style={{ textDecoration: "none" }}
            >
              <Clock3 size={16} />
              Manage Tasks
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}