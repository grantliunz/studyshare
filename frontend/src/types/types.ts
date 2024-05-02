export interface University {
  id: string;
  name: string;
  image: string;
  courses: string[];
  createdAt: Date;
}

export interface PostUniversity {
  name: string;
  courses?: { Name: string }[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  assessments: string[];
  createdAt: Date;
}

export interface PostCourse {
  name: string;
  code: string;
  assessments?: { Name: string }[];
}
