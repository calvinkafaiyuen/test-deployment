export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  if (id == "") {
    return <div>Speaker Not Found</div>;
  }
  const speaker = null;
  // const speaker = await fetchSpeaker(id);
  // Assuming `id` is available in the query parameters
  // Fetch data based on `id` or use dummy data
  const item = {
    id,
    name: `Item ${id}`,
    description: `This is item ${id} description.`,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">{item.name}</h1>
      <p>{item.description}</p>
    </div>
  );
}
