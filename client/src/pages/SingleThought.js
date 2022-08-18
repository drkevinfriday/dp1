import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';

const SingleThought = props => {
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });
  console.log(data)
  
  const thought = data?.thought || {};
  console.log(thought)
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
    <div className="card mb-3">
      <p className="card-header">
        <span style={{ fontWeight: 700 }} className="text-light">
          {thought.username}
        </span>{' '}
        thought on {thought.createdAt}
      </p>
      <div className="card-body">
        <p>{thought.thoughtText}</p>
      </div>
    </div>
  </div>
  );
};

export default SingleThought;