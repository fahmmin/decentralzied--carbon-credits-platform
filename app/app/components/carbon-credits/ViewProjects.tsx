"use client";

import { useState } from "react";
import { Client, CarbonProject } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ViewProjectsProps {
    client: Client;
    publicKey: string;
}

const ViewProjects = ({
    client,
    publicKey
}: ViewProjectsProps) => {
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<CarbonProject | null>(null);
    const [allProjects, setAllProjects] = useState<CarbonProject[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<"single" | "all">("single");

    const handleGetProject = async () => {
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
            const tx = await client.get_project({
                project_id: projectIdNum,
            }, { simulate: true });

            if (tx.result) {
                setProject(tx.result);
            } else {
                const result = await tx.signAndSend();
                if (result.result) {
                    setProject(result.result);
                } else {
                    setProject(null);
                }
            }
        } catch (error: any) {
            alert(`Error fetching project: ${error.message || 'Unknown error'}`);
            setProject(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGetAllProjects = async () => {
        setLoading(true);
        try {
            const tx = await client.get_all_projects({ simulate: true });

            if (tx.result) {
                setAllProjects(tx.result);
            } else {
                const result = await tx.signAndSend();
                if (result.result) {
                    setAllProjects(result.result);
                } else {
                    setAllProjects([]);
                }
            }
        } catch (error: any) {
            alert(`Error fetching projects: ${error.message || 'Unknown error'}`);
            setAllProjects([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">View Carbon Projects</CardTitle>
                <CardDescription className="text-gray-400">
                    View a specific project by ID or view all registered projects.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                    <Button
                        onClick={() => setViewMode("single")}
                        className={`flex-1 ${viewMode === "single" ? "bg-indigo-600" : "bg-gray-700"}`}
                    >
                        Single Project
                    </Button>
                    <Button
                        onClick={() => {
                            setViewMode("all");
                            handleGetAllProjects();
                        }}
                        className={`flex-1 ${viewMode === "all" ? "bg-indigo-600" : "bg-gray-700"}`}
                    >
                        All Projects
                    </Button>
                </div>

                {viewMode === "single" && (
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
                                onClick={handleGetProject}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {loading ? "Loading..." : "Fetch"}
                            </Button>
                        </div>

                        {project && (
                            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-3 mt-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-semibold text-xl">{project.name}</h4>
                                        <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                                    </div>
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        ID: {project.id}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div>
                                        <span className="text-gray-400 text-sm">Location:</span>
                                        <p className="text-white font-medium">{project.location}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Type:</span>
                                        <p className="text-white font-medium">{project.project_type}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Issuer:</span>
                                        <p className="text-white font-medium text-xs break-all">{project.issuer}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Total Credits Issued:</span>
                                        <p className="text-white font-medium">{project.total_credits_issued.toString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-sm">Created At:</span>
                                        <p className="text-white font-medium text-xs">{new Date(Number(project.created_at) * 1000).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === "all" && (
                    <div className="space-y-3">
                        {allProjects.length > 0 ? (
                            <>
                                <h3 className="text-lg font-semibold text-white">All Projects ({allProjects.length})</h3>
                                {allProjects.map((proj) => (
                                    <div
                                        key={proj.id}
                                        className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-semibold text-lg">{proj.name}</h4>
                                                <p className="text-gray-300 text-sm mt-1">{proj.description}</p>
                                            </div>
                                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                ID: {proj.id}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-400">Location:</span> {proj.location}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Type:</span> {proj.project_type}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Credits Issued:</span> {proj.total_credits_issued.toString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            !loading && (
                                <div className="text-gray-400 text-center py-4">
                                    No projects found.
                                </div>
                            )
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ViewProjects;

