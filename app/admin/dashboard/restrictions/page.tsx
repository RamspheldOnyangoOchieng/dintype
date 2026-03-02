"use client"

import { useState, useEffect } from "react"
import { AdminOnlyPage } from "@/components/admin-only-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
    Save,
    Plus,
    Trash2,
    RefreshCw,
    Shield,
    DollarSign,
    Lock,
    Unlock,
    ChevronDown,
    MessageSquare,
    Image as ImageIcon,
    UserPlus,
    Smartphone,
    Phone,
    Monitor,
    Clock,
    Zap,
    HelpCircle,
    Info,
    Layout,
    Loader2
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlanRestriction {
  id: string
  plan_type: 'free' | 'premium'
  restriction_key: string
  restriction_value: string | number | boolean
  description: string | null
  updated_at: string
}

export default function RestrictionsPage() {
  const [freeRestrictions, setFreeRestrictions] = useState<PlanRestriction[]>([])
  const [premiumRestrictions, setPremiumRestrictions] = useState<PlanRestriction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Predefined restrictions that should exist for full site control
  const DEFAULT_RESTRICTIONS: Record<string, { description: string; defaultFree: string | number | boolean; defaultPremium: string | number | boolean }> = {
    'can_generate_nsfw': { description: 'Whether users can generate NSFW content', defaultFree: true, defaultPremium: true },
    'can_use_flux': { description: 'Whether users can use the Flux model', defaultFree: true, defaultPremium: true },
    'can_use_stability': { description: 'Whether users can use Stability AI models', defaultFree: true, defaultPremium: true },
    'can_use_seedream': { description: 'Whether users can use the Seedream 4.5 model', defaultFree: true, defaultPremium: true },
    'daily_free_messages': { description: 'Number of free messages per day', defaultFree: 5, defaultPremium: 50 },
    'weekly_image_generation': { description: 'Weekly image generation limit', defaultFree: 5, defaultPremium: 20 },
    'active_girlfriends_limit': { description: 'Maximum active AI companions', defaultFree: 1, defaultPremium: 3 },
    'monthly_tokens': { description: 'Monthly token allocation', defaultFree: 50, defaultPremium: 200 },
    'tokens_per_image': { description: 'Tokens cost per image generation', defaultFree: 0, defaultPremium: 5 },
    'MAX_FREE_DAILY_MESSAGES': { description: 'Maximum free messages per day', defaultFree: 5, defaultPremium: 50 },
    'CAN_SEND_IMAGES': { description: 'Ability to send images in chat', defaultFree: false, defaultPremium: true },
    'CAN_INITIATE_CHAT': { description: 'Ability to initiate new chats', defaultFree: true, defaultPremium: true },
    'WAIT_TIME_BETWEEN_MESSAGES': { description: 'Wait time between messages in seconds', defaultFree: 10, defaultPremium: 0 },
    'MAX_DAILY_IMAGE_GENERATION': { description: 'Maximum daily image generations', defaultFree: 5, defaultPremium: 50 },
    'CAN_VIEW_PREMIUM_GALLERY': { description: 'Ability to view premium image gallery', defaultFree: false, defaultPremium: true },
    'IMAGE_RESOLUTION_CAP': { description: 'Maximum image resolution (e.g., 512, 1024)', defaultFree: 512, defaultPremium: 1024 },
    'CAN_USE_TELEGRAM': { description: 'Ability to use Telegram integration', defaultFree: false, defaultPremium: true },
    'MAX_CHARACTERS_PER_USER': { description: 'Maximum characters per user profile', defaultFree: 500, defaultPremium: 2000 },
    'HAS_VOICE_CALLS': { description: 'Ability to make voice calls', defaultFree: false, defaultPremium: true },
  }

  // Ensure all default restrictions exist in the loaded data
  const ensureDefaultRestrictions = (restrictions: PlanRestriction[], planType: 'free' | 'premium'): PlanRestriction[] => {
    const existingKeys = new Set(restrictions.map(r => r.restriction_key))
    const updatedRestrictions = [...restrictions]

    Object.entries(DEFAULT_RESTRICTIONS).forEach(([key, config]) => {
      if (!existingKeys.has(key)) {
        updatedRestrictions.push({
          id: Math.random().toString(36).substring(7),
          plan_type: planType,
          restriction_key: key,
          restriction_value: planType === 'free' ? config.defaultFree : config.defaultPremium,
          description: config.description,
          updated_at: new Date().toISOString()
        })
      } else {
        // Ensure description is set for existing restrictions and convert string values
        const existingIdx = updatedRestrictions.findIndex(r => r.restriction_key === key)
        if (existingIdx !== -1) {
          if (!updatedRestrictions[existingIdx].description) {
            updatedRestrictions[existingIdx].description = config.description
          }
          // Convert string values to boolean/number if they match expected types
          let currentValue = updatedRestrictions[existingIdx].restriction_value;
          if (typeof config.defaultFree === 'boolean' && typeof currentValue === 'string') {
            updatedRestrictions[existingIdx].restriction_value = currentValue === 'true';
          } else if (typeof config.defaultFree === 'number' && typeof currentValue === 'string' && !isNaN(Number(currentValue))) {
            updatedRestrictions[existingIdx].restriction_value = Number(currentValue);
          }
        }
      }
    })

    return updatedRestrictions
  }

  // Load restrictions
  const loadRestrictions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/get-restrictions')
      const data = await response.json()

      if (data.success) {
        // Ensure all default restrictions exist
        const freeWithDefaults = ensureDefaultRestrictions(data.free || [], 'free')
        const premiumWithDefaults = ensureDefaultRestrictions(data.premium || [], 'premium')

        setFreeRestrictions(freeWithDefaults)
        setPremiumRestrictions(premiumWithDefaults)
      } else {
        toast({
          title: "Error",
          description: "Failed to load restrictions",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error loading restrictions:", error)
      toast({
        title: "Error",
        description: "Failed to load restrictions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRestrictions()
  }, [])

  // Update restriction value
  const handleUpdateRestrictionValue = (
    planType: 'free' | 'premium',
    restrictionKey: string,
    newValue: string | number | boolean
  ) => {
    const setter = planType === 'free' ? setFreeRestrictions : setPremiumRestrictions;
    setter(prev =>
      prev.map(r =>
        r.restriction_key === restrictionKey
          ? { ...r, restriction_value: newValue }
          : r
      )
    )
  }

  // Add new restriction locally
  const addRestriction = (planType: 'free' | 'premium') => {
    const newKey = prompt("Enter restriction key (e.g. MAX_TOKENS_PER_MESSAGE):")
    if (!newKey) return

    const newRestriction: PlanRestriction = {
      id: Math.random().toString(36).substring(7),
      plan_type: planType,
      restriction_key: newKey.toUpperCase(),
      restriction_value: true, // Default to boolean true
      description: 'Newly added restriction',
      updated_at: new Date().toISOString()
    }

    if (planType === 'free') {
      setFreeRestrictions(prev => [...prev, newRestriction])
    } else {
      setPremiumRestrictions(prev => [...prev, newRestriction])
    }
  }

  // Remove restriction locally
  const handleDeleteRestriction = (planType: 'free' | 'premium', key: string) => {
    if (!confirm(`Remove ${key} from ${planType} plan locally? (Must save to apply)`)) return

    if (planType === 'free') {
      setFreeRestrictions(prev => prev.filter(r => r.restriction_key !== key))
    } else {
      setPremiumRestrictions(prev => prev.filter(r => r.restriction_key !== key))
    }
  }

  // Save all changes
  const saveChanges = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/update-restrictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          free: freeRestrictions,
          premium: premiumRestrictions
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Restrictions updated successfully. Changes are live!",
        })
        await loadRestrictions() // Reload to confirm
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update restrictions",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error saving restrictions:", error)
      toast({
        title: "Error",
        description: "Failed to save restrictions",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const restrictionGroups = [
    {
        id: "messaging",
        name: "Messaging & Chat",
        icon: MessageSquare,
        keys: ["MAX_FREE_DAILY_MESSAGES", "CAN_SEND_IMAGES", "CAN_INITIATE_CHAT", "WAIT_TIME_BETWEEN_MESSAGES", "daily_free_messages"]
    },
    {
        id: "media",
        name: "Media & Images",
        icon: ImageIcon,
        keys: ["MAX_DAILY_IMAGE_GENERATION", "CAN_VIEW_PREMIUM_GALLERY", "IMAGE_RESOLUTION_CAP", "weekly_image_generation", "tokens_per_image", "can_generate_nsfw", "can_use_flux", "can_use_stability", "can_use_seedream"]
    },
    {
        id: "account",
        name: "Account & Features",
        icon: Layout,
        keys: ["CAN_USE_TELEGRAM", "MAX_CHARACTERS_PER_USER", "HAS_VOICE_CALLS", "active_girlfriends_limit", "monthly_tokens"]
    }
  ];

  const getRestrictionIcon = (key: string) => {
      switch (key) {
          case "MAX_FREE_DAILY_MESSAGES": return MessageSquare;
          case "daily_free_messages": return MessageSquare;
          case "CAN_SEND_IMAGES": return ImageIcon;
          case "CAN_INITIATE_CHAT": return UserPlus;
          case "WAIT_TIME_BETWEEN_MESSAGES": return Clock;
          case "MAX_DAILY_IMAGE_GENERATION": return Zap;
          case "weekly_image_generation": return Zap;
          case "CAN_VIEW_PREMIUM_GALLERY": return Shield;
          case "IMAGE_RESOLUTION_CAP": return Monitor;
          case "tokens_per_image": return DollarSign;
          case "can_generate_nsfw": return Lock;
          case "can_use_flux": return Zap;
          case "can_use_stability": return Zap;
          case "can_use_seedream": return Zap;
          case "CAN_USE_TELEGRAM": return Smartphone;
          case "MAX_CHARACTERS_PER_USER": return Layout;
          case "HAS_VOICE_CALLS": return Phone;
          case "active_girlfriends_limit": return UserPlus;
          case "monthly_tokens": return DollarSign;
          default: return Info;
      }
  };

  // Render restriction input based on type
  const renderRestrictionInput = (
    restriction: PlanRestriction,
    planType: 'free' | 'premium'
  ) => {
    const { restriction_key, restriction_value, description } = restriction
    const Icon = getRestrictionIcon(restriction_key);

    return (
      <div key={restriction_key} className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                          <Label htmlFor={restriction_key} className="font-bold truncate text-sm">
                              {restriction_key.replace(/_/g, ' ').toUpperCase()}
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help text-muted-foreground hover:text-foreground">
                                        <HelpCircle className="h-3.5 w-3.5" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-mono text-[10px]">{restriction_key}</p>
                                </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                      {description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>}
                  </div>
              </div>

              <div className="shrink-0">
                  {typeof restriction_value === 'boolean' ? (
                      <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Switch
                                        id={restriction_key}
                                        checked={restriction_value}
                                        onCheckedChange={(checked) => handleUpdateRestrictionValue(planType, restriction_key, checked)}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{restriction_value ? 'Enabled' : 'Disabled'}</p>
                            </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  ) : (
                      <div className="flex items-center gap-2">
                          <Input
                              type="number"
                              className="w-20 font-bold"
                              value={restriction_value as number}
                              onChange={(e) => handleUpdateRestrictionValue(planType, restriction_key, parseInt(e.target.value))}
                          />
                          <span className="text-xs text-muted-foreground font-medium">units</span>
                      </div>
                  )}
              </div>

              <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteRestriction(planType, restriction_key)}
              >
                  <Trash2 className="h-3.5 w-3.5" />
              </Button>
          </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminOnlyPage>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminOnlyPage>
    )
  }

  return (
    <AdminOnlyPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Plan Restrictions Management</h1>
            <p className="text-muted-foreground mt-2">
              Control limits and features for Free and Premium plans. Changes take effect immediately.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadRestrictions} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={saveChanges} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="free" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="free">Free Plan</TabsTrigger>
            <TabsTrigger value="premium">Premium Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="free" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Free Plan Restrictions</CardTitle>
                <CardDescription>
                  Configure limits and features for free tier users ($0)
                </CardDescription>
              </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={["messaging", "media", "account"]} className="space-y-4">
                        {restrictionGroups.map((group) => (
                            <AccordionItem key={group.id} value={group.id} className="border rounded-2xl px-4 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <group.icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-black uppercase tracking-wider">{group.name}</h3>
                                            <p className="text-[10px] text-muted-foreground font-medium">Manage {freeRestrictions.filter(r => group.keys.includes(r.restriction_key)).length} restrictions</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2">
                                    <div className="grid grid-cols-1 gap-3">
                                        {freeRestrictions
                                            .filter(r => group.keys.includes(r.restriction_key))
                                            .map(r => renderRestrictionInput(r, 'free'))
                                        }

                                        {/* Uncategorized items that might be in this group logically (optional) */}
                                        {group.id === "account" && freeRestrictions
                                            .filter(r => !restrictionGroups.some(g => g.keys.includes(r.restriction_key)))
                                            .map(r => renderRestrictionInput(r, 'free'))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {freeRestrictions.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No restrictions configured for this plan.</p>
                        </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => addRestriction('free')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Free Restriction
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="premium" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Premium User Restrictions</CardTitle>
                  <CardDescription>
                    Configure limits and features for premium subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={["messaging", "media", "account"]} className="space-y-4">
                        {restrictionGroups.map((group) => (
                            <AccordionItem key={group.id} value={group.id} className="border rounded-2xl px-4 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <group.icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-black uppercase tracking-wider">{group.name}</h3>
                                            <p className="text-[10px] text-muted-foreground font-medium">Manage {premiumRestrictions.filter(r => group.keys.includes(r.restriction_key)).length} restrictions</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 pt-2">
                                    <div className="grid grid-cols-1 gap-3">
                                        {premiumRestrictions
                                            .filter(r => group.keys.includes(r.restriction_key))
                                            .map(r => renderRestrictionInput(r, 'premium'))
                                        }

                                        {/* Uncategorized items that might be in this group logically (optional) */}
                                        {group.id === "account" && premiumRestrictions
                                            .filter(r => !restrictionGroups.some(g => g.keys.includes(r.restriction_key)))
                                            .map(r => renderRestrictionInput(r, 'premium'))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {premiumRestrictions.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No restrictions configured for this plan.</p>
                        </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => addRestriction('premium')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Premium Restriction
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminOnlyPage>
    )
}
