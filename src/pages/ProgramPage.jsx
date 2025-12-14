import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';

function ProgramPage() {
    const { users } = useUsers();
    
  return (
    <div className="relative p-6">
        <Link to="/" className="bg-gray-800 text-xl rounded-md hover:text-gray-300 hover:bg-gray-700">⬅️</Link>
        <h1 className="text-2xl font-bold mb-6 w-full text-center">All Exercises</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
            {users.map((user) => (
                <div key={user.id} className="mb-8">
                    {Object.entries(user.program).map(([day, exercises]) => (
                        exercises.length > 0 && (
                        <div key={day} className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Day {day}</h3>
                            <ul className="list-disc pl-6">
                                {exercises.map((exercise, index) => (
                                <li key={index} className="mb-2">
                                    {exercise.name}
                                    {exercise.alternatives && (
                                    <div className="text-sm text-gray-400 ml-4">
                                        Alternatives: {exercise.alternatives.join(', ')}
                                    </div>
                                    )}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )))}
                </div>
            ))}
        </div>
    </div>
  );
}

export default ProgramPage; 