import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialMembers = [
  {
    id: "member-1",
    name: "Ankit Sharma",
    email: "ankit.sharma@example.com",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    assignments: 6,
    joinedDate: "Jan 12, 2026",
  },
  {
    id: "member-2",
    name: "Riya Kapoor",
    email: "riya.kapoor@example.com",
    role: "UI/UX Designer",
    department: "Design",
    status: "Active",
    assignments: 4,
    joinedDate: "Feb 03, 2026",
  },
  {
    id: "member-3",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    role: "Backend Developer",
    department: "Development",
    status: "Away",
    assignments: 5,
    joinedDate: "Feb 18, 2026",
  },
  {
    id: "member-4",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    role: "Project Manager",
    department: "Management",
    status: "Active",
    assignments: 8,
    joinedDate: "Mar 01, 2026",
  },
  {
    id: "member-5",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    role: "QA Engineer",
    department: "Testing",
    status: "Offline",
    assignments: 3,
    joinedDate: "Mar 14, 2026",
  },
  {
    id: "member-6",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    assignments: 7,
    joinedDate: "Apr 05, 2026",
  },
  {
    id: "member-7",
    name: "Karan Joshi",
    email: "karan.joshi@example.com",
    role: "Backend Developer",
    department: "Development",
    status: "Away",
    assignments: 4,
    joinedDate: "Apr 19, 2026",
  },
  {
    id: "member-8",
    name: "Sneha Agarwal",
    email: "sneha.agarwal@example.com",
    role: "Product Manager",
    department: "Management",
    status: "Active",
    assignments: 6,
    joinedDate: "May 02, 2026",
  },
];

const initialState = {
  members: initialMembers,
  status: "succeeded",
  error: null,
  search: "",
  roleFilter: "All",
};

const teamSlice = createSlice({
  name: "team",

  initialState,

  reducers: {
    addMember: {
      reducer: (state, action) => {
        state.members.push(action.payload);
        state.error = null;
      },

      prepare: (memberData) => ({
        payload: {
          id: nanoid(),
          name: memberData.name.trim(),
          email: memberData.email.trim(),
          role: memberData.role,
          department: memberData.department,
          status: memberData.status || "Active",
          assignments: Number(memberData.assignments) || 0,
          joinedDate:
            memberData.joinedDate ||
            new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
        },
      }),
    },

    updateMemberStatus: (state, action) => {
      const { id, status } = action.payload;

      const member = state.members.find(
        (item) => String(item.id) === String(id)
      );

      if (member) {
        member.status = status;
      }
    },

    updateMember: (state, action) => {
      const { id, ...updates } = action.payload;

      const index = state.members.findIndex(
        (member) => String(member.id) === String(id)
      );

      if (index !== -1) {
        state.members[index] = {
          ...state.members[index],
          ...updates,
        };
      }
    },

    deleteMember: (state, action) => {
      state.members = state.members.filter(
        (member) =>
          String(member.id) !== String(action.payload)
      );
    },

    setTeamSearch: (state, action) => {
      state.search = action.payload;
    },

    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },

    clearTeamSearch: (state) => {
      state.search = "";
      state.roleFilter = "All";
    },

    clearTeam: (state) => {
      state.members = [];
      state.search = "";
      state.roleFilter = "All";
      state.status = "idle";
      state.error = null;
    },

    resetTeam: (state) => {
      state.members = initialMembers;
      state.search = "";
      state.roleFilter = "All";
      state.status = "succeeded";
      state.error = null;
    },
  },
});

export const {
  addMember,
  updateMemberStatus,
  updateMember,
  deleteMember,
  setTeamSearch,
  setRoleFilter,
  clearTeamSearch,
  clearTeam,
  resetTeam,
} = teamSlice.actions;

export default teamSlice.reducer;