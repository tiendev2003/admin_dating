
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
import { fetchFaq, updateFaq } from '../../redux/faqSlice'
import { AppDispatch, RootState } from '../../redux/store'

const formSchema = z.object({
    question: z.string().min(2, {
        message: "Question must be at least 2 characters.",
    }),
    answer: z.string().min(2, {
        message: "Answer must be at least 2 characters.",
    }),
    status: z.enum(["0", "1"], {
        required_error: "You need to select a status.",
    }),
})

export default function EditFaq() {
    const { id } = useParams<{ id: string }>()
    const { isSidebarOpen } = useAppContext()
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { faq, loading: isUpdating } = useSelector((state: RootState) => state.faq)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            answer: "",
            status: "0",
        },
    })

    useEffect(() => {
        if (id) {
            dispatch(fetchFaq(id))
        }
    }, [dispatch, id, form])

    useEffect(() => {
        if (faq) {
            form.reset({
                ...faq,
                status: faq.status as "0" | "1"
            })
        }
    }, [faq, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!id) {
            toast.error("FAQ ID is missing")
            return
        }
        const faqWithId = { ...values, id }
        try {
            await dispatch(updateFaq(faqWithId)).unwrap()
            toast.success("FAQ updated successfully!")
            navigate('/faq/list') // Navigate to the list page
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update FAQ")
            } else {
                toast.error("Failed to update FAQ")
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
                <h1 className="text-2xl font-bold mb-6">Edit FAQ</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter question" {...field} disabled={isUpdating} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter answer" {...field} disabled={isUpdating} />
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
                                    <FormLabel>Status</FormLabel>
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
                            {isUpdating ? "Updating..." : "Update FAQ"}
                        </Button>
                    </form>
                </Form>
                {isUpdating && <div className="flex justify-center mt-4"><div className="loader"></div></div>}
            </div>
        </div>
    )
}