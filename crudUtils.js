import { fetchAllUsers } from "./models/userModel";

export const displayUsers = (users) => {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

  if (!users || users.length === 0) {
    usersList.innerHTML = "<p>No users found.</p>";
    return;
  }

  let html = `
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach((user) => {
    html += `
      <tr>
        <td>${user.id || user._id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role || "N/A"}</td>
        <td>
          <button onclick=selectUserForUpdate('${
            user.id || user._id
          }')" class="btn-small">Edit</button>
          <button onclick="selectUserForDelete('${
            user.id || user._id
          }')" class="btn-small btn-danger">Delete</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  usersList.innerHTML = html;
};

export const updateUserDropdown = () => {
  const dropdown = document.getElementById("userSelect");
  if (!dropdown) return;

  // Clear existing options
  dropdown.innerHTML = '<option value="">Select a user...</option>';

  // Add users to dropdown
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id || user._id; // Handle both id formats
    option.textContent = `${user.name} (${user.email})`;
    dropdown.appendChild(option);
  });
};

export const selectUserForUpdate = (userId) => {
  const user = fetchAllUsers.find((u) => (u.id || u._id) === userId);
  if (user) {
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("role").value = user.role || "";
    document.getElementById("password").value = ""; // Don't populate password

    // Set the dropdown to this user
    const dropdown = document.getElementById("userSelect");
    if (dropdown) dropdown.value = userId;

    showMessage(`Selected user: ${user.name} for editing`, "success");
  }
};

export const selectUserForDelete = (userId) => {
  const dropdown = document.getElementById("userSelect");
  if (dropdown) dropdown.value = userId;

  const user = users.find((u) => (u.id || u._id) === userId);
  if (user) {
    showMessage(`Selected user: ${user.name} for deletion`, "warning");
  }
};
