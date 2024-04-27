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

export interface Course {
  id: string;
  Name: string;
  Code: string;
  Assessments: string[];
  createdAt: Date;
}

export interface PostCourse {
  Name: string;
  Code: string;
  Assessments?: { Name: string }[];
}
