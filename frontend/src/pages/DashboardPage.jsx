import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileShell from "../components/MobileShell";
import {
    getUserHouseholds,
    getTasksByHousehold,
    getExpensesByHousehold,
    completeTask
} from "../services/api";

function DashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [households, setHouseholds] = useState([]);
    const selectedHouseholdName =
        localStorage.getItem("selectedHouseholdName") || "Geen huishouden geselecteerd";
    const [selectedHouseholdId] = useState(
        localStorage.getItem("selectedHouseholdId") || ""
    );
    const [tasks, setTasks] = useState([]);
    const [expenses, setExpenses] = useState([]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }

    async function loadHouseholds() {
        if (!user?.id) return;

        const result = await getUserHouseholds(user.id);

        if (Array.isArray(result)) {
            setHouseholds(result);
        }
    }

    async function loadDashboardData(householdId) {
        if (!householdId) return;

        const [taskResult, expenseResult] = await Promise.all([
            getTasksByHousehold(householdId),
            getExpensesByHousehold(householdId),
        ]);

        setTasks(Array.isArray(taskResult) ? taskResult : []);
        setExpenses(Array.isArray(expenseResult) ? expenseResult : []);
    }

    async function handleComplete(taskId) {
        await completeTask(taskId);
        loadDashboardData(selectedHouseholdId);
    }

    useEffect(() => {
        loadHouseholds();
    }, []);

    useEffect(() => {
        if (selectedHouseholdId) {
            loadDashboardData(selectedHouseholdId);
        }
    }, [selectedHouseholdId]);

    const openTasksCount = useMemo(
        () => tasks.filter((task) => task.status !== "done").length,
        [tasks]
    );

    const totalExpenses = useMemo(
        () =>
            expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
        [expenses]
    );

    const recentTasks = tasks.slice(0, 3);
    const recentExpenses = expenses.slice(0, 3);
    

    return (
        <MobileShell title={<img src="../src/assets/logo-wit.png" alt="Logo" width="250" className="header-logo" />}>

            <section className="dashboard-grid">
                <article className="info-card accent-orange">
                    <p className="card-label">Huishoudens</p>
                    <h3>{households.length}</h3>
                    <span className="card-note hidden">Actieve groepen</span>
                </article>

                <article className="info-card accent-cream">
                    <p className="card-label">Open taken</p>
                    <h3>{openTasksCount}</h3>
                    <span className="card-note hidden">Nog af te ronden</span>
                </article>

                <article className="info-card accent-soft">
                    <p className="card-label">Totale kosten</p>
                    <h3>€ {totalExpenses.toFixed(2)}</h3>
                    <span className="card-note hidden">Van geselecteerd huishouden</span>
                </article>

                <article className="info-card accent-light">
                    <p className="card-label">Uitgaven</p>
                    <h3>{expenses.length}</h3>
                    <span className="card-note hidden">Geregistreerde kosten</span>
                </article>
            </section>

            <section className="balance-card">
                <div className="balance-title">
                    <h3>Geldzaken</h3>
                </div>
                <div className="balance-amounts">
                    <div className="balance-block">
                        <p className="balance-label">Je ontvangt nog:</p>
                        <p className="balance-amount">
                            <span className="currency">&euro;</span> 30,60
                        </p>
                    </div>
                    <div className="balance-block">
                        <p className="balance-label">Je moet nog betalen:</p>
                        <p className="balance-amount">
                            <span className="currency">&euro;</span> 10,49
                        </p>
                    </div>
                </div>

                <button className="balance-button">
                    Betaal openstaand bedrag
                </button>
            </section>

            <section className="list-section">
                <div className="section-header">
                    <h3>Recente kosten</h3>
                </div>

                {recentExpenses.length === 0 ? (
                    <div className="empty-card">
                        <p>Je hebt nog geen kosten. 🎉</p>
                    </div>
                ) : (
                    <div className="household-cards expenses dashboard">
                        {recentExpenses.map((expense) => (
                            <article key={expense.id} className="expense-item-card">
                                <div>
                                    <strong>{expense.title}</strong>
                                    <p>Betaald door {expense.paid_by_name}</p>
                                </div>
                                <div className="expense-right">
                                    <span className="expense-amount">
                                        € {Number(expense.amount).toFixed(2)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <div className="button-group hidden">
                <button
                    className="primary-button"
                    onClick={() => navigate("/expenses")}
                >
                    Naar kosten
                </button>

                <button
                    className="secondary-button"
                    onClick={() => navigate("/tasks")}
                >
                    Naar taken
                </button>

                <button className="secondary-button" onClick={handleLogout}>
                    Uitloggen
                </button>
            </div>
        </MobileShell>
    );
}

export default DashboardPage;