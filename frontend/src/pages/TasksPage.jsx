import { useEffect, useState } from "react";
import MobileShell from "../components/MobileShell";
import {
    createTask,
    getTasksByHousehold,
    completeTask,
    getUserHouseholds,
} from "../services/api";

function TasksPage() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [households, setHouseholds] = useState([]);
    const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
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
            if (result.length > 0 && !selectedHouseholdId) {
                setSelectedHouseholdId(String(result[0].id));
            }
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
            assignedToUserId: user.id,
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

    return (
        <MobileShell title="Huishoudelijke taken" subtitle={<img src="../src/assets/logo-wit.png" alt="Logo" width="120" className="header-logo sub" />}>

            <section className="top-bar">
                <div className="user-info">
                    <img className="user-icon" src="../src/assets/avatar-placeholder.jpg" width="45" /> <span className="username">{`${user?.name || "gast"}`}</span>
                </div>

                <div className="actions">
                    <button className="icon-button settings">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="rgb(117, 66, 38)" d="M192 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM432 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"/></svg>
                    </button>

                    <button className="icon-button settings">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="rgb(117, 66, 38)" d="M205.5 92.7l13.7-60.7 73.6 0 13.7 60.7c1.7 7.4 6.8 13.6 13.8 16.7 10.8 4.8 21 10.7 30.4 17.6 6.1 4.5 14.1 5.9 21.4 3.6l59.5-18.5 36.8 63.8-45.8 42.3c-5.6 5.2-8.4 12.7-7.6 20.2 1.3 11.5 1.3 23.7 0 35.2-.8 7.6 2 15.1 7.6 20.2l45.8 42.3-36.8 63.8-59.5-18.5c-7.3-2.3-15.2-.9-21.4 3.6-9.4 6.9-19.6 12.9-30.4 17.6-7 3.1-12.1 9.3-13.8 16.7l-13.7 60.7-73.6 0-13.7-60.7c-1.7-7.4-6.8-13.6-13.8-16.7-10.8-4.8-21-10.7-30.4-17.6-6.1-4.5-14.1-5.9-21.4-3.6l-59.5 18.5-36.8-63.8 45.8-42.3c5.6-5.2 8.4-12.7 7.6-20.2-1.3-11.5-1.3-23.7 0-35.2 .8-7.6-2-15.1-7.6-20.2l-45.8-42.3 36.8-63.8 59.5 18.5c7.3 2.3 15.2 .9 21.4-3.6 9.4-6.9 19.6-12.9 30.4-17.6 7-3.1 12.1-9.3 13.8-16.7zM212.8-16c-18.7 0-34.9 13-39 31.2L161.2 70.8c-6.3 3.2-12.3 6.7-18.2 10.5L88.6 64.4c-17.9-5.6-37.2 2-46.5 18.2L-1.1 157.4c-9.3 16.2-6.2 36.7 7.5 49.4l41.9 38.7c-.3 6.9-.3 14 0 21L6.4 305.2c-13.7 12.7-16.9 33.2-7.5 49.4l43.2 74.8c9.3 16.2 28.7 23.7 46.5 18.2l54.5-16.9c5.9 3.8 11.9 7.3 18.2 10.5l12.6 55.6c4.1 18.2 20.3 31.2 39 31.2l86.4 0c18.7 0 34.9-13 39-31.2l12.6-55.6c6.3-3.2 12.3-6.7 18.2-10.5l54.5 16.9c17.9 5.6 37.2-2 46.5-18.2l43.2-74.8c9.3-16.2 6.2-36.7-7.5-49.4l-41.9-38.7c.3-6.9 .3-14 0-21l41.9-38.7c13.7-12.7 16.8-33.2 7.5-49.4L470 82.6c-9.4-16.2-28.7-23.7-46.5-18.2L369 81.3c-5.9-3.8-11.9-7.3-18.2-10.5L338.3 15.2C334.1-3 317.9-16 299.2-16l-86.4 0zM304 256a48 48 0 1 1 -96 0 48 48 0 1 1 96 0zm-48-96a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"/></svg>
                    </button>
                    
                    <button className="icon-button active notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="rgb(244, 122, 31)" d="M224 0c-13.3 0-24 10.7-24 24l0 9.7C118.6 45.3 56 115.4 56 200l0 14.5c0 37.7-10 74.7-29 107.3L5.1 359.2C1.8 365 0 371.5 0 378.2 0 399.1 16.9 416 37.8 416l372.4 0c20.9 0 37.8-16.9 37.8-37.8 0-6.7-1.8-13.3-5.1-19L421 321.7c-19-32.6-29-69.6-29-107.3l0-14.5c0-84.6-62.6-154.7-144-166.3l0-9.7c0-13.3-10.7-24-24-24zM392.4 368l-336.9 0 12.9-22.1C91.7 306 104 260.6 104 214.5l0-14.5c0-66.3 53.7-120 120-120s120 53.7 120 120l0 14.5c0 46.2 12.3 91.5 35.5 131.4L392.4 368zM156.1 464c9.9 28 36.6 48 67.9 48s58-20 67.9-48l-135.8 0z"/></svg>
                        <span className="notification-badge">1</span>
                    </button>
                </div>
            </section>

            <section className="stack-section">
                <article className="form-card">
                    <h3>Nieuwe taak toevoegen</h3>

                    <form onSubmit={handleCreateTask} className="form">
                        <select
                            className="styled-select"
                            value={selectedHouseholdId}
                            onChange={(e) => setSelectedHouseholdId(e.target.value)}
                        >
                            <option value="">Kies een huishouden</option>
                            {households.map((household) => (
                                <option key={household.id} value={household.id}>
                                    {household.name}
                                </option>
                            ))}
                        </select>

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
                                        <p>
                                            {task.description || ""} {" "}

                                            {task.due_date && <p> <svg xmlns="http://www.w3.org/2000/svg" height="10" width="8.75" viewBox="0 0 448 512">
                                            <path fill="rgb(117, 66, 38)" d="M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zm0 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0zM48 224l0 192c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-192-352 0z"/></svg> {task.due_date.slice(0, 10).split('-').reverse().join('-')}</p>}
                                            
                                            <div className="user-information">
                                                <img className="user-icon" src="../src/assets/avatar-placeholder.jpg" width="30" />
                                                {task.assigned_to_name || "Niet toegewezen"}
                                            </div>

                                        </p>
                                    </div>

                                    <div className="task-actions">
                                        <span className={`status-pill ${task.status === "done" ? "done" : ""}`}>
                                            {task.status}
                                        </span>

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