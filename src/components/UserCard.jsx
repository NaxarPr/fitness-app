import React from 'react';
import ExerciseContainer from './exercise/ExerciseContainer';
import UserWeight from './UserWeight';

function UserCard({ user, index }) {
  return (
    <div className="flex-1" key={user.id}>
      <h1 className="text-2xl font-bold text-center mt-4 select-none">
        {user.username} 
      </h1>
      <UserWeight user={user} index={index}/>
      <ExerciseContainer user={user} index={index}/>
    </div>
  );
}

export default UserCard;