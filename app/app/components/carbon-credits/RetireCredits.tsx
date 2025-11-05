"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RetireCreditsProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const RetireCredits = ({
    client,
    publicKey,
    onTransaction
}: RetireCreditsProps) => {
    const [owner, setOwner] = useState(publicKey);
    const [amount, setAmount] = useState("");

    const handleRetire = async () => {
        if (!owner || !amount) {
            alert("All fields are required!");
            return;
        }

        const amountNum = BigInt(amount);
        if (amountNum <= 0) {
            alert("Amount must be greater than 0!");
            return;
        }

        if (!confirm(`Are you sure you want to retire ${amount} carbon credits? This action cannot be undone.`)) {
            return;
        }

        const promise = client.retire({
            owner,
            amount: amountNum,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Carbon credits retired successfully!");

        // Reset form (keep owner)
        setAmount("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Retire Carbon Credits</CardTitle>
                <CardDescription className="text-gray-400">
                    Retire carbon credits to remove them from circulation. This prevents double counting and ensures credits are permanently removed.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="owner" className="text-white">Owner Address</Label>
                    <Input
                        id="owner"
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount to Retire</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="1000"
                        min="1"
                    />
                </div>
                <Button
                    onClick={handleRetire}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Retire Credits
                </Button>
            </CardContent>
        </Card>
    );
};

export default RetireCredits;

