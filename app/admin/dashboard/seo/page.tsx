'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Save, Plus, CheckCircle, AlertCircle, Eye, Activity, Globe, Share2, Facebook, Twitter, Info, ExternalLink } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PageMeta {
  id: string
  page_path: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  og_type: string
  twitter_card: string
  canonical_url: string | null
  robots: string
  language: string
}

export default function SEOMetaAdminPage() {
  const [pages, setPages] = useState<PageMeta[]>([])
  const [selectedPage, setSelectedPage] = useState<PageMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/seo-meta')
      if (!response.ok) throw new Error('Failed to fetch pages')
      const data = await response.json()
      setPages(data.pages || [])
      if (data.pages && data.pages.length > 0) {
        setSelectedPage(data.pages[0])
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      setMessage({ type: 'error', text: 'Failed to load SEO data' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPage = () => {
    const newPage: PageMeta = {
      id: '',
      page_path: '/new-page',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      canonical_url: '',
      robots: 'index,follow',
      language: 'en'
    }
    setSelectedPage(newPage)
  }

  const handleSave = async () => {
    if (!selectedPage) return

    setSaving(true)
    setMessage(null)

    try {
      // Prepare payload - remove ID if empty string to allow auto-generation
      const payload: any = { ...selectedPage }
      if (!payload.id) {
        delete payload.id
      }

      const response = await fetch('/api/admin/seo-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save')

      setMessage({ type: 'success', text: 'SEO meta tags saved successfully!' })
      await fetchPages()
    } catch (error) {
      console.error('Error saving:', error)
      setMessage({ type: 'error', text: 'Failed to save SEO data' })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof PageMeta, value: string) => {
    if (!selectedPage) return
    setSelectedPage({ ...selectedPage, [field]: value })
  }

  const filteredPages = pages.filter((page) =>
    page.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.meta_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Activity className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Analyzing SEO data...</p>
      </div>
    )
  }

  // SEO Health Scorer
  const getSEOHealth = (page: PageMeta) => {
    const checks = [
      {
        name: 'Title Length',
        score: (page.meta_title?.length || 0) >= 40 && (page.meta_title?.length || 0) <= 60 ? 25 : 10,
        status: (page.meta_title?.length || 0) >= 40 && (page.meta_title?.length || 0) <= 60 ? 'pass' : 'warning',
        message: 'Ideal: 50-60 characters'
      },
      {
        name: 'Description Length',
        score: (page.meta_description?.length || 0) >= 120 && (page.meta_description?.length || 0) <= 160 ? 25 : 10,
        status: (page.meta_description?.length || 0) >= 120 && (page.meta_description?.length || 0) <= 160 ? 'pass' : 'warning',
        message: 'Ideal: 150-160 characters'
      },
      {
        name: 'Keywords Present',
        score: (page.meta_keywords?.length || 0) > 0 ? 25 : 0,
        status: (page.meta_keywords?.length || 0) > 0 ? 'pass' : 'danger',
        message: 'Crucial for search indexing'
      },
      {
        name: 'Social Tags',
        score: page.og_title && page.og_image ? 25 : 10,
        status: page.og_title && page.og_image ? 'pass' : 'warning',
        message: 'Enhances social sharing'
      }
    ]

    const totalScore = checks.reduce((acc, curr) => acc + curr.score, 0)
    return { totalScore, checks }
  }

  const health = selectedPage ? getSEOHealth(selectedPage) : { totalScore: 0, checks: [] }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">SEO Meta Tags Manager</h1>
        <p className="text-muted-foreground">
          Manage meta titles, descriptions, and OpenGraph tags for each page
        </p>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Pages List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Pages</CardTitle>
              <CardDescription>Select a page to edit SEO</CardDescription>
            </div>
            <Button size="icon" variant="outline" onClick={handleAddPage} title="Add New Page">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-muted/20 border-muted font-medium rounded-xl h-11"
              />
            </div>

            {/* Pages List */}
            <div className="space-y-1 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
              {filteredPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No pages found</p>
                  <Button variant="link" onClick={handleAddPage} className="text-blue-500">Create one?</Button>
                </div>
              ) : (
                filteredPages.map((page) => {
                  const pageHealth = getSEOHealth(page);
                  return (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                        selectedPage?.id === page.id
                          ? "bg-blue-600/10 border-blue-600/50 shadow-sm"
                          : "hover:bg-accent border-transparent"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "font-bold text-sm tracking-tight truncate max-w-[180px]",
                          selectedPage?.id === page.id ? "text-blue-400" : "text-foreground"
                        )}>{page.page_path}</span>
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0 mt-1",
                          pageHealth.totalScore >= 80 ? "bg-green-500" :
                            pageHealth.totalScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                        )} />
                      </div>
                      <div className="text-[10px] opacity-60 uppercase font-black tracking-widest truncate">
                        {page.meta_title || 'Untitled Page'}
                      </div>
                      {selectedPage?.id === page.id && (
                        <div className="absolute left-0 top-0 w-1 h-full bg-blue-600" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Editor & Previews */}
        {selectedPage && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">Editing: {selectedPage.page_path}</h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global SEO Configuration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-7 bg-muted/30 border-muted">
                  ID: {selectedPage.id ? selectedPage.id.split('-')[0] : 'NEW'}...
                </Badge>
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/20 rounded-full border border-border/10">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    health.totalScore >= 80 ? "bg-green-500" :
                      health.totalScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    Score: {health.totalScore}%
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="bg-muted/30 p-1 rounded-xl mb-4 border border-border/10">
                <TabsTrigger value="editor" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2 transition-all">
                  <Plus className="w-4 h-4 mr-2" /> Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2 transition-all">
                  <Eye className="w-4 h-4 mr-2" /> Live Previews
                </TabsTrigger>
                <TabsTrigger value="health" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-2 transition-all">
                  <Activity className="w-4 h-4 mr-2" /> Health & Scoring
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-6 mt-0">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-6">
                    {/* Basic SEO */}
                    <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50">
                      <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black italic uppercase tracking-tighter">Basic SEO</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest font-bold">Standard metadata for engines</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Page Path</Label>
                          <Input
                            value={selectedPage.page_path || ''}
                            onChange={(e) => updateField('page_path', e.target.value)}
                            className="bg-muted/30 border-muted placeholder:text-muted-foreground/30 font-medium h-11"
                            placeholder="/example-page"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Meta Title</Label>
                          <Input
                            value={selectedPage.meta_title || ''}
                            onChange={(e) => updateField('meta_title', e.target.value)}
                            className="bg-muted/30 border-muted placeholder:text-muted-foreground/30 font-medium h-11"
                            placeholder="e.g. Dintype - Your AI Companion"
                            maxLength={70}
                          />
                          <div className="flex justify-between items-center px-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {selectedPage.meta_title?.length || 0}/60 Recommended
                            </p>
                            <Progress
                              value={Math.min(((selectedPage.meta_title?.length || 0) / 60) * 100, 100)}
                              className={cn(
                                "h-1 w-24",
                                (selectedPage.meta_title?.length || 0) > 60 ? "bg-red-500/20" : "bg-muted/30"
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Meta Description</Label>
                          <Textarea
                            value={selectedPage.meta_description || ''}
                            onChange={(e) => updateField('meta_description', e.target.value)}
                            className="bg-muted/30 border-muted placeholder:text-muted-foreground/30 font-medium resize-none min-h-[100px]"
                            placeholder="Briefly explain what this page is about..."
                            maxLength={200}
                          />
                          <div className="flex justify-between items-center px-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {selectedPage.meta_description?.length || 0}/160 Recommended
                            </p>
                            <Progress
                              value={Math.min(((selectedPage.meta_description?.length || 0) / 160) * 100, 100)}
                              className="h-1 w-24 bg-muted/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Meta Keywords</Label>
                          <Input
                            value={selectedPage.meta_keywords || ''}
                            onChange={(e) => updateField('meta_keywords', e.target.value)}
                            className="bg-muted/30 border-muted placeholder:text-muted-foreground/30 font-medium"
                            placeholder="ai chat, companion, dating sim..."
                          />
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Comma-separated tags</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Advanced */}
                    <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50">
                      <div className="h-1 bg-gradient-to-r from-purple-600 to-indigo-400" />
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black italic uppercase tracking-tighter">Advanced Control</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest font-bold">Indexing & language settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Canonical URL</Label>
                          <div className="relative">
                            <Link href="#" className="absolute right-3 top-3"><Globe className="w-3 h-3 text-muted-foreground" /></Link>
                            <Input
                              value={selectedPage.canonical_url || ''}
                              onChange={(e) => updateField('canonical_url', e.target.value)}
                              className="bg-muted/30 border-muted pr-10 font-medium"
                              placeholder="https://dintype.se/page"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Robots Policy</Label>
                            <Select value={selectedPage.robots} onValueChange={(v: string) => updateField('robots', v)}>
                              <SelectTrigger className="bg-muted/30 border-muted">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="index,follow">Index, Follow</SelectItem>
                                <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                                <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                                <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Default Lang</Label>
                            <Select value={selectedPage.language} onValueChange={(v: string) => updateField('language', v)}>
                              <SelectTrigger className="bg-muted/30 border-muted">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English (US)</SelectItem>
                                <SelectItem value="sv">Swedish (SE)</SelectItem>
                                <SelectItem value="no">Norwegian (NO)</SelectItem>
                                <SelectItem value="da">Danish (DA)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {/* Social Graphics */}
                    <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50">
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500" />
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black italic uppercase tracking-tighter">Social Visibility</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest font-bold">OG Tags & Twitter Cards</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">OG Title (Social)</Label>
                          <Input
                            value={selectedPage.og_title || ''}
                            onChange={(e) => updateField('og_title', e.target.value)}
                            className="bg-muted/30 border-muted font-medium"
                            placeholder="Fallbacks to Meta Title if empty"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">OG Image Source</Label>
                          <div className="flex gap-2">
                            <Input
                              value={selectedPage.og_image || ''}
                              onChange={(e) => updateField('og_image', e.target.value)}
                              className="bg-muted/30 border-muted font-medium flex-grow"
                              placeholder="URL to sharing image..."
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" className="shrink-0 border-muted" onClick={() => window.open(selectedPage.og_image || '', '_blank')}>
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Preview Image Link</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Best: 1200x630px JPG/PNG</p>
                        </div>

                        <div className="space-y-4 pt-2">
                          {selectedPage.og_image && (
                            <div className="relative aspect-[1200/630] rounded-xl overflow-hidden border border-border/20 bg-muted/10 group">
                              <img src={selectedPage.og_image} alt="OG Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-bottom p-4">
                                <div className="mt-auto">
                                  <p className="text-white font-bold text-xs truncate max-w-[200px]">{selectedPage.og_title || selectedPage.meta_title}</p>
                                  <p className="text-white/60 text-[10px] uppercase font-black tracking-wider">Social Header Image</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Page Type</Label>
                            <Select value={selectedPage.og_type} onValueChange={(v: string) => updateField('og_type', v)}>
                              <SelectTrigger className="bg-muted/30 border-muted">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase text-muted-foreground ml-1">Twitter Media</Label>
                            <Select value={selectedPage.twitter_card} onValueChange={(v: string) => updateField('twitter_card', v)}>
                              <SelectTrigger className="bg-muted/30 border-muted">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="summary">Summary</SelectItem>
                                <SelectItem value="summary_large_image">Large Image</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fast Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedPage(pages.find((p) => p.id === selectedPage.id) || null)}
                        className="bg-muted/50 hover:bg-muted text-[11px] font-black uppercase tracking-widest h-11 px-6 rounded-xl border border-border/10 transition-all"
                      >
                        Reset Local
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 text-[11px] font-black uppercase tracking-widest h-11 px-8 rounded-xl transition-all"
                      >
                        {saving ? (
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Syncing...' : 'Publish Update'}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="grid gap-8 lg:grid-cols-1">
                  {/* Google Preview */}
                  <Card className="border-border/40 shadow-xl bg-[#ffffff] dark:bg-[#1a1a1a] overflow-hidden">
                    <CardHeader className="bg-muted/5 dark:bg-muted/20 pb-4 flex flex-row items-center justify-between border-b border-border/10">
                      <div>
                        <CardTitle className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-500" /> Google Search Result
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-widest font-bold">Mockup of organic search appearance</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">Live Simulation</Badge>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="max-w-[600px] space-y-1 font-sans">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">P</div>
                          <div className="text-[12px] text-[#202124] dark:text-[#bdc1c6] truncate">
                            dintype.se <span className="text-[#4d5156] dark:text-[#9aa0a6] font-normal">› {selectedPage.page_path === '/' ? 'home' : selectedPage.page_path.replace('/', '')}</span>
                          </div>
                        </div>
                        <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-[1.3] truncate">
                          {selectedPage.meta_title || 'Dintype - Create Your AI Companion'}
                        </h3>
                        <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-[1.58] line-clamp-2">
                          <span className="text-[#70757a] font-normal mr-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —</span>
                          {selectedPage.meta_description || 'Add a meta description to see how your page appears to users on Google search result pages.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Feed Preview */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Facebook Post */}
                    <Card className="border-border/40 shadow-md bg-[#f0f2f5] dark:bg-[#242526] overflow-hidden">
                      <CardHeader className="p-4 flex flex-row items-center gap-2">
                        <Facebook className="w-5 h-5 text-[#1877f2]" />
                        <span className="text-sm font-bold tracking-tight">Facebook Post</span>
                      </CardHeader>
                      <div className="bg-white dark:bg-[#242526] border-y border-border/10">
                        {selectedPage.og_image ? (
                          <img src={selectedPage.og_image} alt="OG" className="w-full aspect-[1200/630] object-cover" />
                        ) : (
                          <div className="w-full aspect-[1200/630] bg-muted/20 flex items-center justify-center">
                            <Globe className="w-12 h-12 opacity-10" />
                          </div>
                        )}
                        <div className="p-3 bg-[#f0f2f5] dark:bg-[#3a3b3c]">
                          <p className="text-[12px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">DINTYPE.SE</p>
                          <h4 className="text-[16px] font-bold text-black dark:text-white leading-tight truncate">
                            {selectedPage.og_title || selectedPage.meta_title || 'Dintype AI'}
                          </h4>
                          <p className="text-[13px] text-muted-foreground line-clamp-1 mt-1">
                            {selectedPage.og_description || selectedPage.meta_description || 'Chat, flirt and build a deep relationship...'}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Twitter Card */}
                    <Card className="border-border/40 shadow-md border-[#333] bg-black overflow-hidden">
                      <CardHeader className="p-4 flex flex-row items-center gap-2">
                        <Twitter className="w-5 h-5 text-[#1da1f2]" />
                        <span className="text-sm font-bold tracking-tight text-white">Twitter / X Card</span>
                      </CardHeader>
                      <div className="px-4 pb-4">
                        <div className="border border-[#333] rounded-2xl overflow-hidden bg-black">
                          <div className="relative">
                            {selectedPage.og_image ? (
                              <img src={selectedPage.og_image} alt="OG" className="w-full aspect-[1.91] object-cover" />
                            ) : (
                              <div className="w-full aspect-[1.91] bg-muted/20 flex items-center justify-center">
                                <Globe className="w-8 h-8 opacity-10" />
                              </div>
                            )}
                            <Badge className="absolute bottom-2 left-2 bg-black/60 text-[10px] font-black border-white/20">dintype.se</Badge>
                          </div>
                          <div className="p-3 border-t border-[#333]">
                            <p className="text-[14px] font-bold text-white line-clamp-1">
                              {selectedPage.og_title || selectedPage.meta_title}
                            </p>
                            <p className="text-[13px] text-[#71767b] line-clamp-2 mt-0.5">
                              {selectedPage.og_description || selectedPage.meta_description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="health" className="mt-0">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-4">
                    <Card className="bg-card/30 border-border/20">
                      <CardContent className="p-6 text-center space-y-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Global Score</p>
                        <div className={cn(
                          "text-5xl font-black italic tracking-tighter",
                          health.totalScore >= 80 ? "text-green-500" :
                            health.totalScore >= 50 ? "text-yellow-500" : "text-red-500"
                        )}>
                          {health.totalScore}<span className="text-xl opacity-50">%</span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-tight opacity-60">SEO Strength</p>
                      </CardContent>
                    </Card>

                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {health.checks.map((check, idx) => (
                        <Card key={idx} className="bg-card/50 border-border/40">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                              check.status === 'pass' ? "bg-green-500/10 border-green-500/30 text-green-500" :
                                check.status === 'warning' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                                  "bg-red-500/10 border-red-500/30 text-red-500"
                            )}>
                              {check.status === 'pass' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase italic tracking-tighter">{check.name}</p>
                              <p className="text-[11px] font-bold text-muted-foreground">{check.message}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="border-border/40 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-lg font-black italic uppercase tracking-tighter">SEO Optimization Checklist</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest">Ensure your page meets robust SEO standards</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4 p-4 border rounded-2xl bg-muted/20">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Info className="w-5 h-5" /></div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black italic uppercase tracking-tight">Structured Data (LD+JSON)</h4>
                          <p className="text-xs text-muted-foreground">Adding structured data helps search engines understand the content and provides rich snippets in results. We currently use Article and WebPage schema automatically.</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3 p-4 border border-border/40 rounded-2xl bg-muted/5">
                          <h4 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Keywords Recommendations</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPage.meta_keywords?.split(',').map((k, i) => (
                              <Badge key={i} variant="secondary" className="bg-muted text-[10px] font-bold py-1">{k.trim()}</Badge>
                            )) || <span className="text-xs text-muted-foreground italic">Add keywords to see breakdown</span>}
                          </div>
                        </div>
                        <div className="space-y-3 p-4 border border-border/40 rounded-2xl bg-muted/5">
                          <h4 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">Indexing Status</h4>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold">{selectedPage.robots.toUpperCase()}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">This page is currently discoverable by Google and Bing. Ensure no 'noindex' tags exist unless intended.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
