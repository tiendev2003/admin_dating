"use client"

import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Header from '../../components/Dashboard/Header'
import { Badge } from '../../components/ui/badge'
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { deletePlan, fetchPlans } from '../../redux/planSlice'
import { AppDispatch, RootState } from "../../redux/store"

import { Link } from 'react-router-dom'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'

interface Plan {
    id: number
    title: string
    amount: string
    dayLimit: string
    filterInclude: boolean
    directChat: boolean
    chat: boolean
    likeMenu: boolean
    audioVideo: boolean
    status: "Publish" | "Draft"
}

export default function PlanList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Plan
        direction: 'asc' | 'desc'
    } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const dispatch: AppDispatch = useDispatch()
    const { plans, loading, error, isDeleting } = useSelector((state: RootState) => state.plan)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchPlans())
    }, [dispatch])

    const confirmDelete = () => {
        if (deleteId !== null) {
            dispatch(deletePlan(deleteId.toString()))
                .unwrap()
                .then(() => {
                    toast.success("Plan deleted successfully")
                    dispatch(fetchPlans())
                })
                .catch((error) => {
                    toast.error(`Failed to delete plan: ${error.message}`)
                })
            setDeleteId(null)
        }
    }

    const sortData = (key: keyof Plan) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const filteredAndSortedData = useMemo(() => {
        let processed = [...plans]

        if (searchTerm) {
            processed = processed.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (sortConfig) {
            processed.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        return processed
    }, [plans, searchTerm, sortConfig])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

    const handleStatusToggle = (id: string) => {
        console.log(`Toggling status for plan with id: ${id}`)
    }
    const { isSidebarOpen } = useAppContext()

    return (
        <div className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "pl-64" : "pl-16"
        )}>
            <Header />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Plan List Management</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : plans.length === 0 ? (
                    <div className="text-center">No data available</div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span>Show</span>
                                <Select
                                    defaultValue={itemsPerPage.toString()}
                                    onValueChange={(value) => {
                                        setItemsPerPage(Number(value))
                                        setCurrentPage(1)
                                    }}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>entries</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span>Search:</span>
                                <Input
                                    className="max-w-xs"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="w-20 cursor-pointer"
                                            onClick={() => sortData('id')}
                                        >
                                            Sr No.
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('title')}
                                        >
                                            Plan Title
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('amount')}
                                        >
                                            Plan Amount
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('dayLimit')}
                                        >
                                            Day Limit
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('filterInclude')}
                                        >
                                            Filter Include ?
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('directChat')}
                                        >
                                            Direct Chat ?
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('chat')}
                                        >
                                            Chat ?
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('likeMenu')}
                                        >
                                            Like Menu ?
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('audioVideo')}
                                        >
                                            Audio Video ?
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('status')}
                                        >
                                            Plan Status
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead className="w-20">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell>{plan.id}</TableCell>
                                            <TableCell className="font-medium">{plan.title}</TableCell>
                                            <TableCell>{new Intl.NumberFormat('vn-VI',).format(Number(plan.amt))} đ</TableCell>
                                            <TableCell>{plan.day_limit}</TableCell>
                                            <TableCell>{plan.filterInclude ? "Yes" : "No"}</TableCell>
                                            <TableCell>{plan.directChat ? "Yes" : "No"}</TableCell>
                                            <TableCell>{plan.chat ? "Yes" : "No"}</TableCell>
                                            <TableCell>{plan.likeMenu ? "Yes" : "No"}</TableCell>
                                            <TableCell>{plan.audioVideo ? "Yes" : "No"}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={plan.status === '1' ? 'primary' : 'secondary'}
                                                    className="cursor-pointer"
                                                    onClick={() => handleStatusToggle(plan.id)}
                                                >
                                                    {plan.status === '1' ? 'Publish' : 'Unpublish'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>

                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/plan/edit/${plan.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() => setDeleteId(plan.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="text-sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[40px]"
                                >
                                    {currentPage}
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className="text-sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {error && <div className="text-red-500">{error}</div>}
            </div>
            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div>Are you sure you want to delete this plan?</div>
                    <DialogFooter>
                        <Button variant="default" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

