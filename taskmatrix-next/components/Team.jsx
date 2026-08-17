import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BriefcaseBusiness,
  Mail,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  addMember,
  deleteMember,
  updateMemberStatus,
} from "../store/teamSlice";

import "./Team.css";

const Team = () => {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.team.members);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
  });

  const roles = [
    ...new Set(members.map((member) => member.role)),
  ];

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(searchValue) ||
        member.email.toLowerCase().includes(searchValue) ||
        member.department.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const totalProjects = members.reduce(
    (total, member) => total + member.projects,
    0
  );

  const totalTasks = members.reduce(
    (total, member) => total + member.tasks,
    0
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    dispatch(addMember(form));

    setForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      department: "Engineering",
      status: "Active",
    });

    setShowModal(false);
  };

  return (
    <div className="team-page">
      <div className="team-header">
        <div>
          <span className="page-eyebrow">WORKSPACE</span>

          <h1>Team</h1>

          <p>
            Manage your team members, roles, and workspace activity.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={17} />
          Add Member
        </button>
      </div>

      <section className="team-summary">
        <div className="team-summary-card">
          <div className="team-summary-icon purple">
            <Users size={20} />
          </div>

          <div>
            <span>Total Members</span>
            <strong>{members.length}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon green">
            <span className="status-dot"></span>
          </div>

          <div>
            <span>Active Members</span>
            <strong>{activeMembers}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon blue">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>Project Assignments</span>
            <strong>{totalProjects}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon orange">
            <Mail size={20} />
          </div>

          <div>
            <span>Assigned Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>
      </section>

      <section className="team-panel">
        <div className="team-toolbar">
          <div className="team-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search team members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="All">All Roles</option>

            {roles.map((role) => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="team-table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Projects</th>
                <th>Tasks</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-cell">
                        <div className="member-avatar">
                          {member.initials}
                        </div>

                        <div>
                          <strong>{member.name}</strong>

                          <span>{member.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="role-cell">
                        <strong>{member.role}</strong>
                        <span>{member.department}</span>
                      </div>
                    </td>

                    <td>
                      <select
                        className={`member-status ${member.status.toLowerCase()}`}
                        value={member.status}
                        onChange={(event) =>
                          dispatch(
                            updateMemberStatus({
                              id: member.id,
                              status: event.target.value,
                            })
                          )
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Away">Away</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </td>

                    <td>
                      <span className="assignment-count">
                        {member.projects}
                      </span>
                    </td>

                    <td>
                      <span className="assignment-count">
                        {member.tasks}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-member-button"
                        title="Remove member"
                        onClick={() =>
                          dispatch(deleteMember(member.id))
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-team">
                      <Users size={34} />

                      <h3>No team members found</h3>

                      <p>
                        Try changing your search or role filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={() => setShowModal(false)}
        >
          <div
            className="team-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add Team Member</h2>

                <p>
                  Add a new member to your workspace.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>

                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role: event.target.value,
                      })
                    }
                  >
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>UI/UX Designer</option>
                    <option>QA Engineer</option>
                    <option>Project Coordinator</option>
                    <option>Product Manager</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <select
                    value={form.department}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        department: event.target.value,
                      })
                    }
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Management</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Away</option>
                  <option>Offline</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  <Plus size={17} />
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;