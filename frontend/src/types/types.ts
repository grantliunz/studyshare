export interface University {
  id: string;
  name: string;
  image: string;
  courses: string[];
  createdAt: Date;
}

export interface PostUniversity {
  Name: string;
  Courses?: { Name: string }[];
}
