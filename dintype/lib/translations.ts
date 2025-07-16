export type TranslationKey =
  | "general.siteName"
  | "general.welcome"
  | "general.save"
  | "general.cancel"
  | "general.loading"
  | "general.error"
  | "general.success"
  | "general.home"
  | "general.explore"
  | "general.generate"
  | "general.create"
  | "general.chat"
  | "general.collection"
  | "auth.welcomeBack"
  | "general.premium"
  | "general.aiCharacters"
  | "general.admin"
  | "general.user"
  | "auth.login"
  | "auth.logout"
  | "auth.createAccount"
  | "auth.greeting"
  | "home.exploreCharacters"
  | "admin.settings"
  | "admin.language"
  | "admin.languageDescription"
  | "admin.selectLanguage"
  | "admin.english"
  | "admin.swedish"
  | "admin.stripeIntegration"
  | "admin.stripeDescription"
  | "admin.stripeSecretKey"
  | "admin.stripeSecretKeyDescription"
  | "admin.stripeWebhookSecret"
  | "admin.stripeWebhookSecretDescription"
  | "admin.saveSettings"
  | "admin.settingsSaved"
  | "admin.settingsError"
  | "admin.languageNote"
  // Generate page translations
  | "generate.title"
  | "generate.promptPlaceholder"
  | "generate.paste"
  | "generate.showNegativePrompt"
  | "generate.hideNegativePrompt"
  | "generate.negativePromptLabel"
  | "generate.negativePromptPlaceholder"
  | "generate.suggestions"
  | "generate.numberOfImages"
  | "generate.generateImage"
  | "generate.premium"
  | "generate.generateButton"
  | "generate.generating"
  | "generate.viewCollection"
  | "generate.generatedImages"
  | "generate.downloadAll"
  | "generate.collection"
  | "generate.noImagesYet"
  | "generate.noImagesDescription"
  | "generate.savingImages"
  | "generate.download"
  | "generate.share"
  | "generate.image"
  | "generate.saved"
  | "generate.freeTrial"
  | "generate.promptRequired"
  | "generate.promptRequiredDescription"
  | "generate.loginRequired"
  | "generate.loginRequiredDescription"
  | "generate.downloadFailed"
  | "generate.downloadFailedDescription"
  | "generate.imageSaved"
  | "generate.imageSavedDescription"
  | "generate.allImagesSaved"
  | "generate.allImagesSavedDescription"
  | "generate.copiedToClipboard"
  | "generate.pastedFromClipboard"
  | "generate.imageUrlCopied"
  | "chat.chats"
  | "chat.viewConversationHistory"
  | "chat.createCharacter"
  | "chat.allCharacters"
  | "chat.viewAll"
  | "chat.loadingCharacters"
  | "chat.noConversationsYet"
  | "chat.startChattingMessage"
  | "chat.browseCharacters"
  | "chat.recentConversations"
  | "chat.noMessagesYet"
  | "collection.yourImageCollection"
  | "collection.noImagesYet"
  | "collection.noImagesDescription"
  | "collection.refresh"
  | "collection.collections"
  | "collection.generateNewImages"
  | "collection.generateImages"
  | "collection.addToCollection"
  | "collection.delete"
  | "collection.removeFromFavorites"
  | "collection.addToFavorites"
  | "collection.download"
  | "collection.collectionRefreshed"
  | "collection.collectionUpdated"
  | "collection.createCollection"
  | "collection.newCollection"
  | "collection.cancel"
  | "collection.createNewCollection"
  | "collection.name"
  | "collection.description"
  | "collection.descriptionOptional"
  | "collection.myCollection"
  | "collection.collectionDescription"
  | "collection.noCollectionsYet"
  | "login.logIn"
  | "login.signUp"
  | "login.loginToContinue"
  | "signup.createAccount"
  | "signup.joinCommunity"
  | "signup.username"
  | "signup.email"
  | "signup.password"
  | "signup.confirmPassword"
  | "signup.createAccountButton"
  | "signup.alreadyHaveAccount"
  | "signup.allFieldsRequired"
  | "signup.passwordsDoNotMatch"
  | "signup.passwordMinLength"
  | "signup.emailInUse"
  | "signup.errorOccurred"
  | "signup.creatingAccount"
  | "login.invalidCredentials"
  | "login.loginError"
  | "login.emailLabel"
  | "login.emailPlaceholder"
  | "login.passwordLabel"
  | "login.passwordPlaceholder"
  | "login.noAccount"
  | "chat.aboutMe"
  | "profile.age"
  | "profile.body"
  | "profile.ethnicity"
  | "profile.language"
  | "profile.relationship"
  | "profile.occupation"
  | "profile.hobbies"
  | "profile.personality"
  | "chat.searchForProfile"
  | "generate.generate"
  | "general.features"
  | "general.popular"
  | "general.legal"
  | "premium.chooseYourPlan"
  | "premium.anonymousDisclaimer"
  | "premium.cancelAnytime"
  | "premium.springSale"
  | "premium.forNewUsers"
  | "premium.discountEnds"
  | "premium.dontMissOut"
  | "premium.selectedPlan"
  | "premium.benefits"
  | "premium.payWithCard"
  | "premium.processing"
  | "premium.alreadyPremium"
  | "premium.monthlyPayment"
  | "premium.oneTimePayment"
  | "premium.of"
  | "premium.securityBadges"
  | "premium.antivirusSecured"
  | "premium.privacyInStatement"
  | "premium.noAdultTransaction"
  | "premium.noHiddenFees"
  | "premium.month"
  | "premium.months"
  | "premium.year"
  | "premium.was"
  // Add new translation keys for clear chat dialog
  | "chat.clearHistory"
  | "chat.clearConfirmation"
  | "chat.clearing"
  | "chat.clearButton"
  | "chat.cancelButton"
  // Add new translation keys for SEO
  | "admin.seo"
  | "admin.seoSettings"
  | "admin.seoGlobalSettings"
  | "admin.seoPageSettings"
  | "admin.seoSiteName"
  | "admin.seoTitleTemplate"
  | "admin.seoDescription"
  | "admin.seoKeywords"
  | "admin.seoOgImage"
  | "admin.seoTwitterHandle"
  | "admin.seoPageTitle"
  | "admin.seoPageDescription"
  | "admin.seoPageKeywords"
  | "admin.seoPageOgImage"
  | "admin.seoSaveSuccess"
  | "admin.seoSaveError"
  | "profile.title"
  | "profile.accountInfo"
  | "profile.accountInfoDesc"
  | "profile.username"
  | "profile.email"
  | "profile.accountCreated"
  | "profile.accountType"
  | "profile.admin"
  | "profile.user"
  | "profile.subscriptionStatus"
  | "profile.subscriptionStatusDesc"
  | "profile.premiumActive"
  | "profile.premiumActiveDesc"
  | "profile.notPremium"
  | "profile.notPremiumDesc"
  | "profile.expiryDate"
  | "profile.upgradeToPremium"
  | "profile.changePassword"
  | "profile.changePasswordDesc"
  | "profile.currentPassword"
  | "profile.newPassword"
  | "profile.confirmPassword"
  | "profile.passwordRequirements"
  | "profile.changing"
  | "profile.passwordChanged"
  | "profile.passwordsDoNotMatch"
  | "profile.passwordTooShort"
  | "profile.errorChangingPassword"
  | "profile.errorCheckingStatus"
  // Add sidebar specific translations
  | "sidebar.toggleSidebar"
  | "sidebar.userMenu"
  | "sidebar.profile"
  | "sidebar.navigation"
  | "Calling..."
  | "Call me"
  | "+1 (555) 123-4567"
  | "Enter your phone number with country code (e.g., +1 for US)"
  | "Enter your phone number"
  | "Phone number required"
  | "Please enter a valid phone number"
  | "Call failed"
  | "Failed to initiate call"
  | "Call initiated!"
  | "Character will call you shortly"
  | "Initiating call..."
  | "Calling"
  | "Calling character..."
  | "imageGeneration.title"
  | "imageGeneration.describePrompt"
  | "imageGeneration.promptPlaceholder"
  | "imageGeneration.generating"
  | "imageGeneration.generatingMessage"
  | "imageGeneration.emptyStateTitle"
  | "imageGeneration.emptyStateMessage"
  | "imageGeneration.generateWith"
  | "imageGeneration.generateButton"
  | "imageGeneration.cancelButton"
  | "home.exploreAIGirlfriends"
  | "general.aiGirlfriends"

export type Translations = {
  [key in TranslationKey]: string
}

// Add the translations for the new keys in both English and Swedish
export const translations: Record<"en" | "sv", Translations> = {
  en: {
    "general.siteName": "AI Character Explorer",
    "general.welcome": "Welcome",
    "general.home": "Home",
    "general.legal": "Legal",
    "general.features": "Features",
    "general.popular": "Popular",
    "chat.searchForProfile": "Search",
    "profile.personality": "Personality",
    "profile.hobbies": "Hobbies",
    "profile.occupation": "Occupation",
    "profile.relationship": "Relationship",
    "profile.language": "Language",
    "profile.ethnicity": "Ethnicity",
    "generate.generate": "Generate Image",
    "generate.generateImage": "Generate Image",
    "auth.welcomeBack": "Welcome Back",
    "login.loginToContinue": "Login to continue",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.loading": "Loading...",
    "general.error": "An error occurred",
    "general.success": "Success",
    "general.explore": "Explore",
    "general.generate": "Generate",
    "general.create": "Create",
    "general.chat": "Chat",
    "general.collection": "Collection",
    "general.premium": "Premium",
    "general.aiCharacters": "AI Characters",
    "general.admin": "Admin",
    "general.user": "User",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.createAccount": "Create Free Account",
    "auth.greeting": "Hi",
    "home.exploreCharacters": "Explore AI Characters",
    "admin.settings": "Admin Settings",
    "admin.language": "Language",
    "admin.languageDescription": "Set the default language for the application",
    "admin.selectLanguage": "Select language",
    "admin.english": "English",
    "admin.swedish": "Swedish",
    "admin.stripeIntegration": "Stripe Integration",
    "admin.stripeDescription": "Configure your Stripe API keys for payment processing",
    "admin.stripeSecretKey": "Stripe Secret Key",
    "admin.stripeSecretKeyDescription": "Your Stripe secret key. Never share this key publicly.",
    "admin.stripeWebhookSecret": "Stripe Webhook Secret",
    "admin.stripeWebhookSecretDescription": "Your Stripe webhook secret for verifying webhook events.",
    "admin.saveSettings": "Save Settings",
    "admin.settingsSaved": "Settings saved successfully",
    "admin.settingsError": "Failed to save settings",
    "admin.languageNote":
      "This setting translates the entire web site interface for all users. Changes take effect immediately.",
    // Generate page translations
    "generate.title": "Generate Image",
    "generate.promptPlaceholder": "Describe the image you want to generate...",
    "generate.paste": "Paste",
    "generate.showNegativePrompt": "Show Negative Prompt",
    "generate.hideNegativePrompt": "Hide Negative Prompt",
    "generate.negativePromptLabel": "Negative Prompt (what to avoid in the image)",
    "generate.negativePromptPlaceholder": "Elements to exclude from the image...",
    "generate.suggestions": "Suggestions",
    "generate.numberOfImages": "Number of Images",
    "generate.premium": "Premium",
    "generate.generateButton": "Generate Image",
    "generate.generating": "Generating...",
    "generate.viewCollection": "View Your Collection",
    "generate.generatedImages": "Generated Images",
    "generate.downloadAll": "Download All",
    "generate.collection": "Collection",
    "generate.noImagesYet": "No Images Generated Yet",
    "generate.noImagesDescription":
      "Enter a prompt and click the Generate button to create AI-generated images based on your description.",
    "generate.savingImages": "Saving images to your collection...",
    "generate.download": "Download",
    "generate.share": "Share",
    "generate.image": "Image",
    "generate.saved": "Saved",
    "generate.freeTrial": "Free Trial",
    "generate.promptRequired": "Prompt required",
    "generate.promptRequiredDescription": "Please enter a description for the image you want to generate.",
    "generate.loginRequired": "Login required",
    "generate.loginRequiredDescription": "Please log in to generate and save images",
    "generate.downloadFailed": "Download failed",
    "generate.downloadFailedDescription": "Failed to download the image. Please try again.",
    "generate.imageSaved": "Success",
    "generate.imageSavedDescription": "Image saved to your collection",
    "generate.allImagesSaved": "Images saved",
    "generate.allImagesSavedDescription": "All images have been saved to your collection.",
    "generate.copiedToClipboard": "Copied to clipboard",
    "generate.pastedFromClipboard": "Pasted from clipboard",
    "generate.imageUrlCopied": "Image URL copied to clipboard",
    "chat.chats": "Chats",
    "chat.viewConversationHistory": "View your conversation history with characters.",
    "chat.createCharacter": "Create Character",
    "chat.allCharacters": "All Characters",
    "chat.viewAll": "View all",
    "chat.loadingCharacters": "Loading characters...",
    "chat.noConversationsYet": "No conversations yet",
    "chat.startChattingMessage": "Start chatting with a character to see your conversation history here.",
    "chat.browseCharacters": "Browse Characters",
    "chat.recentConversations": "Recent Conversations",
    "chat.noMessagesYet": "No messages yet",
    "collection.yourImageCollection": "Your Image Collection",
    "collection.noImagesYet": "No images saved yet",
    "collection.noImagesDescription": "Generate some images and save them to see them here!",
    "collection.refresh": "Refresh",
    "collection.collections": "Collections",
    "collection.generateNewImages": "Generate New Images",
    "collection.generateImages": "Generate Images",
    "collection.addToCollection": "Add to Collection",
    "collection.delete": "Delete",
    "collection.removeFromFavorites": "Remove from Favorites",
    "collection.addToFavorites": "Add to Favorites",
    "collection.download": "Download",
    "collection.collectionRefreshed": "Collection refreshed",
    "collection.collectionUpdated": "Your image collection has been updated.",
    "collection.createCollection": "Create Collection",
    "collection.newCollection": "New Collection",
    "collection.cancel": "Cancel",
    "collection.createNewCollection": "Create New Collection",
    "collection.name": "Name",
    "collection.description": "Description",
    "collection.descriptionOptional": "Description (optional)",
    "collection.myCollection": "Min samling",
    "collection.collectionDescription": "En samling av mina favoritbilder",
    "collection.noCollectionsYet": "Du har inga samlingar än.",
    "login.logIn": "Log In",
    "login.signUp": "Sign Up",
    "signup.createAccount": "Create an Account",
    "signup.joinCommunity": "Join our community and start chatting with AI characters",
    "signup.username": "Username",
    "signup.email": "Email",
    "profile.age": "Age",
    "chat.aboutMe": "About me",
    "signup.password": "Password",
    "signup.confirmPassword": "Confirm Password",
    "signup.createAccountButton": "Sign Up",
    "signup.alreadyHaveAccount": "Already have an account?",
    "signup.allFieldsRequired": "All fields are required",
    "signup.passwordsDoNotMatch": "Passwords do not match",
    "signup.passwordMinLength": "Password must be at least 6 characters",
    "signup.emailInUse": "Email already in use",
    "signup.errorOccurred": "An error occurred during signup",
    "signup.creatingAccount": "Creating Account...",
    "login.invalidCredentials": "Invalid email or password",
    "login.loginError": "An error occurred during login",
    "login.emailLabel": "Email",
    "profile.body": "Body",
    "login.emailPlaceholder": "john@example.com",
    "login.passwordLabel": "Password",
    "login.passwordPlaceholder": "••••••••",
    "login.noAccount": "Don't have an account? ",
    "premium.chooseYourPlan": "Choose your Plan",
    "premium.anonymousDisclaimer": "100% anonymous. You can cancel anytime.",
    "premium.cancelAnytime": "Cancel subscription at any time",
    "premium.springSale": "Spring Sale",
    "premium.forNewUsers": "for New Users",
    "premium.discountEnds": "Discount ends soon.",
    "premium.dontMissOut": "Don't miss out!",
    "premium.selectedPlan": "Selected Plan",
    "premium.benefits": "Premium Benefits",
    "premium.payWithCard": "Pay with Credit / Debit Card",
    "premium.processing": "Processing...",
    "premium.alreadyPremium": "Already Premium",
    "premium.monthlyPayment": "Monthly payment of",
    "premium.oneTimePayment": "One-time payment of",
    "premium.of": "of",
    "premium.securityBadges": "Security badges",
    "premium.antivirusSecured": "Antivirus Secured",
    "premium.privacyInStatement": "Privacy in bank statement",
    "premium.noAdultTransaction": "No adult transaction in your bank statement",
    "premium.noHiddenFees": "No hidden fees • Cancel subscription at any time",
    "premium.month": "month",
    "premium.months": "months",
    "premium.year": "year",
    "premium.was": "Was",
    // Add new translations for clear chat dialog
    "chat.clearHistory": "Clear chat history",
    "chat.clearConfirmation": "Are you sure you want to clear your chat history? This action cannot be undone.",
    "chat.clearing": "Clearing...",
    "chat.clearButton": "Clear history",
    "chat.cancelButton": "Cancel",
    // Add new translations for SEO
    "admin.seo": "SEO",
    "admin.seoSettings": "SEO Settings",
    "admin.seoGlobalSettings": "Global SEO Settings",
    "admin.seoPageSettings": "Page SEO Settings",
    "admin.seoSiteName": "Site Name",
    "admin.seoTitleTemplate": "Title Template",
    "admin.seoDescription": "Description",
    "admin.seoKeywords": "Keywords",
    "admin.seoOgImage": "Open Graph Image",
    "admin.seoTwitterHandle": "Twitter Handle",
    "admin.seoPageTitle": "Page Title",
    "admin.seoPageDescription": "Page Description",
    "admin.seoPageKeywords": "Page Keywords",
    "admin.seoPageOgImage": "Page Open Graph Image",
    "admin.seoSaveSuccess": "SEO settings saved successfully",
    "admin.seoSaveError": "Failed to save SEO settings",
    "profile.title": "My Profile",
    "profile.accountInfo": "Account Information",
    "profile.accountInfoDesc": "Your personal account details",
    "profile.username": "Username",
    "profile.email": "Email",
    "profile.accountCreated": "Account Created",
    "profile.accountType": "Account Type",
    "profile.admin": "Administrator",
    "profile.user": "User",
    "profile.subscriptionStatus": "Subscription Status",
    "profile.subscriptionStatusDesc": "Your current subscription plan and status",
    "profile.premiumActive": "Premium Active",
    "profile.premiumActiveDesc": "You have access to all premium features",
    "profile.notPremium": "No Premium Subscription",
    "profile.notPremiumDesc": "Upgrade to premium to access all features",
    "profile.expiryDate": "Expiry Date",
    "profile.upgradeToPremium": "Upgrade to Premium",
    "profile.changePassword": "Change Password",
    "profile.changePasswordDesc": "Update your password to keep your account secure",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm New Password",
    "profile.passwordRequirements": "Password must be at least 8 characters long",
    "profile.changing": "Changing...",
    "profile.passwordChanged": "Password changed successfully",
    "profile.passwordsDoNotMatch": "New passwords do not match",
    "profile.passwordTooShort": "Password must be at least 8 characters long",
    "profile.errorChangingPassword": "Error changing password",
    "profile.errorCheckingStatus": "Error checking premium status",
    // Add sidebar specific translations
    "sidebar.toggleSidebar": "Toggle sidebar",
    "sidebar.userMenu": "User menu",
    "sidebar.profile": "Profile",
    "sidebar.navigation": "Navigation",
    "Calling...": "Calling...",
    "Call me": "Call me",
    "+1 (555) 123-4567": "+1 (555) 123-4567",
    "Enter your phone number with country code (e.g., +1 for US)":
      "Enter your phone number with country code (e.g., +1 for US)",
    "Enter your phone number": "Enter your phone number",
    "Phone number required": "Phone number required",
    "Please enter a valid phone number": "Please enter a valid phone number",
    "Call failed": "Call failed",
    "Failed to initiate call": "Failed to initiate call",
    "Call initiated!": "Call initiated!",
    "Character will call you shortly": "{{name}} will call you shortly at {{phoneNumber}}",
    "Initiating call...": "Initiating call...",
    Calling: "Calling",
    "Calling character...": "Calling {{name}}...",
    "imageGeneration.title": "Generate an image",
    "imageGeneration.generateWith": "Generate an image with {{name}}",
    "imageGeneration.describePrompt": "Describe what you want to see",
    "imageGeneration.promptPlaceholder": "Describe the image you want to generate...",
    "imageGeneration.generating": "Generating...",
    "imageGeneration.generatingMessage": "Generating your image...",
    "imageGeneration.emptyStateTitle": "Your generated image will appear here",
    "imageGeneration.emptyStateMessage": "Enter a prompt and click Generate to create an image",
    "imageGeneration.generateButton": "Generate Image",
    "imageGeneration.cancelButton": "Cancel",
    "home.exploreAIGirlfriends": "Explore AI Girlfriends",
    "general.aiGirlfriends": "AI Girlfriends",
  },
  sv: {
    "general.siteName": "AI Karaktärsutforskare",
    "general.welcome": "Välkommen",
    "profile.age": "Åldras",
    "general.legal": "Rättslig",
    "general.features": "AI-flickvänner",
    "general.popular": "Populär",
    "profile.hobbies": "Hobbyer",
    "profile.body": "Kropp",
    "profile.relationship": "Relation",
    "profile.language": "Språk",
    "chat.searchForProfile": "söka",
    "chat.aboutMe": "Om mig",
    "profile.personality": "Personlighet",
    "profile.occupation": "Ockupation",
    "profile.ethnicity": "Etnicitet",
    "auth.welcomeBack": "välkommen tillbaka",
    "general.save": "Spara",
    "general.collection": "samling",
    "generate.generate": "Skapa bild",
    "generate.generateImage": "Skapa bild",
    "general.cancel": "Avbryt",
    "general.home": "Hem",
    "general.loading": "Laddar...",
    "general.error": "Ett fel inträffade",
    "general.success": "Framgång",
    "general.explore": "Utforska",
    "general.generate": "Generera",
    "general.create": "Skapa",
    "general.chat": "Chatta",
    "general.premium": "Premium",
    "general.aiCharacters": "AI-karaktärer",
    "general.admin": "Administratör",
    "general.user": "Användare",
    "auth.login": "Logga in",
    "auth.logout": "Logga ut",
    "auth.createAccount": "Skapa gratis konto",
    "auth.greeting": "Hej",
    "home.exploreCharacters": "Utforska AI-karaktärer",
    "admin.settings": "Administratörsinställningar",
    "admin.language": "Språk",
    "admin.languageDescription": "Ställ in standardspråk för applikationen",
    "admin.selectLanguage": "Välj språk",
    "admin.english": "Engelska",
    "admin.swedish": "Svenska",
    "admin.stripeIntegration": "Stripe Integration",
    "admin.stripeDescription": "Konfigurera dina Stripe API-nycklar för betalningsbehandling",
    "admin.stripeSecretKey": "Stripe Hemlig Nyckel",
    "admin.stripeSecretKeyDescription": "Din hemliga Stripe-nyckel. Dela aldrig denna nyckel offentligt.",
    "admin.stripeWebhookSecret": "Stripe Webhook Hemlighet",
    "admin.stripeWebhookSecretDescription": "Din Stripe webhook-hemlighet för att verifiera webhook-händelser.",
    "admin.saveSettings": "Spara Inställningar",
    "admin.settingsSaved": "Inställningar sparades framgångsrikt",
    "admin.settingsError": "Det gick inte att spara inställningarna",
    "admin.languageNote":
      "Denna inställning översätter hela webbplatsens gränssnitt för alla användare. Ändringar träder i kraft omedelbart.",
    // Generate page translations - Swedish
    "generate.title": "Generera Bild",
    "generate.promptPlaceholder": "Beskriv bilden du vill generera...",
    "generate.paste": "Klistra in",
    "generate.showNegativePrompt": "Visa Negativ Prompt",
    "generate.hideNegativePrompt": "Dölj Negativ Prompt",
    "generate.negativePromptLabel": "Negativ Prompt (vad som ska undvikas i bilden)",
    "generate.negativePromptPlaceholder": "Element att utesluta från bilden...",
    "generate.suggestions": "Förslag",
    "generate.numberOfImages": "Antal Bilder",
    "generate.premium": "Premium",
    "generate.generateButton": "Generera Bild",
    "generate.generating": "Genererar...",
    "generate.viewCollection": "Visa Din Samling",
    "generate.generatedImages": "Genererade Bilder",
    "generate.downloadAll": "Ladda Ner Alla",
    "generate.collection": "Samling",
    "generate.noImagesYet": "Inga Bilder Genererade Än",
    "generate.noImagesDescription":
      "Ange en prompt och klicka på Generera-knappen för att skapa AI-genererade bilder baserat på din beskrivning.",
    "generate.savingImages": "Sparar bilder till din samling...",
    "generate.download": "Ladda Ner",
    "generate.share": "Dela",
    "generate.image": "Bild",
    "generate.saved": "Sparad",
    "generate.freeTrial": "Gratis Provperiod",
    "generate.promptRequired": "Prompt krävs",
    "generate.promptRequiredDescription": "Vänligen ange en beskrivning för bilden du vill generera.",
    "generate.loginRequired": "Inloggning krävs",
    "generate.loginRequiredDescription": "Vänligen logga in för att generera och spara bilder",
    "generate.downloadFailed": "Nedladdning misslyckades",
    "generate.downloadFailedDescription": "Det gick inte att ladda ner bilden. Försök igen.",
    "generate.imageSaved": "Framgång",
    "generate.imageSavedDescription": "Bild sparad till din samling",
    "generate.allImagesSaved": "Bilder sparade",
    "generate.allImagesSavedDescription": "Alla bilder har sparats till din samling.",
    "generate.copiedToClipboard": "Kopierad till urklipp",
    "generate.pastedFromClipboard": "Klistrat in från urklipp",
    "generate.imageUrlCopied": "Bild-URL kopierad till urklipp",
    "chat.chats": "Chattar",
    "chat.viewConversationHistory": "Visa din konversationshistorik med karaktärer.",
    "chat.createCharacter": "Skapa Karaktär",
    "chat.allCharacters": "Alla Karaktärer",
    "chat.viewAll": "Visa alla",
    "chat.loadingCharacters": "Laddar karaktärer...",
    "chat.noConversationsYet": "Inga konversationer än",
    "chat.startChattingMessage": "Börja chatta med en karaktär för att se din konversationshistorik här.",
    "chat.browseCharacters": "Bläddra bland karaktärer",
    "chat.recentConversations": "Senaste konversationer",
    "chat.noMessagesYet": "Inga meddelanden än",
    "collection.yourImageCollection": "Din bildsamling",
    "collection.noImagesYet": "Inga bilder sparade än",
    "collection.noImagesDescription": "Generera några bilder och spara dem för att se dem här!",
    "collection.refresh": "Uppdatera",
    "collection.collections": "Samlingar",
    "collection.generateNewImages": "Generera nya bilder",
    "collection.generateImages": "Generera bilder",
    "collection.addToCollection": "Lägg till i samling",
    "collection.delete": "Ta bort",
    "collection.removeFromFavorites": "Ta bort från favoriter",
    "collection.addToFavorites": "Lägg till i favoriter",
    "collection.download": "Ladda ner",
    "collection.collectionRefreshed": "Samling uppdaterad",
    "collection.collectionUpdated": "Din bildsamling har uppdaterats.",
    "collection.createCollection": "Skapa samling",
    "collection.newCollection": "Ny samling",
    "collection.cancel": "Avbryt",
    "collection.createNewCollection": "Skapa ny samling",
    "collection.name": "Namn",
    "collection.description": "Beskrivning",
    "collection.descriptionOptional": "Beskrivning (valfritt)",
    "login.logIn": "Logga in",
    "login.signUp": "Registrera dig",
    "login.loginToContinue": "logga in för att fortsätta",
    "signup.createAccount": "Skapa ett konto",
    "signup.joinCommunity": "Gå med i vår gemenskap och börja chatta med AI-karaktärer",
    "signup.username": "Användarnamn",
    "signup.email": "E-post",
    "signup.password": "Lösenord",
    "signup.confirmPassword": "Bekräfta lösenord",
    "signup.createAccountButton": "Registrera dig",
    "signup.alreadyHaveAccount": "Har du redan ett konto?",
    "signup.allFieldsRequired": "Alla fält är obligatoriska",
    "signup.passwordsDoNotMatch": "Lösenorden matchar inte",
    "signup.passwordMinLength": "Lösenordet måste vara minst 6 tecken",
    "signup.emailInUse": "E-postadressen används redan",
    "signup.errorOccurred": "Ett fel inträffade vid registreringen",
    "signup.creatingAccount": "Skapar konto...",
    "login.invalidCredentials": "Ogiltig e-post eller lösenord",
    "login.loginError": "Ett fel inträffade vid inloggningen",
    "login.emailLabel": "E-post",
    "login.emailPlaceholder": "john@example.com",
    "login.passwordLabel": "Lösenord",
    "login.passwordPlaceholder": "••••••••",
    "login.noAccount": "Har du inget konto? ",
    "premium.chooseYourPlan": "Välj din plan",
    "premium.anonymousDisclaimer": "100% anonym. Du kan avbryta när som helst.",
    "premium.cancelAnytime": "Avbryt prenumerationen när som helst",
    "premium.springSale": "Vårrea",
    forNewUsers: "för nya användare",
    "premium.discountEnds": "Rabatten slutar snart.",
    "premium.dontMissOut": "Missa inte!",
    "premium.selectedPlan": "Vald plan",
    "premium.benefits": "Premiumförmåner",
    "premium.payWithCard": "Betala med kredit-/betalkort",
    "premium.processing": "Bearbetar...",
    "premium.alreadyPremium": "Redan Premium",
    "premium.monthlyPayment": "Månadsbetalning på",
    "premium.oneTimePayment": "Engångsbetalning på",
    "premium.of": "av",
    "premium.securityBadges": "Säkerhetsmärken",
    "premium.antivirusSecured": "Antivirussäkrad",
    "premium.privacyInStatement": "Sekretess i kontoutdrag",
    "premium.noAdultTransaction": "Ingen vuxentransaktion i ditt kontoutdrag",
    "premium.noHiddenFees": "Inga dolda avgifter • Avbryt prenumerationen när som helst",
    "premium.month": "månad",
    "premium.months": "månader",
    "premium.year": "år",
    "premium.was": "Var",
    // Add new translations for clear chat dialog in Swedish
    "chat.clearHistory": "Rensa chatthistorik",
    "chat.clearConfirmation": "Är du säker på att du vill rensa din chatthistorik? Denna åtgärd kan inte ångras.",
    "chat.clearing": "Rensar...",
    "chat.clearButton": "Rensa historik",
    "chat.cancelButton": "Avbryt",
    // Add new translations for SEO in Swedish
    "admin.seo": "SEO",
    "admin.seoSettings": "SEO-inställningar",
    "admin.seoGlobalSettings": "Globala SEO-inställningar",
    "admin.seoPageSettings": "Sid-specifika SEO-inställningar",
    "admin.seoSiteName": "Webbplatsnamn",
    "admin.seoTitleTemplate": "Titelmall",
    "admin.seoDescription": "Beskrivning",
    "admin.seoKeywords": "Nyckelord",
    "admin.seoOgImage": "Open Graph-bild",
    "admin.seoTwitterHandle": "Twitter-användarnamn",
    "admin.seoPageTitle": "Sidtitel",
    "admin.seoPageDescription": "Sidbeskrivning",
    "admin.seoPageKeywords": "Sidnyckelord",
    "admin.seoPageOgImage": "Sid Open Graph-bild",
    "admin.seoSaveSuccess": "SEO-inställningar sparades framgångsrikt",
    "admin.seoSaveError": "Det gick inte att spara SEO-inställningarna",
    "profile.title": "Min Profil",
    "profile.accountInfo": "Kontoinformation",
    "profile.accountInfoDesc": "Dina personliga kontouppgifter",
    "profile.username": "Användarnamn",
    "profile.email": "E-post",
    "profile.accountCreated": "Konto skapat",
    "profile.accountType": "Kontotyp",
    "profile.admin": "Administratör",
    "profile.user": "Användare",
    "profile.subscriptionStatus": "Prenumerationsstatus",
    "profile.subscriptionStatusDesc": "Din nuvarande prenumerationsplan och status",
    "profile.premiumActive": "Premium Aktivt",
    "profile.premiumActiveDesc": "Du har tillgång till alla premiumfunktioner",
    "profile.notPremium": "Ingen Premiumprenumeration",
    "profile.notPremiumDesc": "Uppgradera till premium för att få tillgång till alla funktioner",
    "profile.expiryDate": "Utgångsdatum",
    "profile.upgradeToPremium": "Uppgradera till Premium",
    "profile.changePassword": "Ändra Lösenord",
    "profile.changePasswordDesc": "Uppdatera ditt lösenord för att hålla ditt konto säkert",
    "profile.currentPassword": "Nuvarande Lösenord",
    "profile.newPassword": "Nytt Lösenord",
    "profile.confirmPassword": "Bekräfta Nytt Lösenord",
    "profile.passwordRequirements": "Lösenordet måste vara minst 8 tecken långt",
    "profile.changing": "Ändrar...",
    "profile.passwordChanged": "Lösenordet har ändrats",
    "profile.passwordsDoNotMatch": "De nya lösenorden matchar inte",
    "profile.passwordTooShort": "Lösenordet måste vara minst 8 tecken långt",
    "profile.errorChangingPassword": "Fel vid ändring av lösenord",
    "profile.errorCheckingStatus": "Fel vid kontroll av premiumstatus",
    // Add sidebar specific translations in Swedish
    "sidebar.toggleSidebar": "Växla sidofält",
    "sidebar.userMenu": "Användarmeny",
    "sidebar.profile": "Profil",
    "sidebar.navigation": "Navigation",
    "Calling...": "Ringer...",
    "Call me": "Ring mig",
    "+1 (555) 123-4567": "+46 (70) 123-4567",
    "Enter your phone number with country code (e.g., +1 for US)":
      "Ange ditt telefonnummer med landskod (t.ex. +46 för Sverige)",
    "Enter your phone number": "Ange ditt telefonnummer",
    "Phone number required": "Telefonnummer krävs",
    "Please enter a valid phone number": "Vänligen ange ett giltigt telefonnummer",
    "Call failed": "Samtalet misslyckades",
    "Failed to initiate call": "Det gick inte att ringa samtalet",
    "Call initiated!": "Samtal initierat!",
    "Character will call you shortly": "{{name}} kommer att ringa dig inom kort på {{phoneNumber}}",
    "Initiating call...": "Initierar samtal...",
    Calling: "Ringer",
    "Calling character...": "Ringer {{name}}...",
    "imageGeneration.title": "Generera en bild",
    "imageGeneration.generateWith": "Generera en bild med {{name}}",
    "imageGeneration.describePrompt": "Beskriv vad du vill se",
    "imageGeneration.promptPlaceholder": "Beskriv bilden du vill generera...",
    "imageGeneration.generating": "Genererar...",
    "imageGeneration.generatingMessage": "Genererar din bild...",
    "imageGeneration.emptyStateTitle": "Din genererade bild kommer att visas här",
    "imageGeneration.emptyStateMessage": "Ange en prompt och klicka på Generera för att skapa en bild",
    "imageGeneration.generateButton": "Generera Bild",
    "imageGeneration.cancelButton": "Avbryt",
    "home.exploreAIGirlfriends": "Utforska AI-flickvänner",
    "general.aiGirlfriends": "AI-flickvänner",
  },
}
