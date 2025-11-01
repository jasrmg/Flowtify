// Mock users for testing authentication
export const mockUsers = [
  {
    uid: "admin-001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@flowtify.com",
    password: "admin123", // In production, this would be hashed
    role: "admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    createdAt: new Date("2024-01-15T08:00:00Z"),
    lastLogin: new Date("2025-11-01T09:30:00Z"),
  },
  {
    uid: "resident-001",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@email.com",
    password: "user123", // In production, this would be hashed
    role: "resident",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    createdAt: new Date("2024-02-20T10:15:00Z"),
    lastLogin: new Date("2025-11-01T08:45:00Z"),
  },
];

// Helper function to find user by email
export const findUserByEmail = (email) => {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

// Helper function to validate login
export const validateLogin = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: "User not found" };
  }
  if (user.password !== password) {
    return { success: false, error: "Invalid password" };
  }

  // Update last login
  user.lastLogin = new Date();

  return {
    success: true,
    user: {
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      lastLogin: user.lastLogin,
    },
  };
};

// Helper function to check if email exists (for signup)
export const emailExists = (email) => {
  return mockUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};
