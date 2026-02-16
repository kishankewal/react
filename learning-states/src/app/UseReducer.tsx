import { useState, useEffect, useReducer } from "react";

type Exercise = {
    id: number;
    name: string;
    calories: number;
};

type Workout = {
    isRunning: boolean,
    isPaused: boolean,
    duration: number,          
    caloriesBurned: number,
    exercises: Exercise[],
    error: string | null
}

const initialState = {
    isRunning : false,
    isPaused: true,
    duration: 0,          
    caloriesBurned: 0,
    exercises: [],
    error: null
}

type WorkoutAction =
  | { type: "START_WORKOUT" }
  | { type: "PAUSE_WORKOUT" }
  | { type: "RESUME_WORKOUT" }
  | { type: "STOP_WORKOUT" }
  | { type: "RESET_WORKOUT" }
  | { type: "INCREMENT_TIME" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "ADD_EXERCISE"; payload: Exercise }
  | { type: "REMOVE_EXERCISE"; payload: number };

const workoutReducer = (state : Workout, action : WorkoutAction) => {
    switch(action.type) {
        case "START_WORKOUT" : 
            return {...state, isRunning : true, isPaused : false, setDuration : 0, setCalories : 0, exercises : [], error : null };
        case "PAUSE_WORKOUT" : 
            return { ...state, isPaused : true }
        case "STOP_WORKOUT" : 
            return { ...state, isRunning : false, isPaused : false }
        case "RESUME_WORKOUT" :
            return { ...state, isRunning : true, isPaused : false }
        case "RESET_WORKOUT" : 
            return { ...initialState};
        case "ADD_EXERCISE" : 
            return { ...state, caloriesBurned : state.caloriesBurned + action.payload.calories ,  exercises : [ ...state.exercises, action.payload ] }
        case "REMOVE_EXERCISE" :
            const deleteExercise = state.exercises.filter((ex) => ex.id === action.payload )[0];
            return { ...state, caloriesBurned : state.caloriesBurned - deleteExercise.calories , exercises : state.exercises.filter((ex) => ex.id != action.payload ) }
        default : return initialState;
    }
}



const Workout = () => {
    const [ state, dispatch ] = useReducer(workoutReducer, initialState);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (state.isRunning && !state.isPaused) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state.isRunning, state.isPaused]);

    // Actions
    const startWorkout = () => {
        dispatch({ type : "START_WORKOUT" });
    };

    const pauseWorkout = () => {
        if (!state.isRunning) return;
        dispatch({ type : "PAUSE_WORKOUT" });
    };

    const resumeWorkout = () => {
        if (!state.isRunning) return;
        dispatch({ type : "RESUME_WORKOUT" });
    };

    const stopWorkout = () => {
        dispatch({ type : "STOP_WORKOUT" });
    };

    const addExercise = (exercise: Exercise) => {
        if (!state.isRunning) {
            setError("Workout not started!");
            return;
        }
        dispatch({ type : "ADD_EXERCISE", payload :  exercise});
        // setCaloriesBurned(prev => prev + exercise.calories);
    };

    const removeExercise = (id: number) => {
        const exerciseToRemove = state.exercises.find(ex => ex.id === id);
        if (!exerciseToRemove) return;
        dispatch({ type : "REMOVE_EXERCISE", payload : exerciseToRemove.id});
        
        // setExercises(prev => prev.filter(ex => ex.id !== id));
        // setCaloriesBurned(prev => prev - exerciseToRemove.calories);
    };

    const resetWorkout = () => {
        dispatch({ type : "RESET_WORKOUT" });
    };

    return (
    <div style={styles.container}>
        <div style={styles.card}>
        <h2 style={styles.title}>🏋️ Workout Session</h2>

        <div style={styles.stats}>
            <div>
            <p style={styles.label}>Duration</p>
            <h3>{duration}s</h3>
            </div>
            <div>
            <p style={styles.label}>Calories</p>
            <h3>{state.caloriesBurned}</h3>
            </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttons}>
            {!state.isRunning && (
            <button style={styles.primary} onClick={startWorkout}>
                Start Workout
            </button>
            )}

            {state.isRunning && !state.isPaused && (
            <>
                <button style={styles.secondary} onClick={pauseWorkout}>
                Pause
                </button>
                <button style={styles.danger} onClick={stopWorkout}>
                Stop
                </button>
            </>
            )}

            {state.isRunning && state.isPaused && (
            <>
                <button style={styles.primary} onClick={resumeWorkout}>
                Resume
                </button>
                <button style={styles.danger} onClick={stopWorkout}>
                Stop
                </button>
            </>
            )}
        </div>

        <button
            style={styles.addExercise}
            onClick={() =>
            addExercise({ id: Date.now(), name: "Push-ups", calories: 50 })
            }
        >
            + Add Push-ups
        </button>

        <div style={styles.exerciseList}>
            {state.exercises.length === 0 && (
            <p style={{ opacity: 0.6 }}>No exercises added yet</p>
            )}

            {state.exercises.map(ex => (
            <div key={ex.id} style={styles.exerciseItem}>
                <div>
                <strong>{ex.name}</strong>
                <span style={{ marginLeft: 8 }}>+{ex.calories} kcal</span>
                </div>
                <button
                style={styles.removeBtn}
                onClick={() => removeExercise(ex.id)}
                >
                ✕
                </button>
            </div>
            ))}
        </div>

        <button style={styles.reset} onClick={resetWorkout}>
            Reset Workout
        </button>
        </div>
    </div>
    );

    };

    const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
    },
    card: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        width: "420px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
    },
    title: {
        textAlign: "center",
        marginBottom: "20px"
    },
    stats: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
    },
    label: {
        fontSize: "12px",
        color: "#888"
    },
    buttons: {
        display: "flex",
        gap: "10px",
        marginBottom: "15px"
    },
    primary: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#2a5298",
        color: "white",
        cursor: "pointer"
    },
    secondary: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#6c757d",
        color: "white",
        cursor: "pointer"
    },
    danger: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#dc3545",
        color: "white",
        cursor: "pointer"
    },
    addExercise: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#28a745",
        color: "white",
        cursor: "pointer",
        marginBottom: "15px"
    },
    exerciseList: {
        marginBottom: "15px"
    },
    exerciseItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #eee"
    },
    removeBtn: {
        border: "none",
        background: "transparent",
        color: "#dc3545",
        cursor: "pointer",
        fontSize: "16px"
    },
    reset: {
        width: "100%",
        padding: "8px",
        borderRadius: "8px",
        border: "none",
        background: "#f8f9fa",
        cursor: "pointer"
    },
    error: {
        color: "red",
        marginBottom: "10px"
    }
};

export default Workout;
