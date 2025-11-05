"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalRetiredProps {
    client: Client;
}

const TotalRetired = ({
    client
}: TotalRetiredProps) => {
    const [totalRetired, setTotalRetired] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetTotalRetired = async () => {
        setLoading(true);
        try {
            const tx = await client.total_retired({ simulate: true });

            if (tx.result !== undefined) {
                setTotalRetired(tx.result.toString());
            } else {
                const result = await tx.signAndSend();
                if (result.result !== undefined) {
                    setTotalRetired(result.result.toString());
                } else {
                    setTotalRetired("0");
                }
            }
        } catch (error: any) {
            alert(`Error fetching total retired: ${error.message || 'Unknown error'}`);
            setTotalRetired(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Total Retired Credits</CardTitle>
                <CardDescription className="text-gray-400">
                    View the total amount of carbon credits that have been retired across the entire platform.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleGetTotalRetired}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {loading ? "Loading..." : "Get Total Retired"}
                </Button>

                {totalRetired !== null && (
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Retired:</span>
                            <span className="text-white font-bold text-2xl">{totalRetired}</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-2">Carbon Credits</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TotalRetired;

