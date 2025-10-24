import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>About Page</h1>
        <p>Learn more about our application</p>
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
                d="M285.928,113.067c62.492,0,113.327,50.827,113.327,113.327c0,0.344-0.041,0.705-0.066,1.049c-0.049,0.836-0.107,1.672-0.123,2.525l-0.426,17.133l17.159,0.065c41.53,0.115,75.313,34.005,75.313,75.535c0,41.415-33.718,75.305-75.157,75.518l-3.664,0.016H104.977c-46.244-0.049-83.872-37.693-83.872-83.929c0-35.825,22.806-67.714,56.737-79.356l9.444-3.229l1.664-9.838c4.115-24.282,24.97-41.907,49.588-41.907c7.846,0,15.428,1.82,22.536,5.394l15.306,7.689l7.386-15.444C202.531,138.398,242.635,113.067,285.928,113.067"
                fill="#37404D"
              />
            </svg>
          </div>
          <div className="title">About Our Platform</div>
          <div className="about-content">
            <p>
              This is a modern web application built with React, TypeScript, and Vite.
              It demonstrates module federation capabilities where multiple applications
              can share components and routes seamlessly.
            </p>
            <div className="features-list">
              <h3>Key Features:</h3>
              <ul>
                <li>Module Federation with Vite</li>
                <li>React Router for navigation</li>
                <li>TypeScript for type safety</li>
                <li>Shared component architecture</li>
                <li>Micro-frontend capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
