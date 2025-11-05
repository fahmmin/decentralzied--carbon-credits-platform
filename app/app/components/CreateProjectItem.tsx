"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateProjectItemProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const CreateProjectItem = ({
    client,
    publicKey,
    onTransaction
}: CreateProjectItemProps) => {
    const [projectId, setProjectId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("open");

    const handleCreateItem = async () => {
        if (!projectId || !title || !description || !status) {
            alert("All fields are required!");
            return;
        }

        const projectIdNum = parseInt(projectId);
        if (isNaN(projectIdNum)) {
            alert("Project ID must be a valid number!");
            return;
        }

        const promise = client.store_item({
            project_id: projectIdNum,
            title,
            description,
            status,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Project item created successfully!");

        // Reset form (keep project_id)
        setTitle("");
        setDescription("");
        setStatus("open");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Create Project Item</CardTitle>
                <CardDescription className="text-gray-400">
                    Add a new item to a project. Each item will be assigned a unique ID automatically.
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
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Enter item title"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Enter item description"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Input
                        id="status"
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="open, in-progress, done, etc."
                    />
                </div>
                <Button
                    onClick={handleCreateItem}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Create Item
                </Button>
            </CardContent>
        </Card>
    );
};

export default CreateProjectItem;

