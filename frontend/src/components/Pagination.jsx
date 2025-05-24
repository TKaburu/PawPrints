import React from "react";

const Pagination = ({ next, previous, onPageChange }) => {
  return (
    <div className='pagination-controls'>
      {previous && (
        <button onClick={() => onPageChange(previous)}>Previous</button>
      )}
      {next && <button onClick={() => onPageChange(next)}>Next</button>}
    </div>
  );
};

export default Pagination;
