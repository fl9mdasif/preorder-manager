interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPreorderPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      {/* TODO: Implement EditPreorderPage */}
      <h1>Edit Preorder {id}</h1>
    </div>
  );
}
