/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from "react";

export const CRMContext = createContext();

const defaultClients = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", tags: ["VIP", "Long-term"] },
  { id: 2, name: "Fatima Zahra", email: "fatima@example.com", tags: ["Prospect"] },
  { id: 3, name: "Zeeshan Ahmed", email: "zeeshan@example.com", tags: ["Enterprise"] },
  { id: 4, name: "Sara Noor", email: "sara@example.com", tags: ["VIP"] }
];

const defaultLeads = {
  New: [
    { id: 101, title: "Follow-up Email", description: "Send product demo intro email", priority: "Low", clientId: 1 }
  ],
  Contacted: [
    { id: 102, title: "Schedule Discovery Call", description: "Call with Fatima to understand requirements", priority: "Medium", clientId: 2 }
  ],
  Proposal: [
    { id: 104, title: "Send Q3 Quote", description: "Send custom enterprise pricing plan", priority: "High", clientId: 3 }
  ],
  Won: [
    { id: 103, title: "Signed Annual Contract", description: "Closed 1-year service plan", priority: "High", clientId: 3 }
  ]
};

const today = new Date().toISOString().slice(0, 10);
const defaultTasks = [
  { id: 201, title: "Call Ali for feedback", note: "Review project milestones", assignedTo: "Client: Ali Khan", dueDate: today, done: false },
  { id: 202, title: "Prep proposal for Zeeshan", note: "Attach pricing sheet v2", assignedTo: "Lead: Send Q3 Quote", dueDate: "2026-09-28", done: false },
  { id: 203, title: "Quarterly review with Sara", note: "Discuss extension terms", assignedTo: "Client: Sara Noor", dueDate: "2026-09-20", done: true }
];

const defaultActivities = [
  { id: 1, text: "Closed deal with Zeeshan Ahmed ('Signed Annual Contract')", time: "10 mins ago", type: "lead" },
  { id: 2, text: "Added task 'Call Ali for feedback'", time: "1 hour ago", type: "task" },
  { id: 3, text: "Added client Sara Noor (VIP)", time: "Yesterday", type: "client" }
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

  const [activities, setActivities] = useState(() => {
    const stored = localStorage.getItem("activities");
    return stored ? JSON.parse(stored) : defaultActivities;
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    setToastMessage({ msg, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const addActivity = useCallback((text, type = "info") => {
    const newAct = { id: Date.now(), text, time: "Just now", type };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  }, []);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  // Client operations
  const addClient = (clientData) => {
    const newClient = { id: Date.now(), ...clientData };
    setClients((prev) => [newClient, ...prev]);
    addActivity(`Added new client "${newClient.name}"`, "client");
    showToast(`Added client "${newClient.name}"`, "success");
    return newClient;
  };

  const updateClient = (id, updated) => {
    setClients((prev) =>
      prev.map((c) => (c.id === Number(id) ? { ...c, ...updated } : c))
    );
    addActivity(`Updated client details for "${updated.name || 'Client'}"`, "client");
    showToast("Client details updated", "success");
  };

  const deleteClient = (id) => {
    const client = clients.find((c) => c.id === Number(id));
    setClients((prev) => prev.filter((c) => c.id !== Number(id)));
    if (client) {
      addActivity(`Deleted client "${client.name}"`, "client");
      showToast(`Deleted client "${client.name}"`, "warning");
    }
  };

  // Lead operations
  const addLead = (leadData, stage = "New") => {
    const newLead = { id: Date.now(), ...leadData };
    setLeads((prev) => ({
      ...prev,
      [stage]: [...(prev[stage] || []), newLead],
    }));
    addActivity(`Added lead "${newLead.title}" to ${stage}`, "lead");
    showToast(`Lead "${newLead.title}" added to ${stage}`, "success");
    return newLead;
  };

  const moveLead = (fromStage, toStage, leadId) => {
    if (fromStage === toStage) return;
    const lead = (leads[fromStage] || []).find((l) => l.id === Number(leadId));
    if (!lead) return;

    setLeads((prev) => ({
      ...prev,
      [fromStage]: prev[fromStage].filter((l) => l.id !== Number(leadId)),
      [toStage]: [...(prev[toStage] || []), lead],
    }));

    addActivity(`Moved lead "${lead.title}" from ${fromStage} to ${toStage}`, "lead");
    showToast(`Moved "${lead.title}" to ${toStage}`, "info");
  };

  const updateLead = (stage, leadId, updatedData) => {
    setLeads((prev) => ({
      ...prev,
      [stage]: prev[stage].map((l) =>
        l.id === Number(leadId) ? { ...l, ...updatedData } : l
      ),
    }));
    showToast("Lead updated", "success");
  };

  const deleteLead = (stage, leadId) => {
    const lead = (leads[stage] || []).find((l) => l.id === Number(leadId));
    setLeads((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((l) => l.id !== Number(leadId)),
    }));
    if (lead) {
      addActivity(`Deleted lead "${lead.title}"`, "lead");
      showToast(`Deleted lead "${lead.title}"`, "warning");
    }
  };

  // Task operations
  const addTask = (taskData) => {
    const newTask = { id: Date.now(), done: false, ...taskData };
    setTasks((prev) => [newTask, ...prev]);
    addActivity(`Created task "${newTask.title || newTask.text}"`, "task");
    showToast("New task created", "success");
    return newTask;
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === Number(id)) {
          const nextDone = !t.done;
          if (nextDone) addActivity(`Completed task "${t.title || t.text}"`, "task");
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    const t = tasks.find((item) => item.id === Number(id));
    setTasks((prev) => prev.filter((item) => item.id !== Number(id)));
    if (t) {
      showToast("Task deleted", "warning");
    }
  };

  const resetDemoData = () => {
    setClients(defaultClients);
    setLeads(defaultLeads);
    setTasks(defaultTasks);
    setActivities(defaultActivities);
    showToast("Reset all data to default sample dataset", "info");
  };

  return (
    <CRMContext.Provider
      value={{
        clients,
        setClients,
        addClient,
        updateClient,
        deleteClient,

        leads,
        setLeads,
        addLead,
        moveLead,
        updateLead,
        deleteLead,

        tasks,
        setTasks,
        addTask,
        toggleTask,
        deleteTask,

        activities,
        addActivity,

        toastMessage,
        showToast,
        clearToast,

        resetDemoData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}
