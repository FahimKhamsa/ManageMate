export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  status: "pending" | "approved";
  organizer: {
    name: string;
    email: string;
  };
}

export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: number | null;
  role?: "admin" | "organizer" | "attendee" | null;
}
