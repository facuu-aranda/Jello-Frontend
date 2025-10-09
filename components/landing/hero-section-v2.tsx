// Archivo: Jello-Frontend/components/landing/hero-section-v2.tsx

"use client"

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TaskSummary } from '@/types'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/tasks/task-card'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui'

const mockTasks: TaskSummary[] = [
    {
        id: '1',
        title: 'Draft Q3 marketing report',
        priority: 'high',
        labels: [{ _id: 'l1', name: 'Marketing', color: '#ff6f61' }],
        assignees: [{ id: 'u1', name: 'A', avatarUrl: '/avatars/sophie.png' }],
        subtasks: { total: 2, completed: 1 },
        status: 'in-progress',
        dueDate: '2025-08-15',
        commentCount: 3,
        attachmentCount: 1,
        projectId: 'proj-1'
    },
    {
        id: '2',
        title: 'Develop new landing page design',
        priority: 'medium',
        labels: [{ _id: 'l2', name: 'Design', color: '#ec4899' }],
        assignees: [{ id: 'u2', name: 'M', avatarUrl: '/avatars/michael.png' }],
        subtasks: { total: 5, completed: 4 },
        status: 'review',
        dueDate: '2025-08-20',
        commentCount: 8,
        attachmentCount: 2,
        projectId: 'proj-1'
    },
    {
        id: '3',
        title: 'Fix authentication bug on mobile',
        priority: 'low',
        labels: [{ _id: 'l3', name: 'Bug', color: '#be123c' }],
        assignees: [{ id: 'u3', name: 'E', avatarUrl: '/avatars/eva.png' }],
        subtasks: { total: 1, completed: 1 },
        status: 'done',
        dueDate: '2025-07-30',
        commentCount: 2,
        attachmentCount: 0,
        projectId: 'proj-2'
    },
];

export function HeroSectionV2() {
    return (
        <section className="w-full py-20 md:py-32 bg-grid-pattern relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Badge variant="secondary" className="mb-4">Introducing Jello 2.0</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-6">
                        The Future of Project Management is Here
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
                        Jello helps teams move work forward. A single platform for project management, collaboration, and automation.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/register">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/showcase">Explore Features</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
            
            <div className="absolute -bottom-20 -left-10 -right-10 h-60">
                <div className="flex justify-center items-end h-full gap-4 perspective-1000">
                    <motion.div initial={{ y: 50, opacity: 0, rotateX: 20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-72">
                        <TaskCard task={mockTasks[0]} />
                    </motion.div>
                    <motion.div initial={{ y: 50, opacity: 0, rotateX: 20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="w-72 mb-10">
                        <TaskCard task={mockTasks[1]} />
                    </motion.div>
                    <motion.div initial={{ y: 50, opacity: 0, rotateX: 20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="w-72">
                        <TaskCard task={mockTasks[2]} />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}