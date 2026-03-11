// src/lib/data.ts
export const getAllTickets = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return { tickets: [] };
    return res.json();
  } catch (error) {
    console.log(error);
    return { tickets: [] };
  }
};

export const getTicketById = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tickets/${id}`, {
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};
