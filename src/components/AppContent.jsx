import { useState } from 'react';
import { useUsers } from '../context/UserContext';
import UserCard from './UserCard';

function AppContent() {
  const { users, loading } = useUsers();
  const [column, setColumn] = useState('flex-col');

  if (loading) {
    return <div className='w-full flex items-center justify-center'>Loading...</div>;
  }
  
  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  }
  
  return (
    <div className='relative w-full'>
      <button onClick={handleReverse} className='absolute top-2 right-2'>🔄</button>
      <div className={`flex w-full ${column} md:flex-row`}>
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} index={index}/>
        ))}
      </div>
    </div>
  );
}

export default AppContent; 