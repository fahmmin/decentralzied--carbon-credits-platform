"use client";

import { useState } from "react";
import { Client, ProjectItem } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetProjectItemsProps {
    client: Client;
    publicKey: string;
}

const GetProjectItems = ({
    client,
    publicKey
}: GetProjectItemsProps) => {
    const [projectId, setProjectId] = useState("");
    const [items, setItems] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGetItems = async () => {
        if (!projectId) {
            alert("Please enter a Project ID!");
            return;
        }

        const projectIdNum = parseInt(projectId);
        if (isNaN(projectIdNum)) {
            alert("Project ID must be a valid number!");
            return;
        }

        setLoading(true);
        try {
            const tx = await client.get_items({
                project_id: projectIdNum,
            }, { simulate: true });
            // For read operations, we can use the simulated result
            if (tx.result) {
                setItems(tx.result);
            } else {
                // If no result from simulation, try signing and sending
                const result = await tx.signAndSend();
                if (result.result) {
                    setItems(result.result);
                } else {
                    setItems([]);
                }
            }
        } catch (error: any) {
            alert(`Error fetching items: ${error.message || 'Unknown error'}`);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Get Project Items</CardTitle>
                <CardDescription className="text-gray-400">
                    Retrieve all items for a specific project ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="projectId" className="text-white">Project ID</Label>
                    <div className="flex gap-2">
                        <Input
                            id="projectId"
                            type="number"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="1"
                        />
                        <Button
                            onClick={handleGetItems}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading ? "Loading..." : "Fetch Items"}
                        </Button>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h3 className="text-lg font-semibold text-white">Items ({items.length})</h3>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                                        <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                                    </div>
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        ID: {item.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-gray-400 text-sm">Status:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'done' ? 'bg-green-600 text-white' :
                                            item.status === 'in-progress' ? 'bg-yellow-600 text-white' :
                                                'bg-blue-600 text-white'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.length === 0 && !loading && projectId && (
                    <div className="text-gray-400 text-center py-4">
                        No items found for this project.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetProjectItems;

