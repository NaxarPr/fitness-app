import { useState } from 'react';
import { useUsers } from '../context/UserContext';
import UserCard from '../components/UserCard';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const { users, loading } = useUsers();
  const [column, setColumn] = useState('flex-col');
  
  if (loading) {
    return <div className='w-full flex items-center justify-center'>Loading...</div>;
  }
  
  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    navigate('/exercises');
  }
  
  return (
    <div className='relative w-full'>
      <div className='flex absolute top-2 right-2 items-center gap-2'>
        <button onClick={handleReverse} onContextMenu={handleContextMenu}>🔃</button>
      </div>
      <div className={`flex w-full ${column} md:flex-row`}>
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} index={index}/>
        ))}
      </div>
    </div>
  );
}

export default HomePage; 