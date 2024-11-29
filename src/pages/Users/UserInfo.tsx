"use client"

import { Heart, Wallet } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Header from '../../components/Dashboard/Header'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppContext } from '../../contexts/AppContext'
import { cn } from '../../lib/utils'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchUserDetails } from '../../redux/userSlice'

export default function UserInfo() {
    const { id } = useParams<{ id: string }>()

    const { isSidebarOpen } = useAppContext()
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (id) {
            dispatch(fetchUserDetails(id));
        }
    }
        , [id, dispatch]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={cn(
            "transition-all duration-300",
            isSidebarOpen ? "pl-64" : "pl-16"
        )}>
            <Header />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">User Info</h1>


                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user?.profile_pic || "/placeholder.svg"} alt="Profile picture" />
                                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{user?.name}</span>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                                    <img
                                        src="/placeholder.svg?height=300&width=400"
                                        alt="Map"
                                        className="rounded-lg"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Other Picture</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user?.other_pic || "/placeholder.svg"} alt="Other picture" />
                                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Other Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Profile Bio:</h3>
                                    <p className="text-sm text-muted-foreground">{user?.profile_bio || '-'}</p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Search Preference:</h3>
                                    <Badge variant="secondary">{user?.search_preference}</Badge>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Gender:</h3>
                                    <Badge variant="secondary">{user?.gender}</Badge>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Radius Search:</h3>
                                    <span className="text-sm">{user?.radius_search}KM</span>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Birth Date:</h3>
                                    <span className="text-sm">{user?.birth_date}</span>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Relation Goal:</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-pink-500">
                                            <Heart className="w-3 h-3 mr-1" />
                                            {user?.relation_goal}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Seeking love and meaningful connections? Choose dating for genuine relationships.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Religion:</h3>
                                    <span className="text-sm">{user?.religion}</span>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Wallet Balance:</h3>
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-sm">{user?.wallet}$</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Interest</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="outline" className="flex items-center gap-2">
                                    <img
                                        src="/placeholder.svg"
                                        alt="Interest icon"
                                        width={16}
                                        height={16}
                                    />
                                    {user?.interest}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Languages Known</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="outline" className="flex items-center gap-2">
                                    <img
                                        src="/placeholder.svg"
                                        alt="Language flag"
                                        width={16}
                                        height={16}
                                    />
                                    {user?.language}
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

