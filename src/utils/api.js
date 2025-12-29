const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://walker-cleaners.vercel.app"
    : "http://localhost:3000";

// Services API
export const servicesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/api/services`);
    const data = await res.json();
    return data.services || [];
  },

  create: async (service) => {
    const res = await fetch(`${API_BASE}/api/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    return res.json();
  },

  update: async (service) => {
    const res = await fetch(`${API_BASE}/api/services`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/api/services?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

// Packages API
export const packagesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/api/packages`);
    const data = await res.json();
    return data.packages || [];
  },

  create: async (pkg) => {
    const res = await fetch(`${API_BASE}/api/packages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkg),
    });
    return res.json();
  },

  update: async (pkg) => {
    const res = await fetch(`${API_BASE}/api/packages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkg),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/api/packages?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/api/bookings`);
    const data = await res.json();
    return data.bookings || [];
  },

  find: async (phone, id) => {
    let url = `${API_BASE}/api/bookings?`;
    if (phone) url += `phone=${phone}`;
    if (id) url += `id=${id}`;

    const res = await fetch(url);
    const data = await res.json();
    return data.booking;
  },

  create: async (booking) => {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/api/bookings?id=${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const res = await fetch(`${API_BASE}/api/settings`);
    const data = await res.json();
    return data.settings || {};
  },

  updateHeaderImage: async (headerImage) => {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headerImage }),
    });
    return res.json();
  },
};
