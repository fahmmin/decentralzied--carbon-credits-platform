"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TransferCreditsProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const TransferCredits = ({
    client,
    publicKey,
    onTransaction
}: TransferCreditsProps) => {
    const [from, setFrom] = useState(publicKey);
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");

    const handleTransfer = async () => {
        if (!from || !to || !amount) {
            alert("All fields are required!");
            return;
        }

        const amountNum = BigInt(amount);
        if (amountNum <= 0) {
            alert("Amount must be greater than 0!");
            return;
        }

        if (from === to) {
            alert("Sender and recipient cannot be the same!");
            return;
        }

        const promise = client.transfer({
            from,
            to,
            amount: amountNum,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Carbon credits transferred successfully!");

        // Reset form (keep from)
        setTo("");
        setAmount("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Transfer Carbon Credits</CardTitle>
                <CardDescription className="text-gray-400">
                    Transfer carbon credits from one address to another.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="from" className="text-white">From Address</Label>
                    <Input
                        id="from"
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="to" className="text-white">To Address</Label>
                    <Input
                        id="to"
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount</Label>
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
                    onClick={handleTransfer}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Transfer Credits
                </Button>
            </CardContent>
        </Card>
    );
};

export default TransferCredits;

