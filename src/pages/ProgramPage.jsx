import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { editDayForUser } from '../utils/editDayForUser';
import { deleteDayForUser } from '../utils/deleteDayForUser';
import { EditDayProgram } from '../components/program/EditDayProgram';
import { DayProgramList } from '../components/program/DayProgramList';

function ProgramPage() {
    const { users, setUsers } = useUsers();
    const [EditDayUser, setEditDayUser] = useState(false);
    const [dayNumber, setDayNumber] = useState(1);
    const [exercises, setExercises] = useState([]);


    const setInitialState = () => {
        setEditDayUser(false);
        setDayNumber(1);
        setExercises([]);
    }

    const handleSaveClick = async (user) => {
        const normalizedExercises = exercises.map((exercise) => (
            typeof exercise === "string" ? { name: exercise } : exercise
        ));

        if (normalizedExercises.length === 0) {
            await deleteDayForUser({ exercises: normalizedExercises, dayNumber, user });
        } else {
            await editDayForUser({ exercises: normalizedExercises, dayNumber, user });
        }

        setUsers((prevUsers = []) =>
            prevUsers.map((mappedUser) => {
                if (mappedUser.id !== user.id) {
                    return mappedUser;
                }

                return {
                    ...mappedUser,
                    program: {
                        ...mappedUser.program,
                        [dayNumber]: normalizedExercises,
                    },
                };
            })
        );
        setInitialState();
    };

    const handleEditClick = async (user, day) => {
        setEditDayUser(user.id);
        setDayNumber(day);
        setExercises(user.program[day]);
    };

  return (
    <div className="relative p-6">
        {EditDayUser ? (
            <button className="text-xl" onClick={setInitialState}>⬅️</button>
        ) : (
            <Link to="/" className="text-xl">⬅️</Link>
        )}
        <h1 className="text-2xl font-bold mb-6 w-full text-center">{EditDayUser ? 'Edit Day' : 'All Exercises'}</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
            {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-4">
                    {EditDayUser === user.id ? (
                        <EditDayProgram 
                            user={user} 
                            dayNumber={dayNumber} 
                            setDayNumber={setDayNumber} 
                            exercises={exercises} 
                            setExercises={setExercises} 
                            handleSaveClick={handleSaveClick} 
                        />
                    ) : EditDayUser === false ? (
                        <DayProgramList 
                            user={user} 
                            setEditDayUser={setEditDayUser} 
                            handleEditClick={handleEditClick} 
                        />
                    ) : null}
                </div>
            ))}
        </div>
    </div>
  );
}

export default ProgramPage; 