"use client"

import { useMemo, useState } from "react"
import Header from '../../components/Dashboard/Header'
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Pagination } from '../../components/ui/pagination'
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

interface User {
    id: number
    name: string
    email: string
    mobile: string
    rdate: string
    status: string
    ccode: string
    code: string
    refercode: string | null
    wallet: string
    gender: string
    lats: string
    longs: string
    profile_bio: string
    profile_pic: string | null
    birth_date: string
    search_preference: string
    radius_search: string
    relation_goal: string
    interest: string
    language: string
    religion: string
    other_pic: string
    plan_id: string
    plan_start_date: string | null
    plan_end_date: string | null
    is_subscribe: string
    history_id: string
    planName?: string
    height: string
    identity_picture: string | null
    is_verify: string
    direct_audio: string
    direct_video: string
    direct_chat: string
    createdAt: string
    updatedAt: string
}

const users: User[] = [
    {
        id: 5,
        name: "toilaai",
        mobile: "222222222",
        rdate: "2024-11-01T12:56:18.000Z",
        status: "1",
        ccode: "+84",
        code: "186094",
        refercode: null,
        wallet: "0",
        email: "toilaai@gmail.com",
        gender: "FEMALE",
        lats: "16.0029133",
        longs: "108.2364067",
        profile_bio: "toilai",
        profile_pic: null,
        birth_date: "2000-02-01T00:00:00.000Z",
        search_preference: "MALE",
        radius_search: "177.97",
        relation_goal: "1",
        interest: "1",
        language: "1,2",
        religion: "1",
        other_pic: "/uploads/1730465778863.jpg$;/uploads/1730465778864.jpg$;/uploads/1730465778864.jpg$;/uploads/1730465778865.jpg$;/uploads/1730465778865.jpg",
        plan_id: "0",
        plan_start_date: null,
        plan_end_date: null,
        is_subscribe: "0",
        history_id: "0",
        height: "",
        identity_picture: null,
        is_verify: "0",
        direct_audio: "1",
        direct_video: "1",
        direct_chat: "1",
        createdAt: "2024-11-01T12:56:18.000Z",
        updatedAt: "2024-11-01T13:32:31.000Z"
    }
    // ...other users...
]

export default function ListUser() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{
        key: keyof User
        direction: 'asc' | 'desc'
    } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Sorting function
    const sortData = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let processed = [...users]

        // Apply search filter
        if (searchTerm) {
            processed = processed.filter(item =>
                Object.values(item).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }

        // Apply sorting
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
    }, [searchTerm, sortConfig])

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem)

    const { isSidebarOpen } = useAppContext()

    return (
        <div className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "pl-64" : "pl-16"
        )}>
            <Header />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">User List Management</h1>

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

                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="w-16 cursor-pointer"
                                    onClick={() => sortData('id')}
                                >
                                    Sr No.
                                    <span className="inline-block ml-1">↑↓</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>mobile</TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => sortData('createdAt')}
                                >
                                    Join Date
                                    <span className="inline-block ml-1">↑↓</span>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Is Subscribe?</TableHead>
                                <TableHead>Plan Name</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Expired Date</TableHead>
                                <TableHead>Identity</TableHead>
                                <TableHead>Is Verified?</TableHead>
                             </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.mobile}</TableCell>
                                    <TableCell>{user.createdAt}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.plan_start_date === "1" ? 'primary' : 'secondary'}
                                            className="cursor-pointer"
                                        >
                                            {user.status === "1" ? 'Active' : 'Not Active'}
                                        </Badge>

                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_verify === "1" ? 'primary' : 'secondary'}>
                                            Not Subscribe
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.planName === "1" ? 'primary' : 'secondary'}>
                                            {user.planName ?? "Not Subscribe"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_verify === "1" ? 'primary' : 'secondary'}>
                                            Not Subscribe
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.plan_end_date === "1" ? 'primary' : 'secondary'}>
                                            {user.plan_end_date ?? "Not Subscribe"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.identity_picture ?? "Not Active"}

                                    </TableCell>
                                    <TableCell>

                                        <Badge variant={user.is_verify === "1" ? 'primary' : 'secondary'}>
                                            {user.is_verify === "1" ? 'Verified' : 'Not Verified'}

                                        </Badge>

                                    </TableCell>
                                     
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredAndSortedData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    className="mt-4"
                />
            </div>
        </div>
    )
}

