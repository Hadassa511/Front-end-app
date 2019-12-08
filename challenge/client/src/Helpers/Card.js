import React from 'react';

const Card = ({ name, value }) => {
  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">{name}</p>
        <h5 className="card-title">{value}</h5>
      </div>
    </div>
  );
};

export default Card;
