"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../utils/firebase";



// Blog image with graceful fallback when there is no image or the URL fails to load
function BlogImage({ src, alt, className, fallbackClassName, lazy = true }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={fallbackClassName}>
        <span>K</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      onError={() => setError(true)}
    />
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  useEffect(() => {
    if (!db) return;
    const fetchBlogs = async () => {
    try {
      const q = query(collection(db, "blogs"),orderBy("createdAt", "desc"));
      const snapshot =await getDocs(q);
      const blogList =snapshot.docs.map(doc => ({id: doc.id,...doc.data()}));
      setBlogs(blogList);
    } 
    catch (error) {
      console.error(error);
    }
  };
    fetchBlogs();
  }, []);

  if (selectedBlog) {
    return (
      <div className="blog-page">
        
        <button className="back-btn" onClick={() => setSelectedBlog(null)}>
          &larr; Back to Blogs
        </button>
        <article className="blog-full">
          <BlogImage
            src={selectedBlog.imageUrl}
            alt={selectedBlog.title}
            className="blog-cover-image"
            fallbackClassName="blog-cover-fallback"
            lazy={false}
          />
          <div className="blog-meta-header">
            <span className="blog-category-tag">{selectedBlog.category || "Academy Blog"}</span>
            <span className="blog-date">{selectedBlog.createdAt?.toDate().toLocaleDateString()}</span>
          </div>
          <h1 className="blog-title-full">{selectedBlog.title}</h1>
          <div className="blog-author-info">
            <div className="author-avatar">K</div>
            <div className="author-details">
              <strong>KAWS Academy</strong>
              <span>Compliance Expert</span>
            </div>
          </div>
          <div className="blog-content">
            {selectedBlog.content?.split("\n\n").filter(Boolean).map((paragraph, index) => (<p key={index}>{paragraph}</p>))}
          </div>
        </article>
      </div>
    );
  }

  const filteredBlogs = blogs.filter(blog => {
  const search = searchTerm.trim().toLowerCase();

const matchesSearch =
  blog.title?.toLowerCase().includes(search) ||
  blog.content?.toLowerCase().includes(search) ||
  blog.category?.toLowerCase().includes(search);

  const matchesCategory =
    !selectedCategory || blog.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="page-title">Latest <span className="title-accent">Insights</span></h1>
          <p className="blog-subtitle">Expert perspectives on Financial Crime Compliance, Risk Management, and Regulatory updates.</p>
        </div>
      </div>
     <div className="search-container">
      <input 
  type="text"
  placeholder="Search blogs..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="search-input"
/>
</div>
<div className="category-filters">
  <button
  className={selectedCategory === "" ? "active-category" : ""}
  onClick={() => setSelectedCategory("")}
>
  All
</button>

  <button
  className={selectedCategory === "Compliance" ? "active-category" : ""}
  onClick={() => setSelectedCategory("Compliance")}
>
  Compliance
</button>

<button
  className={selectedCategory === "AML" ? "active-category" : ""}
  onClick={() => setSelectedCategory("AML")}
>
  AML
</button>

<button
  className={selectedCategory === "KYC" ? "active-category" : ""}
  onClick={() => setSelectedCategory("KYC")}
>
  KYC
</button>

<button
  className={selectedCategory === "Risk Management" ? "active-category" : ""}
  onClick={() => setSelectedCategory("Risk Management")}
>
  Risk Management
</button>
<button
  className={selectedCategory === "Sanctions" ? "active-category" : ""}
  onClick={() => setSelectedCategory("Sanctions")}
>
  Sanctions
</button>
</div>


{blogs.length === 0 ? (
  <div
    style={{
      textAlign: "center",
      padding: "50px",
      color: "#666"
    }}
  >
    No blogs have been published yet.
  </div>
) : filteredBlogs.length === 0 ? (
  <div
    style={{
      textAlign: "center",
      padding: "40px",
      color: "#666"
    }}
  >
    No blogs found.
  </div>
) : null}
      
      <div className="blog-list">
        {filteredBlogs.map((blog) => (
            <div key={blog.id} className="blog-card" onClick={() => setSelectedBlog(blog)}>
              <div className="blog-card-content">
                <BlogImage
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="blog-thumbnail"
                  fallbackClassName="blog-thumb-fallback"
                />
              <div className="blog-card-header">
                <span className="blog-category-tag">{blog.category || "Academy Blog"}</span>
              </div>
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-desc">
  {blog.content?.length > 120
    ? `${blog.content.slice(0, 120)}...`
    : blog.content}
</p>
              
              <div className="blog-card-footer">
                <div className="blog-author-small">
                  <div className="author-avatar-small">K</div>
                  <span>KAWS Academy</span>
                </div>
                <span className="blog-date-small">{blog.createdAt?.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
