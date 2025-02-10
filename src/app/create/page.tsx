"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Interpretation {
  id: number;
  term: string;
  interpretation: string;
}

export default function CreatePage() {
  const [term, setTerm] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!term.trim() || !interpretation.trim()) {
      alert("Both fields are required!");
      return;
    }

    const newInterpretation: Interpretation = {
      id: Date.now(),
      term,
      interpretation,
    };

    const savedInterpretations: Interpretation[] = JSON.parse(
      localStorage.getItem("interpretations") || "[]"
    );

    const updatedInterpretations = [...savedInterpretations, newInterpretation];
    localStorage.setItem(
      "interpretations",
      JSON.stringify(updatedInterpretations)
    );

    setTerm("");
    setInterpretation("");

    router.push("/");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          rows={4}
          placeholder="Interpretation"
          className="py-1 px-4 border rounded-md resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white mt-5 py-1 px-4 rounded-md cursor-pointer"
        >
          Add Interpretation
        </button>
      </form>
    </div>
  );
}
