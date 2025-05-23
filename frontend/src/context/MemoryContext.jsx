// src/context/MemoryContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { speak } from "../utils/speech";

const BACKEND_URL = "http://localhost:5000";

const MemoryContext = createContext();

export function MemoryProvider({ children }) {
  const { token } = useAuth();
  const [memories, setMemories] = useState([]);

  // Fetch all existing memories for this user
  const fetchMemories = async () => {
    if (!token) return;
    const res = await fetch(`${BACKEND_URL}/api/memories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const list = await res.json();
    setMemories(list);
    return list;
  };

  // Add one new memory
  const addMemory = async (data) => {
    const res = await fetch(`${BACKEND_URL}/api/memories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to save");
    }
    const newMem = await res.json();
    setMemories((prev) => [newMem, ...prev]);
    speak("Memory added successfully!");
    return newMem;
  };

  // Delete a memory
  const deleteMemory = async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/memories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete");
    }
    speak("Memory deleted successfully!");
    setMemories((prev) => prev.filter((m) => m._id !== id));
  };

  // Update a memory
  const updateMemory = async (id, updates) => {
    const res = await fetch(`${BACKEND_URL}/api/memories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Update failed");
    }

    const { _id, title, type, date, whatsapp } = await res.json();
    const updated = { _id, title, type, date, whatsapp };

    speak("Memory updated successfully!");
    setMemories((prev) => prev.map((m) => (m._id === id ? updated : m)));
    return updated;
  };

  // refetch whenever token changes (login/logout)

  useEffect(() => {
    if (!token) {
      setMemories([]);
      return;
    }
    async function load() {
      try {
        await fetchMemories();
      } catch (err) {
        console.error("Failed to fetch memories:", err);
      }
    }

    load();
  }, [token]);

  return (
    <MemoryContext.Provider
      value={{ memories, fetchMemories, addMemory, deleteMemory, updateMemory }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  return useContext(MemoryContext);
}
