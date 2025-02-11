"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPage() {
  const [term, setTerm] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");
  const [index, setIndex] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const queryIndex = window.location.pathname.split("/").pop();
    const idx = queryIndex ? parseInt(queryIndex) : null;

    if (idx !== null) {
      const savedInterpretations = JSON.parse(
        localStorage.getItem("interpretations") || "[]"
      );
      if (savedInterpretations[idx]) {
        setTerm(savedInterpretations[idx].term);
        setInterpretation(savedInterpretations[idx].interpretation);
        setIndex(idx);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (index !== null) {
      const updatedInterpretation = { term, interpretation };
      const savedInterpretations = JSON.parse(
        localStorage.getItem("interpretations") || "[]"
      );
      savedInterpretations[index] = updatedInterpretation;
      localStorage.setItem(
        "interpretations",
        JSON.stringify(savedInterpretations)
      );

      router.push("/");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Update Interpretation</h2>
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
          Update Interpretation
        </button>
      </form>
    </div>
  );
}
