"use client"

import Link from "next/link"
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
  Heart,
} from "lucide-react"

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
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature1Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature1Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature1Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature2Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature2Desc")}</p>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature2Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature3Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature3Desc")}</p>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature3Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature4Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature4Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature4Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature5Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature5Desc")}</p>
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature5Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/5 to-green-500/0 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.feature6Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.feature6Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.feature6Date")}</span>
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
              <h2 className="text-3xl font-bold">{t("roadmap.workingOnNow")}</h2>
              <p className="text-muted-foreground">{t("roadmap.inProgress")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.inProgress1Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.inProgress1Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">{t("roadmap.inProgress1Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.inProgress2Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.inProgress2Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">{t("roadmap.inProgress2Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.inProgress3Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.inProgress3Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">{t("roadmap.inProgress3Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 animate-pulse flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.inProgress4Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.inProgress4Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-500 font-medium">{t("roadmap.inProgress4Date")}</span>
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
              <h2 className="text-3xl font-bold">{t("roadmap.comingSoon")}</h2>
              <p className="text-muted-foreground">{t("roadmap.feedbackDesc")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming1Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming1Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming1Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming2Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming2Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming2Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming3Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming3Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming3Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming4Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming4Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming4Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming5Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming5Desc")}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming5Date")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Rocket className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("roadmap.upcoming6Title")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("roadmap.upcoming6Desc")}</p>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">{t("roadmap.upcoming6Date")}</span>
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
        <h2 className="text-3xl font-bold mb-4">{t("roadmap.feedbackTitle")}</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {t("roadmap.feedbackDesc")}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/kontakta"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            <MessageSquare className="h-5 w-5" />
            {t("contact.supportContact")}
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors font-semibold"
          >
            {t("faq.title")}
          </Link>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          <strong>{t("roadmap.noteTitle")}:</strong> {t("roadmap.noteDesc")}
        </p>
      </div>
    </div>
  )
}
