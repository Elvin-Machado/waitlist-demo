"use client";

import React, { useState, useEffect, useMemo } from "react";
import coursesData from "../data/CoursesData";
import Link from "next/link";

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    if (target === 0) {
      setCount(0);
      return;
    }

    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);

  const stats = useMemo(() => {
    const total = coursesData.reduce(
      (acc, domain) => acc + domain.courses.length,
      0
    );

    const beginners = coursesData.reduce(
      (acc, domain) =>
        acc + domain.courses.filter(
          (course) => course.level === "Beginner"
        ).length,
      0
    );

    return {
      totalDomains: coursesData.length,
      totalCourses: total,
      totalBeginner: beginners,
    };
  }, []);

  const domainsCount = useCountUp(stats.totalDomains);
  const coursesCount = useCountUp(stats.totalCourses);
  const beginnerCount = useCountUp(stats.totalBeginner);

  // Search across domains, course titles, codes and levels
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return coursesData;

    return coursesData
      .map((domain) => ({
        ...domain,
        courses: domain.courses.filter(
          (course) =>
            domain.domain.toLowerCase().includes(term) ||
            course.title.toLowerCase().includes(term) ||
            course.code.toLowerCase().includes(term) ||
            course.level.toLowerCase().includes(term)
        ),
      }))
      .filter((domain) => domain.courses.length > 0);
  }, [searchTerm]);

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain.domain);
    setSearchTerm("");

    setTimeout(() => {
      document
        .getElementById("courses-display")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClearFilter = () => {
    setSelectedDomain(null);
    setSearchTerm("");
  };

  return (
    <div className="courses-page">

      {/* Hero */}
      <div className="courses-hero">
        <h1 className="page-title">
          Explore Our <span className="title-accent">Programs</span>
        </h1>

        <p className="courses-subtitle">
          Master the complexities of Financial Crime Compliance with our
          industry-leading curriculum.
        </p>
      </div>

      {/* Stats */}
      {!selectedDomain && !searchTerm && (
        <div className="stats-container">
          <div className="stat-card">
            <h2>{domainsCount}</h2>
            <p>Specializations</p>
          </div>

          <div className="stat-card">
            <h2>{coursesCount}</h2>
            <p>Total Modules</p>
          </div>

          <div className="stat-card">
            <h2>{beginnerCount}</h2>
            <p>Foundations</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, domain, code, or level (Beginner/Advanced)..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedDomain(null);
          }}
        />

        {(selectedDomain || searchTerm) && (
          <button
            className="clear-filter-btn"
            onClick={handleClearFilter}
          >
            ← Back to All Specializations
          </button>
        )}
      </div>

      {/* Specialization Cards */}
      {!selectedDomain && !searchTerm && (
        <div className="specialization-grid">
          {coursesData.map((domain, index) => (
            <div
              key={index}
              className="spec-card"
              onClick={() => handleDomainClick(domain)}
            >
              <div className="spec-icon">
                {index + 1 < 10
                  ? `0${index + 1}`
                  : index + 1}
              </div>

              <h3>{domain.domain}</h3>

              <p>{domain.courses.length} Modules</p>

              <div className="view-link">
                View Courses →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Display */}
      <main id="courses-display">

        {/* Search Results */}
        {searchTerm && (
          <>
            {filteredData.map((domain, index) => (
              <div key={index} className="domain-section">
                <h2 className="domain-title">
                  {domain.domain}
                </h2>

                <div className="courses-grid">
                  {domain.courses.map((course, i) => (
                    <CourseCard
                      key={i}
                      course={course}
                    />
                  ))}
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <h1 className="no-data">
                No results found for "{searchTerm}"
              </h1>
            )}
          </>
        )}

        {/* Selected Domain */}
        {selectedDomain && (
          <>
            {coursesData
              .filter(
                (domain) => domain.domain === selectedDomain
              )
              .map((domain, index) => (
                <div
                  key={index}
                  className="domain-section"
                >
                  <h2 className="domain-title">
                    {domain.domain}
                  </h2>

                  <div className="courses-grid">
                    {domain.courses.map((course, i) => (
                      <CourseCard
                        key={i}
                        course={course}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
    </div>
  );
}

// Course Card
function CourseCard({ course }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = course.image ? `/coursethumbnails/${course.image}` : null;

  return (
    <div className="course-card">

      <div className="course-image">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={course.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="course-image-fallback">{course.code}</span>
        )}
      </div>

      <div>
        <div className="course-meta">
          <span
            className={`badge ${course.level.toLowerCase()}`}
          >
            {course.level}
          </span>

          <span className="duration">
            ⏱ {course.duration}
          </span>
        </div>

        <h3 className="course-title">
          {course.title}
        </h3>

        <p className="course-code">
          {course.code}
        </p>
      </div>

      <Link href="/waiting-list">
        <button className="enroll-btn">
          Enroll Now
        </button>
      </Link>

    </div>
  );
}

export default CoursesPage;