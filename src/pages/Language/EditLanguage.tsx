
"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import { fetchLanguage, updateLanguage } from '../../redux/languageSlice'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
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
import { AppDispatch, RootState } from '../../redux/store'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Language title must be at least 2 characters.",
  }),
  status: z.enum(["0", "1"], {
    required_error: "You need to select a status.",
  }),
  image: z.instanceof(File).optional(),
})

export default function EditLanguage() {
  const { isSidebarOpen } = useAppContext()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "0",
    },
  })

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>();
  const { language, loading } = useSelector((state: RootState) => state.language);

  const [previewImage, setPreviewImage] = React.useState<string>("")

  useEffect(() => {
    if (id) {
      dispatch(fetchLanguage(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (language) {
      form.setValue("title", language.title);
      form.setValue("status", language.status as "0" | "1");
      setPreviewImage(import.meta.env.VITE_URL_BACKEND + "/" + language.img);
    }
  }, [language, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedLanguage = new FormData()
    updatedLanguage.append("id", id!);
    updatedLanguage.append("title", values.title)
    updatedLanguage.append("status", values.status)
    if (values.image) {
      updatedLanguage.append("image", values.image)
    }
    try {
      await dispatch(updateLanguage({
        id: id!,
        language: updatedLanguage
      })).unwrap();
      toast.success("Language updated successfully!");
      navigate("/language/list");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      } else {
        console.error("Failed to update");
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
        <h1 className="text-2xl font-bold mb-6">Edit Language</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
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

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Update Language
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}