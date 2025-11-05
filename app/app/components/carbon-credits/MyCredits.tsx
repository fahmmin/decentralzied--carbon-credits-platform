"use client";

import { useState, useEffect } from "react";
import { Client, CarbonCredit } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MyCreditsProps {
    client: Client;
    publicKey: string;
}

const MyCredits = ({
    client,
    publicKey
}: MyCreditsProps) => {
    const [address, setAddress] = useState(publicKey);
    const [credits, setCredits] = useState<CarbonCredit[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCredits = async () => {
        if (!address) {
            alert("Please enter an address!");
            return;
        }

        setIsLoading(true);
        try {
            const tx = await client.get_credits({ address }, { simulate: true });

            if (tx.result) {
                setCredits(tx.result);
            } else {
                const result = await tx.signAndSend();
                if (result.result) {
                    setCredits(result.result);
                } else {
                    setCredits([]);
                }
            }
        } catch (error: any) {
            console.error("Error fetching credits:", error);
            alert(error.message || "Failed to fetch credits");
            setCredits([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (publicKey) {
            setAddress(publicKey);
        }
    }, [publicKey]);

    useEffect(() => {
        if (address && publicKey && address === publicKey) {
            fetchCredits();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, publicKey]);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">My Carbon Credits</CardTitle>
                <CardDescription className="text-gray-400">
                    View all carbon credits owned by an address
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
                            onClick={fetchCredits}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? "Loading..." : "Fetch"}
                        </Button>
                    </div>
                </div>

                {credits.length > 0 ? (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Credits ({credits.length})</h3>
                        <div className="space-y-2">
                            {credits.map((credit, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-white font-semibold">Credit ID: {credit.id.toString()}</h4>
                                            <p className="text-gray-300 text-sm mt-1">
                                                Amount: {credit.amount.toString()} credits
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${credit.retired
                                                ? 'bg-red-600 text-white'
                                                : 'bg-green-600 text-white'
                                            }`}>
                                            {credit.retired ? 'Retired' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-400">Project ID:</span> {credit.project_id}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Vintage:</span> {credit.vintage}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Issued At:</span> {new Date(Number(credit.issued_at) * 1000).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Owner:</span> <span className="text-xs break-all">{credit.owner}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    !isLoading && (
                        <p className="text-gray-400 text-center py-4">No credits found for this address</p>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default MyCredits;

