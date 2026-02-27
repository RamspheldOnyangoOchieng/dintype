"use client"

import Link from "next/link"
import {
  Sparkles,
  MessageSquare,
  ImagePlus,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

export function HowItWorksContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("howItWorks.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("howItWorks.subtitle")}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-16 mb-16">

        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("howItWorks.step1Title")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("howItWorks.step1Desc")}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Choose age, body type, and ethnicity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Define occupation and hobbies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Customize personality traits</span>
              </li>
            </ul>
            <Link
              href="/skapa-karaktar"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
            >
              Create Character Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[300px]">
            <Users className="h-32 w-32 text-primary/30" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[300px]">
            <MessageSquare className="h-32 w-32 text-blue-500/30" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("howItWorks.step2Title")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("howItWorks.step2Desc")}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Natural real-time conversations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>AI remembers previous parts of the conversation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Personality-adapted responses</span>
              </li>
            </ul>
            <Link
              href="/chatt"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-semibold"
            >
              Start Chatting
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <ImagePlus className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("howItWorks.step3Title")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("howItWorks.step3Desc")}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Photo-realistic results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Generate 1-8 images simultaneously</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>Automatic saving to gallery</span>
              </li>
            </ul>
            <Link
              href="/generera"
              className="inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-semibold"
            >
              Generate Images
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="order-1 md:order-2 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[300px]">
            <ImagePlus className="h-32 w-32 text-purple-500/30" />
          </div>
        </div>

      </div>

      {/* Features Overview */}
      <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Advanced AI</h3>
            <p className="text-sm text-muted-foreground">
              Powered by the latest AI models for natural conversations and high-quality images
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Unlimited Creativity</h3>
            <p className="text-sm text-muted-foreground">
              Create as many characters as you want and explore different personalities and styles
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Available 24/7</h3>
            <p className="text-sm text-muted-foreground">
              Your AI characters are always ready to chat, any time of the day
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">{t("howItWorks.ctaTitle")}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("howItWorks.ctaDesc")}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/skapa-karaktar"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-md hover:bg-primary/90 transition-colors font-semibold text-lg"
          >
            {t("howItWorks.ctaButton")}
            <ArrowRight className="h-6 w-6" />
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-md hover:bg-primary/10 transition-colors font-semibold text-lg"
          >
            Read Full Guide
          </Link>
        </div>
      </div>

      {/* Need Help */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Have questions? Visit our{" "}
          <Link href="/vanliga-fragor" className="text-primary hover:underline font-semibold">
            FAQ page
          </Link>
          {" "}or{" "}
          <Link href="/kontakt" className="text-primary hover:underline font-semibold">
            contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
