import { useState } from 'react';
import { useUsers } from '../context/UserContext';
import UserCard from '../components/UserCard';
import { useNavigate } from 'react-router-dom';
import CalendarModal from '../components/modal/calendar/CalendarModal';
import { Loader } from '../components/common/Loader';
import { StartStopTraining } from '../components/StartStopTraining';

function HomePage() {
  const navigate = useNavigate();
  const { users, loading } = useUsers();
  const [column, setColumn] = useState('flex-col');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (loading) {
    return (
      <div className='w-full min-h-screen flex flex-col items-center justify-center gap-4'>
        <Loader size={100} color='green'/>
        <h1 className='text-white text-2xl font-bold'>Loading...</h1>
      </div>
  )}
  
  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  }

  const openExercises = (e) => {
    navigate('/exercises');
  }

  const openCalendar = async () => {
    setIsCalendarOpen(true);
  }

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  }

  return (
    <div className='relative w-full'>
      <StartStopTraining />
      <div className='flex absolute top-3 right-3 items-center gap-2 leading-none'>
        <button onClick={openCalendar}>📅</button>
        <button onClick={openExercises}>📝</button>
        <button onClick={handleReverse} className='sm:hidden block'>🔃</button>
      </div>
      <div className={`flex w-full ${column} md:flex-row`}>
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} index={index}/>
        ))}
      </div>
      <CalendarModal isOpen={isCalendarOpen} onClose={closeCalendar}/>
    </div>
  );
}

export default HomePage; 