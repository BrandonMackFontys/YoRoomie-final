import { useEffect, useState } from "react";
import MobileShell from "../components/MobileShell";
import {
    createTask,
    getTasksByHousehold,
    completeTask,
    deleteTask,
    getUserHouseholds,
} from "../services/api";
import Avatar from "../components/Avatar";

function TasksPage() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [households, setHouseholds] = useState([]);
    const [selectedHouseholdId] = useState(
        localStorage.getItem("selectedHouseholdId") || ""
    );
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");

    async function loadHouseholds() {
        if (!user?.id) return;
        const result = await getUserHouseholds(user.id);

        if (Array.isArray(result)) {
            setHouseholds(result);
        }
    }

    async function loadTasks(householdId) {
        if (!householdId) return;
        const result = await getTasksByHousehold(householdId);
        setTasks(Array.isArray(result) ? result : []);
    }

    useEffect(() => {
        loadHouseholds();
    }, []);

    useEffect(() => {
        if (selectedHouseholdId) {
            loadTasks(selectedHouseholdId);
        }
    }, [selectedHouseholdId]);

    async function handleCreateTask(e) {
        e.preventDefault();

        const result = await createTask({
            householdId: Number(selectedHouseholdId),
            title,
            description,
            dueDate,
        });

        setMessage(result.message || "");
        setTitle("");
        setDescription("");
        setDueDate("");
        loadTasks(selectedHouseholdId);
    }

    async function handleComplete(taskId) {
        const result = await completeTask(taskId);
        setMessage(result.message || "");
        loadTasks(selectedHouseholdId);
    }

    async function handleDelete(taskId) {
        const result = await deleteTask(taskId);
        setMessage(result.message || "");
        loadTasks(selectedHouseholdId);
    }

    return (
        <MobileShell title="Huishoudelijke taken" subtitle={<img src="../src/assets/logo-wit.png" alt="Logo" width="120" className="header-logo sub" />}>

            <section className="stack-section">
                <article className="form-card">
                    <h3>Nieuwe taak toevoegen</h3>

                    <form onSubmit={handleCreateTask} className="form">
                        <input
                            type="text"
                            placeholder="Titel van de taak"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Beschrijving"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

                        <button type="submit" className="primary-button">
                            Taak toevoegen
                        </button>
                    </form>
                </article>

                {message && <p className="message-card">{message}</p>}

                <section className="list-section">
                    <div className="section-header">
                        <h3>Mijn taken</h3>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="empty-card">
                            <p>Nog geen taken gevonden.</p>
                        </div>
                    ) : (
                        <div className="household-cards">
                            {tasks.map((task) => (
                                <article key={task.id} className="task-card real-task-card">
                                    <div>
                                        <strong>{task.title}</strong>
                                        <p>{task.description || ""}</p>

                                        {task.due_date && (
                                            <p>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="10" width="8.75" viewBox="0 0 448 512">
                                                    <path fill="rgb(117, 66, 38)" d="M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zm0 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0zM48 224l0 192c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-192-352 0z" />
                                                </svg>{" "}
                                                {task.due_date.slice(0, 10).split("-").reverse().join("-")}
                                            </p>
                                        )}

                                        <div className="user-information">
                                            <Avatar size={30} src={task.assigned_to_avatar} />
                                            <span>{task.assigned_to_name || "Niet toegewezen"}</span>
                                        </div>
                                    </div>

                                    <div className="task-actions">
                                        {task.status === "done" && (
                                            <span className="status-pill done">Done</span>
                                        )}

                                        <button
                                            className="delete-pill"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Verwijder
                                        </button>

                                        {task.status !== "done" && (
                                            <button
                                                className="mini-pill"
                                                onClick={() => handleComplete(task.id)}
                                            >
                                                Afronden
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </MobileShell>
    );
}

export default TasksPage;