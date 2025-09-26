"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Button,
  Input,
  Textarea,
  Modal,
  Avatar,
  Spinner,
  Badge,
  Checkbox,
  Icon,
  LanguageSwitcher,
  ColorPicker,
  DatePicker,
} from "@/components/ui"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnimatedBackground } from "@/components/animated-background"
import { JelliChat } from "@/components/jelli-chat"
import { ProjectCard } from "@/components/project-card"
import { TaskCard } from "@/components/tasks/task-card"
import { Heart, Star, Download, Share, Settings, Eye } from "lucide-react"

export default function ComponentShowcasePage() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [colorValue, setColorValue] = useState("#3b82f6")
  const [dateValue, setDateValue] = useState<Date>()
  
  const showcaseSections = [
    {
      title: "UI Primitives",
      description: "Core building blocks of the Jello design system",
      components: [
        {
          name: "Buttons",
          component: (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button disabled>Loading...</Button>
                <Button>
                  <Heart className="w-4 h-4 mr-2" />
                  With Icon
                </Button>
              </div>
            </div>
          ),
        },
        {
          name: "Form Controls",
          component: (
            <div className="space-y-4 max-w-md">
              <Input
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input type="password" placeholder="Password" />
              <Input disabled placeholder="Disabled input" />
              <Textarea
                placeholder="Tell us about yourself..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={3}
              />
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3">
                <Checkbox checked={checkboxValue} onCheckedChange={(checked) => setCheckboxValue(Boolean(checked))} />
                <label className="text-sm text-foreground">Accept terms and conditions</label>
              </div>
            </div>
          ),
        },
        {
          name: "Feedback & Status",
          component: (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                <Button onClick={() => setShowToast(true)}>Show Toast</Button>
              </div>
            </div>
          ),
        },
        {
          name: "Avatars & Icons",
          component: (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <img src="/sarah-avatar.png" alt="Small" />
                </Avatar>
                <Avatar className="w-10 h-10">
                  <img src="/mike-avatar.jpg" alt="Default" />
                </Avatar>
                <Avatar className="w-12 h-12">
                  <img src="/images/jelli-avatar.png" alt="Large" />
                </Avatar>
              </div>
              <div className="flex flex-wrap gap-3">
                <Icon as={Heart} className="text-red-500" />
                <Icon as={Star} className="text-yellow-500" />
                <Icon as={Download} className="text-blue-500" />
                <Icon as={Share} className="text-green-500" />
                <Icon as={Settings} className="text-gray-500" />
              </div>
            </div>
          ),
        },
      ],
    },
     {
      title: "Advanced Components",
      description: "Specialized components for productivity features",
      components: [
        {
          name: "Color & Date Pickers",
          component: (
            <div className="space-y-4 max-w-md">
              <ColorPicker value={colorValue} onChange={setColorValue} />
              <DatePicker date={dateValue} onDateChange={setDateValue} placeholder="Select a date" />
              <LanguageSwitcher />
            </div>
          ),
        },
        {
          name: "Project Card",
          component: (
            <div className="max-w-sm">
              <ProjectCard
                project={{
                  id: "1",
                  name: "Jello Design System",
                  description: "Building the next generation productivity platform",
                  progress: 75,
                  dueDate: "2024-02-15",
                  members: [
                    { id: "1", name: "Sarah Chen", avatar: "/sarah-avatar.png" },
                    { id: "2", name: "Mike Johnson", avatar: "/mike-avatar.jpg" },
                  ],
                  totalTasks: 24,
                  completedTasks: 18,
                  color: "#3b82f6",
                  isOwner: true,
                }}
                onEdit={() => {}}
              />
            </div>
          ),
        },
        {
          name: "Task Card",
          component: (
            <div className="max-w-sm">
              <TaskCard
                task={{
                  id: "1",
                  title: "Design new component library",
                  priority: "high",
                  labels: [{id: '1', name: 'Design', color: '#ec4899'}, {id: '2', name: 'Frontend', color: '#8b5cf6'}],
                  assignees: [{
                    id: "1",
                    name: "Sarah Chen",
                    avatar: "/sarah-avatar.png",
                  }],
                  dueDate: "2024-02-10",
                  subtasks: { completed: 3, total: 5 },
                  attachmentsCount: 2,
                  commentsCount: 4,
                }}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: "Interactive Demos",
      description: "Live demonstrations of complex components",
      components: [
        {
          name: "AI Assistant Chat",
          component: (
            <div className="h-96 max-w-2xl">
              <JelliChat />
            </div>
          ),
        },
      ],
    },
    {
      title: "Design System",
      description: "Colors, typography, and visual elements",
      components: [
        {
          name: "Color Palette",
          component: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-jello-blue rounded-lg border border-white/20"></div>
                  <p className="text-sm font-medium">Jello Blue</p>
                  <p className="text-xs text-muted-foreground">#3b82f6</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-jello-accent rounded-lg border border-white/20"></div>
                  <p className="text-sm font-medium">Jello Accent</p>
                  <p className="text-xs text-muted-foreground">#06b6d4</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-jello-success rounded-lg border border-white/20"></div>
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-xs text-muted-foreground">#10b981</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-jello-warning rounded-lg border border-white/20"></div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-xs text-muted-foreground">#f59e0b</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "Typography",
          component: (
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
                <h2 className="text-3xl font-bold text-foreground">Heading 2</h2>
                <h3 className="text-2xl font-semibold text-foreground">Heading 3</h3>
                <h4 className="text-xl font-semibold text-foreground">Heading 4</h4>
                <p className="text-base text-foreground leading-relaxed">
                  Body text with proper line height and spacing for optimal readability.
                </p>
                <p className="text-sm text-muted-foreground">Small text for captions and secondary information.</p>
              </div>
            </div>
          ),
        },
        {
          name: "Glassmorphism Effects",
          component: (
            <div className="relative h-32 rounded-2xl overflow-hidden">
              <AnimatedBackground />
              <div className="absolute inset-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 flex items-center justify-center">
                <p className="text-foreground font-medium">Glassmorphism Card</p>
              </div>
            </div>
          ),
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-jello-blue/5 to-jello-accent/5 relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <img
              src="/images/jelli-avatar.png"
              alt="Jelli"
              className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-jello-blue/30"
            />
            <h1 className="text-4xl font-bold text-foreground mb-4">Jello Component Showcase</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore the complete Crystal Jello design system with interactive components, glassmorphism effects, and
              smooth animations.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="bg-white/10 border-white/20">
              <Icon as={Eye} className="w-3 h-3 mr-1" />
              Interactive Preview
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20">
              <Icon as={Settings} className="w-3 h-3 mr-1" />
              Design System
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20">
              <Icon as={Star} className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
          </div>
        </div>

        {/* Component Sections */}
        <div className="space-y-16">
          {showcaseSections.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {section.components.map((component, componentIndex) => (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + componentIndex * 0.05 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-6">{component.name}</h3>
                    <div className="space-y-4">{component.component}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Build?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              All components are built with accessibility, responsiveness, and the Crystal Jello aesthetic in mind.
              Start building your next productivity app today!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="bg-jello-blue hover:bg-jello-blue/90">
                <Download className="w-4 h-4 mr-2" />
                Download Components
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share Showcase
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Demo */}
      <Modal open={showModal} onOpenChange={setShowModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Modal Example</h3>
          <p className="text-muted-foreground mb-6">
            This is a demonstration of the modal component with glassmorphism effects and smooth animations.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Demo */}
      {showToast && (
        <Toast onOpenChange={setShowToast}>
            <div className="grid gap-1">
                <ToastTitle>Showcase Loaded</ToastTitle>
                <ToastDescription>Component showcase loaded successfully!</ToastDescription>
            </div>
        </Toast>
      )}
    </div>
  )
}

