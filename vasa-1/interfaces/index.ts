// interfaces/index.ts

export type Status = "active" | "paused" | "prospect" | "ex-client";

export type ProjectStatus = "Not started" | "In progress" | "Done";
export type ProjectPriority = "Low" | "Medium" | "High";

export interface InboxItem {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export interface Project  {
  id: string;
  name: string;
  ownerId: string; // 🔑 store client id instead of name
  status: ProjectStatus;
  dueDate: string;
  priority: string;
};

export interface ProjectModalProps {
  formData: Project;
  setFormData: React.Dispatch<React.SetStateAction<Project>>;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
}


export type Client = {
  id: string;
  name: string;
  email: string;
  status: Status;
  preferences: {
    notifications: boolean;
    theme: string;
  };
  billing: {
    plan: string;
  };
  projects: Project[];
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  role: "VA" | "Team Lead" | "Client";
  phone: string;
  timeZone: string;
  businessType: string;
  services: string[];
  profileImage: string;
}