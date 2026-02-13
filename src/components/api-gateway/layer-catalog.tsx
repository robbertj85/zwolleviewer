interface LayerCatalogProps {
  children: React.ReactNode;
}

export default function LayerCatalog({ children }: LayerCatalogProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}
