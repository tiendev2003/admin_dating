import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { toast } from "react-toastify"
import Header from '../../components/Dashboard/Header'
import { Badge } from '../../components/ui/badge'
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
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

import { RelationGoal } from '../../models/RelationGoal'
import { deleteRelationGoal, fetchRelationGoals } from '../../redux/relationGoalSlice'
import { AppDispatch, RootState } from "../../redux/store"

 

export default function RelationGoalList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{
        key: keyof RelationGoal
        direction: 'asc' | 'desc'
    } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const dispatch: AppDispatch = useDispatch();
    const { relationGoals, loading, error, isDeleting } = useSelector((state: RootState) => state.relationGoal);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchRelationGoals());
    }, [dispatch]);

    const confirmDelete = () => {
        if (deleteId !== null) {
            dispatch(deleteRelationGoal(deleteId.toString()))
                .unwrap()
                .then(() => {
                    toast.success("Relation Goal deleted successfully");
                    dispatch(fetchRelationGoals());
                })
                .catch((error) => {
                    toast.error(`Failed to delete relation goal: ${error.message}`);
                });
            setDeleteId(null);
        }
    };

    const sortData = (key: keyof RelationGoal) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const filteredAndSortedData = useMemo(() => {
        let processed = Array.isArray(relationGoals) ? [...relationGoals] : []

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
    }, [relationGoals, searchTerm, sortConfig])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

    const { isSidebarOpen } = useAppContext()

    return (
        <div className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "pl-64" : "pl-16"
        )}>
            <Header />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Relation Goal List Management</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : relationGoals.length === 0 ? (
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
                                            Relation Goal Title
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead>Relation Goal Subtitle</TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => sortData('status')}
                                        >
                                            Relation Goal Status
                                            <span className="inline-block ml-1">↑↓</span>
                                        </TableHead>
                                        <TableHead className="w-20">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.map((goal) => (
                                        <TableRow key={goal.id}>
                                            <TableCell>{goal.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {goal.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>{goal.subtitle}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={goal.status === '1' ? 'primary' : 'secondary'}
                                                    className="cursor-pointer"

                                                >
                                                    {goal.status === "1" ? 'Publish' : 'UnPublish'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/relation-goal/edit/${goal.id}`}>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => setDeleteId(goal.id)}
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
                    <div>Are you sure you want to delete this relation goal?</div>
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