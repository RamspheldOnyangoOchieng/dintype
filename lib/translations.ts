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
  | "navigation.home"
  | "auth.welcomeBack"
  | "general.premium"
  | "general.aiCharacters"
  | "general.admin"
  | "general.user"
  | "auth.login"
  | "auth.logout"
  | "auth.logoutConfirmation"
  | "auth.createAccount"
  | "auth.greeting"
  | "home.exploreCharacters"
  | "home.howItWorks.title"
  | "home.howItWorks.description"
  | "home.howItWorks.step1"
  | "home.howItWorks.step2"
  | "home.howItWorks.step3"
  | "home.howItWorks.step4"
  | "home.howItWorks.step5"
  | "home.roadmap.title"
  | "home.roadmap.q1"
  | "home.roadmap.q2"
  | "home.roadmap.q3"
  | "home.roadmap.q4"
  | "home.guide.title"
  | "home.guide.description"
  | "home.guide.chat.title"
  | "home.guide.chat.description"
  | "home.guide.safety.title"
  | "home.guide.safety.description"
  | "home.guide.generate.title"
  | "home.guide.generate.description"
  | "home.guide.personalize.title"
  | "home.guide.personalize.description"
  | "home.complaints.title"
  | "home.complaints.description"
  | "home.complaints.email"
  | "home.complaints.note1"
  | "home.complaints.note2"
  | "home.complaints.note2"
  | "faq.title"
  | "faq.addFaq"
  | "faq.cancel"
  | "faq.addNewFaqTitle"
  | "faq.questionLabel"
  | "faq.answerLabel"
  | "faq.questionPlaceholder"
  | "faq.answerPlaceholder"
  | "faq.adding"
  | "faq.deleteConfirm"
  | "faq.deleteSuccess"
  | "faq.addSuccess"
  | "faq.errorGeneric"
  | "faq.noFaqs"
  | "home.companion.title"
  | "home.companion.p1"
  | "home.companion.p2"
  | "home.companion.p3"
  | "home.companion.p4"
  | "home.companion.p5"
  | "home.companion.p6"
  | "home.companion.p7"
  | "home.companion.p8"
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
  | "generate.noSuggestionCategories"
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
  | "chat.inputPlaceholder"
  | "chat.ask"
  | "chat.showMe"
  | "chat.sendMe"
  | "chat.canISee"
  | "chat.howToUse"
  | "chat.viewVideoIntro"
  | "chat.noVideoAvailable"
  | "chat.profileNotFound"
  | "chat.backToConversations"
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
  | "login.submitting"
  | "login.orLoginWith"
  | "login.forgotPassword"
  | "signup.createAccount"
  | "signup.joinCommunity"
  | "signup.username"
  | "signup.email"
  | "signup.password"
  | "signup.confirmPassword"
  | "signup.createAccountButton"
  | "signup.alreadyHaveAccount"
  | "signup.haveAccount"
  | "signup.allFieldsRequired"
  | "signup.passwordsDoNotMatch"
  | "signup.passwordMinLength"
  | "signup.passwordHint"
  | "signup.emailInUse"
  | "signup.errorOccurred"
  | "signup.creatingAccount"
  | "signup.submitting"
  | "signup.orContinueWith"
  | "login.invalidCredentials"
  | "login.loginError"
  | "login.emailLabel"
  | "login.emailPlaceholder"
  | "login.passwordLabel"
  | "login.passwordPlaceholder"
  | "login.noAccount"
  | "reset.title"
  | "reset.emailLabel"
  | "reset.emailRequired"
  | "reset.emailPlaceholder"
  | "reset.sendLink"
  | "reset.sending"
  | "reset.linkSentTitle"
  | "reset.linkSentDescription"
  | "reset.errorGeneric"
  | "reset.newPasswordLabel"
  | "reset.newPasswordPlaceholder"
  | "reset.updatePassword"
  | "reset.updating"
  | "reset.updatedTitle"
  | "reset.updatedDescription"
  | "reset.invalidEmail"
  | "reset.missingConfig"
  | "reset.sessionExpired"
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
  | "chat.generateQuick"
  | "chat.generateAdvanced"
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
  | "chat.clearHistory"
  | "chat.clearConfirmation"
  | "chat.clearing"
  | "chat.clearButton"
  | "chat.cancelButton"
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
  | "profile.usernameRequired"
  | "profile.updateSuccessTitle"
  | "profile.updateSuccessDesc"
  | "profile.updateErrorTitle"
  | "profile.updateErrorDesc"
  | "sidebar.toggleSidebar"
  | "sidebar.userMenu"
  | "sidebar.profile"
  | "sidebar.navigation"
  | "premium.addTokens"
  | "legal.privacyNotice"
  | "legal.termsOfService"
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
  | "footer.companyDescription"
  | "footer.contact"
  | "footer.features.createImage"
  | "footer.features.chat"
  | "footer.features.createCharacter"
  | "footer.features.gallery"
  | "footer.features.explore"
  | "footer.about.title"
  | "footer.company.title"
  | "footer.legal.termsPolicies"
  | "footer.about.aiGirlfriendChat"
  | "footer.about.aiSexting"
  | "footer.about.howItWorks"
  | "footer.about.aboutUs"
  | "footer.about.roadmap"
  | "footer.about.blog"
  | "footer.about.guide"
  | "footer.about.complaints"
  | "footer.about.termsPolicies"
  | "footer.company.weAreHiring"
  | "footer.editFooter"
  | "footer.addItem"
  | "footer.rightsReserved"
  | "footer.resetDefaults"

export type Translations = {
  [key in TranslationKey]: string
}

export const translations: Record<"en" | "sv", Translations> = {
  en: {
    "general.siteName": "Pocketlove",
    "general.welcome": "Welcome",
    "general.home": "Home",
    "navigation.home": "Back to Home",
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
    "general.aiCharacters": "AI Companions",
    "general.admin": "Admin",
    "general.user": "User",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.logoutConfirmation": "Are you sure you want to logout?",
    "auth.createAccount": "Create Free Account",
    "auth.greeting": "Hi",
    "home.exploreCharacters": "Explore AI Companions",
    "home.howItWorks.title": "How it Works",
    "home.howItWorks.description": "Create an account, explore characters or generate your own. Start chatting immediately – conversations evolve dynamically and your AI remembers preferences when you return.",
    "home.howItWorks.step1": "Sign up or log in.",
    "home.howItWorks.step2": "Choose or create an AI character.",
    "home.howItWorks.step3": "Chat, generate images or ask for voice/video.",
    "home.howItWorks.step4": "Save favorites and customize personality.",
    "home.howItWorks.step5": "Upgrade for unlimited and faster interactions.",
    "home.roadmap.title": "Roadmap",
    "home.roadmap.q1": "Q1: Enhanced voice chat & adaptive memory.",
    "home.roadmap.q2": "Q2: Video-avatar rendering & improved moderation.",
    "home.roadmap.q3": "Q3: Real-time multi-party chat & mobile apps.",
    "home.roadmap.q4": "Q4: Offline mode and private edge inference.",
    "home.guide.title": "Guide",
    "home.guide.description": "Quick start for new users. How to get the most out of the platform:",
    "home.guide.chat.title": "Chat smart",
    "home.guide.chat.description": "Be specific in your requests. Ask for style, tone or scenario for more accurate responses.",
    "home.guide.safety.title": "Secure interactions",
    "home.guide.safety.description": "Report inappropriate content. Our filters protect but feedback improves everything.",
    "home.guide.generate.title": "Generate images",
    "home.guide.generate.description": "Use short clear phrases. Combine attributes ('soft lighting', 'portrait', 'anime style').",
    "home.guide.personalize.title": "Personalize",
    "home.guide.personalize.description": "Adjust personality and background to improve consistency in dialogue over time.",
    "home.complaints.title": "Complaints & Content Removal",
    "home.complaints.description": "Want to report a problem, incorrect content or request removal? Contact us and we will handle the matter promptly.",
    "home.complaints.email": "Email",
    "home.complaints.note1": "Provide link/ID for the content and a short description of the problem.",
    "home.complaints.note2": "Urgent matters (security/abuse) are prioritized within 24 hours.",
    "faq.title": "Frequently Asked Questions",
    "faq.addFaq": "Add FAQ",
    "faq.cancel": "Cancel",
    "faq.addNewFaqTitle": "Add New FAQ",
    "faq.questionLabel": "Question",
    "faq.answerLabel": "Answer",
    "faq.questionPlaceholder": "Enter new FAQ question",
    "faq.answerPlaceholder": "Enter answer for the new FAQ",
    "faq.adding": "Adding...",
    "faq.deleteConfirm": "Are you sure you want to delete this FAQ?",
    "faq.deleteSuccess": "FAQ deleted successfully",
    "faq.addSuccess": "FAQ added successfully",
    "faq.errorGeneric": "An unexpected error occurred",
    "faq.noFaqs": "No frequently asked questions available at the moment.",
    "home.companion.title": "AI Companion Experience with Pocketlove",
    "home.companion.p1": "Step into a new kind of connection with Pocketlove – your gateway to personal, emotionally intelligent AI companions.",
    "home.companion.p2": "Looking for an anime companion, an AI girlfriend to chat with, or maybe a caring AI boyfriend? Pocketlove makes it easy to create, personalize, and evolve your ideal match using modern AI.",
    "home.companion.p3": "We don't just offer chatbots. We offer deeply customizable AI experiences shaped to your wishes: realistic voice, image generation, and playful videos.",
    "home.companion.p4": "Your AI companion remembers your preferences and adapts over time. Whether you want a deep relationship or spontaneous encounters, you’re always in control.",
    "home.companion.p5": "Yes—your companion can send selfies, generate custom videos, or respond with voice. Ask for specific outfits, unique poses, or playful scenarios.",
    "home.companion.p6": "Privacy is a top priority. Conversations are encrypted and optional two-factor authentication keeps your account secure.",
    "home.companion.p7": "Curious what an AI companion is? Think of a digital partner who can talk, react, flirt, and connect in real time.",
    "home.companion.p8": "Whether you want casual company or something more romantic, Pocketlove adapts to your pace from first message to goodnight.",
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
    "generate.noSuggestionCategories": "No suggestion categories available.",
    "chat.chats": "Chats",
    "chat.viewConversationHistory": "View your conversation history with characters.",
    "chat.createCharacter": "Create Companion",
    "chat.allCharacters": "All Characters",
    "chat.viewAll": "View all",
    "chat.loadingCharacters": "Loading characters...",
    "chat.noConversationsYet": "No conversations yet",
    "chat.startChattingMessage": "Start chatting with a character to see your conversation history here.",
    "chat.browseCharacters": "Browse Characters",
    "chat.recentConversations": "Recent Conversations",
    "chat.noMessagesYet": "No messages yet",
    "chat.inputPlaceholder": "Write a message...",
    "chat.ask": "Ask",
    "chat.showMe": "Show me...",
    "chat.sendMe": "Send me...",
    "chat.canISee": "Can I see...",
    "chat.howToUse": "How to Use",
    "chat.viewVideoIntro": "View video introduction",
    "chat.noVideoAvailable": "No video available",
    "chat.profileNotFound": "Character not found",
    "chat.backToConversations": "Back to Conversations",
    "chat.generateQuick": "Get new selfie",
    "chat.generateAdvanced": "Custom Character Images",
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
    "collection.myCollection": "My Collection",
    "collection.collectionDescription": "A collection of my favorite images",
    "collection.noCollectionsYet": "You don't have any collections yet.",
    "login.logIn": "Log In",
    "login.signUp": "Sign Up",
    "login.submitting": "Logging in...",
    "login.orLoginWith": "Or log in with",
    "login.forgotPassword": "Forgot password?",
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
    "signup.haveAccount": "Already have an account?",
    "signup.allFieldsRequired": "All fields are required",
    "signup.passwordsDoNotMatch": "Passwords do not match",
    "signup.passwordMinLength": "Password must be at least 6 characters",
    "signup.passwordHint": "At least 6 characters",
    "signup.emailInUse": "Email already in use",
    "signup.errorOccurred": "An error occurred during signup",
    "signup.creatingAccount": "Creating Account...",
    "signup.submitting": "Creating account...",
    "signup.orContinueWith": "or continue with",
    "login.invalidCredentials": "Invalid email or password",
    "login.loginError": "An error occurred during login",
    "login.emailLabel": "Email",
    "profile.body": "Body",
    "login.emailPlaceholder": "john@example.com",
    "login.passwordLabel": "Password",
    "login.passwordPlaceholder": "••••••••",
    "login.noAccount": "Don't have an account? ",
    "reset.title": "Reset your password",
    "reset.emailLabel": "Email",
    "reset.emailPlaceholder": "your@email.com",
    "reset.emailRequired": "Email is required",
    "reset.sendLink": "Send reset link",
    "reset.sending": "Sending...",
    "reset.linkSentTitle": "Reset link sent",
    "reset.linkSentDescription": "Check your inbox for a link to reset your password.",
    "reset.errorGeneric": "Something went wrong. Please try again.",
    "reset.newPasswordLabel": "New password",
    "reset.newPasswordPlaceholder": "••••••••",
    "reset.updatePassword": "Update password",
    "reset.updating": "Updating...",
    "reset.updatedTitle": "Password updated",
    "reset.updatedDescription": "Your password has been updated. Redirecting...",
    "reset.invalidEmail": "Please enter a valid email address",
    "reset.missingConfig": "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    "reset.sessionExpired": "Session expired or invalid. Please request a new password reset link.",
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
    "chat.clearHistory": "Clear chat history",
    "chat.clearConfirmation": "Are you sure you want to clear your chat history? This action cannot be undone.",
    "chat.clearing": "Clearing...",
    "chat.clearButton": "Clear history",
    "chat.cancelButton": "Cancel",
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
    "profile.usernameRequired": "Username cannot be empty",
    "profile.updateSuccessTitle": "Profile Updated",
    "profile.updateSuccessDesc": "Your profile has been updated successfully",
    "profile.updateErrorTitle": "Update Failed",
    "profile.updateErrorDesc": "Failed to update profile",
    "sidebar.toggleSidebar": "Toggle sidebar",
    "sidebar.userMenu": "User menu",
    "sidebar.profile": "Profile",
    "sidebar.navigation": "Navigation",
    "premium.addTokens": "Add Tokens",
    "legal.privacyNotice": "Privacy Notice",
    "legal.termsOfService": "Terms of Service",
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
    "Calling": "Calling",
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
    "home.exploreAIGirlfriends": "Explore AI Companions",
    "general.aiGirlfriends": "AI Companions",
    "footer.companyDescription": "Pocketlove delivers immersive experiences with AI companions that feel real, allowing users to generate images and chat.",
    "footer.contact": "Contact",
    "footer.features.createImage": "Create Image",
    "footer.features.chat": "Chat",
    "footer.features.createCharacter": "Create Companion",
    "footer.features.gallery": "Gallery",
    "footer.features.explore": "Explore",
    "footer.about.title": "About us",
    "footer.company.title": "Company",
    "footer.legal.termsPolicies": "Terms and Policies",
    "footer.about.aiGirlfriendChat": "AI Companion Chat",
    "footer.about.aiSexting": "AI Chat",
    "footer.about.howItWorks": "How it works",
    "footer.about.aboutUs": "About Us",
    "footer.about.roadmap": "Roadmap",
    "footer.about.blog": "Blog",
    "footer.about.guide": "Guide",
    "footer.about.complaints": "Complaints & Content Removal",
    "footer.about.termsPolicies": "Terms and Policies",
    "footer.company.weAreHiring": "We're hiring",
    "footer.editFooter": "Edit Footer",
    "footer.addItem": "Add Item",
    "footer.rightsReserved": "All rights reserved",
    "footer.resetDefaults": "Reset to defaults",
  },
  sv: {
    "general.siteName": "Pocketlove",
    "general.welcome": "Welcome",
    "general.home": "Home",
    "navigation.home": "Back to Home",
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
    "general.aiCharacters": "AI Companions",
    "general.admin": "Admin",
    "general.user": "User",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.logoutConfirmation": "Are you sure you want to logout?",
    "auth.createAccount": "Create Free Account",
    "auth.greeting": "Hi",
    "home.exploreCharacters": "Explore AI Companions",
    "home.howItWorks.title": "How it Works",
    "home.howItWorks.description": "Create an account, explore characters or generate your own. Start chatting immediately – conversations evolve dynamically and your AI remembers preferences when you return.",
    "home.howItWorks.step1": "Sign up or log in.",
    "home.howItWorks.step2": "Choose or create an AI character.",
    "home.howItWorks.step3": "Chat, generate images or ask for voice/video.",
    "home.howItWorks.step4": "Save favorites and customize personality.",
    "home.howItWorks.step5": "Upgrade for unlimited and faster interactions.",
    "home.roadmap.title": "Roadmap",
    "home.roadmap.q1": "Q1: Enhanced voice chat & adaptive memory.",
    "home.roadmap.q2": "Q2: Video-avatar rendering & improved moderation.",
    "home.roadmap.q3": "Q3: Real-time multi-party chat & mobile apps.",
    "home.roadmap.q4": "Q4: Offline mode and private edge inference.",
    "home.guide.title": "Guide",
    "home.guide.description": "Quick start for new users. How to get the most out of the platform:",
    "home.guide.chat.title": "Chat smart",
    "home.guide.chat.description": "Be specific in your requests. Ask for style, tone or scenario for more accurate responses.",
    "home.guide.safety.title": "Secure interactions",
    "home.guide.safety.description": "Report inappropriate content. Our filters protect but feedback improves everything.",
    "home.guide.generate.title": "Generate images",
    "home.guide.generate.description": "Use short clear phrases. Combine attributes ('soft lighting', 'portrait', 'anime style').",
    "home.guide.personalize.title": "Personalize",
    "home.guide.personalize.description": "Adjust personality and background to improve consistency in dialogue over time.",
    "home.complaints.title": "Complaints & Content Removal",
    "home.complaints.description": "Want to report a problem, incorrect content or request removal? Contact us and we will handle the matter promptly.",
    "home.complaints.email": "Email",
    "home.complaints.note1": "Provide link/ID for the content and a short description of the problem.",
    "home.complaints.note2": "Urgent matters (security/abuse) are prioritized within 24 hours.",
    "faq.title": "Frequently Asked Questions",
    "faq.addFaq": "Add FAQ",
    "faq.cancel": "Cancel",
    "faq.addNewFaqTitle": "Add New FAQ",
    "faq.questionLabel": "Question",
    "faq.answerLabel": "Answer",
    "faq.questionPlaceholder": "Enter new FAQ question",
    "faq.answerPlaceholder": "Enter answer for the new FAQ",
    "faq.adding": "Adding...",
    "faq.deleteConfirm": "Are you sure you want to delete this FAQ?",
    "faq.deleteSuccess": "FAQ deleted successfully",
    "faq.addSuccess": "FAQ added successfully",
    "faq.errorGeneric": "An unexpected error occurred",
    "faq.noFaqs": "No frequently asked questions available at the moment.",
    "home.companion.title": "AI Companion Experience with Pocketlove",
    "home.companion.p1": "Step into a new kind of connection with Pocketlove – your gateway to personal, emotionally intelligent AI companions.",
    "home.companion.p2": "Looking for an anime companion, an AI girlfriend to chat with, or maybe a caring AI boyfriend? Pocketlove makes it easy to create, personalize, and evolve your ideal match using modern AI.",
    "home.companion.p3": "We don't just offer chatbots. We offer deeply customizable AI experiences shaped to your wishes: realistic voice, image generation, and playful videos.",
    "home.companion.p4": "Your AI companion remembers your preferences and adapts over time. Whether you want a deep relationship or spontaneous encounters, you’re always in control.",
    "home.companion.p5": "Yes—your companion can send selfies, generate custom videos, or respond with voice. Ask for specific outfits, unique poses, or playful scenarios.",
    "home.companion.p6": "Privacy is a top priority. Conversations are encrypted and optional two-factor authentication keeps your account secure.",
    "home.companion.p7": "Curious what an AI companion is? Think of a digital partner who can talk, react, flirt, and connect in real time.",
    "home.companion.p8": "Whether you want casual company or something more romantic, Pocketlove adapts to your pace from first message to goodnight.",
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
    "generate.noSuggestionCategories": "No suggestion categories available.",
    "chat.chats": "Chats",
    "chat.viewConversationHistory": "View your conversation history with characters.",
    "chat.createCharacter": "Create Companion",
    "chat.allCharacters": "All Characters",
    "chat.viewAll": "View all",
    "chat.loadingCharacters": "Loading characters...",
    "chat.noConversationsYet": "No conversations yet",
    "chat.startChattingMessage": "Start chatting with a character to see your conversation history here.",
    "chat.browseCharacters": "Browse Characters",
    "chat.recentConversations": "Recent Conversations",
    "chat.noMessagesYet": "No messages yet",
    "chat.inputPlaceholder": "Write a message...",
    "chat.ask": "Ask",
    "chat.showMe": "Show me...",
    "chat.sendMe": "Send me...",
    "chat.canISee": "Can I see...",
    "chat.howToUse": "How to Use",
    "chat.viewVideoIntro": "View video introduction",
    "chat.noVideoAvailable": "No video available",
    "chat.profileNotFound": "Character not found",
    "chat.backToConversations": "Back to Conversations",
    "chat.generateQuick": "Get new selfie",
    "chat.generateAdvanced": "Custom Character Images",
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
    "collection.myCollection": "My Collection",
    "collection.collectionDescription": "A collection of my favorite images",
    "collection.noCollectionsYet": "You don't have any collections yet.",
    "login.logIn": "Log In",
    "login.signUp": "Sign Up",
    "login.submitting": "Logging in...",
    "login.orLoginWith": "Or log in with",
    "login.forgotPassword": "Forgot password?",
    "login.loginToContinue": "Login to continue",
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
    "signup.haveAccount": "Already have an account?",
    "signup.allFieldsRequired": "All fields are required",
    "signup.passwordsDoNotMatch": "Passwords do not match",
    "signup.passwordMinLength": "Password must be at least 6 characters",
    "signup.passwordHint": "At least 6 characters",
    "signup.emailInUse": "Email already in use",
    "signup.errorOccurred": "An error occurred during signup",
    "signup.creatingAccount": "Creating Account...",
    "signup.submitting": "Creating account...",
    "signup.orContinueWith": "or continue with",
    "login.invalidCredentials": "Invalid email or password",
    "login.loginError": "An error occurred during login",
    "login.emailLabel": "Email",
    "profile.body": "Body",
    "login.emailPlaceholder": "john@example.com",
    "login.passwordLabel": "Password",
    "login.passwordPlaceholder": "••••••••",
    "login.noAccount": "Don't have an account? ",
    "reset.title": "Reset your password",
    "reset.emailLabel": "Email",
    "reset.emailPlaceholder": "your@email.com",
    "reset.emailRequired": "Email is required",
    "reset.sendLink": "Send reset link",
    "reset.sending": "Sending...",
    "reset.linkSentTitle": "Reset link sent",
    "reset.linkSentDescription": "Check your inbox for a link to reset your password.",
    "reset.errorGeneric": "Something went wrong. Please try again.",
    "reset.newPasswordLabel": "New password",
    "reset.newPasswordPlaceholder": "••••••••",
    "reset.updatePassword": "Update password",
    "reset.updating": "Updating...",
    "reset.updatedTitle": "Password updated",
    "reset.updatedDescription": "Your password has been updated. Redirecting...",
    "reset.invalidEmail": "Please enter a valid email address",
    "reset.missingConfig": "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    "reset.sessionExpired": "Session expired or invalid. Please request a new password reset link.",
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
    "chat.clearHistory": "Clear chat history",
    "chat.clearConfirmation": "Are you sure you want to clear your chat history? This action cannot be undone.",
    "chat.clearing": "Clearing...",
    "chat.clearButton": "Clear history",
    "chat.cancelButton": "Cancel",
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
    "profile.usernameRequired": "Username cannot be empty",
    "profile.updateSuccessTitle": "Profile Updated",
    "profile.updateSuccessDesc": "Your profile has been updated successfully",
    "profile.updateErrorTitle": "Update Failed",
    "profile.updateErrorDesc": "Failed to update profile",
    "sidebar.toggleSidebar": "Toggle sidebar",
    "sidebar.userMenu": "User menu",
    "sidebar.profile": "Profile",
    "sidebar.navigation": "Navigation",
    "premium.addTokens": "Add Tokens",
    "legal.privacyNotice": "Privacy Notice",
    "legal.termsOfService": "Terms of Service",
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
    "Calling": "Calling",
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
    "home.exploreAIGirlfriends": "Explore AI Companions",
    "general.aiGirlfriends": "AI Companions",
    "footer.companyDescription": "Pocketlove delivers immersive experiences with AI companions that feel real, allowing users to generate images and chat.",
    "footer.contact": "Contact",
    "footer.features.createImage": "Create Image",
    "footer.features.chat": "Chat",
    "footer.features.createCharacter": "Create Companion",
    "footer.features.gallery": "Gallery",
    "footer.features.explore": "Explore",
    "footer.about.title": "About us",
    "footer.company.title": "Company",
    "footer.legal.termsPolicies": "Terms and Policies",
    "footer.about.aiGirlfriendChat": "AI Companion Chat",
    "footer.about.aiSexting": "AI Chat",
    "footer.about.howItWorks": "How it works",
    "footer.about.aboutUs": "About Us",
    "footer.about.roadmap": "Roadmap",
    "footer.about.blog": "Blog",
    "footer.about.guide": "Guide",
    "footer.about.complaints": "Complaints & Content Removal",
    "footer.about.termsPolicies": "Terms and Policies",
    "footer.company.weAreHiring": "We're hiring",
    "footer.editFooter": "Edit Footer",
    "footer.addItem": "Add Item",
    "footer.rightsReserved": "All rights reserved",
    "footer.resetDefaults": "Reset to defaults",
  },
}
