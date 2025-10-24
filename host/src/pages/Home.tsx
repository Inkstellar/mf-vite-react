import React from 'react';
import Counter from '../components/Counter';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Home Page</h1>
        <p>Welcome to the host application home page</p>
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
                fill="#37404D"
              />
            </svg>
          </div>
          <div className="title">Host Home</div>
          <p>This is the main dashboard of the host application.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
