"use client";

import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SponsorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const docRef = await addDoc(collection(db, "sponsors"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      setSuccess("Thanks — your message was sent!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("There was an error sending your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 bg-black text-white font-sans">
      <h1 className="text-6xl font-extrabold mb-8">Sponsor Us</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-4"
        aria-label="Sponsor form"
      >
        <div>
          <label className="sr-only">Name / Company</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name / Company"
            className="w-full bg-transparent border border-gray-700 rounded-md p-4 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="sr-only">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent border border-gray-700 rounded-md p-4 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="sr-only">Message</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            rows={6}
            className="w-full bg-transparent border border-gray-700 rounded-md p-4 placeholder-gray-400 resize-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white text-black rounded-md font-semibold disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send"}
          </button>

          {success && <p className="text-green-400">{success}</p>}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </form>
    </main>
  );
}
