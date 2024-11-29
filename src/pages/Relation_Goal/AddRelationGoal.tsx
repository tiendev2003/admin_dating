"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as z from 'zod'
import Header from "../../components/Dashboard/Header"
import { Button } from "../../components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../components/ui/form'
import { Input } from "../../components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { useAppContext } from "../../contexts/AppContext"
import { cn } from "../../lib/utils"
import { addRelationGoal } from '../../redux/relationGoalSlice'
import { AppDispatch } from '../../redux/store'

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Relation goal title must be at least 2 characters.",
    }),
    subtitle: z.string().min(2, {
        message: "Relation goal subtitle must be at least 2 characters.",
    }),
    status: z.enum(["Publish", "Draft"], {
        required_error: "You need to select a status.",
    }),
})

export default function AddRelationGoal() {
    const { isSidebarOpen } = useAppContext()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            status: "Publish",
        },
    })
    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>();
    const isAdding = useSelector((state: { relationGoal: { isAdding: boolean } }) => state.relationGoal.isAdding);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const relationGoalWithId = { ...values, id: crypto.randomUUID() };
        try {
            await dispatch(addRelationGoal(relationGoalWithId)).unwrap();
            toast.success("Relation goal added successfully!");
            navigate("/relation-goal/list");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to add relation goal");
            } else {
                toast.error("Failed to add relation goal");
            }
        }
    }

    return (
        <div className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "pl-64" : "pl-16"
        )}>
            <Header />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Add Relation Goal</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation Goal Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter relation goal title" {...field} disabled={isAdding} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation Goal Subtitle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter relation goal subtitle" {...field} disabled={isAdding} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation Goal Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isAdding}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Publish">Publish</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding..." : "Add Relation Goal"}
                        </Button>
                    </form>
                </Form>
                {isAdding && <div className="flex justify-center mt-4"><div className="loader"></div></div>}
            </div>
        </div>
    )
}

