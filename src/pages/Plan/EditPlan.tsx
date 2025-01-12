"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as z from 'zod'
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import { fetchPlan, updatePlan } from '../../redux/planSlice'
import { AppDispatch, RootState } from '../../redux/store'

import { useEffect } from 'react'
import Header from '../../components/Dashboard/Header'
import { Button } from '../../components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Textarea } from '../../components/ui/textarea'

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Plan title must be at least 2 characters.",
    }),
    amount: z.string().min(1, {
        message: "Plan amount must be at least 1.",
    }),
    dayLimit: z.string().min(1, {
        message: "Day limit must be at least 1.",
    }),
    description: z.string(),
    filterInclude: z.boolean(),
    audioVideo: z.boolean(),
    directChat: z.boolean(),
    chat: z.boolean(),
    likeMenu: z.boolean(),
    status: z.enum(["0", "1"], {
        required_error: "You need to select a status.",
    }),
})

export default function EditPlan() {
    const { isSidebarOpen } = useAppContext()
    const { id } = useParams<{ id: string }>()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { plan, loading } = useSelector((state: RootState) => state.plan);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            amount: "0",
            dayLimit: "0",
            status: "0",
            description: "",
            filterInclude: false,
            audioVideo: false,
            directChat: false,
            chat: false,
            likeMenu: false,

        },
    })
    useEffect(() => {
        if (id) {
            dispatch(fetchPlan(id))
        }
    }, [dispatch, id, form])

    useEffect(() => {
        if (plan) {
            form.reset({
                ...plan,
                status: plan.status as "0" | "1"
            })
        }
    }, [plan, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const updatedPlan = {
            id: id || "",
            ...values,
        }
        try {
            await dispatch(updatePlan(updatedPlan)).unwrap()
            toast.success("Plan updated successfully!")
            navigate("/plan/list")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update plan")
            } else {
                toast.error("Failed to update plan")
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
                <h1 className="text-2xl font-bold mb-6">Edit Plan</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter plan title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Amount</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter amount" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dayLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Day Limit</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter day limit" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter plan description"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <FormField
                                control={form.control}
                                name="filterInclude"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Filter Include?</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="audioVideo"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Audio Video?</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="directChat"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Direct Chat?</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="chat"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Chat?</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="likeMenu"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Like Menu?</FormLabel>
                                        <FormControl>
                                            <Switch onCheckedChange={field.onChange} checked={field.value} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Plan"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
