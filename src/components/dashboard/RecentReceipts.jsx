import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentReceipts() {
    const receipts = [
        {
            id: "INV001",
            customer: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: "$1,999.00",
            status: "Paid",
            date: "Today, 2:34 PM"
        },
        {
            id: "INV002",
            customer: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: "$39.00",
            status: "Pending",
            date: "Today, 1:12 PM"
        },
        {
            id: "INV003",
            customer: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            amount: "$299.00",
            status: "Paid",
            date: "Yesterday, 8:45 AM"
        },
        {
            id: "INV004",
            customer: "William Kim",
            email: "will@email.com",
            amount: "$99.00",
            status: "Paid",
            date: "Mon, 10:23 AM"
        },
        {
            id: "INV005",
            customer: "Sofia Davis",
            email: "sofia.davis@email.com",
            amount: "$39.00",
            status: "Pending",
            date: "Mon, 9:15 AM"
        }
    ];

    return (
        <Card className="col-span-3 border-none shadow-primary">
            <CardHeader>
                <CardTitle>Recent Receipts</CardTitle>
                <CardDescription>
                    You made 265 sales this month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {receipts.map((receipt) => (
                        <div key={receipt.id} className="flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-9 w-9 border border-border/50">
                                    <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${receipt.customer}`} alt={receipt.customer} />
                                    <AvatarFallback>{receipt.customer[0]}{receipt.customer.split(" ")[1]?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{receipt.customer}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {receipt.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="font-medium">{receipt.amount}</div>
                                <Badge variant={receipt.status === "Paid" ? "default" : "secondary"} className={receipt.status === "Paid" ? "bg-green-100 text-green-700 hover:bg-green-200 border-none dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none dark:bg-yellow-900/30 dark:text-yellow-400"}>
                                    {receipt.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
