"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { SavedSearch } from "@/lib/types"
import { Edit, Trash2, Search, Calendar } from "lucide-react"

interface WeatherHistoryProps {
  refreshTrigger: number
  onSelectSearch: (search: SavedSearch) => void
}

export default function WeatherHistory({ refreshTrigger, onSelectSearch }: WeatherHistoryProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [editLocation, setEditLocation] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editEndDate, setEditEndDate] = useState("")


  useEffect(() => {
    fetchSearches()
  }, [refreshTrigger])

  const fetchSearches = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/searches")

      if (!response.ok) {
        throw new Error("Failed to fetch search history")
      }

      const data = await response.json()
      setSearches(data)
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this search?")) {
      return
    }

    try {
      const response = await fetch(`/api/searches?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete search")
      }

      fetchSearches()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete search")
    }
  }

  const handleEdit = (search: SavedSearch) => {
    setEditingSearch(search)
    setEditLocation(search.location)
    setEditStartDate(search.start_date ? search.start_date.substring(0, 10) : "")
    setEditEndDate(search.end_date ? search.end_date.substring(0, 10) : "")
  }

  const handleUpdate = async () => {
    if (!editingSearch) return

    try {
      const response = await fetch(`/api/searches?id=${editingSearch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: editLocation,
          startDate: editStartDate ? new Date(editStartDate) : null,
          endDate: editEndDate ? new Date(editEndDate) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update search")
      }

      setEditingSearch(null)
      fetchSearches()
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update search")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (searches.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No search history found. Search for a location to save it here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Search History</h2>
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{search.location}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {search.start_date && search.end_date ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(search.start_date).toLocaleDateString()} -{" "}
                          {new Date(search.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Searched on {new Date(search.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onSelectSearch(search)}>
                    <Search className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(search)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Search</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Start Date</label>
                          <Input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">End Date</label>
                          <Input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                        </div>
                        <Button onClick={handleUpdate} className="w-full">
                          Update Search
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(search.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
