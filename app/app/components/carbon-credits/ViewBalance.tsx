"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ViewBalanceProps {
    client: Client;
    publicKey: string;
}

const ViewBalance = ({
    client,
    publicKey
}: ViewBalanceProps) => {
    const [address, setAddress] = useState(publicKey);
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetBalance = async () => {
        if (!address) {
            alert("Please enter an address!");
            return;
        }

        setLoading(true);
        try {
            const tx = await client.balance({
                address,
            }, { simulate: true });

            if (tx.result !== undefined) {
                setBalance(tx.result.toString());
            } else {
                const result = await tx.signAndSend();
                if (result.result !== undefined) {
                    setBalance(result.result.toString());
                } else {
                    setBalance("0");
                }
            }
        } catch (error: any) {
            alert(`Error fetching balance: ${error.message || 'Unknown error'}`);
            setBalance(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">View Balance</CardTitle>
                <CardDescription className="text-gray-400">
                    Check the carbon credit balance for any address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">Address</Label>
                    <div className="flex gap-2">
                        <Input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="G..."
                        />
                        <Button
                            onClick={handleGetBalance}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading ? "Loading..." : "Check Balance"}
                        </Button>
                    </div>
                </div>

                {balance !== null && (
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Balance:</span>
                            <span className="text-white font-bold text-2xl">{balance}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-2">Carbon Credits</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ViewBalance;

