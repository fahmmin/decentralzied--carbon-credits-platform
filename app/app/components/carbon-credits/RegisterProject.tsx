"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RegisterProjectProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const RegisterProject = ({
    client,
    publicKey,
    onTransaction
}: RegisterProjectProps) => {
    const [issuer, setIssuer] = useState(publicKey);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [projectType, setProjectType] = useState("");
    const [description, setDescription] = useState("");

    const handleRegisterProject = async () => {
        if (!issuer || !name || !location || !projectType || !description) {
            alert("All fields are required!");
            return;
        }

        const promise = client.register_project({
            issuer,
            name,
            location,
            project_type: projectType,
            description,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Project registered successfully!");

        // Reset form (keep issuer)
        setName("");
        setLocation("");
        setProjectType("");
        setDescription("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Register Carbon Project</CardTitle>
                <CardDescription className="text-gray-400">
                    Register a new carbon offset project. A unique project ID will be assigned automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="issuer" className="text-white">Issuer Address</Label>
                    <Input
                        id="issuer"
                        type="text"
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Project Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Renewable Energy Project"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Country, Region"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="projectType" className="text-white">Project Type</Label>
                    <Input
                        id="projectType"
                        type="text"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="e.g., Renewable Energy, Reforestation, Carbon Capture"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Detailed description of the carbon offset project..."
                        rows={4}
                    />
                </div>
                <Button
                    onClick={handleRegisterProject}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Register Project
                </Button>
            </CardContent>
        </Card>
    );
};

export default RegisterProject;

