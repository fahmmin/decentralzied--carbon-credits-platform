"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DeleteProjectItemProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const DeleteProjectItem = ({
    client,
    publicKey,
    onTransaction
}: DeleteProjectItemProps) => {
    const [projectId, setProjectId] = useState("");
    const [itemId, setItemId] = useState("");

    const handleDeleteItem = async () => {
        if (!projectId || !itemId) {
            alert("Both Project ID and Item ID are required!");
            return;
        }

        const projectIdNum = parseInt(projectId);
        const itemIdNum = parseInt(itemId);

        if (isNaN(projectIdNum) || isNaN(itemIdNum)) {
            alert("Both IDs must be valid numbers!");
            return;
        }

        if (!confirm(`Are you sure you want to delete item ${itemId} from project ${projectId}?`)) {
            return;
        }

        const promise = client.delete_item({
            project_id: projectIdNum,
            item_id: itemIdNum,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Project item deleted successfully!");

        // Reset form
        setProjectId("");
        setItemId("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Delete Project Item</CardTitle>
                <CardDescription className="text-gray-400">
                    Remove an item from a project by specifying the Project ID and Item ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="projectId" className="text-white">Project ID</Label>
                    <Input
                        id="projectId"
                        type="number"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="1"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="itemId" className="text-white">Item ID</Label>
                    <Input
                        id="itemId"
                        type="number"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="0"
                    />
                </div>
                <Button
                    onClick={handleDeleteItem}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Delete Item
                </Button>
            </CardContent>
        </Card>
    );
};

export default DeleteProjectItem;

