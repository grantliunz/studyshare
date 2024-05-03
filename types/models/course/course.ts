export type Course = {
  id: string;
  name: string;
  code: string;
  assessments: string[];
  createdAt: Date;
};

export type PostCourse = {
  name: string;
  code: string;
  assessments?: { Name: string }[];
};
