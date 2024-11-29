
"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
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
import { fetchRelationGoal, updateRelationGoal } from '../../redux/relationGoalSlice'
import { AppDispatch, RootState } from '../../redux/store'

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Relation goal title must be at least 2 characters.",
    }),
    subtitle: z.string().min(2, {
        message: "Relation goal subtitle must be at least 2 characters.",
    }),
    status: z.enum(["0", "1"], {
        required_error: "You need to select a status.",
    }),
})

export default function EditRelationGoal() {
    const { id } = useParams<{ id: string }>()
    const { isSidebarOpen } = useAppContext()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { relationGoal, loading: isUpdating } = useSelector((state: RootState) => state.relationGoal)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            status: "1",
        },
    })

    useEffect(() => {
        if (id) {
            dispatch(fetchRelationGoal(id))
        }
    }, [dispatch, id, form])

    useEffect(() => {
        if (relationGoal) {
            console.log(relationGoal)
            form.reset({
                title: relationGoal.title,
                subtitle: relationGoal.subtitle,
                status: relationGoal.status as "0" | "1"
            })
        }
    }, [relationGoal, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!id) {
            toast.error("Relation goal ID is missing")
            return
        }
        const relationGoalWithId = { ...values, id }
        try {
            await dispatch(updateRelationGoal(relationGoalWithId)).unwrap()
            toast.success("Relation goal updated successfully!")
            navigate('/relation-goal/list') // Navigate to the list page
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update relation goal")
            } else {
                toast.error("Failed to update relation goal")
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
                <h1 className="text-2xl font-bold mb-6">Edit Relation Goal</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation Goal Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter relation goal title" {...field} disabled={isUpdating} />
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
                                        <Input placeholder="Enter relation goal subtitle" {...field} disabled={isUpdating} />
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
                                    <Select onValueChange={field.onChange} value={field.value} disabled={isUpdating}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Publish</SelectItem>
                                            <SelectItem value="0">UnPublish</SelectItem>

                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update Relation Goal"}
                        </Button>
                    </form>
                </Form>
                {isUpdating && <div className="flex justify-center mt-4"><div className="loader"></div></div>}
            </div>
        </div>
    )
}