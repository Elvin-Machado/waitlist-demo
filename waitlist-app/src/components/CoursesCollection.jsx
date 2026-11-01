"use client";

import Course from "./Course";

export default function Courses({ courses }) {
  return (
    <div id="courses-scroll" className="features-section">
      <div className="section-header">
        
        <h1 className="course-heading">Our Features</h1>
        <p className="section-sub">Everything you need to master financial crime compliance</p>
      </div>

      <div className="coursesCollectionPanel">
        {courses.map((curr, index) => {
          return <Course key={index} content={curr} />;
        })}
      </div>
    </div>
  );
}