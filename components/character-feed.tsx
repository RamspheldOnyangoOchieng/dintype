"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Send, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Post {
    id: string
    content: string
    image_url?: string
    likes_count: number
    comments_count: number
    created_at: string
    isLiked: boolean
}

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
}

export function CharacterFeed({ characterId, characterImage, characterName }: { characterId: string, characterImage?: string, characterName: string }) {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newPostContent, setNewPostContent] = useState("")
    const [isPosting, setIsPosting] = useState(false)
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
    const [comments, setComments] = useState<Record<string, Comment[]>>({})
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        fetchPosts()
    }, [characterId])

    const fetchPosts = async () => {
        try {
            const res = await fetch(`/api/characters/${characterId}/posts`)
            if (res.ok) {
                const data = await res.json()
                setPosts(data.posts)
            }
        } catch (error) {
            console.error("Failed to fetch posts", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return

        setIsPosting(true)
        try {
            const res = await fetch(`/api/characters/${characterId}/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newPostContent })
            })

            if (res.ok) {
                toast.success("Post created!")
                setNewPostContent("")
                fetchPosts()
            } else {
                toast.error("Failed to create post (Are you the creator?)")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error creating post")
        } finally {
            setIsPosting(false)
        }
    }

    const handleLike = async (postId: string, currentLiked: boolean) => {
        if (!user) {
            toast.error("Login to like posts")
            return
        }

        // Optimistic update
        setPosts(prev => prev.map(p =>
            p.id === postId
                ? { ...p, isLiked: !currentLiked, likes_count: currentLiked ? p.likes_count - 1 : p.likes_count + 1 }
                : p
        ))

        try {
            await fetch(`/api/posts/${postId}/like`, { method: "POST" })
        } catch (error) {
            // Revert on error
            console.error("Like failed", error)
            fetchPosts()
        }
    }

    const fetchComments = async (postId: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`)
            if (res.ok) {
                const data = await res.json()
                setComments(prev => ({ ...prev, [postId]: data.comments }))
            }
        } catch (error) {
            console.error("Failed comments", error)
        }
    }

    const toggleComments = (postId: string) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null)
        } else {
            setExpandedPostId(postId)
            if (!comments[postId]) {
                fetchComments(postId)
            }
        }
    }

    const handlePostComment = async (postId: string) => {
        if (!newComment.trim() || !user) return

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment })
            })

            if (res.ok) {
                const data = await res.json()
                setComments(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), data.comment]
                }))
                setNewComment("")
                // Update comment count
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
            }
        } catch (error) {
            console.error("Comment failed", error)
            toast.error("Failed to post comment")
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Create Post (Visible if user can likely post - simplistic check done by backend) */}
            {user && (
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <Avatar>
                                <AvatarImage src={characterImage} />
                                <AvatarFallback>{characterName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Input
                                    placeholder={`Write a new update as ${characterName}...`}
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="bg-transparent border-white/20"
                                />
                                <div className="flex justify-end">
                                    <Button size="sm" onClick={handleCreatePost} disabled={isPosting || !newPostContent.trim()}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Post Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map(post => (
                    <Card key={post.id} className="bg-transparent border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar>
                                <AvatarImage src={characterImage} />
                                <AvatarFallback>{characterName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-sm">{characterName}</h4>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            {post.image_url && (
                                <img src={post.image_url} alt="Post content" className="mt-3 rounded-lg w-full object-cover max-h-96" />
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-start pt-2">
                            <div className="flex gap-6 w-full text-muted-foreground">
                                <button
                                    onClick={() => handleLike(post.id, post.isLiked)}
                                    className={`flex items-center gap-1.5 text-sm hover:text-red-500 transition-colors ${post.isLiked ? 'text-red-500' : ''}`}
                                >
                                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                    {post.likes_count}
                                </button>
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {post.comments_count}
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedPostId === post.id && (
                                <div className="w-full mt-4 space-y-4 border-t border-white/5 pt-4">
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {comments[post.id]?.map(comment => (
                                            <div key={comment.id} className="text-sm bg-white/5 p-2 rounded-lg">
                                                <p className="text-white/80">{comment.content}</p>
                                                <p className="text-[10px] text-white/40 mt-1">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
                                            </div>
                                        ))}
                                        {(!comments[post.id] || comments[post.id].length === 0) && (
                                            <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="h-8 text-sm bg-transparent"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handlePostComment(post.id)
                                            }}
                                        />
                                        <Button size="sm" className="h-8 w-8 p-0" onClick={() => handlePostComment(post.id)} disabled={!newComment.trim()}>
                                            <Send className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ))}

                {posts.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No updates yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
