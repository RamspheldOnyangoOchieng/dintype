"use client"

import { AdminOnlyPage } from "@/components/admin-only-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, Save, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"
import { formatSEK } from "@/lib/currency"

interface EmailTemplate {
  id?: string
  template_key: string
  subject: string
  html_body: string
  text_body: string
  variables?: string[]
  description?: string
  updated_at?: string
}

export default function EmailTemplatesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({
    account_welcome: {
      template_key: "account_welcome",
      subject: "Welcome to {{app_name}}! Your account has been created",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome {{username}}!</h1>
          <p>Thank you for creating an account with us. We're excited to have you here!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Get started right away</h2>
            <ul style="line-height: 1.8;">
              <li>Explore our AI characters</li>
              <li>Start your first conversation</li>
              <li>Customize your profile</li>
              <li>Discover new features</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">
            <a href="{{app_url}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Explore Now
            </a>
          </p>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 30px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Tip:</strong> Upgrade to Premium for unlimited conversations, 
              3 active characters, and monthly token credits for just $11.99/month!
            </p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you have any questions, contact us at support@dintype.se
          </p>
        </div>
      `,
      text_body: `Welcome {{username}}!\n\nThank you for creating an account with us. We're excited to have you here!\n\nGet started right away:\n- Explore our AI characters\n- Start your first conversation\n- Customize your profile\n- Discover new features\n\nExplore now: {{app_url}}\n\nTip: Upgrade to Premium for $11.99/month!`,
      description: "Sent when a new user creates an account",
      variables: ["username", "app_url", "app_name"]
    },
    premium_welcome: {
      template_key: "premium_welcome",
      subject: "Welcome to Premium! Your benefits are activated",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Premium, {{username}}! 🎉</h1>
          <p>Thank you for becoming a Premium member. We're excited to have you here!</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h2 style="margin-top: 0; color: #10b981;">Your Premium Benefits</h2>
            <ul style="line-height: 2;">
              <li>✅ <strong>Unlimited messages</strong> with all AI characters</li>
              <li>✅ <strong>3 active characters</strong> simultaneously</li>
              <li>✅ <strong>50 archived characters</strong></li>
              <li>✅ <strong>Monthly token credits</strong> for image generation</li>
              <li>✅ <strong>Priority support</strong></li>
              <li>✅ <strong>Early access</strong> to new features</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">
            <a href="{{app_url}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Get started now
            </a>
          </p>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Subscription Details:</strong><br>
              Plan: Premium Monthly Subscription<br>
              Price: $11.99/month<br>
              Next renewal: {{renewal_date}}
            </p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you have any questions about your Premium account, contact us at support@dintype.se
          </p>
        </div>
      `,
      text_body: `Welcome to Premium, {{username}}!\n\nThank you for becoming a Premium member!\n\nYour Premium benefits:\n✅ Unlimited messages\n✅ 3 active characters\n✅ 50 archived characters\n✅ Monthly token credits\n✅ Priority support\n✅ Early access to new features\n\nGet started: {{app_url}}\n\nSubscription: $11.99/month\nNext renewal: {{renewal_date}}`,
      description: "Sent when a user becomes a Premium member",
      variables: ["username", "app_url", "renewal_date"]
    },
    payment_confirmation: {
      template_key: "payment_confirmation",
      subject: "Payment Confirmation - Order {{order_id}}",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Payment Received! ✅</h1>
          <p>Hi {{username}},</p>
          <p>Thank you for your purchase! We have received your payment.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0;"><strong>Order ID:</strong></td>
                <td style="text-align: right; padding: 12px 0;">{{order_id}}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0;"><strong>Date:</strong></td>
                <td style="text-align: right; padding: 12px 0;">{{order_date}}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0;"><strong>Item:</strong></td>
                <td style="text-align: right; padding: 12px 0;">{{item_name}}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0;"><strong>Amount:</strong></td>
                <td style="text-align: right; padding: 12px 0; font-size: 20px; color: #10b981; font-weight: bold;">{{amount}}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0;">{{purchase_details}}</p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="{{app_url}}/invoices" style="color: #4F46E5; text-decoration: none; font-size: 14px;">
              See all your invoices →
            </a>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you have any questions about your order, contact support@dintype.se with your order ID.
          </p>
        </div>
      `,
      text_body: `Payment Received!\n\nHi {{username}},\n\nThank you for your purchase!\n\nOrder Details:\n━━━━━━━━━━━━━━━━\nOrder ID: {{order_id}}\nDate: {{order_date}}\nItem: {{item_name}}\nAmount: {{amount}}\n━━━━━━━━━━━━━━━━\n\n{{purchase_details}}\n\nSee your invoices: {{app_url}}/invoices\n\nFor questions, contact support@dintype.se`,
      description: "Sent after a successful payment",
      variables: ["username", "order_id", "order_date", "item_name", "amount", "purchase_details", "app_url"]
    },
    subscription_renewal_success: {
      template_key: "subscription_renewal_success",
      subject: "Your Premium subscription has been renewed",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Subscription Renewed! ✅</h1>
          <p>Hi {{username}},</p>
          <p>Your Premium subscription has been successfully renewed.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h2 style="margin-top: 0; color: #10b981;">Renewal Information</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Plan:</strong></td>
                <td style="text-align: right;">Premium Monthly Subscription</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                <td style="text-align: right; font-size: 18px; color: #10b981;">{{amount}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Renewed on:</strong></td>
                <td style="text-align: right;">{{renewal_date}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Next renewal:</strong></td>
                <td style="text-align: right;">{{next_renewal_date}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment method:</strong></td>
                <td style="text-align: right;">{{payment_method}}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>You still have access to:</strong><br>
              • Unlimited messages<br>
              • 3 active characters<br>
              • Monthly token credits<br>
              • Priority support
            </p>
          </div>

          <p style="margin-top: 30px;">
            <a href="{{app_url}}/settings" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Manage Subscription
            </a>
          </p>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            To cancel your subscription, visit the settings page or contact support@dintype.se
          </p>
        </div>
      `,
      text_body: `Subscription Renewed!\n\nHi {{username}},\n\nYour Premium subscription has been successfully renewed.\n\nRenewal Information:\n━━━━━━━━━━━━━━━━\nPlan: Premium Monthly Subscription\nAmount: {{amount}}\nRenewed on: {{renewal_date}}\nNext renewal: {{next_renewal_date}}\nPayment method: {{payment_method}}\n━━━━━━━━━━━━━━━━\n\nYou still have access to all Premium benefits!\n\nManage subscription: {{app_url}}/settings`,
      description: "Sent when a subscription is successfully renewed",
      variables: ["username", "amount", "renewal_date", "next_renewal_date", "payment_method", "app_url"]
    },
    subscription_payment_failed: {
      template_key: "subscription_payment_failed",
      subject: "⚠️ Problem with your Premium payment",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Payment Failed</h1>
          <p>Hi {{username}},</p>
          <p>Unfortunately, we couldn't process your Premium subscription payment.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h2 style="margin-top: 0; color: #dc2626;">Payment Details</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Plan:</strong></td>
                <td style="text-align: right;">Premium Monthly Subscription</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                <td style="text-align: right;">{{amount}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Attempt Date:</strong></td>
                <td style="text-align: right;">{{attempt_date}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
                <td style="text-align: right;">{{payment_method}}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;" colspan="2">
                  <div style="background-color: #fee; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong style="color: #dc2626;">Reason:</strong> {{failure_reason}}
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>What happens now?</strong><br>
              • We will try again in {{retry_days}} days<br>
              • Your Premium access continues until {{grace_period_end}}<br>
              • After that, your Premium subscription will be paused
            </p>
          </div>

          <h3 style="margin-top: 30px;">Fix the issue</h3>
          <p style="color: #666;">To avoid interruption of your Premium service, please:</p>
          <ul style="color: #666; line-height: 1.8;">
            <li>Check that your card has sufficient funds</li>
            <li>Confirm that the card has not expired</li>
            <li>Update your payment method if necessary</li>
          </ul>

          <p style="margin-top: 30px; text-align: center;">
            <a href="{{app_url}}/settings/billing" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update Payment Method
            </a>
          </p>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Need help? Contact us at support@dintype.se and we'll help you!
          </p>
        </div>
      `,
      text_body: `⚠️ Payment Failed\n\nHi {{username}},\n\nUnfortunately, we couldn't process your Premium subscription payment.\n\nPayment Details:\n━━━━━━━━━━━━━━━━\nPlan: Premium Monthly Subscription\nAmount: {{amount}}\nAttempt Date: {{attempt_date}}\nPayment Method: {{payment_method}}\nReason: {{failure_reason}}\n━━━━━━━━━━━━━━━━\n\nWhat happens now?\n• We will try again in {{retry_days}} days\n• Your Premium access continues until {{grace_period_end}}\n• After that, your subscription will be paused\n\nFix the issue:\n- Check that your card has funds\n- Confirm that the card has not expired\n- Update your payment method\n\nUpdate payment: {{app_url}}/settings/billing\n\nNeed help? Contact support@dintype.se`,
      description: "Sent when a subscription payment fails",
      variables: ["username", "amount", "attempt_date", "payment_method", "failure_reason", "retry_days", "grace_period_end", "app_url"]
    },
    password_reset: {
      template_key: "password_reset",
      subject: "Reset your password",
      html_body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333 text-zinc-800">Reset your password</h1>
          <p>Hi {{username}},</p>
          <p>We have received a request to reset the password for your account.</p>
          
          <p style="margin: 30px 0;">
            <a href="{{reset_link}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>

          <p style="color: #666; font-size: 14px;">
            If you did not request this reset, you can ignore this email.
            The link is valid for 24 hours.
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            {{reset_link}}
          </p>
        </div>
      `,
      text_body: `Reset your password\n\nHi {{username}},\n\nWe have received a request to reset the password for your account.\n\nClick the link to reset: {{reset_link}}\n\nIf you did not request this reset, you can ignore this email.\nThe link is valid for 24 hours.`,
      description: "Sent when a user requests a password reset",
      variables: ["username", "reset_link"]
    }
  })

  const [activeTab, setActiveTab] = useState("account_welcome")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("email_templates")
        .select("*")

      if (error) {
        console.error("Error fetching templates:", error)
        // Use default templates if table doesn't exist
        return
      }

      if (data && data.length > 0) {
        const templatesMap: Record<string, EmailTemplate> = {}
        data.forEach((template: any) => {
          templatesMap[template.template_key] = template
        })
        setTemplates(prev => ({ ...prev, ...templatesMap }))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTemplate = async (templateKey: string) => {
    try {
      setIsSaving(true)
      const supabase = createClient()
      const template = templates[templateKey]

      const { error } = await supabase
        .from("email_templates")
        .upsert({
          template_key: templateKey,
          subject: template.subject,
          html_body: template.html_body,
          text_body: template.text_body,
          description: template.description,
          variables: template.variables,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'template_key'
        })

      if (error) {
        throw error
      }

      toast({
        title: "Saved!",
        description: "The email template has been updated.",
      })

      await fetchTemplates()
    } catch (error: any) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: error.message || "Could not save the template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateTemplate = (key: string, field: keyof EmailTemplate, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const previewTemplate = (key: string) => {
    const template = templates[key]
    const previewWindow = window.open("", "_blank")
    if (previewWindow) {
      previewWindow.document.write(template.html_body)
      previewWindow.document.close()
    }
  }

  if (isLoading) {
    return (
      <AdminOnlyPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminOnlyPage>
    )
  }

  return (
    <AdminOnlyPage>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-zinc-800 dark:text-white">Email Templates</h1>
          <p className="text-muted-foreground">
            Manage email templates sent to users. Use variables like {`{{username}}`} for dynamic content.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <TabsTrigger value="account_welcome" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Welcome</span>
              <span className="sm:hidden">Acc</span>
            </TabsTrigger>
            <TabsTrigger value="premium_welcome" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Premium</span>
              <span className="sm:hidden">Prem</span>
            </TabsTrigger>
            <TabsTrigger value="payment_confirmation" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payment</span>
              <span className="sm:hidden">Pay</span>
            </TabsTrigger>
            <TabsTrigger value="subscription_renewal_success" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Renewal</span>
              <span className="sm:hidden">Ren</span>
            </TabsTrigger>
            <TabsTrigger value="subscription_payment_failed" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Failed</span>
              <span className="sm:hidden">Err</span>
            </TabsTrigger>
            <TabsTrigger value="password_reset" className="py-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Password</span>
              <span className="sm:hidden">Pass</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(templates).map(([key, template]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <Card className="border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-zinc-800 dark:text-white">{template.description}</CardTitle>
                  <CardDescription>
                    Available variables: {template.variables?.map(v => `{{${v}}}`).join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-subject`} className="text-zinc-800 dark:text-zinc-200">Subject Line</Label>
                    <Input
                      id={`${key}-subject`}
                      value={template.subject}
                      onChange={(e) => updateTemplate(key, "subject", e.target.value)}
                      placeholder="Email subject..."
                      className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${key}-html`} className="text-zinc-800 dark:text-zinc-200">HTML Content</Label>
                    <Textarea
                      id={`${key}-html`}
                      value={template.html_body}
                      onChange={(e) => updateTemplate(key, "html_body", e.target.value)}
                      placeholder="HTML template..."
                      className="font-mono text-xs min-h-[400px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${key}-text`} className="text-zinc-800 dark:text-zinc-200">Text Version (fallback)</Label>
                    <Textarea
                      id={`${key}-text`}
                      value={template.text_body}
                      onChange={(e) => updateTemplate(key, "text_body", e.target.value)}
                      placeholder="Text version..."
                      className="font-mono text-xs min-h-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => saveTemplate(key)} disabled={isSaving} className="bg-primary text-white">
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Template
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => previewTemplate(key)} className="border-zinc-200 dark:border-zinc-700">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card className="mt-8 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-zinc-50 dark:bg-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-zinc-800 dark:text-white">Pricing in Email Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All pricing is currently displayed in <strong>US Dollars (USD)</strong>.
            </p>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <h4 className="font-semibold mb-2 text-zinc-800 dark:text-white">Price Formatting Examples:</h4>
              <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• $ 9.99 → {formatSEK(9.99)}</li>
                <li>• $ 24.99 → {formatSEK(24.99)}</li>
                <li>• $ 149.99 → {formatSEK(149.99)}</li>
              </ul>

              <p className="text-xs text-muted-foreground mt-3 italic">
                The {`{{amount}}`} variable is automatically formatted based on the payment provider settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnlyPage>
  )
}
