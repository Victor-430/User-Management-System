let usersData = [];

export const users = async () => {
  try {
    console.log("fetching users ...");
    showMessage("Loading users ...", "info");
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Http error! status: ${res.status} `);
    }
    const data = await res.json();
    console.log(data);
    console.log(`user fetched successfully`);

    usersData = data;
    return data;
  } catch (err) {
    console.log(`Error fetching users`, err);
    return [];
  }
};

export const displayUsers = (users) => {
  const usersList = document.getElementById("usersList");
  if (!usersList) return;

  if (!users || users.length === 0) {
    usersList.innerHTML = "<p>No users found.</p>";
    return;
  }

  // sort users
  const sortedUsers = [...users].sort((a,b) => {
    const aTime = new Date(a.updatedAt || a.createdAt)
    const bTime = new Date(b.updatedAt || b.createdAt)
    return bTime - aTime
  })

  let html = `
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  sortedUsers.forEach((user) => {
const lastUpdated = new Date(user.updatedAt || user.createdAt).toLocaleString()
const isRecentlyModified = new Date() - new Date(user.updatedAt || user.createdAt) < 3000
const rowClass = isRecentlyModified ? 'class="recently-modified"' : ''; 

    html += `
      <tr ${rowClass} >
        <td>${user._id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role || "N/A"}</td>
        <td>${lastUpdated}</td>
        <td>
         <button onclick="selectUserForUpdate('${
            user._id
         }')" class="btn-small">Edit</button>
          <button onclick="selectUserForDelete('${
             user._id
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

// Select user for update (populate form)
window.selectUserForUpdate = (userId) => {
  const user = usersData.find((u) => (u._id) === userId);
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


// Select user for delete
window.selectUserForDelete =async(userId) => {

  // Find user name for confirmation
    const user = usersData.find((u) => ( u._id) === userId);
    const userName = user ? user.name : "Unknown User";


    if (user) {
     showMessage(`Selected user: ${user.name} for deletion`, "warning");
    // Confirmation dialog
    if (!confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }
    
    
  }

try{
    showMessage("Deleting user...", "info");

    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("User deleted successfully:", result);

    showMessage(`User ${userName} deleted successfully!`, "success");

    // Reset dropdown and refresh list
    document.getElementById("allUsers").click();

    return result;
  } catch (error) {
    console.error(`Error deleting user`, error);
    showMessage(`Error deleting user: ${error.message}`, "error");
  }
};

export const updateUserDropdown = () => {
  const dropdown = document.getElementById("userSelect");
  if (!dropdown) return;

  // sort users for dropdown
  const sortedUsers = [...usersData].sort((a,b) => {
    const aTime = new Date(a.updatedAt || a.createdAt)
    const bTime = new Date(b.updatedAt || b.createdAt)
    return bTime - aTime
  })


  // Clear existing options
  dropdown.innerHTML = '<option value="">Select a user...</option>';

  // Add users to dropdown
  sortedUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id || user._id; // Handle both id formats
    option.textContent = `${user.name} (${user.email})`;
    dropdown.appendChild(option);
  });
};

const showMessage = (message, type = "error") => {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.style.display = "block";
  messageDiv.className = `message ${type}`;

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// check for existing email and name
const isNameorEmailExist =(name = 'string', email = 'string', excludeUserId = null) => {
  try{
    const findName = usersData.some(user => user.name === name && (!excludeUserId || user._id !== excludeUserId ))
    const findEmail = usersData.some(user => user.email === email && (!excludeUserId || !user._id !== excludeUserId) )
    console.log(`findName: `, findName, findEmail)
    if(findName && findName) {
      return{
        exists:true, message:"Both name and email alrady exists"
      }
    }else if (findName){
return{
  exists:true, message:"This name already exists"
}
    }else if (findEmail) {
return{
  exists:true, message:"This email already exists"
}
    }
    return {exists:false, message: ""}

  }catch(err) {
    console.error('Email or Name already exists')
    throw err
  }
}


document.getElementById("allUsers").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const data = await users();
    console.log(`user fetched successfully`);
    displayUsers(data);
    updateUserDropdown();
    showMessage(`Successfully loaded ${data.length} users`, "success");
  } catch (err) {
    console.log(`Error fetching users`, err);
    displayUsers([]);
    showMessage(`Error loading users`, "error");
  }
});

const clearForm = () => {
  document.getElementById("name").value = "";
  document.getElementById("password").value = "";
  document.getElementById("email").value = "";
  document.getElementById("role").value = "";
};

document.getElementById("createUser").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const formData = {
      name: document.getElementById("name").value.trim(),
      password: document.getElementById("password").value.trim(),
      email: document.getElementById("email").value.trim(),
      role: document.getElementById("role").value.trim(),
    };

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      showMessage(
        "Please fill in all required fields (name, email, password,role)",
        "error"
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    if (!isValidPassword(formData.password)) {
      showMessage(
        "Password must be at least 8 characters with uppercase, lowercase, and number",
        "error"
      );
      return;
    }

    const validation = isNameorEmailExist(formData.name, formData.email)
     if ( validation.exists ){
            showMessage(validation.message , "error")
            return

     }


    showMessage("Creating user...", "info");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("User created successfully: ", result);

    clearForm();
    showMessage("User created successfully!", "success");

    // Refresh user list
    document.getElementById("allUsers").click();

    return result;
  } catch (error) {
    console.error("Error creating user", error);
    showMessage(`Error creating user: ${error.message}`, "error");
  }
});

document.getElementById("deleteUser").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const dropdown = document.getElementById("userSelect");
    const userId = dropdown ? dropdown.value : null;

    if (!userId) {
      showMessage("Please select a user to delete", "error");
      return;
    }

    // Find user name for confirmation
    const user = usersData.find((u) => ( u._id) === userId);
    const userName = user ? user.name : "Unknown User";

    // Confirmation dialog
    if (!confirm(`Are you sure you want to delete user: ${userName}?`)) {
      return;
    }

    showMessage("Deleting user...", "info");

    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("User deleted successfully:", result);

    showMessage(`User ${userName} deleted successfully!`, "success");

    // Reset dropdown and refresh list
    dropdown.value = "";
    document.getElementById("allUsers").click();

    return result;
  } catch (error) {
    console.error(`Error deleting user`, error);
    showMessage(`Error deleting user: ${error.message}`, "error");
  }
});

document.getElementById("updateUser").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const dropdown = document.getElementById("userSelect");
    const userId = dropdown ? dropdown.value : null;

    if (!userId) {
      showMessage("Please select a user to update", "error");
      return;
    }

    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      role: document.getElementById("role").value.trim(),
    };

    // Only include password if it's provided
    const password = document.getElementById("password").value.trim();
    if (password) {
      if (!isValidPassword(password)) {
        showMessage(
          "Password must be at least 8 characters with uppercase, lowercase, and number",
          "error"
        );
        return;
      }
      formData.password = password;
    }

    // Validation
    if (!formData.name || !formData.email ||!formData.role) {
      showMessage("Name, role and email are required", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    const validation = isNameorEmailExist(formData.name, formData.email, userId)
     if ( validation.exists ){
            showMessage(validation.message , "error")
            return

     }

    showMessage("Updating user...", "info");

    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error(`Http error! status: ${res.status} `);
    }
    const result = await res.json();
    console.log("User updated successfully:", result);

    clearForm();
    dropdown.value = "";
    showMessage("User updated successfully!", "success");

    // Refresh user list
    document.getElementById("allUsers").click();

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    showMessage(`Error updating user: ${error.message}`, "error");
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Auto-load users when page loads
  setTimeout(() => {
    document.getElementById("allUsers").click();
  }, 500);
});
