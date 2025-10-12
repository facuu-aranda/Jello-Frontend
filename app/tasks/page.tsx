"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, AlertTriangle } from "lucide-react"
import { TaskModal } from "@/components/tasks/task-modal"
import { cn } from "@/lib/utils"
import { TaskDetails, TaskSummary } from "@/types"
import { useApi } from "@/hooks/useApi"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig: { [key: string]: { color: string; label: string } } = {
    "all": { color: "bg-gray-500", label: "All Tasks" },
    "todo": { color: "bg-gray-500", label: "To Do" },
    "in-progress": { color: "bg-blue-500", label: "In Progress" },
    "review": { color: "bg-yellow-500", label: "Review" },
    "done": { color: "bg-green-500", label: "Done" },
};

export default function MyTasksPage() {
    // --- MODIFICADO: Estado para filtros y datos de la API ---
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<keyof typeof statusConfig>("all");
    const { data: tasks, isLoading, error, refetch } = useApi<TaskSummary[]>(`/tasks/my-tasks`);
    const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null);

    // --- MODIFICADO: Lógica de filtrado en el frontend ---
    const filteredTasks = React.useMemo(() => {
        return tasks?.filter((task) => {
            const matchesStatus = statusFilter === "all" || task.status === statusFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        }) || [];
    }, [tasks, statusFilter, searchQuery]);

    const tasksByStatus = React.useMemo(() => ({
        todo: tasks?.filter((t) => t.status === "todo").length || 0,
        "in-progress": tasks?.filter((t) => t.status === "in-progress").length || 0,
        review: tasks?.filter((t) => t.status === "review").length || 0,
        done: tasks?.filter((t) => t.status === "done").length || 0,
    }), [tasks]);

    // --- NUEVO: Función para abrir el modal con detalles de la tarea ---
    const handleTaskView = async (taskSummary: TaskSummary) => {
        try {
            toast.info("Loading task details...");
            const taskDetails = await apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`);
            setSelectedTask(taskDetails);
            toast.dismiss();
        } catch (err) {
            toast.error("Failed to load task details.");
        }
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
                        <StatCard status="all" count={tasks?.length || 0} />
                        <StatCard status="todo" count={tasksByStatus.todo} />
                        <StatCard status="in-progress" count={tasksByStatus["in-progress"]} />
                        <StatCard status="review" count={tasksByStatus.review} />
                        <StatCard status="done" count={tasksByStatus.done} />
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Search tasks..." className="pl-12 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    
                    {/* --- MODIFICADO: Manejo de estados de carga y error --- */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                        </div>
                    ) : error ? (
                        <div className="text-center text-destructive"><AlertTriangle className="mx-auto mb-2" /> {error}</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    className="glass-card p-4 rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleTaskView(task)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-16 rounded-full ${statusConfig[task.status].color}`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">{task.title}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                <span>{task.projectId}</span>
                                                <span>•</span>
                                                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex gap-1">
                                                {task.labels.map(label => <Badge key={label._id} variant="secondary" style={{ backgroundColor: label.color + '20', color: label.color }}>{label.name}</Badge>)}
                                            </div>
                                            <Button asChild variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                                <Link href={`/project/${task.projectId}`}>Go to project <ArrowRight className="w-3 h-3 ml-2" /></Link>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </AppLayout>

            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onDataChange={refetch}
                showGoToProjectButton={true}
            />
        </>
    )
}