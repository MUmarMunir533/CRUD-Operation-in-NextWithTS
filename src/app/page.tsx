"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";

const fetchInterpretations = () => {
  const data = localStorage.getItem("interpretations");
  return data ? JSON.parse(data) : [];
};

const deleteInterpretation = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(localStorage.getItem("interpretations") || "[]");
      const filteredData = data.filter(
        (item: { id: number }) => item.id !== id
      );
      localStorage.setItem("interpretations", JSON.stringify(filteredData));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default function Home() {
  const { data, refetch } = useQuery({
    queryKey: ["interpretations"],
    queryFn: fetchInterpretations,
  });

  const mutation = useMutation({
    mutationFn: deleteInterpretation,
    onSuccess: () => refetch(),
    onError: (error) => console.error("Error deleting interpretation:", error),
  });

  const handleDelete = (id: number) => {
    mutation.mutate(id); 
  };

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map(
          (item: { id: number; term: string; interpretation: string }) => (
            <div
              key={item.id}
              className="p-4 my-2 rounded-md border-b leading-9"
            >
              <div className="font-bold">{item.term}</div>
              <div>{item.interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  href={`/edit/${item.id}`}
                  className="bg-green-600 font-bold px-4 py-2 rounded-md uppercase text-sm tracking-widest"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded-md uppercase text-sm tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-center text-gray-500">
          No interpretations found
        </div>
      )}
    </div>
  );
}
