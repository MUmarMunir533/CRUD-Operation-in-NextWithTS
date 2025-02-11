export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ReactQueryProviderProps = {
  children: React.ReactNode;
};

const updateInterpretation = async (updatedInterpretation: {
  id: number;
  term: string;
  interpretation: string;
}) => {
  return new Promise<void>((resolve) => {
    const data = JSON.parse(localStorage.getItem("interpretations") || "[]");
    const index = data.findIndex(
      (item: { id: number }) => item.id === updatedInterpretation.id
    );

    if (index !== -1) {
      data[index] = updatedInterpretation;
      localStorage.setItem("interpretations", JSON.stringify(data));
    }

    resolve(); 
  });
};
