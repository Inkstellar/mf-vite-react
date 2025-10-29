import React from 'react';
import Counter from '../components/Counter';
import { Book } from '@mui/icons-material';

const Curriculum: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Curriculum </h1>
        <p>Welcome to the host application Curriculum</p>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="icon">
           <Book />
          </div>
          <div className="title">Curriculum</div>
          <p>This is the Curriculum page of the host application.</p>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
