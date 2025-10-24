import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>Showcase of our featured projects and work</p>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="icon">
            <svg
              enableBackground="new 0 0 512 512"
              height="100px"
              width="100px"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M316.01,199.02L256.134,14.817L196.239,199.02H1.134l158.102,113.324L98.53,496.487l157.604-114.232l157.585,114.232l-60.687-184.143L511.134,199.02H316.01z"
                fill="#f6b352"
              />
            </svg>
          </div>
          <div className="title">Our Portfolio</div>
          <div className="portfolio-content">
            <p>
              Discover our collection of successful projects and innovative solutions.
              Each project demonstrates our expertise in modern web technologies and
              module federation capabilities.
            </p>
            <div className="portfolio-grid">
              <div className="portfolio-item">
                <h4>Module Federation Dashboard</h4>
                <p>A comprehensive dashboard showcasing micro-frontend architecture</p>
              </div>
              <div className="portfolio-item">
                <h4>React Component Library</h4>
                <p>Reusable component system with TypeScript support</p>
              </div>
              <div className="portfolio-item">
                <h4>E-commerce Platform</h4>
                <p>Scalable e-commerce solution with federated modules</p>
              </div>
              <div className="portfolio-item">
                <h4>Real-time Collaboration Tool</h4>
                <p>Collaborative workspace with shared state management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
