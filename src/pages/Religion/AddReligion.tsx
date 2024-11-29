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
import { addReligion } from '../../redux/religionSlice'
import { AppDispatch } from '../../redux/store'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Religion title must be at least 2 characters.",
  }),
  status: z.enum(["0", "1"], {
    required_error: "You need to select a status.",
  }),
})

export default function AddReligion() {
  const { isSidebarOpen } = useAppContext()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "1",
    },
  })
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>();
  const isAdding = useSelector((state: { religion: { isAdding: boolean } }) => state.religion.isAdding);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const religionWithId = { ...values, id: crypto.randomUUID() };
    try {
      await dispatch(addReligion(religionWithId)).unwrap();
      toast.success("Religion added successfully!");
      navigate("/religion/list");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add religion");
      } else {
        toast.error("Failed to add religion");
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
        <h1 className="text-2xl font-bold mb-6">Add Religion</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religion Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter religion title" {...field} disabled={isAdding} />
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
                  <FormLabel>Religion Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isAdding}>
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
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Religion"}
            </Button>
          </form>
        </Form>
        {isAdding && <div className="flex justify-center mt-4"><div className="loader"></div></div>}
      </div>
    </div>
  )
}

