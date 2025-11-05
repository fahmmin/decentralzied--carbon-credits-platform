"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IssueCreditsProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const IssueCredits = ({
    client,
    publicKey,
    onTransaction
}: IssueCreditsProps) => {
    const [issuer, setIssuer] = useState(publicKey);
    const [projectId, setProjectId] = useState("");
    const [amount, setAmount] = useState("");
    const [vintage, setVintage] = useState("");
    const [recipient, setRecipient] = useState(publicKey);

    const handleIssueCredits = async () => {
        if (!issuer || !projectId || !amount || !vintage || !recipient) {
            alert("All fields are required!");
            return;
        }

        const projectIdNum = parseInt(projectId);
        const vintageNum = parseInt(vintage);
        const amountNum = BigInt(amount);

        if (isNaN(projectIdNum) || isNaN(vintageNum) || amountNum <= 0) {
            alert("Project ID, Vintage must be valid numbers and Amount must be greater than 0!");
            return;
        }

        // Validate vintage year is reasonable
        const currentYear = new Date().getFullYear();
        if (vintageNum < 2000 || vintageNum > currentYear + 1) {
            alert(`Vintage year must be between 2000 and ${currentYear + 1}`);
            return;
        }

        try {
            // First, verify the project exists and check issuer
            try {
                const projectTx = await client.get_project({
                    project_id: projectIdNum,
                }, { simulate: true });

                if (!projectTx.result) {
                    alert(`Project with ID ${projectIdNum} does not exist. Please register the project first.`);
                    return;
                }

                // Check if issuer matches
                if (projectTx.result.issuer !== issuer) {
                    alert(`Only the project issuer (${projectTx.result.issuer}) can issue credits for this project.\n\nYour issuer address: ${issuer}`);
                    return;
                }
            } catch (projectError: any) {
                const projectErrorMsg = projectError.message || String(projectError);
                if (projectErrorMsg.includes("does not exist") || projectErrorMsg.includes("not found")) {
                    alert(`Project with ID ${projectIdNum} does not exist. Please register the project first.`);
                    return;
                }
                // If it's a different error, continue and let the issue_credits call handle it
                console.warn("Could not verify project:", projectError);
            }

            // Proceed with issuing credits
            const promise = client.issue_credits({
                issuer,
                project_id: projectIdNum,
                amount: amountNum,
                vintage: vintageNum,
                recipient,
            }).then(tx => tx.signAndSend());

            onTransaction(promise, "Carbon credits issued successfully!");

            // Reset form (keep issuer and recipient)
            setProjectId("");
            setAmount("");
            setVintage("");
        } catch (error: any) {
            console.error("Error issuing credits:", error);
            const errorMessage = error.message || String(error);

            if (errorMessage.includes("Project does not exist") || errorMessage.includes("does not exist")) {
                alert(`Project with ID ${projectIdNum} does not exist. Please register the project first.`);
            } else if (errorMessage.includes("Only project issuer") || errorMessage.includes("issuer")) {
                alert(`Only the project issuer can issue credits for this project. Please verify you are using the correct issuer address.`);
            } else if (errorMessage.includes("UnreachableCodeReached") || errorMessage.includes("InvalidAction")) {
                alert(`Transaction failed. Please verify:\n1. Project ID ${projectIdNum} exists\n2. You are the project issuer\n3. All parameters are valid\n\nError: ${errorMessage}`);
            } else {
                alert(`Error issuing credits: ${errorMessage}`);
            }
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Issue Carbon Credits</CardTitle>
                <CardDescription className="text-gray-400">
                    Issue carbon credits for a specific project. Credits will be assigned to the recipient address.
                    <br />
                    <span className="text-yellow-400 text-sm mt-2 block">
                        ⚠️ Note: The issuer address must match the project's issuer. Make sure the project exists and you are the project issuer.
                    </span>
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
                <div className="space-y-2">
                    <Label htmlFor="vintage" className="text-white">Vintage Year</Label>
                    <Input
                        id="vintage"
                        type="number"
                        value={vintage}
                        onChange={(e) => setVintage(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="2024"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                    <Input
                        id="recipient"
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                </div>
                <Button
                    onClick={handleIssueCredits}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Issue Credits
                </Button>
            </CardContent>
        </Card>
    );
};

export default IssueCredits;

