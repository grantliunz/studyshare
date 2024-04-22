export interface University {
  id: string;
  name: string;
  courses: string[]; // Array of course IDs
  image: string;
  createdAt: Date;
}
