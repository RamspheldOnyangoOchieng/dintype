/**
 * User-friendly error message formatter
 * Converts technical errors into clear, actionable messages
 */

export function formatErrorMessage(error: any): string {
  if (!error) return "Ett oväntat fel uppstod. Försök igen."

  const errorMessage = typeof error === "string" ? error : error.message || error.error || ""

  // Database/UUID errors
  if (errorMessage.includes("invalid input syntax for type uuid")) {
    return "Det här objektet kan inte tas bort eftersom det är en standardinställning. Endast anpassade poster kan tas bort."
  }

  // Authentication errors
  if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("invalid_grant")) {
    return "E-postadressen eller lösenordet du angav är felaktigt. Försök igen."
  }
  if (errorMessage.includes("User already registered") || errorMessage.includes("already exists")) {
    return "Ett konto med denna e-postadress finns redan. Försök logga in istället."
  }
  if (errorMessage.includes("Email not confirmed")) {
    return "Vänligen bekräfta din e-postadress innan du loggar in. Kontrollera din inkorg för bekräftelselänken."
  }
  if (errorMessage.includes("not authorized") || errorMessage.includes("unauthorized")) {
    return "Du har inte behörighet att utföra denna åtgärd."
  }

  // Network errors
  if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
    return "Det gick inte att ansluta till servern. Kontrollera din internetanslutning och försök igen."
  }
  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return "Begäran tog för lång tid. Försök igen."
  }

  // Validation errors
  if (errorMessage.includes("required") || errorMessage.includes("cannot be empty")) {
    return "Vänligen fyll i alla obligatoriska fält."
  }
  if (errorMessage.includes("invalid email") || errorMessage.includes("email format")) {
    return "Vänligen ange en giltig e-postadress."
  }
  if (errorMessage.includes("password") && errorMessage.includes("length")) {
    return "Ditt lösenord måste vara minst 6 tecken långt."
  }

  // Payment errors
  if (errorMessage.includes("insufficient") || errorMessage.includes("not enough tokens")) {
    return "Du har inte tillräckligt med tokens. Vänligen köp fler tokens för att fortsätta."
  }
  if (errorMessage.includes("payment") || errorMessage.includes("stripe")) {
    return "Det uppstod ett problem vid behandlingen av din betalning. Försök igen eller använd en annan betalningsmetod."
  }

  // File upload errors
  if (errorMessage.includes("file size") || errorMessage.includes("too large")) {
    return "Filen är för stor. Vänligen välj en mindre fil."
  }
  if (errorMessage.includes("file type") || errorMessage.includes("not supported")) {
    return "Denna filtyp stöds inte. Använd ett annat filformat."
  }

  // Database errors
  if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
    return "Denna post finns redan. Använd ett annat värde."
  }
  if (errorMessage.includes("foreign key") || errorMessage.includes("violates")) {
    return "Detta objekt är kopplat till annan data och kan inte raderas. Ta bort relaterade objekt först."
  }

  // Rate limiting
  if (errorMessage.includes("rate limit") || errorMessage.includes("too many requests")) {
    return "Du gör för många anrop. Vänta en stund och försök igen."
  }

  // Generic fallbacks for common patterns
  if (errorMessage.includes("not found") || errorMessage.includes("404")) {
    return "Det begärda objektet kunde inte hittas. Det kan ha blivit raderat."
  }
  if (errorMessage.includes("server error") || errorMessage.includes("500")) {
    return "Något gick fel på vår sida. Försök igen om en liten stund."
  }

  // If we have a short, readable error message, use it
  if (errorMessage.length > 0 && errorMessage.length < 100 && !errorMessage.includes("{") && !errorMessage.includes("[")) {
    return `${errorMessage}. Om detta fortsätter att hända, kontakta supporten.`
  }

  // Default fallback with reporting instructions
  return "Vi är ledsna, något oväntat hände. Försök igen. Om problemet kvarstår, kontakta supporten så hjälper vi dig direkt."
}

/**
 * Get a user-friendly title for error toasts
 */
export function getErrorTitle(error: any): string {
  if (!error) return "Fel"

  const errorMessage = typeof error === "string" ? error : error.message || error.error || ""

  if (errorMessage.includes("uuid") || errorMessage.includes("default")) return "Kan inte radera"
  if (errorMessage.includes("auth") || errorMessage.includes("login") || errorMessage.includes("credentials")) return "Inloggning misslyckades"
  if (errorMessage.includes("network") || errorMessage.includes("fetch")) return "Anslutningsfel"
  if (errorMessage.includes("payment") || errorMessage.includes("stripe")) return "Betalningsfel"
  if (errorMessage.includes("not found") || errorMessage.includes("404")) return "Hittades inte"
  if (errorMessage.includes("permission") || errorMessage.includes("authorized")) return "Åtkomst nekad"
  if (errorMessage.includes("validation") || errorMessage.includes("invalid")) return "Ogiltig inmatning"

  return "Fel"
}

/**
 * Format success messages consistently
 */
export function formatSuccessMessage(action: string, item?: string): string {
  const itemText = item ? ` ${item}` : ""

  switch (action.toLowerCase()) {
    case "create":
    case "add":
      return `${item || "Objektet"} har lagts till framgångsrikt!`
    case "update":
    case "edit":
      return `${item || "Objektet"} har uppdaterats framgångsrikt!`
    case "delete":
    case "remove":
      return `${item || "Objektet"} har tagits bort framgångsrikt!`
    case "save":
      return `Ändringarna har sparats!`
    default:
      return `${action} slutfördes framgångsrikt!`
  }
}

