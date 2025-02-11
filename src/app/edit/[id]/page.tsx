"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";


const fetchInterpretation = (id: number) => {
  const data = JSON.parse(localStorage.getItem("interpretations") || "[]");
  return data.find((item: { id: number }) => item.id === id);
};


const updateInterpretation = (updatedInterpretation: {
  id: number;
  term: string;
  interpretation: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(localStorage.getItem("interpretations") || "[]");
      const index = data.findIndex(
        (item: { id: number }) => item.id === updatedInterpretation.id
      );
      if (index !== -1) {
        data[index] = updatedInterpretation;
        localStorage.setItem("interpretations", JSON.stringify(data));
        resolve();
      } else {
        reject("Interpretation not found");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default function EditPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["interpretation", id],
    queryFn: () => fetchInterpretation(Number(id)),
  });

  const mutation = useMutation<
    void,
    Error,
    { id: number; term: string; interpretation: string }
  >({
    mutationFn: updateInterpretation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interpretation", id] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Error updating interpretation:", error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  if (!data) return <div>No data found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: Number(id),
      term: data.term,
      interpretation: data.interpretation,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Update Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          defaultValue={data.term}
          onChange={(e) => (data.term = e.target.value)}
          placeholder="Term"
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
          rows={4}
          defaultValue={data.interpretation}
          onChange={(e) => (data.interpretation = e.target.value)}
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

      {mutation.isPending && <p>Updating...</p>}
      {mutation.isError && (
        <p>
          Error:{" "}
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unknown error"}
        </p>
      )}
      {mutation.isSuccess && <p>Interpretation updated successfully!</p>}
    </div>
  );
}
