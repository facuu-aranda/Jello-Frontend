"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { TaskModal } from "@/components/tasks/task-modal"
import { cn } from "@/lib/utils"
import { TaskDetails, Label, Subtask, UserSummary } from "@/types" // Importamos los tipos necesarios

// CORRECCIÓN: La interfaz local 'Task' ahora es compatible con 'TaskDetails'
// al incluir la propiedad 'assignees'.
interface Task extends TaskDetails {
    project: string; // Añadimos 'project' que se usa en esta página
}

// CORRECCIÓN: Se añade la propiedad 'assignees' a los datos de ejemplo.
const mockTasks: Task[] = [
    { id: "1", title: "Design new user onboarding flow", description: "Create wireframes and mockups for the improved user onboarding experience", status: "in-progress", priority: "high", project: "Mobile App Redesign", projectId: "2", dueDate: "2025-01-14", subtasks: [], comments: [], attachments: [], labels: [{id: "1", name: "Design", color: "#ec4899"}, {id: "2", name: "UX", color: "#8b5cf6"}], assignees: [{id: '1', name: 'Sarah', avatarUrl: '/sarah-avatar.png'}] },
    { id: "2", title: "Implement authentication system", description: "Set up JWT-based authentication with refresh tokens", status: "todo", priority: "high", project: "Backend API", projectId: "4", dueDate: "2025-01-17", subtasks: [], comments: [], attachments: [], labels: [{id: "3", name: "Backend", color: "#14b8a6"}, {id: "4", name: "Security", color: "#ef4444"}], assignees: [{id: '2', name: 'Mike', avatarUrl: '/mike-avatar.jpg'}] },
    { id: "3", title: "Write unit tests for user service", description: "Comprehensive test coverage for all user-related operations", status: "review", priority: "medium", project: "Backend API", projectId: "4", dueDate: "2025-02-01", subtasks: [], comments: [], attachments: [], labels: [{id: "5", name: "Testing", color: "#f59e0b"}, {id: "3", name: "Backend", color: "#14b8a6"}], assignees: [] },
    { id: "4", title: "Update documentation", description: "Update API documentation with new endpoints", status: "done", priority: "low", project: "Documentation", projectId: "3", dueDate: "2025-02-10", subtasks: [], comments: [], attachments: [], labels: [{id: "6", name: "Docs", color: "#6b7280"}], assignees: [] },
];

const statusConfig = {
    "all": { color: "bg-gray-500", label: "All Tasks" }, "todo": { color: "bg-gray-500", label: "To Do" },
    "in-progress": { color: "bg-blue-500", label: "In Progress" }, "review": { color: "bg-yellow-500", label: "Review" },
    "done": { color: "bg-green-500", label: "Done" },
};

export default function MyTasksPage() {
    const [tasks] = React.useState(mockTasks);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<keyof typeof statusConfig>("all");
    const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const tasksByStatus = {
        todo: tasks.filter((t) => t.status === "todo").length,
        "in-progress": tasks.filter((t) => t.status === "in-progress").length,
        review: tasks.filter((t) => t.status === "review").length,
        done: tasks.filter((t) => t.status === "done").length,
    };

    const StatCard = ({ status, count }: { status: keyof typeof tasksByStatus | 'all'; count: number }) => {
        const config = statusConfig[status];
        return (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStatusFilter(status)} className="w-full text-left">
                <div className={cn("glass-card p-4 rounded-2xl transition-all", statusFilter === status ? 'ring-2 ring-primary' : 'ring-0 ring-transparent')}>
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${config.color}`} />
                        <div>
                            <p className="text-2xl font-bold text-foreground">{count}</p>
                            <p className="text-sm text-muted-foreground capitalize">{config.label}</p>
                        </div>
                    </div>
                </div>
            </motion.button>
        );
    };

    return (
        <>
            <AppLayout>
                <div className="max-w-4xl mx-auto space-y-8 p-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
                        <p className="text-muted-foreground">All tasks assigned to you across projects</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatCard status="all" count={tasks.length} />
                        <StatCard status="todo" count={tasksByStatus.todo} />
                        <StatCard status="in-progress" count={tasksByStatus["in-progress"]} />
                        <StatCard status="review" count={tasksByStatus.review} />
                        <StatCard status="done" count={tasksByStatus.done} />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Search tasks..." className="pl-12 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        {filteredTasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                className="glass-card p-4 rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedTask(task)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-1.5 h-16 rounded-full ${statusConfig[task.status].color}`} />
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{task.title}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span>{task.project}</span>
                                            <span>•</span>
                                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-1">
                                            {task.labels.map(label => <Badge key={label.id} variant="secondary" style={{ backgroundColor: label.color + '20', color: label.color }}>{label.name}</Badge>)}
                                        </div>
                                        <Button asChild variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                            <Link href={`/project/${task.projectId}`}>Go to project <ArrowRight className="w-3 h-3 ml-2" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </AppLayout>

            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                showGoToProjectButton={true}
            />
        </>
    )
}

