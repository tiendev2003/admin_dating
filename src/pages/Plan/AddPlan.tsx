"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as z from 'zod'
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import { addPlan } from '../../redux/planSlice'
import { AppDispatch } from '../../redux/store'

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
  amt: z.string().min(1, {
    message: "Plan amount must be at least 1.",
  }),
  day_limit: z.string().min(1, {
    message: "Day limit must be at least 1.",
  }),
  description: z.string().optional(),
  filterInclude: z.boolean().optional(),
  audioVideo: z.boolean().optional(),
  directChat: z.boolean().optional(),
  chat: z.boolean().optional(),
  likeMenu: z.boolean().optional(),
  status: z.enum(["publish", "unpublish"], {
    required_error: "You need to select a status.",
  }),
})

export default function AddPlan() {
  const { isSidebarOpen } = useAppContext()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amt: "0",
      day_limit: "0",
      status: "publish",
    },
  })

  const dispatch = useDispatch<AppDispatch>();
  const isAdding = useSelector((state: { plan: { isAdding: boolean } }) => state.plan.isAdding);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const planWithId = {
      id: crypto.randomUUID(),
      ...values,
    };
    try {
      await dispatch(addPlan(planWithId)).unwrap();
      toast.success("Plan added successfully!");
      navigate("/plan/list");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add plan");
      } else {
        toast.error("Failed to add plan");
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
        <h1 className="text-2xl font-bold mb-6">Add Plan</h1>

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
                name="amt"
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
                name="day_limit"
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="publish">Publish</SelectItem>
                      <SelectItem value="unpublish">UnPublish</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Plan"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

