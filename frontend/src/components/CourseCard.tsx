import style from "./CourseCard.module.css";

interface CourseCardProps {
  courseName: string,
  courseCode: string,
}

const CourseCard: React.FC<CourseCardProps> = ({ courseName, courseCode }) => {
  return (
    <div className={style.courseCard}>
      <p className={style.courseCode}>{courseCode}</p>
      <p className={style.courseName}>{courseName}</p>
    </div>
  );
}

export default CourseCard;


