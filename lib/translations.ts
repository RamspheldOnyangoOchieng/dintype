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
  | "nav.generateImage"
  | "nav.createCharacter"
  | "nav.myAI"
  | "nav.myImages"
  | "nav.premium"
  | "nav.adminPanel"
  | "chat.pocketUniverse"
  | "chat.conversationsTitle"
  | "chat.reconnectDesc"
  | "chat.personalitiesOnline"
  | "chat.recentChatsTitle"
  | "chat.discoverAll"
  | "chat.browseCategory"
  | "generate.createFromSuggestions"
  | "generate.lockedFaceTwinning"
  | "generate.premiumRequired"
  | "generate.upgradeToPremium"
  | "generate.wantMultipleImages"
  | "generate.upgradeForMultiple"
  | "generate.tokensPerImage"
  | "generate.freeLabel"
  | "generate.freeSFW"
  | "generate.clearPrompt"
  | "generate.copyPrompt"
  | "generate.pastePrompt"
  | "generate.generatingProgress"
  | "generate.generateWithTokens"
  | "generate.generateFree"
  | "generate.imageLiked"
  | "generate.addedToFavorites"
  | "generate.promptCleared"
  | "generate.freeOnly1Image"
  | "premium.dintypePremium"
  | "premium.upgradeExperience"
  | "premium.unlockDesc"
  | "premium.statusLabel"
  | "premium.creditsLabel"
  | "premium.tokensLabel"
  | "premium.administrator"
  | "premium.freeVersion"
  | "premium.freePlan"
  | "premium.premiumPlan"
  | "premium.perMonth"
  | "premium.currentPlanBtn"
  | "premium.mostPopular"
  | "premium.subscriptionActiveLabel"
  | "premium.adminAccount"
  | "premium.noMonthlyCredits"
  | "premium.freeMessagesPerDay"
  | "premium.cannotCreateCharacter"
  | "premium.oneFreeImage"
  | "premium.monthlyCreditsIncluded"
  | "premium.unlimitedMessages"
  | "premium.unlimitedCharacters"
  | "premium.unlimitedImages"
  | "premium.buyTokensWithCredits"
  | "premium.becomePremium"
  | "premium.topUpTokens"
  | "premium.convertCreditsDesc"
  | "premium.selectPackage"
  | "premium.buyTokensBtn"
  | "premium.grantTokens"
  | "premium.adminCanAddFree"
  | "premium.creditsDeducted"
  | "premium.secureLabel"
  | "premium.privateLabel"
  | "premium.unlimitedLabel"
  | "premium.tokensGranted"
  | "premium.adminUpdated"
  | "premium.newBalance"
  | "premium.tokensAdded"
  | "premium.systemLogsUpdated"
  | "premium.balanceSynced"
  | "premium.continueToDashboard"
  | "premium.priceLabel"
  | "premium.premiumRequiredForTokens"
  | "premium.upgradeNow"
  | "premium.chatLabel"
  | "premium.perMessage"
  | "premium.createAILabel"
  | "premium.perProfile"
  | "premium.imagesLabel"
  | "premium.perImage"
  | "collection.selectAll"
  | "collection.deselectAll"
  | "collection.bulkDelete"
  | "collection.confirmDeleteImage"
  | "collection.imageDeleted"
  | "collection.deleteError"
  | "collection.collectionCreated"
  | "collection.errorCreatingCollection"
  | "collection.imagesTitle"
  | "collection.selectImages"
  | "collection.generating"
  | "profile.overview"
  | "profile.security"
  | "profile.activity"
  | "profile.tokenHistory"
  | "profile.deleteAccount"
  | "profile.dangerZone"
  | "profile.dangerZoneDesc"
  | "profile.saveProfile"
  | "profile.saving"
  | "profile.gender"
  | "profile.notifications"
  | "profile.notificationsDesc"
  | "profile.phone"
  | "profile.male"
  | "profile.female"
  | "profile.other"
  | "profile.personalInfo"
  | "profile.personalInfoDesc"
  | "profile.notLoggedIn"
  | "profile.tokenUsage"
  | "profile.noActivity"
  | "auth.loginSuccess"
  | "general.loading"
  // Footer column headings
  | "footer.colAiCompanions"
  | "footer.colLegal"
  | "footer.colAboutUs"
  | "footer.legal.terms"
  | "footer.legal.privacyPolicy"
  | "footer.legal.reportComplaints"
  | "footer.legal.guidelines"
  | "footer.legal.cookies"
  // Admin sidebar navigation
  | "admin.nav.dashboard"
  | "admin.nav.brandingTheme"
  | "admin.nav.costMonitor"
  | "admin.nav.restrictions"
  | "admin.nav.seoMetaTags"
  | "admin.nav.contentEditor"
  | "admin.nav.mediaLibrary"
  | "admin.nav.blogPosts"
  | "admin.nav.characters"
  | "admin.nav.users"
  | "admin.nav.telegramProfiles"
  | "admin.nav.miniAppMgmt"
  | "admin.nav.imageSuggestions"
  | "admin.nav.banners"
  | "admin.nav.tokenPackages"
  | "admin.nav.premiumContent"
  | "admin.nav.premiumManagement"
  | "admin.nav.subscriptions"
  | "admin.nav.settings"
  | "admin.nav.legal"
  | "admin.nav.overview"
  | "admin.nav.mainSite"
  // Admin dashboard
  | "admin.dashboard.title"
  | "admin.dashboard.welcome"
  | "admin.dashboard.viewSite"
  | "admin.dashboard.loading"
  | "admin.stat.totalUsers"
  | "admin.stat.activeCharacters"
  | "admin.stat.monthlyRevenue"
  | "admin.stat.apiCosts"
  | "admin.stat.totalRevenue"
  | "admin.stat.premiumMembers"
  | "admin.stat.allTime"
  | "admin.stat.thisMonth"
  // FAQ page
  | "faq.pageTitle"
  | "faq.pageIntro"
  | "faq.section.gettingStarted"
  | "faq.q.whatIs"
  | "faq.a.whatIs"
  | "faq.q.howWorks"
  | "faq.a.howWorks"
  | "faq.q.isFree"
  | "faq.a.isFree"
  | "faq.q.whatIsPremium"
  | "faq.a.whatIsPremium"
  | "faq.q.createAccount"
  | "faq.a.createAccount"
  | "faq.a.createAccountSocial"
  | "faq.a.createAccountEmail"
  | "faq.section.aiChars"
  | "faq.q.customize"
  | "faq.a.customize"
  | "faq.q.askPhotos"
  | "faq.a.askPhotos"
  | "faq.q.realtimeImages"
  | "faq.a.realtimeImages"
  | "faq.section.accountMgmt"
  | "faq.q.howToPay"
  | "faq.a.howToPay"
  | "faq.q.paymentMethods"
  | "faq.a.paymentMethods"
  | "faq.a.paymentMethodsList"
  | "faq.a.paymentMethodsNote"
  | "faq.q.howToCancel"
  | "faq.a.howToCancel"
  | "faq.a.cancelMethod1"
  | "faq.a.cancelMethod1Desc"
  | "faq.a.cancelMethod2"
  | "faq.a.cancelMethod2Step1"
  | "faq.a.cancelMethod2Step2"
  | "faq.a.cancelMethod2Step3"
  | "faq.a.cancelMethod2Step4"
  | "faq.a.cancelMethod3"
  | "faq.a.cancelMethod3Desc"
  | "faq.a.cancelNote"
  | "faq.q.howToDelete"
  | "faq.a.howToDelete"
  | "faq.a.deleteStep1"
  | "faq.a.deleteStep2"
  | "faq.a.deleteStep3"
  | "faq.a.deleteStep4"
  | "faq.section.privacy"
  | "faq.q.isSafe"
  | "faq.a.isSafe"
  | "faq.a.isSafeModeration"
  | "faq.a.isSafeReporting"
  | "faq.a.isSafeSecurity"
  | "faq.q.isPrivate"
  | "faq.a.isPrivate"
  | "faq.q.canOthersSee"
  | "faq.a.canOthersSee"
  | "faq.q.personalData"
  | "faq.a.personalData"
  | "faq.q.reportContent"
  | "faq.a.reportContent"
  | "faq.a.reportInApp"
  | "faq.a.reportEmail"
  | "faq.section.billing"
  | "faq.q.refunds"
  | "faq.a.refunds"
  | "faq.section.technical"
  | "faq.q.techIssue"
  | "faq.a.techIssue"
  | "faq.a.techStep1"
  | "faq.a.techStep2"
  | "faq.a.techStep3"
  | "faq.a.techStep4"
  | "faq.a.techContact"
  | "faq.cta.title"
  | "faq.cta.desc"
  | "faq.cta.contactSupport"
  | "faq.cta.moreOptions"
  | "faq.cta.thanks"
  // Character components
  | "characterDetail.yearsOld"
  | "characterDetail.noImage"
  | "characterDetail.about"
  | "characterDetail.details"
  | "characterDetail.style"
  | "characterDetail.eyeColor"
  | "characterDetail.hair"
  | "characterDetail.bodyType"
  | "characterDetail.relationship"
  | "characterDetail.close"
  | "characterDetail.startChat"
  | "characterDetail.notFound"
  | "characterCard.new"
  | "characterList.error"
  | "characterList.deleted"
  | "characterList.deletedDesc"
  | "characterList.noCharacters"
  | "characterList.createFirst"
  | "characterList.createCharacter"
  | "characterList.noPortrait"
  | "characterList.public"
  | "characterList.editProfile"
  | "characterList.deleteCharacter"
  | "characterList.deleteDesc"
  | "characterList.cancel"
  | "characterList.deleting"
  | "characterList.confirmDelete"
  | "characterList.chatNow"
  // Error page
  | "error.title"
  | "error.description"
  | "error.errorId"
  | "error.defaultMessage"
  | "error.tryAgain"
  | "error.returnHome"
  | "error.goBack"
  // Loading page
  | "loading.title"
  | "loading.description"
  // Login page
  | "login.title"
  | "login.continueToAccess"
  | "login.openLoginDialog"
  // Not found page
  | "notFound.title"
  | "notFound.description"
  | "notFound.subDescription"
  | "notFound.returnHome"
  | "notFound.browseCollections"
  | "notFound.startChat"
  | "notFound.goBack"
  | "notFound.refreshPage"
  | "notFound.searchPlaceholder"
  | "notFound.popularSearches"
  | "notFound.homeTab"
  | "notFound.searchTab"
  | "notFound.chatTab"
  | "notFound.dontWorry"
  | "notFound.lostInDigital"
  | "notFound.collections"
  | "notFound.browseCharacterCollections"
  | "notFound.characters"
  | "notFound.viewAllCharacters"
  | "notFound.startConversation"
  | "notFound.chooseCharacter"
  | "notFound.startChatting"
  // My AI page
  | "myAi.loadingPartners"
  | "myAi.privateGallery"
  | "myAi.title"
  | "myAi.noCompanions"
  | "myAi.createNew"
  | "myAi.noCompanionsTitle"
  | "myAi.noCompanionsDesc"
  | "myAi.startCreating"
  | "myAi.premiumLocked"
  | "myAi.renewMembership"
  | "myAi.unlockNow"
  | "myAi.startChat"
  | "myAi.edit"
  | "myAi.delete"
  | "myAi.yearsOld"
  | "myAi.deleted"
  | "myAi.deletedDesc"
  | "myAi.failed"
  | "myAi.failedDesc"
  | "myAi.errorTitle"
  | "myAi.errorDesc"
  // About us page
  | "aboutUs.title"
  | "aboutUs.intro"
  | "aboutUs.newEra"
  | "aboutUs.newEraDesc"
  | "aboutUs.chatConnect"
  | "aboutUs.feature1"
  | "aboutUs.feature2"
  | "aboutUs.feature3"
  | "aboutUs.feature4"
  | "aboutUs.fictional"
  | "aboutUs.fictionalDesc1"
  | "aboutUs.fictionalDesc2"
  | "aboutUs.getStarted"
  | "aboutUs.getStartedDesc"
  | "aboutUs.createImage"
  | "aboutUs.createCompanion"
  // Characters page
  | "characters.title"
  | "characters.description"
  | "characters.createCharacter"
  | "characters.loading"
  // Favorites page
  | "favorites.title"
  | "favorites.empty"
  | "favorites.loading"
  // Blog page
  | "blog.title"
  | "blog.allCategories"
  | "blog.loadingPosts"
  | "blog.noPosts"
  | "blog.readMore"
  | "blog.previous"
  | "blog.next"
  // Invoices page
  | "invoices.title"
  | "invoices.subtitle"
  | "invoices.refresh"
  | "invoices.paymentHistory"
  | "invoices.allPayments"
  | "invoices.noInvoices"
  | "invoices.invoiceDate"
  | "invoices.description"
  | "invoices.amount"
  | "invoices.status"
  | "invoices.actions"
  | "invoices.download"
  | "invoices.tokenPurchase"
  | "invoices.invoice"
  | "invoices.billTo"
  | "invoices.thankYou"
  // How it works page
  | "howItWorks.title"
  | "howItWorks.subtitle"
  | "howItWorks.step1Title"
  | "howItWorks.step1Desc"
  | "howItWorks.step2Title"
  | "howItWorks.step2Desc"
  | "howItWorks.step3Title"
  | "howItWorks.step3Desc"
  | "howItWorks.ctaTitle"
  | "howItWorks.ctaDesc"
  | "howItWorks.ctaButton"
  // Contact page
  | "contact.title"
  | "contact.subtitle"
  | "contact.accountHelp"
  | "contact.technicalHelp"
  | "contact.billingHelp"
  | "contact.safetyHelp"
  | "contact.generalHelp"
  | "contact.emailUs"
  | "contact.emailUsDesc"
  | "contact.visitFaq"
  | "contact.visitFaqDesc"
  | "contact.communityGuidelines"
  | "contact.communityGuidelinesDesc"
  | "contact.supportExpect"
  | "contact.supportExpectDesc"
  // Monetization page
  | "monetization.title"
  | "monetization.subtitle"
  | "monetization.tokenBalance"
  | "monetization.totalEarnings"
  | "monetization.modelsOwned"
  | "monetization.availableWithdrawal"
  | "monetization.forImageGen"
  | "monetization.premiumModels"
  | "monetization.loading"
  | "monetization.unavailable"
  | "monetization.unavailableDesc"
  | "monetization.returnHome"
  | "monetization.readyToWithdraw"
  | "monetization.needMore"
  | "monetization.tokensEarned"
  | "monetization.recentActivity"
  | "monetization.activityDesc"
  // Cookies page
  | "cookies.title"
  | "cookies.intro"
  | "cookies.whatAreCookies"
  | "cookies.whatAreCookiesDesc"
  | "cookies.typesTitle"
  | "cookies.essentialTitle"
  | "cookies.essentialDesc"
  | "cookies.functionalTitle"
  | "cookies.functionalDesc"
  | "cookies.analyticsTitle"
  | "cookies.analyticsDesc"
  | "cookies.marketingTitle"
  | "cookies.marketingDesc"
  | "cookies.manageCookies"
  | "cookies.manageCookiesDesc"
  | "cookies.gdprTitle"
  | "cookies.gdprDesc"
  | "cookies.contactTitle"
  | "cookies.contactDesc"
  // Terms page
  | "terms.title"
  | "terms.intro"
  | "terms.acceptance"
  | "terms.eligibility"
  | "terms.useOfService"
  | "terms.contentAndAI"
  | "terms.premiumAndPayments"
  | "terms.intellectualProperty"
  | "terms.privacyAndData"
  | "terms.limitation"
  | "terms.changesToTerms"
  | "terms.contactUs"
  // Privacy page
  | "privacy.title"
  | "privacy.intro"
  | "privacy.whoWeAre"
  | "privacy.whatIsPersonalData"
  | "privacy.whatWeCollect"
  | "privacy.howWeCollect"
  | "privacy.whyWeProcess"
  | "privacy.dataSharing"
  | "privacy.internationalTransfers"
  | "privacy.dataSecurity"
  | "privacy.childrenPrivacy"
  | "privacy.dataRetention"
  | "privacy.yourRights"
  | "privacy.contactUs"
  // Guidelines page
  | "guidelines.title"
  | "guidelines.intro"
  | "guidelines.ageRequirements"
  | "guidelines.illegalActivities"
  | "guidelines.childProtection"
  | "guidelines.sexualContent"
  | "guidelines.violence"
  | "guidelines.hateSpeech"
  | "guidelines.privacyFraud"
  | "guidelines.misinformation"
  | "guidelines.spam"
  | "guidelines.restrictedGoods"
  | "guidelines.reportViolations"
  | "guidelines.reportContent"
  | "guidelines.contactSupport"
  | "guidelines.agreement"
  // Report page
  | "report.title"
  | "report.intro"
  | "report.whatToReport"
  | "report.howToSubmit"
  | "report.inPlatform"
  | "report.contactSupport"
  | "report.afterSubmit"
  | "report.acknowledgement"
  | "report.reviewInvestigation"
  | "report.actionsTaken"
  | "report.timeline"
  | "report.important"
  | "report.falseReporting"
  | "report.objectivity"
  | "report.improvement"
  | "report.needToReport"
  | "report.sendReport"
  // Roadmap page
  | "roadmap.title"
  | "roadmap.subtitle"
  | "roadmap.productDev"
  | "roadmap.doneLaunched"
  | "roadmap.featuresAvailable"
  | "roadmap.inProgress"
  | "roadmap.workingOnNow"
  | "roadmap.upcoming"
  | "roadmap.comingSoon"
  // Guide page
  | "guide.title"
  | "guide.subtitle"
  | "guide.gettingStarted"
  | "guide.imageGeneration"
  | "guide.chatFeature"
  | "guide.tokensAndPremium"
  | "guide.profileSettings"
  | "guide.support"
  // Unsubscribe page
  | "unsubscribe.title"
  | "unsubscribe.description"
  | "unsubscribe.success"
  | "unsubscribe.error"

export type Translations = {
  [key in TranslationKey]: string
}

export const translations: Record<"en" | "sv", Translations> = {

  en: {
    "general.siteName": "Dintype",
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
    "home.companion.title": "AI Companion Experience with Dintype",
    "home.companion.p1": "Step into a new kind of connection with Dintype – your gateway to personal, emotionally intelligent AI companions.",
    "home.companion.p2": "Looking for an anime companion, an AI girlfriend to chat with, or maybe a caring AI boyfriend? Dintype makes it easy to create, personalize, and evolve your ideal match using modern AI.",
    "home.companion.p3": "We don't just offer chatbots. We offer deeply customizable AI experiences shaped to your wishes: realistic voice, image generation, and playful videos.",
    "home.companion.p4": "Your AI companion remembers your preferences and adapts over time. Whether you want a deep relationship or spontaneous encounters, you’re always in control.",
    "home.companion.p5": "Yes—your companion can send selfies, generate custom videos, or respond with voice. Ask for specific outfits, unique poses, or playful scenarios.",
    "home.companion.p6": "Privacy is a top priority. Conversations are encrypted and optional two-factor authentication keeps your account secure.",
    "home.companion.p7": "Curious what an AI companion is? Think of a digital partner who can talk, react, flirt, and connect in real time.",
    "home.companion.p8": "Whether you want casual company or something more romantic, Dintype adapts to your pace from first message to goodnight.",
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
    "footer.companyDescription": "Dintype delivers immersive experiences with AI companions that feel real, allowing users to generate images and chat.",
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
    "nav.generateImage": "Generate Image",
    "nav.createCharacter": "Create Character",
    "nav.myAI": "My AI Character",
    "nav.myImages": "My Images",
    "nav.premium": "Premium",
    "nav.adminPanel": "Admin Panel",
    "chat.pocketUniverse": "Your Pocket Universe",
    "chat.conversationsTitle": "Conversations",
    "chat.reconnectDesc": "Reconnect with your favorites or explore new personalities crafted just for you.",
    "chat.personalitiesOnline": "{{count}} Personalities Online",
    "chat.recentChatsTitle": "Recent Chats",
    "chat.discoverAll": "Discover All",
    "chat.browseCategory": "Browse Category",
    "generate.createFromSuggestions": "Create your love from suggestions",
    "generate.lockedFaceTwinning": "Locked Face Twinning Active",
    "generate.premiumRequired": "Premium Required",
    "generate.upgradeToPremium": "Upgrade to Premium",
    "generate.wantMultipleImages": "Want to generate multiple images?",
    "generate.upgradeForMultiple": "Upgrade to Premium to generate 4, 6, or 8 images at once!",
    "generate.tokensPerImage": "5 tokens per image",
    "generate.freeLabel": "Free",
    "generate.freeSFW": "FREE SFW",
    "generate.clearPrompt": "Clear",
    "generate.copyPrompt": "Copy",
    "generate.pastePrompt": "Paste",
    "generate.generatingProgress": "Generating... {{progress}}%",
    "generate.generateWithTokens": "Generate Image ({{tokens}} tokens)",
    "generate.generateFree": "Generate Image (Free)",
    "generate.imageLiked": "Image liked!",
    "generate.addedToFavorites": "Added to your favorites.",
    "generate.promptCleared": "Prompt cleared",
    "generate.freeOnly1Image": "🆓 Free: 1 image only",
    "premium.dintypePremium": "DINTYPE PREMIUM",
    "premium.upgradeExperience": "Upgrade Your Experience",
    "premium.unlockDesc": "Unlock unlimited potential, exclusive content, and monthly credits.",
    "premium.statusLabel": "Status",
    "premium.creditsLabel": "Credits",
    "premium.tokensLabel": "Tokens",
    "premium.administrator": "Administrator",
    "premium.freeVersion": "Free Version",
    "premium.freePlan": "Free Plan",
    "premium.premiumPlan": "Premium Plan",
    "premium.perMonth": "per month",
    "premium.currentPlanBtn": "Current Plan",
    "premium.mostPopular": "MOST POPULAR",
    "premium.subscriptionActiveLabel": "Subscription Active",
    "premium.adminAccount": "Admin Account",
    "premium.noMonthlyCredits": "No monthly credits",
    "premium.freeMessagesPerDay": "3 free messages per day",
    "premium.cannotCreateCharacter": "Cannot create AI character",
    "premium.oneFreeImage": "Only 1 free image (SFW)",
    "premium.monthlyCreditsIncluded": "110 Credits included every month",
    "premium.unlimitedMessages": "Unlimited text messages",
    "premium.unlimitedCharacters": "Create unlimited AI characters",
    "premium.unlimitedImages": "Unlimited images (NSFW/SFW)",
    "premium.buyTokensWithCredits": "Buy tokens with your credits",
    "premium.becomePremium": "BECOME PREMIUM",
    "premium.topUpTokens": "Top Up Tokens",
    "premium.convertCreditsDesc": "Convert your credits to tokens for special features",
    "premium.selectPackage": "Select a package",
    "premium.buyTokensBtn": "BUY TOKENS",
    "premium.grantTokens": "GRANT TOKENS",
    "premium.adminCanAddFree": "As an administrator, you can add tokens at no cost.",
    "premium.creditsDeducted": "Credits are automatically deducted from your balance.",
    "premium.secureLabel": "SECURE",
    "premium.privateLabel": "PRIVATE",
    "premium.unlimitedLabel": "UNLIMITED",
    "premium.tokensGranted": "TOKENS GRANTED!",
    "premium.adminUpdated": "Your administrator account has been updated successfully.",
    "premium.newBalance": "New Balance",
    "premium.tokensAdded": "+{{amount}} Tokens Added",
    "premium.systemLogsUpdated": "System logs updated with administrator action.",
    "premium.balanceSynced": "Your profile and balance have been synchronized globally.",
    "premium.continueToDashboard": "CONTINUE TO DASHBOARD",
    "premium.priceLabel": "PRICE",
    "premium.premiumRequiredForTokens": "You need Premium to be able to use tokens.",
    "premium.upgradeNow": "UPGRADE NOW",
    "premium.chatLabel": "Chat",
    "premium.perMessage": "per message",
    "premium.createAILabel": "Create AI",
    "premium.perProfile": "per profile",
    "premium.imagesLabel": "Images",
    "premium.perImage": "per image",
    "collection.selectAll": "Select All",
    "collection.deselectAll": "Deselect All",
    "collection.bulkDelete": "Delete Selected",
    "collection.confirmDeleteImage": "Are you sure you want to delete this image?",
    "collection.imageDeleted": "Image deleted successfully",
    "collection.deleteError": "Error deleting image",
    "collection.collectionCreated": "Collection created successfully",
    "collection.errorCreatingCollection": "Error creating collection",
    "collection.imagesTitle": "My Images",
    "collection.selectImages": "Select images",
    "collection.generating": "Generating...",
    "profile.overview": "Overview",
    "profile.security": "Security",
    "profile.activity": "Activity",
    "profile.tokenHistory": "Token History",
    "profile.deleteAccount": "Delete Account",
    "profile.dangerZone": "Danger Zone",
    "profile.dangerZoneDesc": "Once you delete your account, there is no going back. Please be certain.",
    "profile.saveProfile": "Save Profile",
    "profile.saving": "Saving...",
    "profile.gender": "Gender",
    "profile.notifications": "Notifications",
    "profile.notificationsDesc": "Receive email notifications",
    "profile.phone": "Phone",
    "profile.male": "Male",
    "profile.female": "Female",
    "profile.other": "Other",
    "profile.personalInfo": "Personal Information",
    "profile.personalInfoDesc": "Update your personal details",
    "profile.notLoggedIn": "You are not logged in",
    "profile.tokenUsage": "Token Usage",
    "profile.noActivity": "No recent activity",
    "auth.loginSuccess": "Logged in successfully!",
    "general.loading": "Loading...",
    // Footer column headings
    "footer.colAiCompanions": "AI Companions",
    "footer.colLegal": "Legal",
    "footer.colAboutUs": "About Us",
    "footer.legal.terms": "Terms and Conditions",
    "footer.legal.privacyPolicy": "Privacy Policy",
    "footer.legal.reportComplaints": "Report and Complaints",
    "footer.legal.guidelines": "Guidelines",
    "footer.legal.cookies": "Cookies",
    // Admin sidebar navigation
    "admin.nav.dashboard": "Dashboard",
    "admin.nav.brandingTheme": "Branding & Theme",
    "admin.nav.costMonitor": "Cost Monitor",
    "admin.nav.restrictions": "Restrictions",
    "admin.nav.seoMetaTags": "SEO Meta Tags",
    "admin.nav.contentEditor": "Content Editor",
    "admin.nav.mediaLibrary": "Media Library",
    "admin.nav.blogPosts": "Blog Posts",
    "admin.nav.characters": "Characters",
    "admin.nav.users": "Users",
    "admin.nav.telegramProfiles": "Telegram Profiles",
    "admin.nav.miniAppMgmt": "Mini App Management",
    "admin.nav.imageSuggestions": "Image Suggestions",
    "admin.nav.banners": "Banners",
    "admin.nav.tokenPackages": "Token Packages",
    "admin.nav.premiumContent": "Premium Content",
    "admin.nav.premiumManagement": "Premium Management",
    "admin.nav.subscriptions": "Subscriptions",
    "admin.nav.settings": "Settings",
    "admin.nav.legal": "Legal",
    "admin.nav.overview": "Overview",
    "admin.nav.mainSite": "Main Site",
    // Admin dashboard
    "admin.dashboard.title": "Dashboard",
    "admin.dashboard.welcome": "Welcome back! Here's your platform overview.",
    "admin.dashboard.viewSite": "View Site",
    "admin.dashboard.loading": "Loading dashboard...",
    "admin.stat.totalUsers": "Total Users",
    "admin.stat.activeCharacters": "Active Characters",
    "admin.stat.monthlyRevenue": "Monthly Revenue",
    "admin.stat.apiCosts": "API Costs",
    "admin.stat.totalRevenue": "Total Revenue",
    "admin.stat.premiumMembers": "Premium Members",
    "admin.stat.allTime": "All time",
    "admin.stat.thisMonth": "This month",
    // FAQ page
    "faq.pageTitle": "Frequently Asked Questions: FAQ",
    "faq.pageIntro": "Welcome to the Dintype FAQ! We have compiled a list of common questions to help you understand our platform and get the most out of your experience. If you can't find the answer you're looking for, don't hesitate to contact our support team at",
    "faq.section.gettingStarted": "Getting Started with Dintype",
    "faq.q.whatIs": "What is Dintype?",
    "faq.a.whatIs": "Dintype is an innovative platform that allows you to create unique AI characters and engage in interactive conversations with them using generative artificial intelligence. You can customize your experience and explore creative interactions. Additionally, Dintype offers an AI-powered feature for image generation based on your text descriptions.",
    "faq.q.howWorks": "How does your platform work?",
    "faq.a.howWorks": "Our platform uses advanced AI models to understand your text inputs and generate relevant and engaging responses from your AI characters. For image generation, you provide text prompts, and our AI creates visual content based on those descriptions. Our systems also include content moderation to ensure a safe and respectful environment.",
    "faq.q.isFree": "Is your service free to use?",
    "faq.a.isFree": "Dintype offers both free and premium features. The free version may have limitations in usage, the number of AI interactions, or access to certain features. Our premium subscription unlocks additional benefits and removes these limitations.",
    "faq.q.whatIsPremium": "What is a premium subscription and what does it cost?",
    "faq.a.whatIsPremium": "Our premium subscription offers enhanced features such as unlimited messages, faster response times, access to exclusive features, and higher limits for image generation. You can find detailed pricing information on our premium page.",
    "faq.q.createAccount": "How do I create an account?",
    "faq.a.createAccount": "Creating an account on Dintype is easy! You can register using one of the following methods:",
    "faq.a.createAccountSocial": "Social Login: Log in quickly using your existing Discord or Google account.",
    "faq.a.createAccountEmail": "Email Registration: Register with a valid email address and create a secure password. You will typically need to verify your email address after registration.",
    "faq.section.aiChars": "Your AI Characters and Interactions",
    "faq.q.customize": "Can I customize my AI character?",
    "faq.a.customize": "Yes, Dintype allows you to customize your AI characters. You can typically define various aspects such as name, personality traits, backstory, and interests. The degree of customization may vary depending on the specific features offered.",
    "faq.q.askPhotos": "Can I ask for photos in the chat?",
    "faq.a.askPhotos": "The ability to request and receive photos in the chat interface with your AI character is a feature of Dintype. Keep in mind that all generated content is subject to our content moderation policies to ensure safety and appropriateness.",
    "faq.q.realtimeImages": "Are images generated in real-time?",
    "faq.a.realtimeImages": "Generation time for images can vary depending on the complexity of your request and current system load. While we strive for fast generation, it may not always be instantaneous.",
    "faq.section.accountMgmt": "Account and Subscription Management",
    "faq.q.howToPay": "How do I pay for the premium subscription?",
    "faq.a.howToPay": "You can pay for the premium subscription via our website or app using the available payment methods. You typically choose a subscription length (e.g., monthly, annually) and provide your payment details during the checkout process.",
    "faq.q.paymentMethods": "What payment methods do you use?",
    "faq.a.paymentMethods": "We accept a variety of payment methods, including:",
    "faq.a.paymentMethodsList": "Credit and debit cards (Visa, MasterCard, American Express), PayPal, Google Pay, Apple Pay",
    "faq.a.paymentMethodsNote": "Note that the availability of specific payment methods may vary depending on your region.",
    "faq.q.howToCancel": "How do I cancel my subscription?",
    "faq.a.howToCancel": "You can cancel your subscription at any time using one of the following methods:",
    "faq.a.cancelMethod1": "Method 1: Quick Access",
    "faq.a.cancelMethod1Desc": "Click here to go directly to your profile settings and manage your subscription.",
    "faq.a.cancelMethod2": "Method 2: Self-Service Navigation",
    "faq.a.cancelMethod2Step1": "Open My Account menu (typically found in the top right corner)",
    "faq.a.cancelMethod2Step2": "Click on Profile or Account Settings",
    "faq.a.cancelMethod2Step3": "Under your current plan, click \"Unsubscribe\" or \"Cancel Subscription\"",
    "faq.a.cancelMethod2Step4": "Follow the on-screen instructions to confirm your cancellation",
    "faq.a.cancelMethod3": "Method 3: Contact Support",
    "faq.a.cancelMethod3Desc": "Alternatively, you can email our support team at support@dintype.se to request cancellation of your subscription.",
    "faq.a.cancelNote": "Effect of Cancellation: Your access to premium features continues until the end of your current billing period. You will not receive a refund for the unused portion of your subscription.",
    "faq.q.howToDelete": "How do I delete my account?",
    "faq.a.howToDelete": "You can permanently delete your Dintype account via your account settings. Follow these steps:",
    "faq.a.deleteStep1": "Go to your Profile or Account Settings",
    "faq.a.deleteStep2": "Look for an option like \"Delete account\", \"Close account\", or similar",
    "faq.a.deleteStep3": "Read the information carefully, as this action is irreversible and will result in permanent loss of your data",
    "faq.a.deleteStep4": "Confirm that you want to proceed with the deletion of the account",
    "faq.section.privacy": "Privacy and Security",
    "faq.q.isSafe": "Is it safe to use your platform?",
    "faq.a.isSafe": "Yes, our users' safety is a top priority. We implement various measures to ensure a safe and respectful environment, including:",
    "faq.a.isSafeModeration": "Content Moderation: We use both automated and manual moderation systems to detect and remove inappropriate content and behavior.",
    "faq.a.isSafeReporting": "Reporting Tools: We provide users with tools to easily report content that violates our Community Guidelines.",
    "faq.a.isSafeSecurity": "Data Security: We use security measures to protect your personal data. See our Privacy Policy for more information.",
    "faq.q.isPrivate": "Are my conversations truly private?",
    "faq.a.isPrivate": "We understand the importance of privacy. Your direct conversations with your AI characters are generally considered private to you. However, our systems may process and store these conversations for service improvement, and in some cases we may need to access them to comply with legal obligations or address safety concerns.",
    "faq.q.canOthersSee": "Can other users access my chats?",
    "faq.a.canOthersSee": "Generally, other users cannot directly access your private conversations with your AI characters. Our system is designed to keep these interactions private to you. However, if you choose to share your conversations publicly, that information may become available to others.",
    "faq.q.personalData": "How do you handle my personal data?",
    "faq.a.personalData": "We are committed to protecting your personal data in accordance with applicable data protection laws. Our Privacy Policy provides detailed information on what data we collect, how we use it, how we store and protect it, and your rights regarding it.",
    "faq.q.reportContent": "How do I report inappropriate content?",
    "faq.a.reportContent": "We encourage our users to help us maintain a safe and respectful community. If you encounter content that violates our Community Guidelines, please report it immediately:",
    "faq.a.reportInApp": "In-app Reporting: Click the \"Report\" button near the content",
    "faq.a.reportEmail": "Contact Support: Email us at support@dintype.se",
    "faq.section.billing": "Billing and Refunds",
    "faq.q.refunds": "Do you offer refunds?",
    "faq.a.refunds": "Generally, due to the nature of our services and immediate access to premium features, we do not offer refunds for subscription fees or purchases, unless required by applicable consumer protection laws. We may offer a free trial or a limited free version so you can evaluate our services before committing to a paid subscription.",
    "faq.section.technical": "Technical Issues and Support",
    "faq.q.techIssue": "What should I do if I encounter a technical issue?",
    "faq.a.techIssue": "If you experience any technical difficulties while using Dintype, please try the following steps:",
    "faq.a.techStep1": "Check your internet connection",
    "faq.a.techStep2": "Ensure your app or browser is updated to the latest version",
    "faq.a.techStep3": "Try clearing your browser's cache and cookies or the app's cache",
    "faq.a.techStep4": "Restart the app or your browser",
    "faq.a.techContact": "If the problem persists, please contact our support team at support@dintype.se with a detailed description of the issue.",
    "faq.cta.title": "Have more questions?",
    "faq.cta.desc": "We hope this FAQ page has been helpful! If you have further questions or need help, don't hesitate to contact our support team.",
    "faq.cta.contactSupport": "Contact Support",
    "faq.cta.moreOptions": "More Contact Options",
    "faq.cta.thanks": "Thank you for being part of the Dintype community!",
    // Character components
    "characterDetail.yearsOld": "years old",
    "characterDetail.noImage": "No image available",
    "characterDetail.about": "About",
    "characterDetail.details": "Details",
    "characterDetail.style": "Style:",
    "characterDetail.eyeColor": "Eye Color:",
    "characterDetail.hair": "Hair:",
    "characterDetail.bodyType": "Body Type:",
    "characterDetail.relationship": "Relationship:",
    "characterDetail.close": "Close",
    "characterDetail.startChat": "Start Chat",
    "characterDetail.notFound": "Character not found",
    "characterCard.new": "New",
    "characterList.error": "Error",
    "characterList.deleted": "Character Deleted",
    "characterList.deletedDesc": "The character has been successfully deleted.",
    "characterList.noCharacters": "No characters found",
    "characterList.createFirst": "Create your first character to begin your adventure.",
    "characterList.createCharacter": "Create Character",
    "characterList.noPortrait": "No Portrait",
    "characterList.public": "Public",
    "characterList.editProfile": "Edit Profile",
    "characterList.deleteCharacter": "Delete Character",
    "characterList.deleteDesc": "This action is permanent and will delete all memory and prompts associated with this AI.",
    "characterList.cancel": "Cancel",
    "characterList.deleting": "Deleting...",
    "characterList.confirmDelete": "Confirm Delete",
    "characterList.chatNow": "Chat Now",
    // Error page
    "error.title": "Something Went Wrong",
    "error.description": "Our AI characters encountered an unexpected error.",
    "error.errorId": "Error ID:",
    "error.defaultMessage": "An unexpected error occurred",
    "error.tryAgain": "Try Again",
    "error.returnHome": "Return Home",
    "error.goBack": "Go Back",
    // Loading page
    "loading.title": "Generating AI Magic",
    "loading.description": "Our AI characters are working on your request...",
    // Login page
    "login.title": "Log In",
    "login.continueToAccess": "Continue to access",
    "login.openLoginDialog": "Open login dialog",
    // Not found page
    "notFound.title": "Character Not Found",
    "notFound.description": "Oops! It seems this AI character has wandered off into the digital void.",
    "notFound.subDescription": "Perhaps they're exploring another dimension or just taking a break from the digital world.",
    "notFound.returnHome": "Return Home",
    "notFound.browseCollections": "Browse Collections",
    "notFound.startChat": "Start a Chat",
    "notFound.goBack": "Go Back",
    "notFound.refreshPage": "Refresh Page",
    "notFound.searchPlaceholder": "Search for characters...",
    "notFound.popularSearches": "Popular searches:",
    "notFound.homeTab": "Home",
    "notFound.searchTab": "Search",
    "notFound.chatTab": "Chat",
    "notFound.dontWorry": "Don't worry! You can try one of these paths instead:",
    "notFound.lostInDigital": "Lost in the digital realm? Try searching for another character.",
    "notFound.collections": "Collections",
    "notFound.browseCharacterCollections": "Browse character collections",
    "notFound.characters": "Characters",
    "notFound.viewAllCharacters": "View all characters",
    "notFound.startConversation": "Start a new conversation",
    "notFound.chooseCharacter": "Choose a character to chat with or start a new conversation",
    "notFound.startChatting": "Start Chatting",
    // My AI page
    "myAi.loadingPartners": "Loading your AI partners...",
    "myAi.privateGallery": "YOUR PRIVATE GALLERY",
    "myAi.title": "My AI Partners",
    "myAi.noCompanions": "You don't have any AI companions yet. Unleash your imagination and create your perfect match!",
    "myAi.createNew": "CREATE NEW",
    "myAi.noCompanionsTitle": "NO AI COMPANIONS YET",
    "myAi.noCompanionsDesc": "The world is waiting for you. Create your first unique AI character with personality, memories, and style.",
    "myAi.startCreating": "START CREATING NOW",
    "myAi.premiumLocked": "Premium Content Locked",
    "myAi.renewMembership": "Renew your membership to continue chatting with",
    "myAi.unlockNow": "UNLOCK NOW",
    "myAi.startChat": "START CHAT",
    "myAi.edit": "EDIT",
    "myAi.delete": "DELETE",
    "myAi.yearsOld": "YEARS OLD",
    "myAi.deleted": "DELETED",
    "myAi.deletedDesc": "Your connection has been successfully removed.",
    "myAi.failed": "FAILED",
    "myAi.failedDesc": "We couldn't delete your AI companion right now. Please try again.",
    "myAi.errorTitle": "ERROR",
    "myAi.errorDesc": "An unexpected connection error occurred.",
    // About us page
    "aboutUs.title": "Dintype – AI Companions, just for you",
    "aboutUs.intro": "Looking for an AI companion who truly gets you? With Dintype, you can create your own AI partner – one that remembers your preferences, adapts to your conversations, and is always there for you.",
    "aboutUs.newEra": "A New Era of AI Relationships",
    "aboutUs.newEraDesc": "Forget the stress of dating apps and one-sided conversations. Dintype uses cutting-edge AI technology to offer a deeply personal and immersive experience.",
    "aboutUs.chatConnect": "Chat, Connect, Customize",
    "aboutUs.feature1": "Create AI characters that match your ideal type.",
    "aboutUs.feature2": "Enjoy personalized conversations that adapt over time.",
    "aboutUs.feature3": "Generate stunning, custom images of your AI partner.",
    "aboutUs.feature4": "Chat freely in a private, secure environment.",
    "aboutUs.fictional": "Fictional AI, Real Pleasure",
    "aboutUs.fictionalDesc1": "While our AI companions are fictional, the experience is designed to feel meaningful and enjoyable. Whether you want companionship, fun, or creative exploration – Dintype delivers.",
    "aboutUs.fictionalDesc2": "All content is AI-generated and fictional. Users must be 18+.",
    "aboutUs.getStarted": "Get Started Today",
    "aboutUs.getStartedDesc": "Join Dintype and experience the next generation of AI companionship. Create your first character or image – it only takes a minute.",
    "aboutUs.createImage": "Create Image",
    "aboutUs.createCompanion": "Create Companion",
    // Characters page
    "characters.title": "All Characters",
    "characters.description": "Explore public characters and manage your own.",
    "characters.createCharacter": "Create Character",
    "characters.loading": "Loading characters...",
    // Favorites page
    "favorites.title": "Favorite Prompts",
    "favorites.empty": "You haven't favorited any prompts yet.",
    "favorites.loading": "Loading favorites...",
    // Blog page
    "blog.title": "BLOG",
    "blog.allCategories": "All categories",
    "blog.loadingPosts": "Loading posts...",
    "blog.noPosts": "No posts found",
    "blog.readMore": "Read more →",
    "blog.previous": "Previous",
    "blog.next": "Next",
    // Invoices page
    "invoices.title": "Invoices & Receipts",
    "invoices.subtitle": "View and download your payment receipts",
    "invoices.refresh": "Refresh",
    "invoices.paymentHistory": "Payment History",
    "invoices.allPayments": "All your payment transactions and invoices",
    "invoices.noInvoices": "No invoices found",
    "invoices.invoiceDate": "Invoice Date",
    "invoices.description": "Description",
    "invoices.amount": "Amount",
    "invoices.status": "Status",
    "invoices.actions": "Actions",
    "invoices.download": "Download",
    "invoices.tokenPurchase": "Token Purchase",
    "invoices.invoice": "INVOICE",
    "invoices.billTo": "Bill To:",
    "invoices.thankYou": "Thank you for your business!",
    // How it works
    "howItWorks.title": "How it Works",
    "howItWorks.subtitle": "Create your perfect AI companion in three simple steps",
    "howItWorks.step1Title": "Create Your Character",
    "howItWorks.step1Desc": "Design your ideal AI companion with custom personality traits, appearance, and background story.",
    "howItWorks.step2Title": "Start Chatting",
    "howItWorks.step2Desc": "Have natural conversations with your AI character. They remember everything and adapt to your style.",
    "howItWorks.step3Title": "Generate Images",
    "howItWorks.step3Desc": "Create stunning AI-generated images of your character in any scenario you imagine.",
    "howItWorks.ctaTitle": "Ready to Begin?",
    "howItWorks.ctaDesc": "Start your AI companion journey today",
    "howItWorks.ctaButton": "Get Started",
    // Contact page
    "contact.title": "Dintype Support: We are here to help!",
    "contact.subtitle": "Get help with your account, billing, or any questions you may have about Dintype.",
    "contact.accountHelp": "Account & Login Help",
    "contact.technicalHelp": "Technical Issues",
    "contact.billingHelp": "Billing & Payments",
    "contact.safetyHelp": "Safety & Reporting",
    "contact.generalHelp": "General Questions",
    "contact.emailUs": "Email Us",
    "contact.emailUsDesc": "Send us an email and we'll get back to you within 24 hours.",
    "contact.visitFaq": "Visit Our FAQ",
    "contact.visitFaqDesc": "Find answers to the most common questions.",
    "contact.communityGuidelines": "Community Guidelines",
    "contact.communityGuidelinesDesc": "Read our community guidelines to learn what's allowed.",
    "contact.supportExpect": "What to Expect",
    "contact.supportExpectDesc": "Our support team typically responds within 24 hours. For urgent matters, please include 'URGENT' in your email subject.",
    // Monetization page
    "monetization.title": "Monetization Dashboard",
    "monetization.subtitle": "Manage your earnings, models, and withdrawal requests",
    "monetization.tokenBalance": "Token Balance",
    "monetization.totalEarnings": "Total Earnings",
    "monetization.modelsOwned": "Models Owned",
    "monetization.availableWithdrawal": "Available for Withdrawal",
    "monetization.forImageGen": "Available for image generation",
    "monetization.premiumModels": "Premium models purchased",
    "monetization.loading": "Loading...",
    "monetization.unavailable": "Monetization Unavailable",
    "monetization.unavailableDesc": "Monetization features are currently disabled. Please check back later.",
    "monetization.returnHome": "Return to Home",
    "monetization.readyToWithdraw": "Ready to withdraw",
    "monetization.needMore": "Need more",
    "monetization.tokensEarned": "tokens earned",
    "monetization.recentActivity": "Recent Activity",
    "monetization.activityDesc": "Activity will appear here as you use the platform",
    // Cookies page
    "cookies.title": "Cookie Policy",
    "cookies.intro": "This Cookie Policy explains how Dintype uses cookies and similar tracking technologies when you visit our website.",
    "cookies.whatAreCookies": "What Are Cookies?",
    "cookies.whatAreCookiesDesc": "Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.",
    "cookies.typesTitle": "Types of Cookies We Use",
    "cookies.essentialTitle": "Essential Cookies",
    "cookies.essentialDesc": "Required for the website to function properly. These cannot be disabled.",
    "cookies.functionalTitle": "Functional Cookies",
    "cookies.functionalDesc": "Enable personalized features like language preferences and theme settings.",
    "cookies.analyticsTitle": "Analytics Cookies",
    "cookies.analyticsDesc": "Help us understand how visitors use our website to improve performance.",
    "cookies.marketingTitle": "Marketing Cookies",
    "cookies.marketingDesc": "Used to deliver relevant advertisements and track campaign effectiveness.",
    "cookies.manageCookies": "Managing Your Cookies",
    "cookies.manageCookiesDesc": "You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect website functionality.",
    "cookies.gdprTitle": "GDPR Compliance",
    "cookies.gdprDesc": "In accordance with GDPR, we obtain your consent before placing non-essential cookies. You can withdraw your consent at any time.",
    "cookies.contactTitle": "Contact Us",
    "cookies.contactDesc": "If you have questions about our cookie policy, please contact us.",
    // Terms page
    "terms.title": "Rules and Terms of Use",
    "terms.intro": "Welcome to Dintype. By using our services, you agree to these terms. Please read them carefully to understand your rights and responsibilities.",
    "terms.acceptance": "1. Acceptance of Terms",
    "terms.eligibility": "2. Eligibility and Account",
    "terms.useOfService": "3. Use of the Service",
    "terms.contentAndAI": "4. Content and AI Interactions",
    "terms.premiumAndPayments": "5. Premium Subscriptions and Payments",
    "terms.intellectualProperty": "6. Intellectual Property",
    "terms.privacyAndData": "7. Privacy and Data Protection",
    "terms.limitation": "8. Limitation of Liability",
    "terms.changesToTerms": "9. Changes to Terms",
    "terms.contactUs": "10. Contact Us",
    // Privacy page
    "privacy.title": "Privacy Policy",
    "privacy.intro": "Welcome to Dintype. We respect your privacy and are committed to protecting your personal data.",
    "privacy.whoWeAre": "1. Who We Are (Data Controller)",
    "privacy.whatIsPersonalData": "2. What is Personal Data?",
    "privacy.whatWeCollect": "3. What Personal Data We Collect",
    "privacy.howWeCollect": "4. How We Collect Your Data",
    "privacy.whyWeProcess": "5. Why We Process Your Data (Legal Basis)",
    "privacy.dataSharing": "6. Data Transfer and Sharing",
    "privacy.internationalTransfers": "7. International Data Transfers",
    "privacy.dataSecurity": "8. Data Security",
    "privacy.childrenPrivacy": "9. Children's Privacy",
    "privacy.dataRetention": "10. Data Retention",
    "privacy.yourRights": "11. Your Rights",
    "privacy.contactUs": "12. Contact Us",
    // Guidelines page
    "guidelines.title": "Community Guidelines",
    "guidelines.intro": "Our goal is to provide a safe, respectful place where users can enjoy exciting, creative, and fun conversations with virtual chatbots.",
    "guidelines.ageRequirements": "Age Requirements",
    "guidelines.illegalActivities": "Illegal Activities and Criminal Behavior",
    "guidelines.childProtection": "Child Exploitation and Protection of Minors",
    "guidelines.sexualContent": "Sexual Content Restrictions",
    "guidelines.violence": "Violence and Harm",
    "guidelines.hateSpeech": "Hate Speech and Discrimination",
    "guidelines.privacyFraud": "Privacy, Fraud, and Impersonation",
    "guidelines.misinformation": "Misinformation and Political Interference",
    "guidelines.spam": "Spam and Irrelevant Content",
    "guidelines.restrictedGoods": "Restricted Goods and Transactions",
    "guidelines.reportViolations": "Report Violations",
    "guidelines.reportContent": "Report Content",
    "guidelines.contactSupport": "Contact Support",
    "guidelines.agreement": "By using Dintype, you agree to abide by these Community Guidelines.",
    // Report page
    "report.title": "Reporting and Content Complaints Policy",
    "report.intro": "At Dintype, we strive to foster a safe, respectful, and lawful environment for all our users.",
    "report.whatToReport": "What to Report?",
    "report.howToSubmit": "How to Submit a Report or Complaint",
    "report.inPlatform": "In-Platform Reporting:",
    "report.contactSupport": "Contact Support:",
    "report.afterSubmit": "What Happens After You Submit a Complaint?",
    "report.acknowledgement": "Acknowledgement:",
    "report.reviewInvestigation": "Review and Investigation:",
    "report.actionsTaken": "Actions Taken:",
    "report.timeline": "Resolution Timeline:",
    "report.important": "Important Considerations",
    "report.falseReporting": "False Reporting:",
    "report.objectivity": "Objectivity:",
    "report.improvement": "Continuous Improvement:",
    "report.needToReport": "Need to Report Something?",
    "report.sendReport": "Send Report to support@dintype.se",
    // Roadmap page
    "roadmap.title": "Our Roadmap",
    "roadmap.subtitle": "Join us on our journey! Here you can see what we have achieved, what we are currently working on, and what's coming next.",
    "roadmap.productDev": "Product Development",
    "roadmap.doneLaunched": "Done & Launched",
    "roadmap.featuresAvailable": "Features already available",
    "roadmap.inProgress": "In Progress",
    "roadmap.workingOnNow": "What we are working on right now",
    "roadmap.upcoming": "Upcoming",
    "roadmap.comingSoon": "Coming soon",
    // Guide page
    "guide.title": "Platform Guide",
    "guide.subtitle": "Your complete guide to Dintype - from registration to advanced features",
    "guide.gettingStarted": "1. Getting Started - Registration",
    "guide.imageGeneration": "2. Image Generation",
    "guide.chatFeature": "3. Chat Feature",
    "guide.tokensAndPremium": "4. Tokens & Premium",
    "guide.profileSettings": "5. Profile & Settings",
    "guide.support": "6. Support & Help",
    // Unsubscribe page
    "unsubscribe.title": "Unsubscribe",
    "unsubscribe.description": "You have been unsubscribed from our mailing list.",
    "unsubscribe.success": "Successfully unsubscribed!",
    "unsubscribe.error": "An error occurred. Please try again.",
  },

  sv: {
    "general.siteName": "Dintype",
    "general.welcome": "Välkommen",
    "general.home": "Hem",
    "navigation.home": "Tillbaka till startsidan",
    "general.legal": "Juridik",
    "general.features": "Funktioner",
    "general.popular": "Populärt",
    "chat.searchForProfile": "Sök",
    "profile.personality": "Personlighet",
    "profile.hobbies": "Intressen",
    "profile.occupation": "Yrke",
    "profile.relationship": "Relation",
    "profile.language": "Språk",
    "profile.ethnicity": "Etnicitet",
    "generate.generate": "Generera bild",
    "generate.generateImage": "Generera bild",
    "auth.welcomeBack": "Välkommen tillbaka",
    "login.loginToContinue": "Logga in för att fortsätta",
    "general.save": "Spara",
    "general.cancel": "Avbryt",
    "general.loading": "Läser in...",
    "general.error": "Ett fel uppstod",
    "general.success": "Klar",
    "general.explore": "Utforska",
    "general.generate": "Generera",
    "general.create": "Skapa",
    "general.chat": "Chatt",
    "general.collection": "Samling",
    "general.premium": "Premium",
    "general.aiCharacters": "AI-sällskap",
    "general.admin": "Admin",
    "general.user": "Användare",
    "auth.login": "Logga in",
    "auth.logout": "Logga ut",
    "auth.logoutConfirmation": "Är du säker på att du vill logga ut?",
    "auth.createAccount": "Skapa gratis konto",
    "auth.greeting": "Hej",
    "home.exploreCharacters": "Utforska AI-sällskap",
    "home.howItWorks.title": "Hur det fungerar",
    "home.howItWorks.description": "Skapa ett konto, utforska karaktärer eller generera din egen. Börja chatta direkt – konversationerna utvecklas dynamiskt och din AI minns dina preferenser när du återvänder.",
    "home.howItWorks.step1": "Registrera dig eller logga in.",
    "home.howItWorks.step2": "Välj eller skapa en AI-karaktär.",
    "home.howItWorks.step3": "Chatta, generera bilder eller be om röst/video.",
    "home.howItWorks.step4": "Spara favoriter och anpassa personlighet.",
    "home.howItWorks.step5": "Uppgradera för obegränsade och snabbare interaktioner.",
    "home.roadmap.title": "Färdplan",
    "home.roadmap.q1": "K1: Förbättrat röstchat och adaptivt minne.",
    "home.roadmap.q2": "K2: Video-avatarrendering och förbättrad moderering.",
    "home.roadmap.q3": "K3: Realtids-flerpersonschat och mobilappar.",
    "home.roadmap.q4": "K4: Offlineläge och privat kantinferens.",
    "home.guide.title": "Guide",
    "home.guide.description": "Snabbstart för nya användare. Hur du får ut mest av plattformen:",
    "home.guide.chat.title": "Chatta smart",
    "home.guide.chat.description": "Var specifik i dina förfrågningar. Be om stil, ton eller scenario för mer precisa svar.",
    "home.guide.safety.title": "Säkra interaktioner",
    "home.guide.safety.description": "Rapportera olämpligt innehåll. Våra filter skyddar men feedback förbättrar allt.",
    "home.guide.generate.title": "Generera bilder",
    "home.guide.generate.description": "Använd korta tydliga fraser. Kombinera attribut ('mjukt ljus', 'porträtt', 'animestil').",
    "home.guide.personalize.title": "Personalisera",
    "home.guide.personalize.description": "Justera personlighet och bakgrund för att förbättra konsekvens i dialogen över tid.",
    "home.complaints.title": "Klagomål och innehållsborttagning",
    "home.complaints.description": "Vill du rapportera ett problem, felaktigt innehåll eller begära borttagning? Kontakta oss så hanterar vi ärendet omgående.",
    "home.complaints.email": "E-post",
    "home.complaints.note1": "Ange länk/ID för innehållet och en kort beskrivning av problemet.",
    "home.complaints.note2": "Akuta ärenden (säkerhet/missbruk) prioriteras inom 24 timmar.",
    "faq.title": "Vanliga frågor",
    "faq.addFaq": "Lägg till FAQ",
    "faq.cancel": "Avbryt",
    "faq.addNewFaqTitle": "Lägg till ny FAQ",
    "faq.questionLabel": "Fråga",
    "faq.answerLabel": "Svar",
    "faq.questionPlaceholder": "Ange ny FAQ-fråga",
    "faq.answerPlaceholder": "Ange svar för den nya FAQ:n",
    "faq.adding": "Lägger till...",
    "faq.deleteConfirm": "Är du säker på att du vill ta bort denna FAQ?",
    "faq.deleteSuccess": "FAQ borttagen",
    "faq.addSuccess": "FAQ tillagd",
    "faq.errorGeneric": "Ett oväntat fel uppstod",
    "faq.noFaqs": "Inga vanliga frågor finns tillgängliga för tillfället.",
    "home.companion.title": "AI-sällskapsupplevelse med Dintype",
    "home.companion.p1": "Kliv in i en ny typ av kontakt med Dintype – din portal till personliga, emotionellt intelligenta AI-sällskap.",
    "home.companion.p2": "Letar du efter ett anime-sällskap, en AI-flickvän att chatta med, eller kanske en omtänksam AI-pojkvän? Dintype gör det enkelt att skapa, anpassa och utveckla din idealpartner med modern AI.",
    "home.companion.p3": "Vi erbjuder inte bara chatbotar. Vi erbjuder djupt anpassningsbara AI-upplevelser formade efter dina önskemål: realistisk röst, bildgenerering och lekfulla videor.",
    "home.companion.p4": "Ditt AI-sällskap minns dina preferenser och anpassar sig över tid. Oavsett om du vill ha ett djupt förhållande eller spontana möten är du alltid i kontroll.",
    "home.companion.p5": "Ja – ditt sällskap kan skicka selfies, generera anpassade videor eller svara med röst. Be om specifika kläder, unika poser eller lekfulla scenarier.",
    "home.companion.p6": "Integritet är högsta prioritet. Konversationer är krypterade och valfri tvåfaktorsautentisering håller ditt konto säkert.",
    "home.companion.p7": "Nyfiken på vad ett AI-sällskap är? Tänk dig en digital partner som kan prata, reagera, flirta och koppla upp i realtid.",
    "home.companion.p8": "Oavsett om du vill ha avslappnat sällskap eller något mer romantiskt anpassar sig Dintype till din takt från första meddelande till godnatt.",
    "admin.settings": "Admininställningar",
    "admin.language": "Språk",
    "admin.languageDescription": "Ange standardspråket för applikationen",
    "admin.selectLanguage": "Välj språk",
    "admin.english": "Engelska",
    "admin.swedish": "Svenska",
    "admin.stripeIntegration": "Stripe-integration",
    "admin.stripeDescription": "Konfigurera dina Stripe API-nycklar för betalningshantering",
    "admin.stripeSecretKey": "Stripe hemlig nyckel",
    "admin.stripeSecretKeyDescription": "Din Stripe hemliga nyckel. Dela aldrig denna nyckel offentligt.",
    "admin.stripeWebhookSecret": "Stripe webhook-hemlighet",
    "admin.stripeWebhookSecretDescription": "Din Stripe webhook-hemlighet för att verifiera webhook-händelser.",
    "admin.saveSettings": "Spara inställningar",
    "admin.settingsSaved": "Inställningar sparade",
    "admin.settingsError": "Misslyckades med att spara inställningar",
    "admin.languageNote": "Den här inställningen översätter hela webbplatsens gränssnitt för alla användare. Ändringar träder i kraft omedelbart.",
    "generate.title": "Generera bild",
    "generate.promptPlaceholder": "Beskriv bilden du vill generera...",
    "generate.paste": "Klistra in",
    "generate.showNegativePrompt": "Visa negativt prompt",
    "generate.hideNegativePrompt": "Dölj negativt prompt",
    "generate.negativePromptLabel": "Negativt prompt (vad som ska undvikas i bilden)",
    "generate.negativePromptPlaceholder": "Element att utesluta från bilden...",
    "generate.suggestions": "Förslag",
    "generate.numberOfImages": "Antal bilder",
    "generate.premium": "Premium",
    "generate.generateButton": "Generera bild",
    "generate.generating": "Genererar...",
    "generate.viewCollection": "Visa din samling",
    "generate.generatedImages": "Genererade bilder",
    "generate.downloadAll": "Ladda ner alla",
    "generate.collection": "Samling",
    "generate.noImagesYet": "Inga bilder genererade ännu",
    "generate.noImagesDescription": "Ange ett prompt och klicka på Generera-knappen för att skapa AI-genererade bilder baserade på din beskrivning.",
    "generate.savingImages": "Sparar bilder till din samling...",
    "generate.download": "Ladda ner",
    "generate.share": "Dela",
    "generate.image": "Bild",
    "generate.saved": "Sparad",
    "generate.freeTrial": "Gratis provperiod",
    "generate.promptRequired": "Prompt krävs",
    "generate.promptRequiredDescription": "Ange en beskrivning av bilden du vill generera.",
    "generate.loginRequired": "Inloggning krävs",
    "generate.loginRequiredDescription": "Logga in för att generera och spara bilder",
    "generate.downloadFailed": "Nedladdning misslyckades",
    "generate.downloadFailedDescription": "Det gick inte att ladda ner bilden. Försök igen.",
    "generate.imageSaved": "Klar",
    "generate.imageSavedDescription": "Bild sparad i din samling",
    "generate.allImagesSaved": "Bilder sparade",
    "generate.allImagesSavedDescription": "Alla bilder har sparats i din samling.",
    "generate.copiedToClipboard": "Kopierat till urklipp",
    "generate.pastedFromClipboard": "Klistrat in från urklipp",
    "generate.imageUrlCopied": "Bild-URL kopierad till urklipp",
    "generate.noSuggestionCategories": "Inga förslagskategorier tillgängliga.",
    "chat.chats": "Chattar",
    "chat.viewConversationHistory": "Visa din konversationshistorik med karaktärer.",
    "chat.createCharacter": "Skapa sällskap",
    "chat.allCharacters": "Alla karaktärer",
    "chat.viewAll": "Visa alla",
    "chat.loadingCharacters": "Laddar karaktärer...",
    "chat.noConversationsYet": "Inga konversationer ännu",
    "chat.startChattingMessage": "Börja chatta med en karaktär för att se din konversationshistorik här.",
    "chat.browseCharacters": "Bläddra bland karaktärer",
    "chat.recentConversations": "Senaste konversationer",
    "chat.noMessagesYet": "Inga meddelanden ännu",
    "chat.inputPlaceholder": "Skriv ett meddelande...",
    "chat.ask": "Fråga",
    "chat.showMe": "Visa mig...",
    "chat.sendMe": "Skicka mig...",
    "chat.canISee": "Kan jag se...",
    "chat.howToUse": "Hur man använder",
    "chat.viewVideoIntro": "Se videointroduktion",
    "chat.noVideoAvailable": "Ingen video tillgänglig",
    "chat.profileNotFound": "Karaktären hittades inte",
    "chat.backToConversations": "Tillbaka till konversationer",
    "chat.generateQuick": "Ny selfie",
    "chat.generateAdvanced": "Anpassade karaktärsbilder",
    "collection.yourImageCollection": "Din bildsamling",
    "collection.noImagesYet": "Inga bilder sparade ännu",
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
    "collection.myCollection": "Min samling",
    "collection.collectionDescription": "En samling av mina favoritbilder",
    "collection.noCollectionsYet": "Du har inga samlingar ännu.",
    "login.logIn": "Logga in",
    "login.signUp": "Registrera dig",
    "login.submitting": "Loggar in...",
    "login.orLoginWith": "Eller logga in med",
    "login.forgotPassword": "Glömt lösenord?",
    "signup.createAccount": "Skapa ett konto",
    "signup.joinCommunity": "Gå med i vår community och börja chatta med AI-karaktärer",
    "signup.username": "Användarnamn",
    "signup.email": "E-post",
    "profile.age": "Ålder",
    "chat.aboutMe": "Om mig",
    "signup.password": "Lösenord",
    "signup.confirmPassword": "Bekräfta lösenord",
    "signup.createAccountButton": "Registrera dig",
    "signup.alreadyHaveAccount": "Har du redan ett konto?",
    "signup.haveAccount": "Har du redan ett konto?",
    "signup.allFieldsRequired": "Alla fält är obligatoriska",
    "signup.passwordsDoNotMatch": "Lösenorden matchar inte",
    "signup.passwordMinLength": "Lösenordet måste vara minst 6 tecken",
    "signup.passwordHint": "Minst 6 tecken",
    "signup.emailInUse": "E-postadressen används redan",
    "signup.errorOccurred": "Ett fel uppstod vid registreringen",
    "signup.creatingAccount": "Skapar konto...",
    "signup.submitting": "Skapar konto...",
    "signup.orContinueWith": "eller fortsätt med",
    "login.invalidCredentials": "Felaktig e-post eller lösenord",
    "login.loginError": "Ett fel uppstod vid inloggningen",
    "login.emailLabel": "E-post",
    "profile.body": "Kropp",
    "login.emailPlaceholder": "namn@exempel.com",
    "login.passwordLabel": "Lösenord",
    "login.passwordPlaceholder": "••••••••",
    "login.noAccount": "Har du inget konto? ",
    "reset.title": "Återställ ditt lösenord",
    "reset.emailLabel": "E-post",
    "reset.emailPlaceholder": "din@email.com",
    "reset.emailRequired": "E-post krävs",
    "reset.sendLink": "Skicka återställningslänk",
    "reset.sending": "Skickar...",
    "reset.linkSentTitle": "Återställningslänk skickad",
    "reset.linkSentDescription": "Kolla din inkorg för en länk för att återställa ditt lösenord.",
    "reset.errorGeneric": "Något gick fel. Försök igen.",
    "reset.newPasswordLabel": "Nytt lösenord",
    "reset.newPasswordPlaceholder": "••••••••",
    "reset.updatePassword": "Uppdatera lösenord",
    "reset.updating": "Uppdaterar...",
    "reset.updatedTitle": "Lösenord uppdaterat",
    "reset.updatedDescription": "Ditt lösenord har uppdaterats. Omdirigerar...",
    "reset.invalidEmail": "Ange en giltig e-postadress",
    "reset.missingConfig": "Supabase är inte konfigurerat. Ange NEXT_PUBLIC_SUPABASE_URL och NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    "reset.sessionExpired": "Sessionen har gått ut eller är ogiltig. Begär en ny länk för lösenordsåterställning.",
    "premium.chooseYourPlan": "Välj ditt abonnemang",
    "premium.anonymousDisclaimer": "100% anonymt. Du kan avbryta när som helst.",
    "premium.cancelAnytime": "Avbryt abonnemanget när som helst",
    "premium.springSale": "Vårrea",
    "premium.forNewUsers": "för nya användare",
    "premium.discountEnds": "Rabatten slutar snart.",
    "premium.dontMissOut": "Missa inte!",
    "premium.selectedPlan": "Valt abonnemang",
    "premium.benefits": "Premiumförmåner",
    "premium.payWithCard": "Betala med kredit- / betalkort",
    "premium.processing": "Behandlar...",
    "premium.alreadyPremium": "Redan Premium",
    "premium.monthlyPayment": "Månadsbetalning av",
    "premium.oneTimePayment": "Engångsbetalning av",
    "premium.of": "av",
    "premium.securityBadges": "Säkerhetsmärken",
    "premium.antivirusSecured": "Antivirusskyddad",
    "premium.privacyInStatement": "Sekretess i kontoutdrag",
    "premium.noAdultTransaction": "Ingen vuxentransaktion i ditt kontoutdrag",
    "premium.noHiddenFees": "Inga dolda avgifter • Avbryt abonnemanget när som helst",
    "premium.month": "månad",
    "premium.months": "månader",
    "premium.year": "år",
    "premium.was": "Var",
    "chat.clearHistory": "Rensa chatthistorik",
    "chat.clearConfirmation": "Är du säker på att du vill rensa din chatthistorik? Denna åtgärd kan inte ångras.",
    "chat.clearing": "Rensar...",
    "chat.clearButton": "Rensa historik",
    "chat.cancelButton": "Avbryt",
    "admin.seo": "SEO",
    "admin.seoSettings": "SEO-inställningar",
    "admin.seoGlobalSettings": "Globala SEO-inställningar",
    "admin.seoPageSettings": "Sid-SEO-inställningar",
    "admin.seoSiteName": "Webbplatsnamn",
    "admin.seoTitleTemplate": "Titelmall",
    "admin.seoDescription": "Beskrivning",
    "admin.seoKeywords": "Nyckelord",
    "admin.seoOgImage": "Open Graph-bild",
    "admin.seoTwitterHandle": "Twitter-konto",
    "admin.seoPageTitle": "Sidtitel",
    "admin.seoPageDescription": "Sidbeskrivning",
    "admin.seoPageKeywords": "Sidnyckelord",
    "admin.seoPageOgImage": "Sid Open Graph-bild",
    "admin.seoSaveSuccess": "SEO-inställningar sparade",
    "admin.seoSaveError": "Misslyckades med att spara SEO-inställningar",
    "profile.title": "Min profil",
    "profile.accountInfo": "Kontoinformation",
    "profile.accountInfoDesc": "Dina personliga kontouppgifter",
    "profile.username": "Användarnamn",
    "profile.email": "E-post",
    "profile.accountCreated": "Konto skapat",
    "profile.accountType": "Kontotyp",
    "profile.admin": "Administratör",
    "profile.user": "Användare",
    "profile.subscriptionStatus": "Abonnemangsstatus",
    "profile.subscriptionStatusDesc": "Ditt nuvarande abonnemang och status",
    "profile.premiumActive": "Premium aktiv",
    "profile.premiumActiveDesc": "Du har tillgång till alla premiumfunktioner",
    "profile.notPremium": "Inget premiumabonnemang",
    "profile.notPremiumDesc": "Uppgradera till premium för att få tillgång till alla funktioner",
    "profile.expiryDate": "Utgångsdatum",
    "profile.upgradeToPremium": "Uppgradera till Premium",
    "profile.changePassword": "Byt lösenord",
    "profile.changePasswordDesc": "Uppdatera ditt lösenord för att hålla ditt konto säkert",
    "profile.currentPassword": "Nuvarande lösenord",
    "profile.newPassword": "Nytt lösenord",
    "profile.confirmPassword": "Bekräfta nytt lösenord",
    "profile.passwordRequirements": "Lösenordet måste vara minst 8 tecken långt",
    "profile.changing": "Ändrar...",
    "profile.passwordChanged": "Lösenordet har ändrats",
    "profile.passwordsDoNotMatch": "De nya lösenorden matchar inte",
    "profile.passwordTooShort": "Lösenordet måste vara minst 8 tecken långt",
    "profile.errorChangingPassword": "Fel vid ändring av lösenord",
    "profile.errorCheckingStatus": "Fel vid kontroll av premiumstatus",
    "profile.usernameRequired": "Användarnamnet kan inte vara tomt",
    "profile.updateSuccessTitle": "Profil uppdaterad",
    "profile.updateSuccessDesc": "Din profil har uppdaterats",
    "profile.updateErrorTitle": "Uppdatering misslyckades",
    "profile.updateErrorDesc": "Misslyckades med att uppdatera profilen",
    "sidebar.toggleSidebar": "Växla sidofält",
    "sidebar.userMenu": "Användarmeny",
    "sidebar.profile": "Profil",
    "sidebar.navigation": "Navigering",
    "premium.addTokens": "Lägg till token",
    "legal.privacyNotice": "Integritetspolicy",
    "legal.termsOfService": "Användarvillkor",
    "Calling...": "Ringer...",
    "Call me": "Ring mig",
    "+1 (555) 123-4567": "+1 (555) 123-4567",
    "Enter your phone number with country code (e.g., +1 for US)": "Ange ditt telefonnummer med landskod (t.ex. +46 för Sverige)",
    "Enter your phone number": "Ange ditt telefonnummer",
    "Phone number required": "Telefonnummer krävs",
    "Please enter a valid phone number": "Ange ett giltigt telefonnummer",
    "Call failed": "Samtal misslyckades",
    "Failed to initiate call": "Misslyckades med att starta samtal",
    "Call initiated!": "Samtal initierat!",
    "Character will call you shortly": "{{name}} ringer dig snart på {{phoneNumber}}",
    "Initiating call...": "Startar samtal...",
    "Calling": "Ringer",
    "Calling character...": "Ringer {{name}}...",
    "imageGeneration.title": "Generera en bild",
    "imageGeneration.generateWith": "Generera en bild med {{name}}",
    "imageGeneration.describePrompt": "Beskriv vad du vill se",
    "imageGeneration.promptPlaceholder": "Beskriv bilden du vill generera...",
    "imageGeneration.generating": "Genererar...",
    "imageGeneration.generatingMessage": "Genererar din bild...",
    "imageGeneration.emptyStateTitle": "Din genererade bild visas här",
    "imageGeneration.emptyStateMessage": "Ange ett prompt och klicka på Generera för att skapa en bild",
    "imageGeneration.generateButton": "Generera bild",
    "imageGeneration.cancelButton": "Avbryt",
    "home.exploreAIGirlfriends": "Utforska AI-sällskap",
    "general.aiGirlfriends": "AI-sällskap",
    "footer.companyDescription": "Dintype levererar uppslukande upplevelser med AI-sällskap som känns verkliga, så att användare kan generera bilder och chatta.",
    "footer.contact": "Kontakt",
    "footer.features.createImage": "Skapa bild",
    "footer.features.chat": "Chatt",
    "footer.features.createCharacter": "Skapa sällskap",
    "footer.features.gallery": "Galleri",
    "footer.features.explore": "Utforska",
    "footer.about.title": "Om oss",
    "footer.company.title": "Företag",
    "footer.legal.termsPolicies": "Villkor och policyer",
    "footer.about.aiGirlfriendChat": "AI-sällskapschatt",
    "footer.about.aiSexting": "AI-chatt",
    "footer.about.howItWorks": "Hur det fungerar",
    "footer.about.aboutUs": "Om oss",
    "footer.about.roadmap": "Färdplan",
    "footer.about.blog": "Blogg",
    "footer.about.guide": "Guide",
    "footer.about.complaints": "Klagomål och innehållsborttagning",
    "footer.about.termsPolicies": "Villkor och policyer",
    "footer.company.weAreHiring": "Vi rekryterar",
    "footer.editFooter": "Redigera sidfot",
    "footer.addItem": "Lägg till objekt",
    "footer.rightsReserved": "Alla rättigheter förbehållna",
    "footer.resetDefaults": "Återställ till standard",
    "nav.generateImage": "Generera bild",
    "nav.createCharacter": "Skapa karaktär",
    "nav.myAI": "Min AI-karaktär",
    "nav.myImages": "Mina bilder",
    "nav.premium": "Premium",
    "nav.adminPanel": "Adminpanel",
    "chat.pocketUniverse": "Ditt fickuniversum",
    "chat.conversationsTitle": "Konversationer",
    "chat.reconnectDesc": "Återknyt med dina favoriter eller utforska nya personligheter skapade just för dig.",
    "chat.personalitiesOnline": "{{count}} personligheter online",
    "chat.recentChatsTitle": "Senaste chattar",
    "chat.discoverAll": "Utforska allt",
    "chat.browseCategory": "Bläddra i kategori",
    "generate.createFromSuggestions": "Skapa din kärlek från förslag",
    "generate.lockedFaceTwinning": "Ansiktsmatchning aktiverad",
    "generate.premiumRequired": "Premium krävs",
    "generate.upgradeToPremium": "Uppgradera till Premium",
    "generate.wantMultipleImages": "Vill du generera flera bilder?",
    "generate.upgradeForMultiple": "Uppgradera till Premium för att generera 4, 6 eller 8 bilder åt gången!",
    "generate.tokensPerImage": "5 token per bild",
    "generate.freeLabel": "Gratis",
    "generate.freeSFW": "GRATIS SFW",
    "generate.clearPrompt": "Rensa",
    "generate.copyPrompt": "Kopiera",
    "generate.pastePrompt": "Klistra in",
    "generate.generatingProgress": "Genererar... {{progress}}%",
    "generate.generateWithTokens": "Generera bild ({{tokens}} token)",
    "generate.generateFree": "Generera bild (Gratis)",
    "generate.imageLiked": "Bild gillad!",
    "generate.addedToFavorites": "Tillagd i dina favoriter.",
    "generate.promptCleared": "Prompt rensad",
    "generate.freeOnly1Image": "🆓 Gratis: endast 1 bild",
    "premium.dintypePremium": "DINTYPE PREMIUM",
    "premium.upgradeExperience": "Uppgradera din upplevelse",
    "premium.unlockDesc": "Lås upp obegränsad potential, exklusivt innehåll och månadskredit.",
    "premium.statusLabel": "Status",
    "premium.creditsLabel": "Krediter",
    "premium.tokensLabel": "Token",
    "premium.administrator": "Administratör",
    "premium.freeVersion": "Gratis version",
    "premium.freePlan": "Gratisplan",
    "premium.premiumPlan": "Premiumplan",
    "premium.perMonth": "per månad",
    "premium.currentPlanBtn": "Nuvarande plan",
    "premium.mostPopular": "MEST POPULÄR",
    "premium.subscriptionActiveLabel": "Abonnemang aktivt",
    "premium.adminAccount": "Adminkonto",
    "premium.noMonthlyCredits": "Inga månadskredit",
    "premium.freeMessagesPerDay": "3 gratis meddelanden per dag",
    "premium.cannotCreateCharacter": "Kan inte skapa AI-karaktär",
    "premium.oneFreeImage": "Bara 1 gratis bild (SFW)",
    "premium.monthlyCreditsIncluded": "110 krediter inkluderat varje månad",
    "premium.unlimitedMessages": "Obegränsade textmeddelanden",
    "premium.unlimitedCharacters": "Skapa obegränsat AI-karaktärer",
    "premium.unlimitedImages": "Obegränsat bilder (NSFW/SFW)",
    "premium.buyTokensWithCredits": "Köp token med dina krediter",
    "premium.becomePremium": "BLI PREMIUM",
    "premium.topUpTokens": "Fyll på token",
    "premium.convertCreditsDesc": "Konvertera dina krediter till token för specialfunktioner",
    "premium.selectPackage": "Välj ett paket",
    "premium.buyTokensBtn": "KÖP TOKEN",
    "premium.grantTokens": "GE TOKEN",
    "premium.adminCanAddFree": "Som administratör kan du lägga till token utan kostnad.",
    "premium.creditsDeducted": "Krediter dras automatiskt från ditt saldo.",
    "premium.secureLabel": "SÄKER",
    "premium.privateLabel": "PRIVAT",
    "premium.unlimitedLabel": "OBEGRÄNSAT",
    "premium.tokensGranted": "TOKEN TILLDELADE!",
    "premium.adminUpdated": "Ditt administratörskonto har uppdaterats.",
    "premium.newBalance": "Nytt saldo",
    "premium.tokensAdded": "+{{amount}} token tillagda",
    "premium.systemLogsUpdated": "Systemloggar uppdaterade med administratörsåtgärd.",
    "premium.balanceSynced": "Din profil och ditt saldo har synkroniserats globalt.",
    "premium.continueToDashboard": "FORTSÄTT TILL INSTRUMENTPANEL",
    "premium.priceLabel": "PRIS",
    "premium.premiumRequiredForTokens": "Du behöver Premium för att kunna använda token.",
    "premium.upgradeNow": "UPPGRADERA NU",
    "premium.chatLabel": "Chatt",
    "premium.perMessage": "per meddelande",
    "premium.createAILabel": "Skapa AI",
    "premium.perProfile": "per profil",
    "premium.imagesLabel": "Bilder",
    "premium.perImage": "per bild",
    "collection.selectAll": "Välj alla",
    "collection.deselectAll": "Avmarkera alla",
    "collection.bulkDelete": "Ta bort valda",
    "collection.confirmDeleteImage": "Är du säker på att du vill ta bort den här bilden?",
    "collection.imageDeleted": "Bild borttagen",
    "collection.deleteError": "Fel vid borttagning av bild",
    "collection.collectionCreated": "Samling skapad",
    "collection.errorCreatingCollection": "Fel vid skapande av samling",
    "collection.imagesTitle": "Mina bilder",
    "collection.selectImages": "Välj bilder",
    "collection.generating": "Genererar...",
    "profile.overview": "Översikt",
    "profile.security": "Säkerhet",
    "profile.activity": "Aktivitet",
    "profile.tokenHistory": "Tokenhistorik",
    "profile.deleteAccount": "Radera konto",
    "profile.dangerZone": "Farlig zon",
    "profile.dangerZoneDesc": "När du raderar ditt konto kan det inte ångras. Var säker.",
    "profile.saveProfile": "Spara profil",
    "profile.saving": "Sparar...",
    "profile.gender": "Kön",
    "profile.notifications": "Notifieringar",
    "profile.notificationsDesc": "Ta emot e-postnotifieringar",
    "profile.phone": "Telefon",
    "profile.male": "Man",
    "profile.female": "Kvinna",
    "profile.other": "Annat",
    "profile.personalInfo": "Personlig information",
    "profile.personalInfoDesc": "Uppdatera dina personuppgifter",
    "profile.notLoggedIn": "Du är inte inloggad",
    "profile.tokenUsage": "Tokenanvändning",
    "profile.noActivity": "Ingen senaste aktivitet",
    "auth.loginSuccess": "Inloggning lyckades!",
    "general.loading": "Läser in...",
    // Footer column headings
    "footer.colAiCompanions": "AI-sällskaper",
    "footer.colLegal": "Juridik",
    "footer.colAboutUs": "Om oss",
    "footer.legal.terms": "Villkor",
    "footer.legal.privacyPolicy": "Integritetspolicy",
    "footer.legal.reportComplaints": "Rapport och klagomål",
    "footer.legal.guidelines": "Riktlinjer",
    "footer.legal.cookies": "Cookies",
    // Admin sidebar navigation
    "admin.nav.dashboard": "Instrumentpanel",
    "admin.nav.brandingTheme": "Varumärke & tema",
    "admin.nav.costMonitor": "Kostnadsövervakning",
    "admin.nav.restrictions": "Begränsningar",
    "admin.nav.seoMetaTags": "SEO-metatagg",
    "admin.nav.contentEditor": "Innehållsredigerare",
    "admin.nav.mediaLibrary": "Mediebibliotek",
    "admin.nav.blogPosts": "Blogginlägg",
    "admin.nav.characters": "Karaktärer",
    "admin.nav.users": "Användare",
    "admin.nav.telegramProfiles": "Telegram-profiler",
    "admin.nav.miniAppMgmt": "Hantering av miniapp",
    "admin.nav.imageSuggestions": "Bildförslag",
    "admin.nav.banners": "Banderoller",
    "admin.nav.tokenPackages": "Tokenpaket",
    "admin.nav.premiumContent": "Premiuminnehåll",
    "admin.nav.premiumManagement": "Premiumhantering",
    "admin.nav.subscriptions": "Abonnemang",
    "admin.nav.settings": "Inställningar",
    "admin.nav.legal": "Juridik",
    "admin.nav.overview": "Översikt",
    "admin.nav.mainSite": "Huvudsida",
    // Admin dashboard
    "admin.dashboard.title": "Instrumentpanel",
    "admin.dashboard.welcome": "Välkommen tillbaka! Här är din plattformsöversikt.",
    "admin.dashboard.viewSite": "Visa webbplatsen",
    "admin.dashboard.loading": "Läser in instrumentpanel...",
    "admin.stat.totalUsers": "Totala användare",
    "admin.stat.activeCharacters": "Aktiva karaktärer",
    "admin.stat.monthlyRevenue": "Månadsintäkter",
    "admin.stat.apiCosts": "API-kostnader",
    "admin.stat.totalRevenue": "Totala intäkter",
    "admin.stat.premiumMembers": "Premiummedlemmar",
    "admin.stat.allTime": "Alltid",
    "admin.stat.thisMonth": "Denna månad",
    // FAQ page
    "faq.pageTitle": "Vanliga frågor: FAQ",
    "faq.pageIntro": "Välkommen till Dintypes FAQ! Vi har sammanställt en lista med vanliga frågor för att hjälpa dig förstå vår plattform och få ut mesta möjliga av din upplevelse. Om du inte hittar svaret du letar efter, tveka inte att kontakta vårt supportteam på",
    "faq.section.gettingStarted": "Kom igång med Dintype",
    "faq.q.whatIs": "Vad är Dintype?",
    "faq.a.whatIs": "Dintype är en innovativ plattform som låter dig skapa unika AI-karaktärer och delta i interaktiva konversationer med dem med hjälp av generativ artificiell intelligens. Du kan anpassa din upplevelse och utforska kreativa interaktioner. Dessutom erbjuder Dintype en AI-driven funktion för bildgenerering baserad på dina textbeskrivningar.",
    "faq.q.howWorks": "Hur fungerar er plattform?",
    "faq.a.howWorks": "Vår plattform använder avancerade AI-modeller för att förstå dina textinmatningar och generera relevanta och engagerande svar från dina AI-karaktärer. För bildgenerering anger du textpromptar och vår AI skapar visuellt innehåll baserat på dessa beskrivningar. Våra system inkluderar även innehållsmoderering för att säkerställa en säker och respektfull miljö.",
    "faq.q.isFree": "Är er tjänst gratis att använda?",
    "faq.a.isFree": "Dintype erbjuder både gratis- och premiumfunktioner. Gratisversionen kan ha begränsningar i användning, antal AI-interaktioner eller tillgång till vissa funktioner. Vårt premiumabonnemang låser upp ytterligare förmåner och tar bort dessa begränsningar.",
    "faq.q.whatIsPremium": "Vad är ett premiumabonnemang och vad kostar det?",
    "faq.a.whatIsPremium": "Vårt premiumabonnemang erbjuder förbättrade funktioner som obegränsade meddelanden, snabbare svarstider, tillgång till exklusiva funktioner och högre gränser för bildgenerering. Du hittar detaljerad prisinformation på vår premiumsida.",
    "faq.q.createAccount": "Hur skapar jag ett konto?",
    "faq.a.createAccount": "Att skapa ett konto på Dintype är enkelt! Du kan registrera dig på ett av följande sätt:",
    "faq.a.createAccountSocial": "Social inloggning: Logga in snabbt med ditt befintliga Discord- eller Google-konto.",
    "faq.a.createAccountEmail": "E-postregistrering: Registrera dig med en giltig e-postadress och skapa ett säkert lösenord. Du behöver vanligtvis verifiera din e-postadress efter registreringen.",
    "faq.section.aiChars": "Dina AI-karaktärer och interaktioner",
    "faq.q.customize": "Kan jag anpassa min AI-karaktär?",
    "faq.a.customize": "Ja, Dintype låter dig anpassa dina AI-karaktärer. Du kan vanligtvis definiera olika aspekter som namn, personlighetsdrag, bakgrundshistoria och intressen. Graden av anpassning kan variera beroende på de specifika funktionerna som erbjuds.",
    "faq.q.askPhotos": "Kan jag be om foton i chatten?",
    "faq.a.askPhotos": "Möjligheten att begära och ta emot foton i chatgränssnittet med din AI-karaktär är en funktion hos Dintype. Tänk på att allt genererat innehåll är föremål för våra innehållsmodereringspolicyer för att säkerställa säkerhet och lämplighet.",
    "faq.q.realtimeImages": "Genereras bilder i realtid?",
    "faq.a.realtimeImages": "Genereringstiden för bilder kan variera beroende på komplexiteten i din begäran och den aktuella systembelastningen. Även om vi strävar efter snabb generering är det kanske inte alltid omedelbart.",
    "faq.section.accountMgmt": "Konto- och abonnemangshantering",
    "faq.q.howToPay": "Hur betalar jag för premiumabonnemanget?",
    "faq.a.howToPay": "Du kan betala för premiumabonnemanget via vår webbplats eller app med tillgängliga betalningsmetoder. Du väljer vanligtvis en abonnemangslängd (t.ex. månadsvis, årsvis) och anger dina betalningsuppgifter under utcheckningsprocessen.",
    "faq.q.paymentMethods": "Vilka betalningsmetoder använder ni?",
    "faq.a.paymentMethods": "Vi accepterar en mängd olika betalningsmetoder, inklusive:",
    "faq.a.paymentMethodsList": "Kredit- och betalkort (Visa, MasterCard, American Express), PayPal, Google Pay, Apple Pay",
    "faq.a.paymentMethodsNote": "Observera att tillgängligheten av specifika betalningsmetoder kan variera beroende på din region.",
    "faq.q.howToCancel": "Hur avbryter jag mitt abonnemang?",
    "faq.a.howToCancel": "Du kan avbryta ditt abonnemang när som helst med en av följande metoder:",
    "faq.a.cancelMethod1": "Metod 1: Snabbåtkomst",
    "faq.a.cancelMethod1Desc": "Klicka här för att gå direkt till dina profilinställningar och hantera ditt abonnemang.",
    "faq.a.cancelMethod2": "Metod 2: Självbetjäning",
    "faq.a.cancelMethod2Step1": "Öppna Mitt konto-menyn (vanligtvis i det övre högra hörnet)",
    "faq.a.cancelMethod2Step2": "Klicka på Profil eller Kontoinställningar",
    "faq.a.cancelMethod2Step3": "Under din nuvarande plan, klicka på \"Avsluta prenumeration\" eller \"Avbryt abonnemang\"",
    "faq.a.cancelMethod2Step4": "Följ instruktionerna på skärmen för att bekräfta din annullering",
    "faq.a.cancelMethod3": "Metod 3: Kontakta support",
    "faq.a.cancelMethod3Desc": "Alternativt kan du maila vårt supportteam på support@dintype.se för att begära annullering av ditt abonnemang.",
    "faq.a.cancelNote": "Effekt av annullering: Din tillgång till premiumfunktioner fortsätter till slutet av din nuvarande faktureringsperiod. Du får ingen återbetalning för den oanvända delen av ditt abonnemang.",
    "faq.q.howToDelete": "Hur tar jag bort mitt konto?",
    "faq.a.howToDelete": "Du kan permanent ta bort ditt Dintype-konto via dina kontoinställningar. Följ dessa steg:",
    "faq.a.deleteStep1": "Gå till din Profil eller Kontoinställningar",
    "faq.a.deleteStep2": "Leta efter ett alternativ som \"Ta bort konto\", \"Stäng konto\" eller liknande",
    "faq.a.deleteStep3": "Läs informationen noggrant, eftersom denna åtgärd är oåterkallelig och leder till permanent förlust av dina data",
    "faq.a.deleteStep4": "Bekräfta att du vill fortsätta med borttagningen av kontot",
    "faq.section.privacy": "Integritet och säkerhet",
    "faq.q.isSafe": "Är det säkert att använda er plattform?",
    "faq.a.isSafe": "Ja, våra användares säkerhet är en högsta prioritet. Vi implementerar olika åtgärder för att säkerställa en säker och respektfull miljö, inklusive:",
    "faq.a.isSafeModeration": "Innehållsmoderering: Vi använder både automatiserade och manuella modereringssystem för att upptäcka och ta bort olämpligt innehåll och beteende.",
    "faq.a.isSafeReporting": "Rapporteringsverktyg: Vi ger användare verktyg för att enkelt rapportera innehåll som bryter mot våra community-riktlinjer.",
    "faq.a.isSafeSecurity": "Datasäkerhet: Vi använder säkerhetsåtgärder för att skydda dina personuppgifter. Se vår integritetspolicy för mer information.",
    "faq.q.isPrivate": "Är mina konversationer verkligen privata?",
    "faq.a.isPrivate": "Vi förstår vikten av integritet. Dina direkta konversationer med dina AI-karaktärer anses i allmänhet vara privata för dig. Våra system kan dock behandla och lagra dessa konversationer för tjänsteförbättring, och i vissa fall kan vi behöva komma åt dem för att uppfylla juridiska skyldigheter eller hantera säkerhetsproblem.",
    "faq.q.canOthersSee": "Kan andra användare komma åt mina chattar?",
    "faq.a.canOthersSee": "I allmänhet kan andra användare inte direkt komma åt dina privata konversationer med dina AI-karaktärer. Vårt system är utformat för att hålla dessa interaktioner privata för dig. Om du väljer att dela dina konversationer offentligt kan den informationen bli tillgänglig för andra.",
    "faq.q.personalData": "Hur hanterar ni mina personuppgifter?",
    "faq.a.personalData": "Vi är engagerade i att skydda dina personuppgifter i enlighet med tillämpliga dataskyddslagar. Vår integritetspolicy ger detaljerad information om vilka uppgifter vi samlar in, hur vi använder dem, hur vi lagrar och skyddar dem samt dina rättigheter avseende dem.",
    "faq.q.reportContent": "Hur rapporterar jag olämpligt innehåll?",
    "faq.a.reportContent": "Vi uppmuntrar våra användare att hjälpa oss upprätthålla en säker och respektfull community. Om du stöter på innehåll som bryter mot våra community-riktlinjer, rapportera det omedelbart:",
    "faq.a.reportInApp": "Rapportering i appen: Klicka på knappen \"Rapportera\" nära innehållet",
    "faq.a.reportEmail": "Kontakta support: Maila oss på support@dintype.se",
    "faq.section.billing": "Fakturering och återbetalningar",
    "faq.q.refunds": "Erbjuder ni återbetalningar?",
    "faq.a.refunds": "I allmänhet, på grund av tjänsternas natur och omedelbar tillgång till premiumfunktioner, erbjuder vi inte återbetalningar för abonnemangsavgifter eller köp, såvida det inte krävs av tillämpliga konsumentskyddslagar. Vi kan erbjuda en gratis provperiod eller en begränsad gratisversion så att du kan utvärdera våra tjänster innan du förbinder dig till ett betalt abonnemang.",
    "faq.section.technical": "Tekniska problem och support",
    "faq.q.techIssue": "Vad ska jag göra om jag stöter på ett tekniskt problem?",
    "faq.a.techIssue": "Om du upplever tekniska problem med Dintype, prova följande steg:",
    "faq.a.techStep1": "Kontrollera din internetanslutning",
    "faq.a.techStep2": "Se till att din app eller webbläsare är uppdaterad till den senaste versionen",
    "faq.a.techStep3": "Försök att rensa webbläsarens cache och cookies eller appens cache",
    "faq.a.techStep4": "Starta om appen eller webbläsaren",
    "faq.a.techContact": "Om problemet kvarstår, kontakta vårt supportteam på support@dintype.se med en detaljerad beskrivning av problemet.",
    "faq.cta.title": "Har du fler frågor?",
    "faq.cta.desc": "Vi hoppas att denna FAQ-sida har varit till hjälp! Om du har ytterligare frågor eller behöver hjälp, tveka inte att kontakta vårt supportteam.",
    "faq.cta.contactSupport": "Kontakta support",
    "faq.cta.moreOptions": "Fler kontaktalternativ",
    "faq.cta.thanks": "Tack för att du är en del av Dintype-communityn!",
    // Character components
    "characterDetail.yearsOld": "år",
    "characterDetail.noImage": "Ingen bild tillgänglig",
    "characterDetail.about": "Om",
    "characterDetail.details": "Detaljer",
    "characterDetail.style": "Stil:",
    "characterDetail.eyeColor": "Ögonfärg:",
    "characterDetail.hair": "Hår:",
    "characterDetail.bodyType": "Kroppstyp:",
    "characterDetail.relationship": "Relation:",
    "characterDetail.close": "Stäng",
    "characterDetail.startChat": "Starta chatt",
    "characterDetail.notFound": "Karaktären hittades inte",
    "characterCard.new": "Ny",
    "characterList.error": "Fel",
    "characterList.deleted": "Karaktär borttagen",
    "characterList.deletedDesc": "Karaktären har tagits bort.",
    "characterList.noCharacters": "Inga karaktärer hittades",
    "characterList.createFirst": "Skapa din första karaktär för att börja ditt äventyr.",
    "characterList.createCharacter": "Skapa karaktär",
    "characterList.noPortrait": "Inget porträtt",
    "characterList.public": "Offentlig",
    "characterList.editProfile": "Redigera profil",
    "characterList.deleteCharacter": "Ta bort karaktär",
    "characterList.deleteDesc": "Denna åtgärd är permanent och raderar alla minnen och prompter kopplade till denna AI.",
    "characterList.cancel": "Avbryt",
    "characterList.deleting": "Tar bort...",
    "characterList.confirmDelete": "Bekräfta borttagning",
    "characterList.chatNow": "Chatta nu",
    // Error page
    "error.title": "Något gick fel",
    "error.description": "Våra AI-karaktärer stötte på ett oväntat fel.",
    "error.errorId": "Fel-ID:",
    "error.defaultMessage": "Ett oväntat fel inträffade",
    "error.tryAgain": "Försök igen",
    "error.returnHome": "Tillbaka hem",
    "error.goBack": "Gå tillbaka",
    // Loading page
    "loading.title": "Skapar AI-magi",
    "loading.description": "Våra AI-karaktärer arbetar på din förfrågan...",
    // Login page
    "login.title": "Logga in",
    "login.continueToAccess": "Fortsätt för att komma till",
    "login.openLoginDialog": "Öppna inloggningsruta",
    // Not found page
    "notFound.title": "Karaktär inte hittad",
    "notFound.description": "Hoppsan! Det verkar som att denna AI-karaktär har vandrat iväg i det digitala tomrummet.",
    "notFound.subDescription": "Kanske utforskar de en annan dimension eller tar bara en paus från den digitala världen.",
    "notFound.returnHome": "Tillbaka hem",
    "notFound.browseCollections": "Utforska samlingar",
    "notFound.startChat": "Starta en chatt",
    "notFound.goBack": "Gå tillbaka",
    "notFound.refreshPage": "Ladda om sidan",
    "notFound.searchPlaceholder": "Sök efter karaktärer...",
    "notFound.popularSearches": "Populära sökningar:",
    "notFound.homeTab": "Hem",
    "notFound.searchTab": "Sök",
    "notFound.chatTab": "Chatt",
    "notFound.dontWorry": "Oroa dig inte! Du kan prova en av dessa vägar istället:",
    "notFound.lostInDigital": "Vilse i den digitala världen? Prova att söka efter en annan karaktär.",
    "notFound.collections": "Samlingar",
    "notFound.browseCharacterCollections": "Utforska karaktärssamlingar",
    "notFound.characters": "Karaktärer",
    "notFound.viewAllCharacters": "Visa alla karaktärer",
    "notFound.startConversation": "Starta en ny konversation",
    "notFound.chooseCharacter": "Välj en karaktär att chatta med eller starta en ny konversation",
    "notFound.startChatting": "Börja chatta",
    // My AI page
    "myAi.loadingPartners": "Laddar dina AI-partners...",
    "myAi.privateGallery": "DITT PRIVATA GALLERI",
    "myAi.title": "Mina AI-partners",
    "myAi.noCompanions": "Du har inga AI-partners ännu. Släpp loss din fantasi och skapa din perfekta match!",
    "myAi.createNew": "SKAPA NY",
    "myAi.noCompanionsTitle": "INGA AI-PARTNERS ÄNNU",
    "myAi.noCompanionsDesc": "Världen väntar på dig. Skapa din första unika AI-karaktär med personlighet, minnen och stil.",
    "myAi.startCreating": "BÖRJA SKAPA NU",
    "myAi.premiumLocked": "Premiuminnehåll låst",
    "myAi.renewMembership": "Förnya ditt medlemskap för att fortsätta chatta med",
    "myAi.unlockNow": "LÅS UPP NU",
    "myAi.startChat": "STARTA CHATT",
    "myAi.edit": "REDIGERA",
    "myAi.delete": "TA BORT",
    "myAi.yearsOld": "ÅR",
    "myAi.deleted": "BORTTAGET",
    "myAi.deletedDesc": "Din anslutning har tagits bort.",
    "myAi.failed": "MISSLYCKADES",
    "myAi.failedDesc": "Vi kunde inte ta bort din AI-partner just nu. Försök igen.",
    "myAi.errorTitle": "FEL",
    "myAi.errorDesc": "Ett oväntat anslutningsfel inträffade.",
    // About us page
    "aboutUs.title": "Dintype – AI-partners, bara för dig",
    "aboutUs.intro": "Letar du efter en AI-partner som verkligen förstår dig? Med Dintype kan du skapa din egen AI-partner – en som kommer ihåg dina preferenser, anpassar sig till dina konversationer och alltid finns där för dig.",
    "aboutUs.newEra": "En ny era av AI-relationer",
    "aboutUs.newEraDesc": "Glöm stressen med dejtingappar och ensidiga konversationer. Dintype använder banbrytande AI-teknik för att erbjuda en djupt personlig och engagerande upplevelse.",
    "aboutUs.chatConnect": "Chatta, koppla, anpassa",
    "aboutUs.feature1": "Skapa AI-karaktärer som matchar din idealtyp.",
    "aboutUs.feature2": "Njut av personliga konversationer som anpassas över tid.",
    "aboutUs.feature3": "Generera fantastiska, anpassade bilder av din AI-partner.",
    "aboutUs.feature4": "Chatta fritt i en privat, säker miljö.",
    "aboutUs.fictional": "Fiktiv AI, verklig njutning",
    "aboutUs.fictionalDesc1": "Även om våra AI-partners är fiktiva, är upplevelsen utformad för att kännas meningsfull och njutbar. Oavsett om du vill ha sällskap, kul eller kreativ utforskning – Dintype levererar.",
    "aboutUs.fictionalDesc2": "Allt innehåll är AI-genererat och fiktivt. Användare måste vara 18+.",
    "aboutUs.getStarted": "Kom igång idag",
    "aboutUs.getStartedDesc": "Gå med i Dintype och upplev nästa generation av AI-sällskap. Skapa din första karaktär eller bild – det tar bara en minut.",
    "aboutUs.createImage": "Skapa bild",
    "aboutUs.createCompanion": "Skapa partner",
    // Characters page
    "characters.title": "Alla karaktärer",
    "characters.description": "Utforska offentliga karaktärer och hantera dina egna.",
    "characters.createCharacter": "Skapa karaktär",
    "characters.loading": "Laddar karaktärer...",
    // Favorites page
    "favorites.title": "Favoritprompter",
    "favorites.empty": "Du har inte favoritmarkerat några prompter ännu.",
    "favorites.loading": "Laddar favoriter...",
    // Blog page
    "blog.title": "BLOGG",
    "blog.allCategories": "Alla kategorier",
    "blog.loadingPosts": "Laddar inlägg...",
    "blog.noPosts": "Inga inlägg hittades",
    "blog.readMore": "Läs mer →",
    "blog.previous": "Föregående",
    "blog.next": "Nästa",
    // Invoices page
    "invoices.title": "Fakturor och kvitton",
    "invoices.subtitle": "Visa och ladda ner dina betalningskvitton",
    "invoices.refresh": "Uppdatera",
    "invoices.paymentHistory": "Betalningshistorik",
    "invoices.allPayments": "Alla dina betalningstransaktioner och fakturor",
    "invoices.noInvoices": "Inga fakturor hittades",
    "invoices.invoiceDate": "Fakturadatum",
    "invoices.description": "Beskrivning",
    "invoices.amount": "Belopp",
    "invoices.status": "Status",
    "invoices.actions": "Åtgärder",
    "invoices.download": "Ladda ner",
    "invoices.tokenPurchase": "Tokenköp",
    "invoices.invoice": "FAKTURA",
    "invoices.billTo": "Faktureras till:",
    "invoices.thankYou": "Tack för din beställning!",
    // How it works
    "howItWorks.title": "Så fungerar det",
    "howItWorks.subtitle": "Skapa din perfekta AI-partner i tre enkla steg",
    "howItWorks.step1Title": "Skapa din karaktär",
    "howItWorks.step1Desc": "Designa din ideala AI-partner med anpassade personlighetsdrag, utseende och bakgrundshistoria.",
    "howItWorks.step2Title": "Börja chatta",
    "howItWorks.step2Desc": "Ha naturliga konversationer med din AI-karaktär. Den minns allt och anpassar sig till din stil.",
    "howItWorks.step3Title": "Generera bilder",
    "howItWorks.step3Desc": "Skapa fantastiska AI-genererade bilder av din karaktär i alla scenarier du kan tänka dig.",
    "howItWorks.ctaTitle": "Redo att börja?",
    "howItWorks.ctaDesc": "Starta din AI-partnerresa idag",
    "howItWorks.ctaButton": "Kom igång",
    // Contact page
    "contact.title": "Dintype Support: Vi finns här för att hjälpa!",
    "contact.subtitle": "Få hjälp med ditt konto, fakturering eller frågor om Dintype.",
    "contact.accountHelp": "Konto & inloggningshjälp",
    "contact.technicalHelp": "Tekniska problem",
    "contact.billingHelp": "Fakturering & betalningar",
    "contact.safetyHelp": "Säkerhet & rapportering",
    "contact.generalHelp": "Allmänna frågor",
    "contact.emailUs": "Mejla oss",
    "contact.emailUsDesc": "Skicka ett mejl så återkommer vi inom 24 timmar.",
    "contact.visitFaq": "Besök vår FAQ",
    "contact.visitFaqDesc": "Hitta svar på de vanligaste frågorna.",
    "contact.communityGuidelines": "Gemenskapsregler",
    "contact.communityGuidelinesDesc": "Läs våra gemenskapsregler för att veta vad som gäller.",
    "contact.supportExpect": "Vad du kan förvänta dig",
    "contact.supportExpectDesc": "Vårt supportteam svarar vanligtvis inom 24 timmar. Vid brådskande ärenden, skriv 'BRÅDSKANDE' i ämnesraden.",
    // Monetization page
    "monetization.title": "Monetiseringspanel",
    "monetization.subtitle": "Hantera dina intäkter, modeller och uttagsförfrågningar",
    "monetization.tokenBalance": "Tokensaldo",
    "monetization.totalEarnings": "Totala intäkter",
    "monetization.modelsOwned": "Ägda modeller",
    "monetization.availableWithdrawal": "Tillgängligt för uttag",
    "monetization.forImageGen": "Tillgängligt för bildgenerering",
    "monetization.premiumModels": "Premiummodeller köpta",
    "monetization.loading": "Laddar...",
    "monetization.unavailable": "Monetisering ej tillgänglig",
    "monetization.unavailableDesc": "Monetiseringsfunktioner är för tillfället inaktiverade. Vänligen återkom senare.",
    "monetization.returnHome": "Tillbaka till startsidan",
    "monetization.readyToWithdraw": "Redo att ta ut",
    "monetization.needMore": "Behöver mer",
    "monetization.tokensEarned": "tokens intjänade",
    "monetization.recentActivity": "Senaste aktivitet",
    "monetization.activityDesc": "Aktivitet visas här när du använder plattformen",
    // Cookies page
    "cookies.title": "Cookiepolicy",
    "cookies.intro": "Denna cookiepolicy förklarar hur Dintype använder cookies och liknande spårningsteknologier när du besöker vår webbplats.",
    "cookies.whatAreCookies": "Vad är cookies?",
    "cookies.whatAreCookiesDesc": "Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De hjälper webbplatsen att komma ihåg dina preferenser och förbättra din upplevelse.",
    "cookies.typesTitle": "Typer av cookies vi använder",
    "cookies.essentialTitle": "Nödvändiga cookies",
    "cookies.essentialDesc": "Krävs för att webbplatsen ska fungera korrekt. Dessa kan inte inaktiveras.",
    "cookies.functionalTitle": "Funktionella cookies",
    "cookies.functionalDesc": "Aktiverar personliga funktioner som språkinställningar och temaval.",
    "cookies.analyticsTitle": "Analytikcookies",
    "cookies.analyticsDesc": "Hjälper oss förstå hur besökare använder vår webbplats för att förbättra prestandan.",
    "cookies.marketingTitle": "Marknadsföringscookies",
    "cookies.marketingDesc": "Används för att leverera relevanta annonser och spåra kampanjers effektivitet.",
    "cookies.manageCookies": "Hantera dina cookies",
    "cookies.manageCookiesDesc": "Du kan kontrollera och radera cookies via dina webbläsarinställningar. Observera att inaktivering av vissa cookies kan påverka webbplatsens funktionalitet.",
    "cookies.gdprTitle": "GDPR-efterlevnad",
    "cookies.gdprDesc": "I enlighet med GDPR inhämtar vi ditt samtycke innan vi placerar icke-nödvändiga cookies. Du kan återkalla ditt samtycke när som helst.",
    "cookies.contactTitle": "Kontakta oss",
    "cookies.contactDesc": "Om du har frågor om vår cookiepolicy, vänligen kontakta oss.",
    // Terms page
    "terms.title": "Regler och användarvillkor",
    "terms.intro": "Välkommen till Dintype. Genom att använda våra tjänster godkänner du dessa villkor. Läs dem noggrant för att förstå dina rättigheter och skyldigheter.",
    "terms.acceptance": "1. Godkännande av villkor",
    "terms.eligibility": "2. Behörighet och konto",
    "terms.useOfService": "3. Användning av tjänsten",
    "terms.contentAndAI": "4. Innehåll och AI-interaktioner",
    "terms.premiumAndPayments": "5. Premiumabonnemang och betalningar",
    "terms.intellectualProperty": "6. Immateriella rättigheter",
    "terms.privacyAndData": "7. Integritet och dataskydd",
    "terms.limitation": "8. Ansvarsbegränsning",
    "terms.changesToTerms": "9. Ändringar av villkor",
    "terms.contactUs": "10. Kontakta oss",
    // Privacy page
    "privacy.title": "Integritetspolicy",
    "privacy.intro": "Välkommen till Dintype. Vi respekterar din integritet och är engagerade i att skydda dina personuppgifter.",
    "privacy.whoWeAre": "1. Vilka vi är (Personuppgiftsansvarig)",
    "privacy.whatIsPersonalData": "2. Vad är personuppgifter?",
    "privacy.whatWeCollect": "3. Vilka personuppgifter vi samlar in",
    "privacy.howWeCollect": "4. Hur vi samlar in dina uppgifter",
    "privacy.whyWeProcess": "5. Varför vi behandlar dina uppgifter (Rättslig grund)",
    "privacy.dataSharing": "6. Dataöverföring och delning",
    "privacy.internationalTransfers": "7. Internationella dataöverföringar",
    "privacy.dataSecurity": "8. Datasäkerhet",
    "privacy.childrenPrivacy": "9. Barns integritet",
    "privacy.dataRetention": "10. Datalagring",
    "privacy.yourRights": "11. Dina rättigheter",
    "privacy.contactUs": "12. Kontakta oss",
    // Guidelines page
    "guidelines.title": "Gemenskapsregler",
    "guidelines.intro": "Vårt mål är att erbjuda en säker, respektfull plats där användare kan njuta av spännande, kreativa och roliga konversationer med virtuella chatbotar.",
    "guidelines.ageRequirements": "Ålderskrav",
    "guidelines.illegalActivities": "Olagliga aktiviteter och kriminellt beteende",
    "guidelines.childProtection": "Barnexploatering och skydd av minderåriga",
    "guidelines.sexualContent": "Begränsningar för sexuellt innehåll",
    "guidelines.violence": "Våld och skada",
    "guidelines.hateSpeech": "Hatpropaganda och diskriminering",
    "guidelines.privacyFraud": "Integritet, bedrägeri och utgivning för annan",
    "guidelines.misinformation": "Desinformation och politisk inblandning",
    "guidelines.spam": "Spam och irrelevant innehåll",
    "guidelines.restrictedGoods": "Reglerade varor och transaktioner",
    "guidelines.reportViolations": "Rapportera överträdelser",
    "guidelines.reportContent": "Rapportera innehåll",
    "guidelines.contactSupport": "Kontakta support",
    "guidelines.agreement": "Genom att använda Dintype godkänner du att följa dessa gemenskapsregler.",
    // Report page
    "report.title": "Policy för rapportering och innehållsklagomål",
    "report.intro": "På Dintype strävar vi efter att skapa en säker, respektfull och laglig miljö för alla våra användare.",
    "report.whatToReport": "Vad ska rapporteras?",
    "report.howToSubmit": "Hur skickar jag in en rapport eller ett klagomål",
    "report.inPlatform": "Rapportering via plattformen:",
    "report.contactSupport": "Kontakta support:",
    "report.afterSubmit": "Vad händer efter att du skickat in ett klagomål?",
    "report.acknowledgement": "Bekräftelse:",
    "report.reviewInvestigation": "Granskning och utredning:",
    "report.actionsTaken": "Åtgärder som vidtas:",
    "report.timeline": "Tidsram för beslut:",
    "report.important": "Viktiga överväganden",
    "report.falseReporting": "Falsk rapportering:",
    "report.objectivity": "Objektivitet:",
    "report.improvement": "Kontinuerlig förbättring:",
    "report.needToReport": "Behöver du rapportera något?",
    "report.sendReport": "Skicka rapport till support@dintype.se",
    // Roadmap page
    "roadmap.title": "Vår färdplan",
    "roadmap.subtitle": "Följ med på vår resa! Här kan du se vad vi har uppnått, vad vi arbetar med just nu och vad som kommer härnäst.",
    "roadmap.productDev": "Produktutveckling",
    "roadmap.doneLaunched": "Klart & lanserat",
    "roadmap.featuresAvailable": "Funktioner som redan finns",
    "roadmap.inProgress": "Pågår",
    "roadmap.workingOnNow": "Vad vi arbetar med just nu",
    "roadmap.upcoming": "Kommande",
    "roadmap.comingSoon": "Kommer snart",
    // Guide page
    "guide.title": "Plattformsguide",
    "guide.subtitle": "Din kompletta guide till Dintype - från registrering till avancerade funktioner",
    "guide.gettingStarted": "1. Kom igång - Registrering",
    "guide.imageGeneration": "2. Bildgenerering",
    "guide.chatFeature": "3. Chattfunktion",
    "guide.tokensAndPremium": "4. Tokens & Premium",
    "guide.profileSettings": "5. Profil & inställningar",
    "guide.support": "6. Support & hjälp",
    // Unsubscribe page
    "unsubscribe.title": "Avsluta prenumeration",
    "unsubscribe.description": "Du har avprenumererats från vår e-postlista.",
    "unsubscribe.success": "Avprenumereringen lyckades!",
    "unsubscribe.error": "Ett fel uppstod. Vänligen försök igen.",
  },
}