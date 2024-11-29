import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as z from 'zod'
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
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import { addLanguage } from '../../redux/languageSlice'
import { AppDispatch } from '../../redux/store'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Language title must be at least 2 characters.",
  }),
  status: z.enum(["0", "1"], {
    required_error: "You need to select a status.",
  }),
  image: z.instanceof(File).optional(),
})

export default function AddLanguage() {
  const { isSidebarOpen } = useAppContext()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "1",
    },
  })
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
   const navigate = useNavigate()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const languageWithId = new FormData()
    languageWithId.append("title", values.title)
    languageWithId.append("status", values.status)
    if (values.image) {
      languageWithId.append("image", values.image)
    }
    try {
      await dispatch(addLanguage(languageWithId)).unwrap();
      toast.success("Language added successfully!");
      navigate("/language/list");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      } else {
        console.error("Failed to add");
      }
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={cn(
      "transition-all duration-300",
      isSidebarOpen ? "pl-64" : "pl-16"
    )}>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add Language</h1>
        
       
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormItem>
                <FormLabel>Language Image</FormLabel>
                <div className="flex items-center gap-4">
                  <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose file</span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {previewImage && (
                    <div className="relative w-20 h-20">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language title" {...field} />
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
                    <FormLabel>Language Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Add Language
              </Button>
            </form>
          </Form>
       </div>
    </div>
  )
}