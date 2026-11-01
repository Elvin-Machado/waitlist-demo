"use client";

export default function Course({ content }) {
  return (
    <div className="coursesLayout">
      <div className="course-img-wrap">
        <img src={content.img_link} alt={content.title} className="courseImage" />
      </div>
      <div className="courseContent">
        <h2 className="courseTitle">{content.title}</h2>
        <p className="courseDesc">{content.description}</p>
      </div>
      <div className="course-card-glow"></div>
    </div>
  );
}