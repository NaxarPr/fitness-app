import { Link } from 'react-router-dom';
import EXERCISES from '../const/exercises';

function ProgramPage() {
  return (
    <div className="relative p-6">
        <Link to="/" className="bg-gray-800 text-xl rounded-md hover:text-gray-300 hover:bg-gray-700">⬅️</Link>
        <h1 className="text-2xl font-bold mb-6 w-full text-center">All Exercises</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
            {EXERCISES.map((program, programIndex) => (
                <div key={programIndex} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Program {programIndex + 1}</h2>
            {Object.entries(program).map(([day, exercises]) => (
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
            ))}
            </div>
        ))}
        </div>
    </div>
  );
}

export default ProgramPage; 