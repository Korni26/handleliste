const useGetApiData = async (productName: string) => {
  try {
    const res = await fetch(
      `https://kassal.app/api/v1/products?search=${productName}&size=10`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Respons feil: ", res.status);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Feilet å hente data fra endepunktet:", error);
  }
};

export { useGetApiData };
