import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HouseholdPage from "./pages/HouseholdPage";
import TasksPage from "./pages/TasksPage";
import GroceriesPage from "./pages/GroceriesPage";
import ExpensesPage from "./pages/ExpensesPage";
import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";    
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/households" element={<HouseholdPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/groceries" element={<GroceriesPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;