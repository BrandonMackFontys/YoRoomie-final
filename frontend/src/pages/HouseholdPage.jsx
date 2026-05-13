import { useEffect, useState } from "react";
import { createHousehold, getUserHouseholds, joinHousehold } from "../services/api";
import MobileShell from "../components/MobileShell";

function HouseholdPage() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [households, setHouseholds] = useState([]);
    const [createName, setCreateName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [message, setMessage] = useState("");

    async function loadHouseholds() {
        if (!user?.id) return;
        const result = await getUserHouseholds(user.id);
        setHouseholds(Array.isArray(result) ? result : []);
    }

    useEffect(() => {
        loadHouseholds();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();

        const result = await createHousehold({
            name: createName,
            userId: user.id,
        });

        setMessage(result.message || "");
        setCreateName("");
        loadHouseholds();
    }

    async function handleJoin(e) {
        e.preventDefault();

        const result = await joinHousehold({
            inviteCode,
            userId: user.id,
        });

        setMessage(result.message || "");
        setInviteCode("");
        loadHouseholds();
    }

    return (
        <MobileShell title="Huishoudens" subtitle={<img src="../src/assets/logo-wit.png" alt="Logo" width="120" className="header-logo sub" />}>
        </MobileShell>
    );
}

export default HouseholdPage;