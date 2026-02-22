"use client"

import { useTranslations } from "@/lib/use-translations"
import {
  CheckCircle2,
  Clock,
  Rocket,
  Sparkles,
  MessageSquare,
  ImagePlus,
  Mic,
  Video,
  Zap,
  Globe,
  Users,
  Shield,
  TrendingUp,
  Brain,
  Heart
} from "lucide-react";

export function RoadmapContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Rocket className="h-4 w-4" />
          <span className="text-sm font-semibold">{t("roadmap.productDev")}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("roadmap.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("roadmap.subtitle")}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-12">

        {/* Completed Features */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t("roadmap.doneLaunched")}</h2>
              <p className="text-muted-foreground">{t("roadmap.featuresAvailable")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Character Creation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full 6-step wizard to create custom AI characters with personality,
                    appearance, and traits.
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Image Generation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Powerful image generator supporting 1-8 images simultaneously, negative prompts, and
                    automatic saving to gallery.
                  </p>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Intelligent Chat Feature</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Real-time AI conversations with context awareness, personality adaptation, and
                    chat history.
                  </p>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Premium System</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Token-based system with premium memberships, Stripe payments, and
                    automatic invoice management.
                  </p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Collections & Gallery</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organize and manage generated images with collections, favorites, and
                    download feature.
                  </p>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">OAuth Login</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Easy login with Google, Discord, and Twitter/X in addition to
                    traditional email/password.
                  </p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Launched Q1 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* In Progress */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t("roadmap.inProgress")}</h2>
              <p className="text-muted-foreground">{t("roadmap.workingOnNow")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="relative">
                  <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Voice Generation (TTS)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Text-to-speech for characters so they can "speak" their messages with unique voices.
                  </p>
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Expected Q1 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Improved Admin Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Extended administrator panel with user management, ban feature, cost logging,
                    and detailed statistics.
                  </p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Expected Q1 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mobile App (PWA)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Progressive Web App for a better mobile experience with offline support and
                    push notifications.
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Expected Q2 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Community Features</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Share characters, follow other users, comment, and like creations in
                    the community feed.
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">Expected Q2 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planned Features */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Rocket className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t("roadmap.upcoming")}</h2>
              <p className="text-muted-foreground">{t("roadmap.comingSoon")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Video Calls with AI</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Live video calls where the character's face is animated based on the conversation
                    with lipsync and emotions.
                  </p>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned Q3 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Voice Cloning</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload voice samples to give your character a completely unique and natural voice based
                    on real recordings.
                  </p>
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned Q3 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Multi-language Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Expanded support for more languages beyond Swedish and English, including automatic
                    real-time translation.
                  </p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned Q3 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Model Selection</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose between different AI models (GPT-4, Claude, Gemini) for varying
                    personality types and response styles.
                  </p>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned Q4 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Character Marketplace</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Buy and sell characters, image packs, and prompt templates from other creators in
                    the community.
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned Q4 2025</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Developer API</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Open API to integrate Dintype.se's features into your own applications and
                    services.
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Planned 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Feedback Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Your feedback is important!</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Want to see a specific feature? Have ideas on how we can improve the platform?
          We listen to our users, and your feedback shapes our roadmap.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            <MessageSquare className="h-5 w-5" />
            Contact Us
          </a>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors font-semibold"
          >
            Read FAQ
          </a>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          <strong>NOTE:</strong> All dates are estimates and subject to change based on development priorities
          and user feedback. We always strive for the highest quality in every release.
        </p>
      </div>
    </div>
  );
}
