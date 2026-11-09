"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiClock, FiSearch, FiBookOpen } from "react-icons/fi";
import coursesData from "../data/CoursesData";
import Footer from "./Footer";

const COURSES = coursesData.flatMap(domain => domain.courses.map(course => ({ ...course, domain: domain.domain })));

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [level, setLevel] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const filtered = useMemo(() => COURSES.filter(course =>
    (!domain || course.domain === domain) &&
    (!level || course.level === level) &&
    `${course.title} ${course.code} ${course.domain} ${course.level}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [search, domain, level]);

  function clearFilters() { setSearch(""); setDomain(""); setLevel(""); setVisibleCount(12); }

  return <><main className="academy-catalog" id="main-content">
    <div className="academy-catalog-hero"><div className="k-container"><span className="k-eyebrow">The KAWS curriculum</span><h1>Find the skills.<br /><span>Build your future.</span></h1><p>Explore {COURSES.length} focused modules across {coursesData.length} learning domains.<br />Programs are coming soon. Find your interests and join the waitlist.</p></div></div>
    <div className="k-container academy-catalog-body">
      <div className="academy-catalog-filters">
        <div className="academy-catalog-search"><label htmlFor="course-search">Search courses</label><div><FiSearch aria-hidden="true" /><input id="course-search" type="search" placeholder="Search by topic, title or course code" value={search} onChange={event => { setSearch(event.target.value); setVisibleCount(12); }} /></div></div>
        <div><label htmlFor="course-domain">Learning domain</label><select id="course-domain" value={domain} onChange={event => { setDomain(event.target.value); setVisibleCount(12); }}><option value="">All domains</option>{coursesData.map(item => <option key={item.domain}>{item.domain}</option>)}</select></div>
        <div><label htmlFor="course-level">Experience level</label><select id="course-level" value={level} onChange={event => { setLevel(event.target.value); setVisibleCount(12); }}><option value="">All levels</option>{["Beginner", "Intermediate", "Advanced"].map(item => <option key={item}>{item}</option>)}</select></div>
      </div>
      <div className="academy-catalog-result"><p role="status">{filtered.length} {filtered.length === 1 ? "module" : "modules"}{domain ? ` in ${domain}` : " to explore"}</p>{(search || domain || level) && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
      {filtered.length ? <div className="academy-course-grid">{filtered.slice(0, visibleCount).map(course => <article className="academy-course-card" key={course.code}><div className="academy-course-top"><FiBookOpen aria-hidden="true" /><span>Coming soon</span></div><p className="academy-course-domain">{course.domain}</p><h2>{course.title}</h2><div className="academy-course-details"><span>{course.level}</span><span><FiClock aria-hidden="true" />{course.duration}</span></div><div className="academy-course-bottom"><span>{course.code}</span><Link href={`/waitlist?interest=${encodeURIComponent(course.domain)}`} aria-label={`Join the waitlist for ${course.title}`}>Join waitlist <FiArrowRight aria-hidden="true" /></Link></div></article>)}</div> : <div className="academy-catalog-empty"><FiSearch aria-hidden="true" /><h2>No matching modules</h2><p>Try a different topic or clear your filters to explore the curriculum.</p><button type="button" className="academy-secondary-btn" onClick={clearFilters}>View all modules</button></div>}
      {visibleCount < filtered.length && <div className="academy-catalog-more"><p>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} modules</p><button type="button" className="academy-secondary-btn" onClick={() => setVisibleCount(count => count + 12)}>Show more modules <FiArrowRight aria-hidden="true" /></button></div>}
    </div>
  </main><Footer /></>;
}