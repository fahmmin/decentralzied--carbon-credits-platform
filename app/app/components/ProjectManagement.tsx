"use client";

import { useState } from "react";
import { Client } from "@/index";
import CreateProjectItem from "./CreateProjectItem";
import GetProjectItems from "./GetProjectItems";
import DeleteProjectItem from "./DeleteProjectItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectManagementProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const ProjectManagement = ({
    client,
    publicKey,
    onTransaction
}: ProjectManagementProps) => {
    return (
        <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="create">Create Item</TabsTrigger>
                <TabsTrigger value="view">View Items</TabsTrigger>
                <TabsTrigger value="delete">Delete Item</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="mt-6">
                <CreateProjectItem
                    client={client}
                    publicKey={publicKey}
                    onTransaction={onTransaction}
                />
            </TabsContent>
            <TabsContent value="view" className="mt-6">
                <GetProjectItems
                    client={client}
                    publicKey={publicKey}
                />
            </TabsContent>
            <TabsContent value="delete" className="mt-6">
                <DeleteProjectItem
                    client={client}
                    publicKey={publicKey}
                    onTransaction={onTransaction}
                />
            </TabsContent>
        </Tabs>
    );
};

export default ProjectManagement;

