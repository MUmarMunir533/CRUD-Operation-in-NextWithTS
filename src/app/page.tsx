"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Interpretation {
  term: string;
  interpretation: string;
}

export default function Home() {
  
  const [interpretations, setInterpretations] = useState<Interpretation[]>([]);

  useEffect(() => {
    const savedInterpretations = JSON.parse(
      localStorage.getItem("interpretations") || "[]"
    );
    setInterpretations(savedInterpretations);
  }, []);

  return (
    <div>
      {interpretations.length > 0 ? (
        interpretations.map((item, index) => (
          <div key={index} className="p-4 my-2 rounded-md border-b leading-9">
            <div className="font-bold">{item.term}</div>
            <div>{item.interpretation}</div>
            <div className="flex gap-4 mt-4 justify-end">
              <Link
                href={`/edit/${index}`}
                className="bg-green-600 font-bold px-4 py-2 rounded-md uppercase text-sm tracking-widest"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  const newInterpretations = interpretations.filter(
                    (_, i) => i !== index
                  );
                  localStorage.setItem(
                    "interpretations",
                    JSON.stringify(newInterpretations)
                  );
                  setInterpretations(newInterpretations);
                }}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-md uppercase text-sm tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No interpretations found</div>
      )}
    </div>
  );
}
