"use client"

import * as React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from "../../components/Dashboard/Header"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { useAppContext } from "../../contexts/AppContext"
import { cn } from "../../lib/utils"
import { addFaq } from '../../redux/faqSlice'
import { AppDispatch, RootState } from '../../redux/store'

interface FAQFormData {
  id: string
  question: string
  answer: string
  status: string
}

export default function AddFaq() {
  const { isSidebarOpen } = useAppContext()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const isAdding = useSelector((state: RootState) => state.faq.isAdding)

  const [formData, setFormData] = React.useState<FAQFormData>({
    id: "",
    question: "",
    answer: "",
    status: "1"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(addFaq(formData)).unwrap()
      toast.success("FAQ added successfully!")
      navigate("/faq/list")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add FAQ")
      } else {
        toast.error("Failed to add FAQ")
      }
    }
  }

  const handleChange = (field: keyof FAQFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className={cn(
      "transition-all duration-300",
      isSidebarOpen ? "pl-64" : "pl-16"
    )}>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add FAQ</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Enter Question</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => handleChange("question", e.target.value)}
              placeholder="Enter Question"
              disabled={isAdding}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Enter Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              placeholder="Enter Answer"
              className="min-h-[100px]"
              disabled={isAdding}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">FAQ Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
              disabled={isAdding}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Published</SelectItem>
                <SelectItem value="0">Unpublished </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add FAQ"}
          </Button>
        </form>
        {isAdding && <div className="flex justify-center mt-4"><div className="loader"></div></div>}
      </div>
    </div>
  )
}

