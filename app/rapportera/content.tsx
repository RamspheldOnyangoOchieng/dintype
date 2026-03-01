"use client"

import Link from "next/link"
import { Shield, CheckCircle2, AlertTriangle, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useTranslations } from "@/lib/use-translations"

export function ReportContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-zinc-800 dark:text-white">{t("report.title")}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("report.intro")}
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("report.whatToReport")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("report.whatToReportList")}</p>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold underline">{t("report.catIllegal")}</h3>
                <p>{t("report.catIllegalDesc")}</p>
              </li>
              <li>
                <h3 className="font-bold underline">{t("report.catTerms")}</h3>
                <p>
                  {t("report.catTermsDesc")}
                </p>
              </li>
              <li>
                <h3 className="font-bold underline">{t("report.catGuidelines")}</h3>
                <p>
                  {t("report.catGuidelinesDesc")}
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t("report.catItem1")}</li>
                  <li>{t("report.catItem2")}</li>
                  <li>{t("report.catItem3")}</li>
                  <li>{t("report.catItem4")}</li>
                  <li>{t("report.catItem5")}</li>
                  <li>{t("report.catItem6")}</li>
                  <li>{t("report.catItem7")}</li>
                  <li>{t("report.catItem8")}</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {t("report.howToSubmit")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("report.howToSubmitDesc")}</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">{t("report.inPlatform")}</h3>
                <p>{t("report.inPlatformDesc")}</p>
              </div>
              <div>
                <h3 className="font-bold">{t("report.contactSupport")}</h3>
                <p>{t("report.contactSupportDesc")}</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><span className="font-bold italic">{t("report.infoName")}</span> {t("report.infoNameDesc")}</li>
                  <li><span className="font-bold italic">{t("report.infoDescription")}</span> {t("report.infoDescriptionDesc")}</li>
                  <li><span className="font-bold italic">{t("report.infoDate")}</span> {t("report.infoDateDesc")}</li>
                  <li><span className="font-bold italic">{t("report.infoDocs")}</span> {t("report.infoDocsDesc")}</li>
                  <li><span className="font-bold italic">{t("report.infoCategory")}</span> {t("report.infoCategoryDesc")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              {t("report.afterSubmit")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>{t("report.afterSubmitDesc")}</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li><span className="font-bold italic">{t("report.acknowledgement")}</span> {t("report.acknowledgementDesc")}</li>
              <li><span className="font-bold italic">{t("report.reviewInvestigation")}</span> {t("report.reviewInvestigationDesc")}</li>
              <li>
                <span className="font-bold italic">{t("report.actionsTaken")}</span> {t("report.actionsTakenDesc")}
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><span className="font-bold">{t("report.action1")}</span> {t("report.action1Desc")}</li>
                  <li><span className="font-bold">{t("report.action2")}</span> {t("report.action2Desc")}</li>
                  <li><span className="font-bold">{t("report.action3")}</span> {t("report.action3Desc")}</li>
                  <li><span className="font-bold">{t("report.action4")}</span> {t("report.action4Desc")}</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t("report.timeline")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{t("report.timelineDesc")}</p>
          </CardContent>
        </Card>

        <div className="space-y-4 text-xs text-muted-foreground mt-12 pt-8 border-t border-border/40">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-bold text-foreground italic">{t("report.important")}</span> {t("report.falseReportingDesc")}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-bold text-foreground italic">{t("report.objectivity")}</span> {t("report.objectivityDesc")}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-bold text-foreground italic">{t("report.improvement")}</span> {t("report.improvementDesc")}
            </p>
          </div>
          <p className="mt-8 pt-4 italic">
            {t("report.closing")}
          </p>
        </div>

        <div className="text-center mt-12 py-8 bg-muted/30 rounded-2xl border border-border/40">
          <p className="text-muted-foreground mb-4">{t("report.needToReport")}</p>
          <Link
            href="mailto:support@dintype.se"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
          >
            {t("report.sendReport")}
          </Link>
        </div>
      </div>
    </div>
  );
}
