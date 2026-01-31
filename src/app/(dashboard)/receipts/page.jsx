export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Receipts</h1>
        <p className="text-muted-foreground">Manage your receipts</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No receipts yet</p>
      </div>
    </div>
  );
}
