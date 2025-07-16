import { getTerms } from "@/app/actions/terms-actions"
import type { Metadata } from "next"
import { TermsEditor } from "./terms-editor"

export const metadata: Metadata = {
  title: "Redigera användarvillkor",
  description: "Admingränssnitt för redigering av användarvillkor",
}

export default async function AdminTermsPage() {
  const terms = await getTerms()

  return <TermsEditor initialTerms={terms} />
}
