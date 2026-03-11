import { useAppStore } from '../store/appStore';
import UserCard from '../components/UserCard';
import { Loader } from '../components/common/Loader';
import { TopBar } from '../components/TopBar';
import { useShallow } from 'zustand/shallow';

function HomePage() {

  const { users, loading, column } = useAppStore(useShallow((state) => ({
    users: state.users,
    loading: state.loading,
    column: state.column,
  })));

  if (loading) {
    return (
      <div className='w-full min-h-screen flex flex-col items-center justify-center gap-4'>
        <Loader size={100} color='green'/>
        <h1 className='text-white text-2xl font-bold'>Loading...</h1>
      </div>
  )}
  

  return (
    <div className='relative w-full'>
      <TopBar />
      <div className={`flex w-full ${column} md:flex-row`}>
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} index={index}/>
        ))}
      </div>
    </div>
  );
}

export default HomePage; 