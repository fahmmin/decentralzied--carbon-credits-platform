"use client";

import { Client } from "@/index";
import RegisterProject from "./RegisterProject";
import ViewProjects from "./ViewProjects";
import IssueCredits from "./IssueCredits";
import TransferCredits from "./TransferCredits";
import RetireCredits from "./RetireCredits";
import ViewBalance from "./ViewBalance";
import MyCredits from "./MyCredits";
import TotalRetired from "./TotalRetired";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CarbonCreditsManagementProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const CarbonCreditsManagement = ({
    client,
    publicKey,
    onTransaction
}: CarbonCreditsManagementProps) => {
    return (
        <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                <TabsTrigger value="view">View</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
                <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                        <TabsTrigger value="register">Register Project</TabsTrigger>
                        <TabsTrigger value="view">View Projects</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register" className="mt-4">
                        <RegisterProject
                            client={client}
                            publicKey={publicKey}
                            onTransaction={onTransaction}
                        />
                    </TabsContent>
                    <TabsContent value="view" className="mt-4">
                        <ViewProjects
                            client={client}
                            publicKey={publicKey}
                        />
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="credits" className="mt-6">
                <div className="space-y-4">
                    <IssueCredits
                        client={client}
                        publicKey={publicKey}
                        onTransaction={onTransaction}
                    />
                    <RetireCredits
                        client={client}
                        publicKey={publicKey}
                        onTransaction={onTransaction}
                    />
                </div>
            </TabsContent>

            <TabsContent value="transfer" className="mt-6">
                <TransferCredits
                    client={client}
                    publicKey={publicKey}
                    onTransaction={onTransaction}
                />
            </TabsContent>

            <TabsContent value="view" className="mt-6">
                <div className="space-y-4">
                    <MyCredits
                        client={client}
                        publicKey={publicKey}
                    />
                    <ViewBalance
                        client={client}
                        publicKey={publicKey}
                    />
                    <TotalRetired
                        client={client}
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default CarbonCreditsManagement;

