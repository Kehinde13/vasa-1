// Dummy Clients
import { Client, User } from "@/interfaces";

// Dummy Clients with Projects
export const dummyClients: Client[] = [
  {
    id: "c1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    status: "active",
    preferences: {
      notifications: true,
      theme: "light",
    },
    billing: {
      plan: "Monthly Retainer - $800",
    },
    projects: [
      {
        id: "p1",
        name: "Cocacola",
        ownerId: "u2",
        status: "In progress",
        dueDate: "2025-02-26",
        priority: "High",
      },
    ],
    documents: [],
  },
  {
    id: "c2",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    status: "prospect",
    preferences: {
        notifications: false,
        theme: "light",
    },
    billing: {
        plan: "Project-based - $1200",
    },
    projects: [
      {
        id: "p2",
        name: "Nike",
        ownerId: "u2",
        status: "Not started",
        dueDate: "2025-04-16",
        priority: "Medium",
      },
      {
        id: "p3",
        name: "Flight Booking App",
        ownerId: "u3",
        status: "Done",
        dueDate: "2025-02-03",
        priority: "Medium",
      },
    ],
    documents: [],
  },
  {
    id: "c3",
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    status: "paused",
    preferences: {
      notifications: true,
      theme: "dark",
    },
    billing: {
      plan: "Hourly - $40/hr",
    },
    projects: [],
    documents: [],
  },
];

// Dummy User
export const dummyUser: User = {
  id: "u1",
  fullName: "Kehinde Balogun",
  email: "kehinde@example.com",
  businessName: "VAsA HQ",
  role: "VA",
  phone: "+234-123-456-789",
  timeZone: "GMT+1",
  businessType: "Virtual Assistance",
  services: ["Client Management", "Task Tracking", "Invoicing"],
  profileImage: "/assets/images/profile-placeholder.png",
};

