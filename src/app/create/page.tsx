"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; 

const saveInterpretation = (data: { term: string; interpretation: string }) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const existingData = JSON.parse(localStorage.getItem("interpretations") || "[]");

      const newInterpretation = {
        id: Date.now(),
        term: data.term,
        interpretation: data.interpretation,
      };

      const updatedData = [...existingData, newInterpretation];
      localStorage.setItem("interpretations", JSON.stringify(updatedData));

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default function CreatePage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: saveInterpretation,
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const term = (e.target as HTMLFormElement).term.value;
    const interpretation = (e.target as HTMLFormElement).interpretation.value;

    if (!term || !interpretation) {
      alert("Both fields are required!");
      return;
    }

    mutation.mutate({ term, interpretation });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
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

      {mutation.isPending && <p>Loading...</p>}
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Interpretation added successfully!</p>}
    </div>
  );
}
