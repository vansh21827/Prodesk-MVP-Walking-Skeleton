"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Search,
  Users,
  UserCheck,
  Clock3,
  ClipboardList,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

import {
  addMember,
  deleteMember,
  setRoleFilter,
  setTeamSearch,
  updateMemberStatus,
} from "../../store/teamSlice";

import "./Team.css";

function TeamContent() {
  const dispatch = useDispatch();

  const members = useSelector(
    (state) => state.team?.members || []
  );

  const search = useSelector(
    (state) => state.team?.search || ""
  );

  const roleFilter = useSelector(
    (state) => state.team?.roleFilter || "All"
  );

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    assignments: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const awayMembers = members.filter(
    (member) => member.status === "Away"
  ).length;

  const totalAssignments = members.reduce(
    (total, member) =>
      total + (Number(member.assignments) || 0),
    0
  );

  /*
  |--------------------------------------------------------------------------
  | Role Options
  |--------------------------------------------------------------------------
  */

  const roles = useMemo(() => {
    const uniqueRoles = [
      ...new Set(
        members
          .map((member) => member.role)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueRoles];
  }, [members]);

  /*
  |--------------------------------------------------------------------------
  | Filtered Members
  |--------------------------------------------------------------------------
  */

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        member.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.role
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.department
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        roleFilter === "All" ||
        member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Add Member
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    dispatch(
      addMember({
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        status: form.status,
        assignments: Number(form.assignments) || 0,
      })
    );

    setForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      department: "Development",
      status: "Active",
      assignments: 0,
    });

    setShowModal(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Member
  |--------------------------------------------------------------------------
  */

  const handleDelete = (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the team?`
    );

    if (!confirmed) {
      return;
    }

    dispatch(deleteMember(member.id));
  };

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = (member, event) => {
    dispatch(
      updateMemberStatus({
        id: member.id,
        status: event.target.value,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Modal
  |--------------------------------------------------------------------------
  */

  const closeModal = () => {
    setShowModal(false);

    setForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      department: "Development",
      status: "Active",
      assignments: 0,
    });
  };

  return (
    <div className="team-page">
      {/* HEADER */}

      <div className="team-header">
        <div>
          <p className="team-eyebrow">
            WORKSPACE
          </p>

          <h1>Team</h1>

          <p>
            Manage team members, roles, assignments,
            and availability.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={17} />
          Add Member
        </button>
      </div>

      {/* SUMMARY */}

      <section className="team-summary">
        <div className="team-summary-card">
          <div className="team-summary-icon purple">
            <Users size={20} />
          </div>

          <div>
            <span>Total Members</span>
            <strong>{totalMembers}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon green">
            <UserCheck size={20} />
          </div>

          <div>
            <span>Active Members</span>
            <strong>{activeMembers}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon orange">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Away Members</span>
            <strong>{awayMembers}</strong>
          </div>
        </div>

        <div className="team-summary-card">
          <div className="team-summary-icon blue">
            <ClipboardList size={20} />
          </div>

          <div>
            <span>Assignments</span>
            <strong>{totalAssignments}</strong>
          </div>
        </div>
      </section>

      {/* TEAM PANEL */}

      <section className="team-panel">
        <div className="team-toolbar">
          <div className="team-search">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                dispatch(
                  setTeamSearch(event.target.value)
                )
              }
              placeholder="Search team members..."
              aria-label="Search team members"
            />
          </div>

          <select
            className="role-filter"
            value={roleFilter}
            onChange={(event) =>
              dispatch(
                setRoleFilter(event.target.value)
              )
            }
            aria-label="Filter by role"
          >
            {roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role === "All"
                  ? "All Roles"
                  : role}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}

        <div className="team-table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Assignments</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const statusClass =
                  String(member.status || "")
                    .toLowerCase();

                return (
                  <tr key={member.id}>
                    {/* MEMBER */}

                    <td>
                      <div className="member-cell">
                        <div className="member-avatar">
                          {initials}
                        </div>

                        <div>
                          <strong>
                            {member.name}
                          </strong>

                          <span>
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}

                    <td>
                      <div className="role-cell">
                        <strong>
                          {member.role}
                        </strong>

                        <span>
                          Team member
                        </span>
                      </div>
                    </td>

                    {/* DEPARTMENT */}

                    <td>{member.department}</td>

                    {/* STATUS */}

                    <td>
                      <select
                        value={member.status}
                        onChange={(event) =>
                          handleStatusChange(
                            member,
                            event
                          )
                        }
                        className={`member-status ${statusClass}`}
                        aria-label={`Change status for ${member.name}`}
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Away">
                          Away
                        </option>

                        <option value="Offline">
                          Offline
                        </option>
                      </select>
                    </td>

                    {/* ASSIGNMENTS */}

                    <td>
                      <span className="assignment-count">
                        {member.assignments}
                      </span>
                    </td>

                    {/* JOINED */}

                    <td>
                      {member.joinedDate}
                    </td>

                    {/* DELETE */}

                    <td>
                      <button
                        type="button"
                        className="delete-member-button"
                        onClick={() =>
                          handleDelete(member)
                        }
                        aria-label={`Delete ${member.name}`}
                        title={`Remove ${member.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* EMPTY STATE */}

          {filteredMembers.length === 0 && (
            <div className="empty-team">
              <Users size={36} />

              <h3>No team members found</h3>

              <p>
                Try changing your search or role
                filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ADD MEMBER MODAL */}

      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="team-modal">
            <div className="modal-header">
              <div>
                <h2>Add Team Member</h2>

                <p>
                  Add a new member to your
                  workspace.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}

              <div className="form-group">
                <label htmlFor="member-name">
                  Full Name
                </label>

                <input
                  id="member-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label htmlFor="member-email">
                  Email Address
                </label>

                <input
                  id="member-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  required
                />
              </div>

              {/* ROLE + DEPARTMENT */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="member-role">
                    Role
                  </label>

                  <select
                    id="member-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>

                    <option value="Backend Developer">
                      Backend Developer
                    </option>

                    <option value="Full Stack Developer">
                      Full Stack Developer
                    </option>

                    <option value="UI/UX Designer">
                      UI/UX Designer
                    </option>

                    <option value="QA Engineer">
                      QA Engineer
                    </option>

                    <option value="Project Manager">
                      Project Manager
                    </option>

                    <option value="Product Manager">
                      Product Manager
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="member-department">
                    Department
                  </label>

                  <select
                    id="member-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  >
                    <option value="Development">
                      Development
                    </option>

                    <option value="Design">
                      Design
                    </option>

                    <option value="Testing">
                      Testing
                    </option>

                    <option value="Management">
                      Management
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Operations">
                      Operations
                    </option>
                  </select>
                </div>
              </div>

              {/* STATUS + ASSIGNMENTS */}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="member-status">
                    Status
                  </label>

                  <select
                    id="member-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Away">
                      Away
                    </option>

                    <option value="Offline">
                      Offline
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="member-assignments">
                    Assignments
                  </label>

                  <input
                    id="member-assignments"
                    name="assignments"
                    type="number"
                    min="0"
                    value={form.assignments}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
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
}

export default function TeamPage() {
  return (
    <DashboardLayout>
      <TeamContent />
    </DashboardLayout>
  );
}