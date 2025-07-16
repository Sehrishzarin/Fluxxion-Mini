import { createContext, useEffect, useState } from "react";

export const CRMContext = createContext();

const defaultClients = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", tags: ["VIP", "Long-term"] },
  { id: 2, name: "Fatima Zahra", email: "fatima@example.com", tags: ["Prospect"] },
  { id: 3, name: "Zeeshan Ahmed", email: "zeeshan@example.com", tags: [] }
];

const defaultLeads = {
  New: [
    { id: 101, title: "Follow-up Email", description: "Send intro email", priority: "Low", clientId: 1 }
  ],
  Contacted: [
    { id: 102, title: "Schedule Call", description: "Call with Fatima", priority: "Medium", clientId: 2 }
  ],
  Proposal: [],
  Won: [
    { id: 103, title: "Signed Contract", description: "Closed deal", priority: "High", clientId: 3 }
  ]
};

const today = new Date().toISOString().slice(0, 10);
const defaultTasks = [
  { id: 201, text: "Call Ali for feedback", dueDate: today },
  { id: 202, text: "Prep proposal for Zeeshan", dueDate: "2025-07-20" }
];

export function CRMProvider({ children }) {
  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : defaultClients;
  });

  const [leads, setLeads] = useState(() => {
    const stored = localStorage.getItem("leads");
    return stored ? JSON.parse(stored) : defaultLeads;
  });

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : defaultTasks;
  });

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addLead = (lead) => {
    setLeads((prev) => ({
      ...prev,
      New: [...prev.New, lead],
    }));
  };

  const moveLead = (fromStage, toStage, leadId) => {
    const lead = leads[fromStage].find((l) => l.id === leadId);
    if (!lead) return;

    setLeads((prev) => ({
      ...prev,
      [fromStage]: prev[fromStage].filter((l) => l.id !== leadId),
      [toStage]: [...prev[toStage], lead],
    }));
  };

  return (
    <CRMContext.Provider
      value={{
        clients,
        setClients,
        leads,
        setLeads,
        tasks,
        setTasks,
        addLead,
        moveLead
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}
