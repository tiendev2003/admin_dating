"use client"

import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Header from '../../components/Dashboard/Header'
import { Badge } from '../../components/ui/badge'
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
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
import { Payment } from '../../models/Payment'
import { deletePayment, fetchPayments } from '../../redux/paymentSlice'
import { AppDispatch, RootState } from "../../redux/store"

export default function PaymentGatewayList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment
    direction: 'asc' | 'desc'
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const dispatch: AppDispatch = useDispatch();
  const { payments, loading, error, isDeleting } = useSelector((state: RootState) => state.payment);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const confirmDelete = () => {
    if (deleteId !== null) {
      dispatch(deletePayment(deleteId))
        .unwrap()
        .then(() => {
          toast.success("Payment deleted successfully");
          dispatch(fetchPayments());
        })
        .catch((error) => {
          toast.error(`Failed to delete payment: ${error.message}`);
        });
      setDeleteId(null);
    }
  };

  const sortData = (key: keyof Payment) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedData = useMemo(() => {
    let processed = Array.isArray(payments) ? [...payments] : [];

    if (searchTerm) {
      processed = processed.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [payments, searchTerm, sortConfig])

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
        <h1 className="text-2xl font-bold">Payment Gateway List Management</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : payments.length === 0 ? (
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
                      className="w-16 cursor-pointer"
                      onClick={() => sortData('id')}
                    >
                      Sr No.
                      <span className="inline-block ml-1">↑↓</span>
                    </TableHead>
                    <TableHead>Payment Gateway Image</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => sortData('title')}
                    >
                      Payment Gateway Name
                      <span className="inline-block ml-1">↑↓</span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => sortData('subtitle')}
                    >
                      Payment Gateway Subtitle
                      <span className="inline-block ml-1">↑↓</span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => sortData('status')}
                    >
                      Payment Gateway Status
                      <span className="inline-block ml-1">↑↓</span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => sortData('p_show')}
                    >
                      Show On Wallet?
                      <span className="inline-block ml-1">↑↓</span>
                    </TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((gateway) => (
                    <TableRow key={gateway.id}>
                      <TableCell>{gateway.id}</TableCell>
                      <TableCell>
                        <img
                          src={import.meta.env.VITE_URL_BACKEND  + gateway.img}
                          alt={gateway.title}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{gateway.title}</TableCell>
                      <TableCell>{gateway.subtitle}</TableCell>
                      <TableCell>
                        <Badge
                          variant={gateway.status === 'Publish' ? 'primary' : 'secondary'}
                          className="cursor-pointer"
                        >
                          {gateway.status === '1' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={gateway.p_show === 'Publish' ? 'primary' : 'secondary'}
                          className="cursor-pointer"
                        >
                          {gateway.p_show === '1' ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                      <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteId(gateway.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              <Pagination
                currentPage={currentPage}
                totalItems={filteredAndSortedData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                className="mt-4"
              />
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
          <div>Are you sure you want to delete this payment gateway?</div>
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

