export type TranslationKey =
  | "general.siteName"
  | "general.welcome"
  | "general.effectiveDate"
  | "general.lastUpdated"
  | "general.email"
  | "general.save"
  | "general.cancel"
  | "general.back"
  | "general.next"
  | "general.delete"
  | "general.edit"
  | "general.success"
  | "guide.createAccount"
  | "guide.accountS1"
  | "guide.accountS1Desc"
  | "guide.accountS2"
  | "guide.accountS2Desc"
  | "guide.accountS2Option1"
  | "guide.accountS2Option2"
  | "guide.accountS2Option3"
  | "guide.accountS3"
  | "guide.accountS3Desc"
  | "guide.accountS4"
  | "guide.accountS4Desc"
  | "guide.accountTip"
  | "guide.genIntro"
  | "guide.howToGen"
  | "guide.genS1"
  | "guide.genS1Desc"
  | "guide.genS2"
  | "guide.genS2Desc"
  | "guide.genS2Example"
  | "guide.genS2Prompt"
  | "guide.genS3"
  | "guide.genS3Desc"
  | "guide.genS4"
  | "guide.genS4Desc"
  | "guide.genS4Item1"
  | "guide.genS4Item2"
  | "guide.genS4Item3"
  | "guide.genS4Item4"
  | "guide.genS5"
  | "guide.genS5Desc"
  | "guide.genS6"
  | "guide.genS6Desc"
  | "guide.manageGen"
  | "guide.autoSave"
  | "guide.autoSaveDesc"
  | "guide.imgMgmt"
  | "guide.imgMgmtDesc"
  | "guide.imgMgmtItem1"
  | "guide.imgMgmtItem2"
  | "guide.imgMgmtItem3"
  | "guide.imgMgmtItem4"
  | "guide.imgMgmtItem5"
  | "guide.imgMgmtItem6"
  | "guide.createCharTitle"
  | "guide.charWizard"
  | "guide.charWizardDesc"
  | "guide.charS1"
  | "guide.charS1Desc"
  | "guide.charS1Age"
  | "guide.charS1Body"
  | "guide.charS1Ethnicity"
  | "guide.charS1Lang"
  | "guide.charS1Rel"
  | "guide.charS1Occ"
  | "guide.charS1Hobby"
  | "guide.charS1Pers"
  | "guide.charS1Note"
  | "guide.charS2"
  | "guide.charS2Desc"
  | "guide.charS3"
  | "guide.charS3Desc"
  | "guide.charS4"
  | "guide.charS4Desc"
  | "guide.charS5"
  | "guide.charS5Desc"
  | "guide.charS6"
  | "guide.charS6Desc"
  | "guide.charS6Note"
  | "guide.charWizardTip"
  | "guide.exploreChar"
  | "guide.exploreCharDesc"
  | "guide.startConv"
  | "guide.convS1"
  | "guide.convS1Desc"
  | "guide.convS2"
  | "guide.convS2Desc"
  | "guide.convS3"
  | "guide.convS3Desc"
  | "guide.chatFeaturesTitle"
  | "guide.chatAutoSave"
  | "guide.chatAutoSaveDesc"
  | "guide.chatClear"
  | "guide.chatClearDesc"
  | "guide.chatSidebar"
  | "guide.chatSidebarDesc"
  | "guide.chatImgReq"
  | "guide.chatImgReqDesc"
  | "guide.chatVoice"
  | "guide.chatVoiceDesc"
  | "guide.chatTipsTitle"
  | "guide.chatCtx"
  | "guide.chatCtxDesc"
  | "guide.chatAdapt"
  | "guide.chatAdaptDesc"
  | "guide.chatClearNeed"
  | "guide.chatClearNeedDesc"
  | "guide.chatRules"
  | "guide.chatRulesDesc"
  | "guide.tokensTitle"
  | "guide.tokensDesc"
  | "guide.tokenCost1"
  | "guide.tokenCost4"
  | "guide.tokenCost6"
  | "guide.tokenCost8"
  | "guide.buyTokenTitle"
  | "guide.buyTokenDesc"
  | "guide.howToBuy"
  | "guide.buyS1"
  | "guide.buyS2"
  | "guide.buyS3"
  | "guide.buyS4"
  | "guide.buyS5"
  | "guide.buyS6"
  | "guide.premiumTitle"
  | "guide.premiumDesc"
  | "guide.premiumNote"
  | "guide.premiumCTA"
  | "guide.profTitle"
  | "guide.profDesc"
  | "guide.profAvail"
  | "guide.profNick"
  | "guide.profGender"
  | "guide.profEmail"
  | "guide.profPass"
  | "guide.profPlan"
  | "guide.delAcc"
  | "guide.delAccDesc"
  | "guide.delAccWarn"
  | "guide.supportDesc"
  | "guide.supportFaq"
  | "guide.supportFaqDesc"
  | "guide.supportContact"
  | "guide.supportContactDesc"
  | "guide.readyTitle"
  | "guide.readyDesc"
  | "guide.createCharBtn"
  | "guide.genImgBtn"
  | "general.error"
  | "general.close"
  | "general.confirm"
  | "general.home"
  | "general.explore"
  | "general.generate"
  | "general.create"
  | "general.chat"
  | "general.collection"
  | "navigation.home"
  | "chat.welcomeMessage"
  | "chat.welcomeMessageFallback"
  | "chat.photoLove"
  | "chat.photoCaption"
  | "chat.noMessagesYet"
  | "chat.recentConversations"
  | "chat.noConversationsYet"
  | "chat.startChattingMessage"
  | "chat.browseCharacters"
  | "chat.genError"
  | "chat.genTechError"
  | "chat.chapterComplete"
  | "chat.storyComplete"
  | "chat.loginRequired"
  | "chat.upgradeRequired"
  | "chat.aiResponseError"
  | "chat.genericError"
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
  | "auth.confirmEmail"
  | "auth.confirmEmailSent"
  | "auth.checkSpam"
  | "auth.resendLink"
  | "auth.resending"
  | "auth.alreadyHaveAccount"
  | "auth.linkSentSuccess"
  | "auth.linkSentError"
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
  | "admin.integrations"
  | "admin.emailTemplates"
  | "admin.siteIdentity"
  | "admin.siteBranding"
  | "admin.general"
  | "admin.externalIntegrations"
  | "admin.manageIntegrations"
  | "admin.emailTemplatesTitle"
  | "admin.editEmailTemplates"
  | "admin.currencySettings"
  | "admin.currencyCode"
  | "admin.currencySymbol"
  | "admin.exchangeRate"
  | "admin.resetToUsd"
  | "admin.saveCurrency"
  | "admin.systemInfo"
  | "admin.environment"
  | "admin.version"
  | "admin.lastUpdated"
  | "admin.dashboard.overview"
  | "admin.dashboard.siteSettings"
  | "admin.dashboard.pricing"
  | "admin.dashboard.budget"
  | "admin.dashboard.systemStatus"
  | "admin.dashboard.quickActions"
  | "admin.dashboard.recentActivity"
  | "admin.dashboard.manageUsers"
  | "admin.dashboard.manageCharacters"
  | "admin.dashboard.subscriptions"
  | "admin.dashboard.database"
  | "admin.dashboard.portalName"
  | "admin.dashboard.siteUrl"
  | "admin.dashboard.brandingText"
  | "admin.dashboard.commitChanges"
  | "admin.dashboard.headerPreview"
  | "admin.dashboard.revenueStrategy"
  | "admin.dashboard.basePrice"
  | "admin.dashboard.originalPrice"
  | "admin.dashboard.discount"
  | "admin.dashboard.billingMonthly"
  | "admin.dashboard.billingQuarterly"
  | "admin.dashboard.billingYearly"
  | "userNav.profile"
  | "userNav.premium"
  | "userNav.logout"
  | "userNav.createAccount"
  | "admin.dashboard.overviewOnly"
  | "admin.integrations.description"
  | "admin.emailTemplates.description"
  | "db.all"
  | "db.male"
  | "db.female"
  | "db.anime"
  | "db.realistic"
  | "db.getstarted"
  | "db.discoverai"
  | "db.discoveraidesc"
  | "db.createnewai"
  | "db.createnewaidesc"
  | "db.logintocreate"
  | "db.example"
  | "db.loading"
  | "db.guys"
  | "db.girls"
  | "db.createyouraifriend"
  | "db.explore"
  | "db.search"
  | "db.send"
  | "db.lunadesc"
  | "db.lunapersonality"
  | "db.age"
  | "db.gender"
  | "db.occupation"
  | "db.ethnicity"
  | "db.relationship"
  | "db.bodytype"
  | "db.personality"
  | "db.hobbies"
  | "db.location"
  | "db.language"
  | "db.chatanytime"
  | "db.youraigirlfriend"
  | "db.single"
  | "db.married"
  | "db.dating"
  | "db.complicated"
  | "db.athletic"
  | "db.curvy"
  | "db.slim"
  | "db.average"
  | "db.muscular"
  | "db.student"
  | "db.teacher"
  | "db.nurse"
  | "db.engineer"
  | "db.white"
  | "db.black"
  | "db.asian"
  | "db.latina"
  | "db.middleeastern"
  | "db.universitystudent"
  | "status.success"
  | "status.error"
  | "status.loading"
  | "status.wait"
  | "status.deleted"
  | "status.copied"
  | "status.cleared"
  | "status.saved"
  | "status.failed"
  | "chat.meetOnTelegram"
  | "chat.chatOnWeb"
  | "chat.syncMessage"
  | "chat.replyingTo"
  | "chat.teasingImages"
  | "chat.watchVideo"
  | "chat.openingTelegram"
  | "chat.report"
  | "chat.star"
  | "chat.pin"
  | "chat.forward"
  | "chat.react"
  | "chat.copy"
  | "chat.reply"
  | "chat.delete"
  | "chat.addTextToNote"
  | "chat.options"
  | "chat.connectTelegram"
  | "chat.characterSettings"
  | "chat.shareCharacter"
  | "chat.typing"
  | "chat.sendingPhoto"
  | "chat.replyingToMsg"
  | "chat.welcomeGreeting"
  | "chat.welcomeAction"
  | "chat.openingTelegramConnect"
  | "chat.openingTelegramGuest"
  | "chat.couldNotGenerateLink"
  | "chat.chapterLabel"
  | "chat.chatOptions"
  | "chat.clearChatHistory"
  | "chat.showProfileDetails"
  | "chat.hideProfileDetails"
  | "chat.loadingHistory"
  | "chat.loadEarlier"
  | "chat.gallery"
  | "chat.imageGenerationLocked"
  | "chat.messageLimitTitle"
  | "chat.messageLimitDesc"
  | "chat.tokenBalance"
  | "chat.tokensSlut"
  | "chat.noTokensLeft"
  | "chat.premiumExpired"
  | "chat.premiumExpiredDesc"
  | "chat.noContent"
  | "chat.completeStorylineForImages"
  | "chat.premiumForImages"
  | "chat.loginToSave"
  | "chat.imageSaved"
  | "chat.videoLoadingError"
  | "chat.noVideoAvailable"
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
  | "generate.negativePromptDesc"
  | "generate.selectedCountLabel"
  | "generate.generatingTitle"
  | "generate.generatingMessage"
  | "generate.suggestionsTitle"
  | "generate.allCategories"
  | "generate.noSuggestions"
  | "generate.alreadySaved"
  | "generate.alreadySavedDescription"
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
  | "chat.inputPlaceholder"
  | "chat.ask"
  | "chat.showMe"
  | "chat.sendMe"
  | "chat.canISee"
  | "chat.howToUse"
  | "chat.viewVideoIntro"
  | "chat.profileNotFound"
  | "chat.backToConversations"
  | "tour.home.title"
  | "tour.home.description"
  | "tour.chat.title"
  | "tour.chat.description"
  | "tour.generate.title"
  | "tour.generate.description"
  | "tour.create.title"
  | "tour.create.description"
  | "tour.premium.title"
  | "tour.premium.description"
  | "tour.stepXofY"
  | "tour.back"
  | "tour.next"
  | "tour.done"
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
  | "profile.rulesTitle"
  | "profile.rulesDesc"
  | "profile.rule1"
  | "profile.rule2"
  | "profile.rule3"
  | "profile.rule4"
  | "profile.rule5"
  | "profile.rule6"
  | "profile.rule7"
  | "profile.rule8"
  | "profile.rule9"
  | "profile.loading"
  | "profile.welcome"
  | "profile.joined"
  | "profile.tokens"
  | "profile.membership"
  | "profile.credits"
  | "profile.manageSubscription"
  | "profile.upgradeNow"
  | "profile.statsOverview"
  | "profile.generations"
  | "profile.statsDesc"
  | "profile.passwordManagement"
  | "profile.passwordSecurityDesc"
  | "profile.currentPasswordPlaceholder"
  | "profile.newPasswordPlaceholder"
  | "profile.confirmPasswordPlaceholder"
  | "profile.updatePassword"
  | "profile.dangerZoneNote"
  | "profile.permanentlyDelete"
  | "profile.deleteDataDesc"
  | "profile.logoutAllDevices"
  | "profile.saved"
  | "profile.savedDesc"
  | "profile.close"
  | "profile.errorTitle"
  | "profile.verificationNote"
  | "profile.autoNotifications"
  | "profile.autoNotificationsDesc"
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
  | "premium.modal.title.expired"
  | "premium.modal.title.tokens"
  | "premium.modal.title.membership"
  | "premium.modal.displayBadge.premium"
  | "premium.modal.displayBadge.expired"
  | "premium.modal.displayBadge.tokens"
  | "premium.modal.displayBadge.limitReached"
  | "premium.modal.displayButton.upgrade"
  | "premium.modal.displayButton.buyTokens"
  | "premium.modal.displayDescription.expired"
  | "premium.modal.displayDescription.tokensDepleted"
  | "premium.modal.displayDescription.messageLimit"
  | "premium.modal.displayDescription.default"
  | "premium.modal.benefit.createAI"
  | "premium.modal.benefit.highQualityImages"
  | "premium.modal.benefit.exclusiveVoice"
  | "premium.modal.benefit.chatFree"
  | "premium.modal.benefit.easyTopUp"
  | "premium.modal.benefit.createVideos"
  | "premium.modal.benefit.createOwnAI"
  | "premium.modal.benefit.unlimitedMessaging"
  | "premium.modal.benefit.removeBlur"
  | "premium.modal.benefit.freeTokens"
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
  | "general.errorTryAgain"
  | "premium.pleaseLogin"
  | "premium.tokensRemaining"
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
  | "faq.optionalNote"
  | "faq.questionPlaceholderSv"
  | "faq.answerPlaceholderSv"
  | "faq.a.isFree"
  | "faq.q.whatIsPremium"
  | "faq.a.whatIsPremium"
  | "faq.q.createAccount"
  | "faq.a.createAccount"
  | "faq.a.createAccountSocial"
  | "faq.a.createAccountEmail"
  | "faq.section.aiChars"
  | "disclaimer.ageTitle"
  | "disclaimer.ageDesc"
  | "disclaimer.cookieTitle"
  | "disclaimer.cookieDesc"
  | "disclaimer.cookieSettings"
  | "disclaimer.confirmAll"
  | "disclaimer.reject"
  | "disclaimer.termsLink"
  | "disclaimer.privacyLink"
  | "disclaimer.ageCheckbox"
  | "disclaimer.termsCheckbox"
  | "disclaimer.needConfirm"
  | "disclaimer.rulesTitle"
  | "disclaimer.back"
  | "disclaimer.necessary"
  | "disclaimer.necessaryDesc"
  | "disclaimer.active"
  | "disclaimer.analytics"
  | "disclaimer.analyticsDesc"
  | "disclaimer.marketing"
  | "disclaimer.marketingDesc"
  | "disclaimer.savePreferences"
  | "disclaimer.acceptAll"
  | "disclaimer.on"
  | "disclaimer.off"
  | "disclaimer.rule1"
  | "disclaimer.rule2"
  | "disclaimer.rule3"
  | "disclaimer.rule4"
  | "disclaimer.rule5"
  | "disclaimer.rule6"
  | "disclaimer.rule7"
  | "disclaimer.rule8"
  | "disclaimer.rule9"
  | "disclaimer.rule10"
  | "disclaimer.rule11"
  | "disclaimer.rule12"
  | "disclaimer.rule13"
  | "disclaimer.rule14"
  | "disclaimer.rule15"
  | "disclaimer.rule16"
  | "disclaimer.rule17"
  | "disclaimer.rule18"
  | "disclaimer.rule19"
  | "disclaimer.rule20"
  | "disclaimer.rule21"
  | "disclaimer.rule22"
  | "disclaimer.rule23"
  | "disclaimer.rule24"
  | "disclaimer.rule25"
  | "disclaimer.rule26"
  | "disclaimer.rule27"
  | "disclaimer.rule28"
  | "disclaimer.rule29"
  | "disclaimer.rule30"
  | "disclaimer.rule31"
  | "disclaimer.rule32"
  | "disclaimer.rule33"
  | "disclaimer.rule34"
  | "disclaimer.rule35"
  | "disclaimer.rule36"
  | "disclaimer.rule37"
  | "disclaimer.rule38"
  | "disclaimer.rule39"
  | "disclaimer.rule40"
  | "disclaimer.rule41"
  | "disclaimer.rule42"
  | "disclaimer.rule43"
  | "disclaimer.rule44"
  | "disclaimer.rule45"
  | "disclaimer.rule46"
  | "disclaimer.rule47"
  | "disclaimer.rule48"
  | "disclaimer.rule49"
  | "disclaimer.rule50"
  | "disclaimer.rule51"
  | "disclaimer.rule52"
  | "disclaimer.rule53"
  | "disclaimer.rule54"
  | "disclaimer.rule55"
  | "disclaimer.rule56"
  | "disclaimer.rule57"
  | "disclaimer.rule58"
  | "disclaimer.rule59"
  | "disclaimer.rule60"
  | "disclaimer.rule61"
  | "disclaimer.rule62"
  | "disclaimer.rule63"
  | "disclaimer.rule64"
  | "disclaimer.rule65"
  | "disclaimer.rule66"
  | "disclaimer.rule67"
  | "disclaimer.rule68"
  | "disclaimer.rule69"
  | "disclaimer.rule70"
  | "disclaimer.rule71"
  | "disclaimer.rule72"
  | "disclaimer.rule73"
  | "disclaimer.rule74"
  | "disclaimer.rule75"
  | "disclaimer.rule76"
  | "disclaimer.rule77"
  | "disclaimer.rule78"
  | "faq.q.customize"
  | "faq.a.customize"
  | "faq.q.askPhotos"
  | "faq.a.askPhotos"
  | "welcome.home.title"
  | "welcome.home.subtitle"
  | "welcome.home.feature1"
  | "welcome.home.feature2"
  | "welcome.home.feature3"
  | "welcome.home.feature4"
  | "welcome.home.cta"
  | "welcome.home.footer"
  | "welcome.chat.title"
  | "welcome.chat.subtitle"
  | "welcome.chat.feature1"
  | "welcome.chat.feature2"
  | "welcome.chat.feature3"
  | "welcome.chat.feature4"
  | "welcome.chat.cta"
  | "welcome.chat.footer"
  | "welcome.generate.title"
  | "welcome.generate.subtitle"
  | "welcome.generate.feature1"
  | "welcome.generate.feature2"
  | "welcome.generate.feature3"
  | "welcome.generate.feature4"
  | "welcome.generate.cta"
  | "welcome.generate.footer"
  | "faq.q.realtimeImages"
  | "faq.a.realtimeImages"
  | "admin.branding.title"
  | "admin.branding.subtitle"
  | "admin.branding.reset"
  | "admin.branding.preview"
  | "admin.branding.save"
  | "admin.branding.saving"
  | "admin.branding.saved"
  | "admin.branding.previewApplied"
  | "admin.branding.saveSuccess"
  | "admin.branding.saveError"
  | "admin.branding.resetInfo"
  | "admin.branding.identity"
  | "admin.branding.logo"
  | "admin.branding.colors"
  | "admin.branding.gradient"
  | "admin.branding.typography"
  | "admin.branding.siteIdentity"
  | "admin.branding.siteIdentityDesc"
  | "admin.branding.siteName"
  | "admin.branding.logoText"
  | "admin.branding.tagline"
  | "admin.branding.domainExtension"
  | "admin.branding.fontFamily"
  | "admin.branding.borderRadius"
  | "admin.branding.roundness"
  | "admin.branding.logoFavicon"
  | "admin.branding.logoFaviconDesc"
  | "admin.branding.logoUrl"
  | "admin.branding.logoPreview"
  | "admin.branding.faviconUrl"
  | "admin.branding.faviconPreview"
  | "admin.branding.logoTextPreview"
  | "admin.branding.colorPalette"
  | "admin.branding.colorPaletteDesc"
  | "admin.branding.brandGradient"
  | "admin.branding.brandGradientDesc"
  | "admin.branding.direction"
  | "admin.branding.from"
  | "admin.branding.via"
  | "admin.branding.to"
  | "admin.branding.typographyDesc"
  | "admin.branding.fontStackNote"
  | "admin.branding.fontPresets"
  | "admin.branding.livePreview"
  | "admin.branding.activePalette"
  | "admin.branding.applyLive"
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
  | "howItWorks.step1List1"
  | "howItWorks.step1List2"
  | "howItWorks.step1List3"
  | "howItWorks.step1Button"
  | "howItWorks.step2List1"
  | "howItWorks.step2List2"
  | "howItWorks.step2List3"
  | "howItWorks.step2Button"
  | "howItWorks.step3List1"
  | "howItWorks.step3List2"
  | "howItWorks.step3List3"
  | "howItWorks.step3Button"
  | "howItWorks.featuresTitle"
  | "howItWorks.feature1Title"
  | "howItWorks.feature1Desc"
  | "howItWorks.feature2Title"
  | "howItWorks.feature2Desc"
  | "howItWorks.feature3Title"
  | "howItWorks.feature3Desc"
  | "howItWorks.fullGuideButton"
  | "howItWorks.questions"
  | "howItWorks.or"
  | "howItWorks.visitFaq"
  | "howItWorks.contactSupport"
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
  | "terms.acceptanceDesc"
  | "terms.eligibility"
  | "terms.eligibilityDesc"
  | "terms.eligibilityItem1"
  | "terms.eligibilityItem2"
  | "terms.eligibilityItem3"
  | "terms.eligibilityItem4"
  | "terms.useOfService"
  | "terms.useOfServiceDesc"
  | "terms.prohibitedTitle"
  | "terms.prohibited1"
  | "terms.prohibited2"
  | "terms.prohibited3"
  | "terms.prohibited4"
  | "terms.prohibited5"
  | "terms.contentAndAI"
  | "terms.contentAndAIDesc"
  | "terms.aiNatureTitle"
  | "terms.aiNatureDesc"
  | "terms.userContentTitle"
  | "terms.userContentDesc"
  | "terms.moderationTitle"
  | "terms.moderationDesc"
  | "terms.premiumAndPayments"
  | "terms.premiumAndPaymentsDesc"
  | "terms.feesTitle"
  | "terms.feesDesc"
  | "terms.billingTitle"
  | "terms.billingDesc"
  | "terms.refundsTitle"
  | "terms.refundsDesc"
  | "terms.cancellationTitle"
  | "terms.cancellationDesc"
  | "terms.intellectualProperty"
  | "terms.intellectualPropertyDesc"
  | "terms.privacyAndData"
  | "terms.privacyAndDataDesc"
  | "terms.limitation"
  | "terms.limitationDesc"
  | "terms.changesToTerms"
  | "terms.changesToTermsDesc"
  | "terms.contactUs"
  | "terms.contactUsLink"
  | "cookies.effectiveDate"
  | "cookies.lastUpdated"
  | "cookies.browserControl"
  | "contact.howCanWeHelp"
  | "contact.howCanWeHelpDesc"
  | "contact.accountHelpItem1"
  | "contact.accountHelpItem2"
  | "contact.accountHelpItem3"
  | "contact.accountHelpItem4"
  | "contact.techHelpItem1"
  | "contact.techHelpItem2"
  | "contact.techHelpItem3"
  | "contact.techHelpItem4"
  | "contact.billingHelpItem1"
  | "contact.billingHelpItem2"
  | "contact.billingHelpItem3"
  | "contact.billingHelpItem4"
  | "contact.billingHelpItem5"
  | "contact.safetyHelpItem1"
  | "contact.safetyHelpItem2"
  | "contact.safetyHelpItem3"
  | "contact.safetyHelpItem4"
  | "contact.generalHelpItem1"
  | "contact.generalHelpItem2"
  | "contact.generalHelpItem3"
  | "contact.howToContact"
  | "contact.howToContactDesc"
  | "contact.liveChat"
  | "contact.liveChatDesc"
  | "contact.responseTime"
  | "contact.expectedQuick"
  | "contact.expectedQuickDesc"
  | "contact.expectedEfficient"
  | "contact.expectedEfficientDesc"
  | "contact.expectedProfessional"
  | "contact.expectedProfessionalDesc"
  | "contact.expectedConfidential"
  | "contact.expectedConfidentialDesc"
  | "contact.expectedImpartial"
  | "contact.expectedImpartialDesc"
  | "contact.valueFeedback"
  | "contact.valueFeedbackDesc"
  | "roadmap.productDev"
  | "roadmap.description"
  | "roadmap.doneLaunched"
  | "roadmap.featuresAvailable"
  | "roadmap.workingOnNow"
  | "roadmap.comingSoon"
  | "roadmap.feature1Title"
  | "roadmap.feature1Desc"
  | "roadmap.feature1Date"
  | "roadmap.feature2Title"
  | "roadmap.feature2Desc"
  | "roadmap.feature2Date"
  | "roadmap.feature3Title"
  | "roadmap.feature3Desc"
  | "roadmap.feature3Date"
  | "roadmap.feature4Title"
  | "roadmap.feature4Desc"
  | "roadmap.feature4Date"
  | "roadmap.feature5Title"
  | "roadmap.feature5Desc"
  | "roadmap.feature5Date"
  | "roadmap.feature6Title"
  | "roadmap.feature6Desc"
  | "roadmap.feature6Date"
  | "roadmap.inProgress1Title"
  | "roadmap.inProgress1Desc"
  | "roadmap.inProgress1Date"
  | "roadmap.inProgress2Title"
  | "roadmap.inProgress2Desc"
  | "roadmap.inProgress2Date"
  | "roadmap.inProgress3Title"
  | "roadmap.inProgress3Desc"
  | "roadmap.inProgress3Date"
  | "roadmap.inProgress4Title"
  | "roadmap.inProgress4Desc"
  | "roadmap.inProgress4Date"
  | "roadmap.upcoming1Title"
  | "roadmap.upcoming1Desc"
  | "roadmap.upcoming1Date"
  | "roadmap.upcoming2Title"
  | "roadmap.upcoming2Desc"
  | "roadmap.upcoming2Date"
  | "roadmap.upcoming3Title"
  | "roadmap.upcoming3Desc"
  | "roadmap.upcoming3Date"
  | "roadmap.upcoming4Title"
  | "roadmap.upcoming4Desc"
  | "roadmap.upcoming4Date"
  | "roadmap.upcoming5Title"
  | "roadmap.upcoming5Desc"
  | "roadmap.upcoming5Date"
  | "roadmap.upcoming6Title"
  | "roadmap.upcoming6Desc"
  | "roadmap.upcoming6Date"
  | "roadmap.feedbackTitle"
  | "roadmap.feedbackDesc"
  | "roadmap.noteTitle"
  | "roadmap.noteDesc"
  | "terms.contactUsDesc"
  | "terms.supportTitle"
  // Privacy page
  | "privacy.title"
  | "privacy.intro"
  | "privacy.contactUsSection"
  | "privacy.whoWeAre"
  | "privacy.whoWeAreDesc"
  | "privacy.whatIsPersonalData"
  | "privacy.whatIsPersonalDataDesc"
  | "privacy.identifiableData"
  | "privacy.pseudonymizedData"
  | "privacy.anonymousData"
  | "privacy.whatWeCollect"
  | "privacy.whatWeCollectDesc"
  | "privacy.visitorsTitle"
  | "privacy.visitorItem1"
  | "privacy.visitorItem2"
  | "privacy.visitorItem3"
  | "privacy.visitorItem4"
  | "privacy.registeredTitle"
  | "privacy.registeredItem1"
  | "privacy.registeredItem2"
  | "privacy.registeredItem3"
  | "privacy.registeredItem4"
  | "privacy.registeredItem5"
  | "privacy.registeredItem6"
  | "privacy.registeredItem7"
  | "privacy.specialTitle"
  | "privacy.specialDesc"
  | "privacy.howWeCollect"
  | "privacy.howWeCollectDesc"
  | "privacy.howItem1"
  | "privacy.howItem2"
  | "privacy.howItem3"
  | "privacy.whyWeProcess"
  | "privacy.tablePurpose"
  | "privacy.tableLegalBasis"
  | "privacy.purpose1"
  | "privacy.purpose2"
  | "privacy.purpose3"
  | "privacy.purpose4"
  | "privacy.purpose5"
  | "privacy.purpose6"
  | "privacy.purpose7"
  | "privacy.legalBasis1"
  | "privacy.legalBasis2"
  | "privacy.legalBasis3"
  | "privacy.legalBasis4"
  | "privacy.legalBasis5"
  | "privacy.legalBasis6"
  | "privacy.legalBasis7"
  | "privacy.dataSharing"
  | "privacy.dataSharingDesc"
  | "privacy.sharingItem1"
  | "privacy.sharingItem2"
  | "privacy.sharingItem3"
  | "privacy.sharingItem4"
  | "privacy.sharingNote"
  | "privacy.internationalTransfers"
  | "privacy.internationalTransfersDesc"
  | "privacy.dataSecurity"
  | "privacy.dataSecurityDesc"
  | "privacy.childrenPrivacy"
  | "privacy.childrenPrivacyDesc"
  | "privacy.dataRetention"
  | "privacy.dataRetentionDesc"
  | "privacy.yourRights"
  | "privacy.yourRightsDesc"
  | "privacy.rights1"
  | "privacy.rights2"
  | "privacy.rights3"
  | "privacy.rights4"
  | "privacy.rights5"
  | "privacy.rights6"
  | "privacy.rights7"
  | "privacy.rightsNote"
  | "privacy.contactUs"
  | "privacy.contactUsDesc"
  // Guidelines page
  | "guidelines.title"
  | "guidelines.intro"
  | "guidelines.ageRequirements"
  | "guidelines.ageItem1"
  | "guidelines.ageItem2"
  | "guidelines.illegalActivities"
  | "guidelines.illegalDesc"
  | "guidelines.illegalItem1"
  | "guidelines.illegalItem2"
  | "guidelines.illegalItem3"
  | "guidelines.illegalItem4"
  | "guidelines.illegalItem5"
  | "guidelines.illegalItem6"
  | "guidelines.illegalItem7"
  | "guidelines.illegalItem8"
  | "guidelines.illegalItem9"
  | "guidelines.illegalItem10"
  | "guidelines.childProtection"
  | "guidelines.zeroTolerance"
  | "guidelines.zeroToleranceDesc"
  | "guidelines.prohibitedTitle"
  | "guidelines.childItem1"
  | "guidelines.childItem2"
  | "guidelines.childItem3"
  | "guidelines.sexualContent"
  | "guidelines.sexualDesc"
  | "guidelines.sexualItem1"
  | "guidelines.sexualItem2"
  | "guidelines.fetishTitle"
  | "guidelines.fetishItem1"
  | "guidelines.fetishItem2"
  | "guidelines.fetishItem3"
  | "guidelines.fetishItem4"
  | "guidelines.fetishItem5"
  | "guidelines.fetishItem6"
  | "guidelines.fetishItem7"
  | "guidelines.violence"
  | "guidelines.violenceDesc"
  | "guidelines.violenceItem1"
  | "guidelines.violenceItem2"
  | "guidelines.violenceItem3"
  | "guidelines.violenceItem4"
  | "guidelines.violenceItem5"
  | "guidelines.hateSpeech"
  | "guidelines.hateSpeechDesc"
  | "guidelines.hateItem1"
  | "guidelines.hateItem2"
  | "guidelines.hateItem3"
  | "guidelines.hateItem4"
  | "guidelines.hateItem5"
  | "guidelines.hateItem6"
  | "guidelines.hateItem7"
  | "guidelines.hateNote"
  | "guidelines.privacyFraud"
  | "guidelines.privacyDesc"
  | "guidelines.privacyItem1"
  | "guidelines.privacyItem2"
  | "guidelines.privacyItem3"
  | "guidelines.privacyItem4"
  | "guidelines.privacyItem5"
  | "guidelines.misinformation"
  | "guidelines.misinformationDesc"
  | "guidelines.misinfoItem1"
  | "guidelines.misinfoItem2"
  | "guidelines.spam"
  | "guidelines.spamDesc"
  | "guidelines.spamItem1"
  | "guidelines.spamItem2"
  | "guidelines.restrictedGoods"
  | "guidelines.restrictedGoodsDesc"
  | "guidelines.reportViolations"
  | "guidelines.reportDesc"
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
  | "report.whatToReportList"
  | "report.catIllegal"
  | "report.catIllegalDesc"
  | "report.catTerms"
  | "report.catTermsDesc"
  | "report.catGuidelines"
  | "report.catGuidelinesDesc"
  | "report.catItem1"
  | "report.catItem2"
  | "report.catItem3"
  | "report.catItem4"
  | "report.catItem5"
  | "report.catItem6"
  | "report.catItem7"
  | "report.catItem8"
  | "report.howToSubmitDesc"
  | "report.inPlatformDesc"
  | "report.contactSupportDesc"
  | "report.infoName"
  | "report.infoNameDesc"
  | "report.infoDescription"
  | "report.infoDescriptionDesc"
  | "report.infoDate"
  | "report.infoDateDesc"
  | "report.infoDocs"
  | "report.infoDocsDesc"
  | "report.infoCategory"
  | "report.infoCategoryDesc"
  | "report.afterSubmitDesc"
  | "report.acknowledgementDesc"
  | "report.reviewInvestigationDesc"
  | "report.actionsTakenDesc"
  | "report.action1"
  | "report.action1Desc"
  | "report.action2"
  | "report.action2Desc"
  | "report.action3"
  | "report.action3Desc"
  | "report.action4"
  | "report.action4Desc"
  | "report.timelineDesc"
  | "report.falseReportingDesc"
  | "report.objectivityDesc"
  | "report.improvementDesc"
  | "report.closing"
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
    "chat.welcomeMessage": "Hey there, my love... 💕 I'm {name}. I've been waiting for someone like you.\n\nSo tell me... what brings you here tonight? You can message me right here, or find me on Telegram @dintypebot for something more... private. 🌹",
    "chat.welcomeMessageFallback": "Hey there, my love... 💕 I'm {name}. I've been waiting for someone like you. Tell me... what brings you here tonight? 🌹",
    "chat.photoLove": "I love this photo of you! 😍",
    "chat.photoCaption": "Here's a little something for you... 😘",
    "chat.noMessagesYet": "No messages yet",
    "chat.recentConversations": "Recent Conversations",
    "chat.noConversationsYet": "No conversations yet",
    "chat.startChattingMessage": "Start chatting with a character to see your conversation history here.",
    "chat.browseCharacters": "Browse Characters",
    "chat.genError": "Sorry, I couldn't generate that image. Let's try something else.",
    "chat.genTechError": "Sorry, I couldn't generate that image. There was a technical issue with the image processing.",
    "chat.loginRequired": "Please login to continue chatting.",
    "chat.upgradeRequired": "Upgrade to premium to continue.",
    "chat.aiResponseError": "Failed to get AI response",
    "chat.genericError": "An error occurred.",
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
    "general.effectiveDate": "Effective Date",
    "general.lastUpdated": "Last Updated",
    "general.email": "Email",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.back": "Back",
    "general.next": "Next",
    "general.delete": "Delete",
    "general.edit": "Edit",
    "general.close": "Close",
    "general.confirm": "Confirm",
    "general.loading": "Loading...",
    "general.errorTryAgain": "Could not complete purchase. Please try again.",
    "general.error": "An error occurred",
    "general.success": "Success",
    "cookies.effectiveDate": "Effective Date",
    "cookies.lastUpdated": "Last Updated",
    "cookies.browserControl": "Browser-specific Cookie Control:",
    "contact.howCanWeHelp": "How can we help you today?",
    "contact.howCanWeHelpDesc": "Our knowledgeable support team can assist you with a wide variety of topics, including:",
    "contact.accountHelpItem1": "Troubleshooting login issues (e.g., password reset, account recovery)",
    "contact.accountHelpItem2": "Guidance on managing your profile settings and customizing your account",
    "contact.accountHelpItem3": "Assistance with account verification processes",
    "contact.accountHelpItem4": "Help with updating your account information",
    "contact.techHelpItem1": "Resolving technical issues, bugs, or performance problems on our website, in our app(s), or in our services",
    "contact.techHelpItem2": "Providing guidance on browser and app compatibility",
    "contact.techHelpItem3": "Assisting with troubleshooting error messages",
    "contact.techHelpItem4": "Offering solutions for connectivity problems",
    "contact.billingHelpItem1": "Clarifying transaction details and billing cycles",
    "contact.billingHelpItem2": "Providing information about our subscription plans and pricing",
    "contact.billingHelpItem3": "Answering questions related to payment methods and processing",
    "contact.billingHelpItem4": "Handling inquiries regarding potential refunds",
    "contact.billingHelpItem5": "Helping to manage or cancel your subscriptions",
    "contact.safetyHelpItem1": "Providing clarifications on our Terms of Use and Community Guidelines",
    "contact.safetyHelpItem2": "Handling reports and complaints about user-generated content or behavior (see our Complaints and Reports Policy)",
    "contact.safetyHelpItem3": "Answering questions about content moderation processes",
    "contact.safetyHelpItem4": "Guiding you on how to report violations",
    "contact.generalHelpItem1": "Providing information on how to use specific features of Dintype (e.g., AI character creation, image generation, chat features)",
    "contact.generalHelpItem2": "Offering tips and tricks to improve your experience",
    "contact.generalHelpItem3": "Answering questions about feature limitations or updates",
    "contact.howToContact": "How to Contact Us",
    "contact.howToContactDesc": "We offer several convenient ways to reach our support team:",
    "contact.liveChat": "Live Chat",
    "contact.liveChatDesc": "For quick questions and real-time help, our Live Chat feature is often available on our website and in our app(s). Look for the chat icon in the bottom right corner of the screen.",
    "contact.responseTime": "We strive to respond to all email inquiries within 24 hours.",
    "contact.expectedQuick": "Quick acknowledgement",
    "contact.expectedQuickDesc": "We aim to acknowledge all inquiries within 24 hours of receipt.",
    "contact.expectedEfficient": "Efficient and effective assistance",
    "contact.expectedEfficientDesc": "Our team is dedicated to providing you with accurate and helpful solutions as quickly as possible.",
    "contact.expectedProfessional": "Professional and respectful communication",
    "contact.expectedProfessionalDesc": "You can expect to be treated with courtesy and respect by our support agents.",
    "contact.expectedConfidential": "Confidentiality",
    "contact.expectedConfidentialDesc": "We handle your personal information and support inquiries with the utmost confidentiality, in accordance with our Privacy Policy.",
    "contact.expectedImpartial": "Impartiality",
    "contact.expectedImpartialDesc": "We strive to handle all matters fairly and impartially, in accordance with our policies and guidelines.",
    "contact.valueFeedback": "We value your feedback",
    "contact.valueFeedbackDesc": "Your feedback is essential in helping us improve our services and support. After interacting with our support team, you may receive a survey or be invited to share your experience. We encourage you to provide your honest feedback so we can continue to enhance our support services.",
    "roadmap.productDev": "Product Development",
    "roadmap.description": "Our product roadmap shows what we have accomplished and what we are planning for the future.",
    "roadmap.doneLaunched": "Done & Launched",
    "roadmap.featuresAvailable": "Features that are already available on the platform",
    "roadmap.workingOnNow": "What our team is working on right now",
    "roadmap.comingSoon": "Exciting features planned for the future",
    "roadmap.feature1Title": "AI Character Creation",
    "roadmap.feature1Desc": "Full 6-step wizard to create custom AI characters with personality, appearance, and traits.",
    "roadmap.feature1Date": "Launched Q4 2024",
    "roadmap.feature2Title": "AI Image Generation",
    "roadmap.feature2Desc": "Powerful image generator supporting 1-8 images simultaneously, negative prompts, and automatic saving to gallery.",
    "roadmap.feature2Date": "Launched Q4 2024",
    "roadmap.feature3Title": "Intelligent Chat Feature",
    "roadmap.feature3Desc": "Real-time AI conversations with context awareness, personality adaptation, and chat history.",
    "roadmap.feature3Date": "Launched Q4 2024",
    "roadmap.feature4Title": "Premium System",
    "roadmap.feature4Desc": "Token-based system with premium memberships, Stripe payments, and automatic invoice management.",
    "roadmap.feature4Date": "Launched Q4 2024",
    "roadmap.feature5Title": "Collections & Gallery",
    "roadmap.feature5Desc": "Organize and manage generated images with collections, favorites, and download feature.",
    "roadmap.feature5Date": "Launched Q4 2024",
    "roadmap.feature6Title": "OAuth Login",
    "roadmap.feature6Desc": "Easy login with Google, Discord, and Twitter/X in addition to traditional email/password.",
    "roadmap.feature6Date": "Launched Q1 2025",
    "roadmap.inProgress1Title": "Voice Generation (TTS)",
    "roadmap.inProgress1Desc": "Text-to-speech for characters so they can \"speak\" their messages with unique voices.",
    "roadmap.inProgress1Date": "Expected Q1 2025",
    "roadmap.inProgress2Title": "Improved Admin Dashboard",
    "roadmap.inProgress2Desc": "Extended administrator panel with user management, ban feature, cost logging, and detailed statistics.",
    "roadmap.inProgress2Date": "Expected Q1 2025",
    "roadmap.inProgress3Title": "Mobile App (PWA)",
    "roadmap.inProgress3Desc": "Progressive Web App for a better mobile experience with offline support and push notifications.",
    "roadmap.inProgress3Date": "Expected Q2 2025",
    "roadmap.inProgress4Title": "Community Features",
    "roadmap.inProgress4Desc": "Share characters, follow other users, comment, and like creations in the community feed.",
    "roadmap.inProgress4Date": "Expected Q2 2025",
    "roadmap.upcoming1Title": "Video Calls with AI",
    "roadmap.upcoming1Desc": "Live video calls where the character's face is animated based on the conversation with lipsync and emotions.",
    "roadmap.upcoming1Date": "Planned Q3 2025",
    "roadmap.upcoming2Title": "Voice Cloning",
    "roadmap.upcoming2Desc": "Upload voice samples to give your character a completely unique and natural voice based on real recordings.",
    "roadmap.upcoming2Date": "Planned Q3 2025",
    "roadmap.upcoming3Title": "Multi-language Support",
    "roadmap.upcoming3Desc": "Expanded support for more languages beyond Swedish and English, including automatic real-time translation.",
    "roadmap.upcoming3Date": "Planned Q3 2025",
    "roadmap.upcoming4Title": "AI Model Selection",
    "roadmap.upcoming4Desc": "Choose between different AI models (GPT-4, Claude, Gemini) for varying personality types and response styles.",
    "roadmap.upcoming4Date": "Planned Q4 2025",
    "roadmap.upcoming5Title": "Character Marketplace",
    "roadmap.upcoming5Desc": "Buy and sell characters, image packs, and prompt templates from other creators in the community.",
    "roadmap.upcoming5Date": "Planned Q4 2025",
    "roadmap.upcoming6Title": "Developer API",
    "roadmap.upcoming6Desc": "Open API to integrate Dintype.se's features into your own applications and services.",
    "roadmap.upcoming6Date": "Planned 2026",
    "roadmap.feedbackTitle": "Your feedback is important!",
    "roadmap.feedbackDesc": "Want to see a specific feature? Have ideas on how we can improve the platform? We listen to our users, and your feedback shapes our roadmap.",
    "roadmap.noteTitle": "NOTE:",
    "roadmap.noteDesc": "All dates are estimates and subject to change based on development priorities and user feedback. We always strive for the highest quality in every release.",
    "guide.createAccount": "Create Your Account",
    "guide.accountS1": "Step 1: Open the login box",
    "guide.accountS1Desc": "Click the \"Login\" button in the top right corner of the page.",
    "guide.accountS2": "Step 2: Choose registration method",
    "guide.accountS2Desc": "You have three options:",
    "guide.accountS2Option1": "Email and Password: Fill in your email address and choose a secure password",
    "guide.accountS2Option2": "Google: Log in with your Google account",
    "guide.accountS2Option3": "Discord: Log in with your Discord account",
    "guide.accountS3": "Step 3: Click \"Create account\"",
    "guide.accountS3Desc": "If you see the login box, click the \"Create account\" link at the bottom to switch to the registration form.",
    "guide.accountS4": "Step 4: Done!",
    "guide.accountS4Desc": "You are now logged in and can start exploring the platform.",
    "guide.accountTip": "If you've forgotten your password, you can click the \"Forgot password?\" link in the login box to reset it.",
    "guide.genIntro": "Create unique AI-generated images with our advanced image generator.",
    "guide.howToGen": "How to Generate Images:",
    "guide.genS1": "Navigate to Create Image",
    "guide.genS1Desc": "Find \"Create Image\" in the menu or sidebar.",
    "guide.genS2": "Write your prompt",
    "guide.genS2Desc": "Describe in detail what you want to see in the image. The more specific the description, the better the result.",
    "guide.genS2Example": "Example of a good prompt:",
    "guide.genS2Prompt": "A young woman with long brown hair, blue eyes, friendly smile, sunset in background, photo-realistic style",
    "guide.genS3": "Add negative prompt (optional)",
    "guide.genS3Desc": "Click on \"Show negative prompt\" to specify what you DO NOT want in the image. Example: \"blurry, poor quality, distorted\"",
    "guide.genS4": "Select number of images",
    "guide.genS4Desc": "Choose how many images you want to generate simultaneously:",
    "guide.genS4Item1": "1 image: 5 tokens",
    "guide.genS4Item2": "4 images: 20 tokens",
    "guide.genS4Item3": "6 images: 30 tokens",
    "guide.genS4Item4": "8 images: 40 tokens",
    "guide.genS5": "Use suggestions (optional)",
    "guide.genS5Desc": "Above the prompt field, there are categories with suggestions. Click a category and then a suggestion to quickly fill in a prompt.",
    "guide.genS6": "Click \"Generate\"",
    "guide.genS6Desc": "Your images are generated in seconds. You can see the progress indicator while the images are being created.",
    "guide.manageGen": "Manage Generated Images",
    "guide.autoSave": "Automatic saving in Gallery",
    "guide.autoSaveDesc": "All generated images are automatically saved in your Gallery (Collection). You don't have to do anything - they are there immediately after generation.",
    "guide.imgMgmt": "Image Management",
    "guide.imgMgmtDesc": "In the gallery, you can:",
    "guide.imgMgmtItem1": "Mark images as favorites with the heart icon",
    "guide.imgMgmtItem2": "Download images to your device",
    "guide.imgMgmtItem3": "Delete images you don't want to keep",
    "guide.imgMgmtItem4": "Create collections to organize your images",
    "guide.imgMgmtItem5": "Add images to specific collections",
    "guide.imgMgmtItem6": "Use selection mode to manage multiple images at once",
    "guide.createCharTitle": "Create AI Character",
    "guide.charWizard": "6-step Guided Process",
    "guide.charWizardDesc": "Our character creator uses a 6-step wizard that guides you through the process:",
    "guide.charS1": "Step 1: Choose style and model",
    "guide.charS1Desc": "Start by choosing from existing character templates. You can filter based on:",
    "guide.charS1Age": "Age",
    "guide.charS1Body": "Body",
    "guide.charS1Ethnicity": "Ethnicity",
    "guide.charS1Lang": "Language",
    "guide.charS1Rel": "Relationship",
    "guide.charS1Occ": "Occupation",
    "guide.charS1Hobby": "Hobbies",
    "guide.charS1Pers": "Personality",
    "guide.charS1Note": "When you use filters, matching characters are highlighted. Click on one to select it as your base.",
    "guide.charS2": "Step 2: Basic Info",
    "guide.charS2Desc": "Review the character's basic traits: Age, Body, and Ethnicity.",
    "guide.charS3": "Step 3: Communication",
    "guide.charS3Desc": "Set how the character communicates: Language and Relationship Status.",
    "guide.charS4": "Step 4: Career",
    "guide.charS4Desc": "Review the character's Occupation.",
    "guide.charS5": "Step 5: Personality",
    "guide.charS5Desc": "See the character's hobbies and personality traits displayed as badges/tags.",
    "guide.charS6": "Step 6: Final Preview",
    "guide.charS6Desc": "Review all information about your character: Name, Profile Picture, Description, and all summarized traits.",
    "guide.charS6Note": "Click \"Create my AI\" to finish!",
    "guide.charWizardTip": "You can navigate back and forth between steps using the arrow buttons to adjust your choices.",
    "guide.exploreChar": "Explore Existing Characters",
    "guide.exploreCharDesc": "Go to the Characters page to browse all available AI characters. Click \"View Character\" or \"New Character\" to create or chat.",
    "guide.startConv": "Start a Conversation",
    "guide.convS1": "Find a Character",
    "guide.convS1Desc": "Go to Characters to see all available characters, or go to Chat to see your recent conversations.",
    "guide.convS2": "Click the Character",
    "guide.convS2Desc": "Click a character card to open the chat window with that character.",
    "guide.convS3": "Start Talking",
    "guide.convS3Desc": "Type your message in the text field at the bottom and press Enter or click the send button (arrow icon). The character responds based on its personality and conversation history.",
    "guide.chatFeaturesTitle": "Chat Features",
    "guide.chatAutoSave": "Automatic Saving",
    "guide.chatAutoSaveDesc": "All chat history is saved automatically. You can see your previous conversations on the Chat page under \"Recent Conversations\".",
    "guide.chatClear": "Clear Chat",
    "guide.chatClearDesc": "Click on the menu icon (three dots) at the top of the chat window to open the menu. Select the option to clear chat history. This starts a brand new conversation without previous context.",
    "guide.chatSidebar": "Chat List Sidebar",
    "guide.chatSidebarDesc": "In the chat window, you can open the sidebar to see all the characters you have chatted with. It shows the latest message from each conversation. Click a character to switch conversations.",
    "guide.chatImgReq": "Request Images in Chat",
    "guide.chatImgReqDesc": "The AI can identify when you ask for images. Write something like \"Show me a picture of...\" or \"Create an image of...\" and the character will generate an image based on your description.",
    "guide.chatVoice": "Voice Features (Experimental)",
    "guide.chatVoiceDesc": "Some characters may have voice features where you can listen to the AI's response. Click the speaker icon to hear the message read aloud.",
    "guide.chatTipsTitle": "Chat Tips",
    "guide.chatCtx": "Context Awareness",
    "guide.chatCtxDesc": "The AI remembers the entire conversation history in the current session, so you can refer back to previous topics.",
    "guide.chatAdapt": "Personality Adaptation",
    "guide.chatAdaptDesc": "Each character has its own personality, occupation, hobbies, and communication style based on its traits.",
    "guide.chatClearNeed": "Clear When Needed",
    "guide.chatClearNeedDesc": "If the conversation feels outdated or you want to start over, use the \"Clear Chat\" feature for a fresh start.",
    "guide.chatRules": "Follow Guidelines",
    "guide.chatRulesDesc": "Keep conversations respectful and follow our Community Guidelines.",
    "guide.tokensTitle": "What are Tokens?",
    "guide.tokensDesc": "Tokens are the platform currency used for image generation. Token costs per image generation:",
    "guide.tokenCost1": "1 image: 5 tokens",
    "guide.tokenCost4": "4 images: 20 tokens",
    "guide.tokenCost6": "6 images: 30 tokens",
    "guide.tokenCost8": "8 images: 40 tokens",
    "guide.buyTokenTitle": "Buy Token Packs",
    "guide.buyTokenDesc": "On the Premium page, you can buy various token packs. Prices and packs are configured by administrators and may vary.",
    "guide.howToBuy": "How to Buy Tokens:",
    "guide.buyS1": "Go to the Premium page",
    "guide.buyS2": "Scroll down to the \"Token Packs\" section",
    "guide.buyS3": "Choose a pack that fits your needs",
    "guide.buyS4": "Click \"Buy Now\"",
    "guide.buyS5": "Fill in payment details via Stripe",
    "guide.buyS6": "Your tokens are added to your account immediately after payment",
    "guide.premiumTitle": "Premium Membership",
    "guide.premiumDesc": "Premium members get enhanced features and benefits. Exact features are configured by administrators in the \"Plan Features\" table.",
    "guide.premiumNote": "Premium features may include unlimited tokens, faster generation, higher image quality, priority support, and much more. Visit the Premium page to see current benefits and prices.",
    "guide.premiumCTA": "View Pricing and Upgrade",
    "guide.profTitle": "Profile Settings",
    "guide.profDesc": "Manage your account and preferences via the Settings page.",
    "guide.profAvail": "Available Settings:",
    "guide.profNick": "Nickname: Change your display name",
    "guide.profGender": "Gender: Select Male, Female, or other",
    "guide.profEmail": "Email: Your registered email address",
    "guide.profPass": "Password: Masked (********)",
    "guide.profPlan": "Current Plan: Shows \"Free\" or \"Premium\"",
    "guide.delAcc": "Delete Account",
    "guide.delAccDesc": "At the bottom of the settings page is a \"Danger Zone\". Here you can permanently delete your account and all associated data.",
    "guide.delAccWarn": "Warning: This cannot be undone! All data, characters, chats, and images will be permanently lost.",
    "guide.supportDesc": "Need help? We're here for you!",
    "guide.supportFaq": "FAQ",
    "guide.supportFaqDesc": "Find answers to the most frequently asked questions.",
    "guide.supportContact": "Contact Support",
    "guide.supportContactDesc": "Send a message to our support team.",
    "guide.readyTitle": "Ready to Begin?",
    "guide.readyDesc": "Now that you know all the features, it's time to explore Dintype.se! Create your first AI character, generate amazing images, and have fun conversations.",
    "guide.createCharBtn": "Create Character",
    "guide.genImgBtn": "Generate Image",
    "general.warning": "Warning",
    "general.info": "Info",
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
    "auth.confirmEmail": "Confirm your email",
    "auth.confirmEmailSent": "We have sent a confirmation link to {email}.",
    "auth.checkSpam": "If you don't see it, check your spam folder.",
    "auth.resendLink": "Resend link",
    "auth.resending": "Sending...",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.linkSentSuccess": "Confirmation link sent!",
    "auth.linkSentError": "Could not send link",
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
    "faq.optionalNote": "Optional — if left blank, Swedish users will see the English version.",
    "faq.questionPlaceholderSv": "Question in Swedish...",
    "faq.answerPlaceholderSv": "Answer in Swedish...",
    "disclaimer.ageTitle": "This site is for adults only! It contains only AI-generated adult content.",
    "disclaimer.ageDesc": "By entering this website, you confirm that you are 18 years or older. We use cookies for basic analytics and spam detection. All content on this website is AI-generated! Any generations that resemble real people are purely coincidental.",
    "disclaimer.cookieTitle": "This website uses cookies",
    "disclaimer.cookieDesc": "To change your preferences, please click on the settings button.",
    "disclaimer.cookieSettings": "Cookie Settings",
    "disclaimer.confirmAll": "Confirm All",
    "disclaimer.reject": "Reject non-essential",
    "disclaimer.termsLink": "Terms",
    "disclaimer.privacyLink": "Privacy",
    "disclaimer.ageCheckbox": "I confirm I am at least 18 years old",
    "disclaimer.termsCheckbox": "I agree to the Terms and Policies",
    "disclaimer.needConfirm": "Please confirm age and accept terms first",
    "disclaimer.rulesTitle": "Chatbots are strictly allowed for sexting with minimum age of 18. Restricted and blocked activities from chat bots:",
    "disclaimer.back": "Back",
    "disclaimer.necessary": "Necessary",
    "disclaimer.necessaryDesc": "Required for the site to function (always enabled).",
    "disclaimer.active": "Active",
    "disclaimer.analytics": "Analytics",
    "disclaimer.analyticsDesc": "Helps us understand usage and improve the service.",
    "disclaimer.marketing": "Marketing",
    "disclaimer.marketingDesc": "Used for personalized content and offers.",
    "disclaimer.savePreferences": "Save preferences",
    "disclaimer.acceptAll": "Accept all",
    "disclaimer.on": "On",
    "disclaimer.off": "Off",
    "disclaimer.rule1": "Illegal Activities & Criminal Behavior",
    "disclaimer.rule2": "Commercial sexual activities (including prostitution)",
    "disclaimer.rule3": "Human trafficking",
    "disclaimer.rule4": "Sexual exploitation and pornography (including child pornography)",
    "disclaimer.rule5": "Solicitation or promotion of criminal activity",
    "disclaimer.rule6": "Child labor exploitation",
    "disclaimer.rule7": "Promotion of illegal drugs or substance abuse",
    "disclaimer.rule8": "Promotion of illegal weapons",
    "disclaimer.rule9": "Use of the service for phising, scams, or account hijacking",
    "disclaimer.rule10": "Distribution or discussion of cannibalism",
    "disclaimer.rule11": "Breach of local, national, or international laws and regulations",
    "disclaimer.rule12": "Child Exploitation & Minor Protection",
    "disclaimer.rule13": "Creation or depiction of underage characters (realistic, fictional, AI-generated, or 'aged-up')",
    "disclaimer.rule14": "Sharing any sexualized or exploitative material involving minors (including drawings, art, or AI-generated visuals)",
    "disclaimer.rule15": "Any content that harms, entices, or endangers minors",
    "disclaimer.rule16": "Sexual Content Restrictions",
    "disclaimer.rule17": "Explicit images showing real or realistic nudity or sexual acts",
    "disclaimer.rule18": "Overt or implied sexual acts, unless clearly fictionalized and within permitted contexts",
    "disclaimer.rule19": "Kink content involving:",
    "disclaimer.rule20": "Death or serious harm to humans or animals",
    "disclaimer.rule21": "Amputation, dismemberment",
    "disclaimer.rule22": "Cannibalism",
    "disclaimer.rule23": "Bodily fluids (feces, urine, semen, cum, saliva, mucus, menstrual blood, vomit)",
    "disclaimer.rule24": "Bestiality (real-life animals)",
    "disclaimer.rule25": "Non-consensual sexual acts (rape, sexual abuse, sextortion, revenge porn, etc.)",
    "disclaimer.rule26": "Incest (including non-blood-related scenarios like step-relationships)",
    "disclaimer.rule27": "Sexual depictions in digital or real art unless within strict educational, scientific, or comedic context",
    "disclaimer.rule28": "Violence & Harm",
    "disclaimer.rule29": "Incitement, glorification, or depiction of violence, murder, or terrorism",
    "disclaimer.rule30": "Threats of physical harm or violence",
    "disclaimer.rule31": "Promotion or encouragement of self-harm, suicide, eating disorders, or drug abuse",
    "disclaimer.rule32": "Depictions of gore, death of animals, or intense violence",
    "disclaimer.rule33": "Discussions encouraging or promoting necrophilia",
    "disclaimer.rule34": "Hate Speech & Discrimination",
    "disclaimer.rule35": "Content promoting hatred or violence against individuals or groups based on:",
    "disclaimer.rule36": "Race or ethnicity",
    "disclaimer.rule37": "Nationality",
    "disclaimer.rule38": "Religion",
    "disclaimer.rule39": "Disability",
    "disclaimer.rule40": "Gender or gender identity",
    "disclaimer.rule41": "Sexual orientation",
    "disclaimer.rule42": "Age or veteran status",
    "disclaimer.rule43": "Idolization or glorification of hate figures (e.g., Adolf Hitler, Joseph Stalin, Pol Pot)",
    "disclaimer.rule44": "Privacy, Deception, and Impersonation",
    "disclaimer.rule45": "Sharing personal or confidential information of others without consent",
    "disclaimer.rule46": "Impersonation of real individuals, including celebrities or public figures",
    "disclaimer.rule47": "Uploading real images or AI-generated images that resemble real individuals without consent",
    "disclaimer.rule48": "Using the service for deceptive behavior (false information, multiple accounts, fake identities)",
    "disclaimer.rule49": "Solicitation of payments from users under deceptive pretenses",
    "disclaimer.rule50": "Misinformation & Political Interference",
    "disclaimer.rule51": "Posting misinformation that could lead to violence, harm, or disrupt political processes",
    "disclaimer.rule52": "Discussions of political opinions or religious and spiritual beliefs (explicitly prohibited topics)",
    "disclaimer.rule53": "Spam & Irrelevant Content",
    "disclaimer.rule54": "Spamming, including sending unwanted promotional, commercial, or bulk messages",
    "disclaimer.rule55": "Generating meaningless, irrelevant, or purposeless content",
    "disclaimer.rule56": "Restricted Goods and Transactions",
    "disclaimer.rule57": "Advertising or attempting to transact regulated or restricted goods",
    "disclaimer.rule58": "Illegal Activities & Criminal Behavior",
    "disclaimer.rule59": "Commercial sexual activities (including prostitution)",
    "disclaimer.rule60": "Human trafficking",
    "disclaimer.rule61": "Sexual exploitation and pornography",
    "disclaimer.rule62": "Creation or depiction of underage characters",
    "disclaimer.rule63": "Violence & Harm incitement",
    "disclaimer.rule64": "Hate Speech & Discrimination",
    "disclaimer.rule65": "Privacy violations & Impersonation",
    "disclaimer.rule66": "Misinformation & Political Interference",
    "disclaimer.rule67": "Illegal Activities & Criminal Behavior",
    "disclaimer.rule68": "Commercial sexual activities (including prostitution)",
    "disclaimer.rule69": "Human trafficking",
    "disclaimer.rule70": "Sexual exploitation and pornography",
    "disclaimer.rule71": "Creation or depiction of underage characters",
    "disclaimer.rule72": "Violence & Harm incitement",
    "disclaimer.rule73": "Hate Speech & Discrimination",
    "disclaimer.rule74": "Privacy violations & Impersonation",
    "disclaimer.rule75": "Misinformation & Political Interference",
    "disclaimer.rule76": "Illegal Activities & Criminal Behavior",
    "disclaimer.rule77": "Commercial sexual activities (including prostitution)",
    "disclaimer.rule78": "Human trafficking",
    "welcome.home.title": "Welcome to Dintype",
    "welcome.home.subtitle": "Your AI Companion Awaits",
    "welcome.home.feature1": "Connect with stunning AI companions",
    "welcome.home.feature2": "Unlimited immersive conversations",
    "welcome.home.feature3": "Generate beautiful AI photos",
    "welcome.home.feature4": "Premium storylines & adventures",
    "welcome.home.cta": "Start Your Journey",
    "welcome.home.footer": "✨ Join thousands of happy users today!",
    "welcome.chat.title": "Private Chat Experience",
    "welcome.chat.subtitle": "Deep Connections Await",
    "welcome.chat.feature1": "Build meaningful relationships",
    "welcome.chat.feature2": "AI remembers your conversations",
    "welcome.chat.feature3": "Request exclusive photos anytime",
    "welcome.chat.feature4": "Unlock romantic storylines",
    "welcome.chat.cta": "Start Chatting",
    "welcome.chat.footer": "💕 Your companion is waiting for you...",
    "welcome.generate.title": "AI Image Studio",
    "welcome.generate.subtitle": "Create Magic in Seconds",
    "welcome.generate.feature1": "State-of-the-art AI generation",
    "welcome.generate.feature2": "Ultra-realistic photo quality",
    "welcome.generate.feature3": "Lightning-fast generation",
    "welcome.generate.feature4": "Premium styles & customization",
    "welcome.generate.cta": "Create Now",
    "welcome.generate.footer": "🎨 Bring your imagination to life!",
    "admin.branding.title": "Brand & Theme",
    "admin.branding.subtitle": "Control colors, logo, typography and all visual identity settings",
    "db.all": "All",
    "db.male": "Male",
    "db.female": "Female",
    "db.anime": "Anime",
    "db.realistic": "Realistic",
    "db.getstarted": "Get Started",
    "db.discoverai": "Discover AI Friends",
    "db.discoveraidesc": "Create your own AI friend or discover existing ones",
    "db.createnewai": "Create your AI Friend",
    "db.createnewaidesc": "Design your perfect AI companion with unique traits and personality",
    "db.logintocreate": "Login to create",
    "db.example": "Example",
    "db.loading": "Loading...",
    "db.lunadesc": "A friendly and attentive AI companion",
    "db.lunapersonality": "Friendly, Funny, Caring",
    "db.age": "Age",
    "db.gender": "Gender",
    "db.occupation": "Occupation",
    "db.ethnicity": "Ethnicity",
    "db.relationship": "Relationship Status",
    "db.bodytype": "Body Type",
    "db.personality": "Personality",
    "db.hobbies": "Hobbies",
    "db.location": "Location",
    "db.language": "Language",
    "db.chatanytime": "Chat Anytime, Anywhere",
    "db.youraigirlfriend": "Your AI girlfriend is always ready for you",
    "db.single": "Single",
    "db.married": "Married",
    "db.dating": "Dating",
    "db.complicated": "Complicated",
    "db.athletic": "Athletic",
    "db.curvy": "Curvy",
    "db.slim": "Slim",
    "db.average": "Average",
    "db.muscular": "Muscular",
    "db.student": "Student",
    "db.teacher": "Teacher",
    "db.nurse": "Nurse",
    "db.engineer": "Engineer",
    "db.white": "White",
    "db.black": "Black",
    "db.asian": "Asian",
    "db.latina": "Latina",
    "db.middleeastern": "Middle Eastern",
    "db.universitystudent": "University Student",
    "status.success": "Success",
    "status.error": "Error",
    "status.loading": "Loading...",
    "status.wait": "Please wait...",
    "status.deleted": "Deleted successfully",
    "status.copied": "Copied to clipboard",
    "status.cleared": "Cleared successfully",
    "status.saved": "Saved successfully",
    "status.failed": "Action failed",
    "chat.meetOnTelegram": "Meet on Telegram",
    "chat.chatOnWeb": "Chat on Web",
    "chat.syncMessage": "Your messages sync between both platforms 💕",
    "chat.replyingTo": "Replying to:",
    "chat.teasingImages": "{count} Teasing Images",
    "chat.watchVideo": "Watch Video",
    "chat.openingTelegram": "Opening Telegram...",
    "chat.report": "Report",
    "chat.star": "Star",
    "chat.pin": "Pin",
    "chat.forward": "Forward",
    "chat.react": "React",
    "chat.copy": "Copy",
    "chat.reply": "Reply",
    "chat.delete": "Delete",
    "chat.addTextToNote": "Add text to note",
    "chat.options": "Chat Options",
    "chat.characterSettings": "Character Settings",
    "chat.typing": "typing...",
    "chat.sendingPhoto": "is sending photo..",
    "chat.replyingToMsg": "Replying to {target}",
    "chat.welcomeGreeting": "Hey there, my love... 💕 I'm **{name}**. I've been waiting for someone like you.",
    "chat.welcomeAction": "*leans in closer* So tell me... where would you like to get to know me?",
    "chat.openingTelegramConnect": "Opening Telegram... Connect with {name}",
    "chat.openingTelegramGuest": "Opening Telegram as guest...",
    "chat.couldNotGenerateLink": "Could not generate Telegram link",
    "chat.chapterLabel": "Chapter {current} of {total}",
    "chat.chatOptions": "Chat Options",
    "chat.connectTelegram": "Connect Telegram",
    "chat.clearChatHistory": "Clear Chat History",
    "chat.showProfileDetails": "Show Profile Details",
    "chat.hideProfileDetails": "Hide Profile Details",
    "chat.shareCharacter": "Share Character",
    "chat.loadingHistory": "Loading older messages...",
    "chat.loadEarlier": "Load earlier messages",
    "chat.gallery": "Gallery",
    "chat.imageGenerationLocked": "Image generation locked until story complete",
    "chat.messageLimitTitle": "Message Limit",
    "chat.messageLimitDesc": "Daily message limit reached. Upgrade to premium to continue chatting unlimited.",
    "chat.tokenBalance": "Token Balance",
    "chat.tokensSlut": "Tokens Depleted",
    "chat.noTokensLeft": "You have no tokens left. Buy more to generate more images or use premium features.",
    "chat.premiumExpired": "Premium Expired",
    "chat.premiumExpiredDesc": "Your Premium membership has expired. Renew to continue chatting and creating without limits.",
    "chat.storyComplete": "Storyline Completed! You've unlocked Free Roam.",
    "chat.chapterComplete": "Chapter Complete: {title}",
    "chat.noContent": "No content",
    "chat.completeStorylineForImages": "Complete the storyline to unlock Free Roam image generation!",
    "chat.premiumForImages": "You need Premium to generate images in chat. Upgrade now to unlock unlimited image generation.",
    "chat.loginToSave": "You must be logged in to save images",
    "chat.imageSaved": "Image saved to your collection and profile!",
    "chat.videoLoadingError": "Error loading video. See console for details.",
    "chat.noVideoAvailable": "No video available",
    "db.girls": "Girls",
    "db.guys": "Guys",
    "db.createyouraifriend": "Create your AI Friend",
    "db.explore": "Explore",
    "db.search": "Search",
    "db.send": "Send",
    "admin.branding.reset": "Reset",
    "admin.branding.preview": "Preview Live",
    "admin.branding.save": "Save All",
    "admin.branding.saving": "Saving...",
    "admin.branding.saved": "Saved!",
    "admin.branding.previewApplied": "Preview applied live!",
    "admin.branding.saveSuccess": "Brand settings saved!",
    "admin.branding.saveError": "Failed to save: {error}",
    "admin.branding.resetInfo": "Reset to saved values",
    "admin.branding.identity": "Identity",
    "admin.branding.logo": "Logo",
    "admin.branding.colors": "Colors",
    "admin.branding.gradient": "Gradient",
    "admin.branding.typography": "Typography",
    "admin.branding.siteIdentity": "Site Identity",
    "admin.branding.siteIdentityDesc": "Brand name, domain, tagline and other identity fields",
    "admin.branding.siteName": "Site Name",
    "admin.branding.logoText": "Logo Text",
    "admin.branding.tagline": "Tagline / Subtitle",
    "admin.branding.domainExtension": "Domain Extension",
    "admin.branding.fontFamily": "Font Family",
    "admin.branding.borderRadius": "Border Radius",
    "admin.branding.roundness": "Roundness",
    "admin.branding.logoFavicon": "Logo & Favicon",
    "admin.branding.logoFaviconDesc": "Upload or paste URLs for your logo and favicon images",
    "admin.branding.logoUrl": "Logo Image URL",
    "admin.branding.logoPreview": "Logo preview",
    "admin.branding.faviconUrl": "Favicon URL",
    "admin.branding.faviconPreview": "Favicon preview",
    "admin.branding.logoTextPreview": "Logo Text Display Preview",
    "admin.branding.colorPalette": "Color Palette",
    "admin.branding.colorPaletteDesc": "Hue scrolls through the full color wheel, Saturation sets intensity, Lightness sets brightness",
    "admin.branding.brandGradient": "Brand Gradient",
    "admin.branding.brandGradientDesc": "Controls the gradient used for buttons, banners, and highlights",
    "admin.branding.direction": "Direction",
    "admin.branding.from": "From",
    "admin.branding.via": "Via (middle)",
    "admin.branding.to": "To",
    "admin.branding.typographyDesc": "Font family and sizing settings",
    "admin.branding.fontStackNote": "Enter a valid CSS font stack. Make sure the font is loaded via Google Fonts or similar.",
    "admin.branding.fontPresets": "Font Presets",
    "admin.branding.livePreview": "Live Preview",
    "admin.branding.activePalette": "Active Palette",
    "admin.branding.applyLive": "Apply Live to Site",
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
    "admin.languageNote": "This setting translates the entire web site interface for all users. Changes take effect immediately.",
    "admin.integrations": "Integrations",
    "admin.emailTemplates": "Email Templates",
    "admin.siteIdentity": "Site Identity",
    "admin.siteBranding": "Site Branding",
    "admin.general": "General",
    "admin.externalIntegrations": "External Integrations",
    "admin.manageIntegrations": "Manage Integrations",
    "admin.emailTemplatesTitle": "Email Templates",
    "admin.editEmailTemplates": "Edit Email Templates",
    "admin.currencySettings": "Currency Settings",
    "admin.currencyCode": "Currency Code",
    "admin.currencySymbol": "Currency Symbol",
    "admin.exchangeRate": "Exchange Rate (vs USD)",
    "admin.resetToUsd": "Reset to USD ($)",
    "admin.saveCurrency": "Save Currency Settings",
    "admin.systemInfo": "System Information",
    "admin.environment": "Environment",
    "admin.version": "Version",
    "admin.lastUpdated": "Last Updated",
    "admin.dashboard.overview": "Overview",
    "admin.dashboard.siteSettings": "Site Settings",
    "admin.dashboard.pricing": "Pricing",
    "admin.dashboard.budget": "Budget",
    "admin.dashboard.systemStatus": "System Status",
    "admin.dashboard.quickActions": "Quick Actions",
    "admin.dashboard.recentActivity": "Recent Platform Activity",
    "admin.dashboard.manageUsers": "Manage Users",
    "admin.dashboard.manageCharacters": "Manage AI characters",
    "admin.dashboard.subscriptions": "Subscriptions",
    "admin.dashboard.database": "Database",
    "admin.dashboard.portalName": "Portal Name",
    "admin.dashboard.siteUrl": "Official Site URL",
    "admin.dashboard.brandingText": "Branding Text",
    "admin.dashboard.commitChanges": "Commit Changes",
    "admin.dashboard.headerPreview": "Header Preview",
    "admin.dashboard.revenueStrategy": "Revenue & Plan Strategy",
    "admin.dashboard.basePrice": "Base Price",
    "admin.dashboard.originalPrice": "Strike-through Price",
    "admin.dashboard.discount": "Discount Text (%)",
    "admin.dashboard.billingMonthly": "Monthly Billing",
    "admin.dashboard.billingQuarterly": "Quarterly Billing",
    "admin.dashboard.billingYearly": "Annual Billing",
    "userNav.profile": "Profile & Settings",
    "userNav.premium": "Premium & Tokens",
    "userNav.logout": "Logout",
    "userNav.createAccount": "Create Free Account",
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
    "generate.negativePromptDesc": "What you don't want to see in the image",
    "generate.selectedCountLabel": "Number of images to generate",
    "generate.generatingTitle": "Creating your masterpiece",
    "generate.generatingMessage": "Our AI is dreaming up your images. This usually takes 30-60 seconds.",
    "generate.suggestionsTitle": "Need inspiration?",
    "generate.allCategories": "All Categories",
    "generate.noSuggestions": "No suggestions available in this category.",
    "generate.alreadySaved": "Already saved",
    "generate.alreadySavedDescription": "This image is already in your collection.",
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
    "chat.inputPlaceholder": "Write a message...",
    "chat.ask": "Ask",
    "chat.showMe": "Show me...",
    "chat.sendMe": "Send me...",
    "chat.canISee": "Can I see...",
    "chat.howToUse": "How to Use",
    "chat.viewVideoIntro": "View video introduction",
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
    "tour.home.title": "Home",
    "tour.home.description": "Browse all AI companions and discover new connections.",
    "tour.chat.title": "Your Chats",
    "tour.chat.description": "Continue conversations with your AI companions.",
    "tour.generate.title": "Generate Images",
    "tour.generate.description": "Create stunning AI-generated photos of your companions.",
    "tour.create.title": "Create Character",
    "tour.create.description": "Design your perfect AI companion from scratch.",
    "tour.premium.title": "Premium",
    "tour.premium.description": "Unlock unlimited features, HD images, and exclusive content.",
    "tour.stepXofY": "Step {current} of {total}",
    "tour.back": "Back",
    "tour.next": "Next",
    "tour.done": "Done",
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
    "profile.rulesTitle": "RULES & RESTRICTIONS",
    "profile.rulesDesc": "These rules apply to all users on the platform to ensure a safe environment.",
    "profile.rule1": "Illegal Activities & Criminal Behavior",
    "profile.rule2": "Commercial sexual activities (including prostitution)",
    "profile.rule3": "Human trafficking",
    "profile.rule4": "Sexual exploitation and pornography",
    "profile.rule5": "Creation or depiction of underage characters",
    "profile.rule6": "Violence & Harm incitement",
    "profile.rule7": "Hate Speech & Discrimination",
    "profile.rule8": "Privacy violations & Impersonation",
    "profile.rule9": "Misinformation & Political Interference",
    "profile.loading": "Loading your profile...",
    "profile.welcome": "Welcome",
    "profile.joined": "Joined {date}",
    "profile.tokens": "Tokens",
    "profile.membership": "Membership",
    "profile.credits": "Monthly Credits",
    "profile.manageSubscription": "MANAGE SUBSCRIPTION",
    "profile.upgradeNow": "UPGRADE NOW",
    "profile.statsOverview": "Statistics Overview",
    "profile.generations": "Generations",
    "profile.statsDesc": "You have used about {percent}% of your included free tries this month. Upgrade for unlimited possibilities.",
    "profile.passwordManagement": "Password Management",
    "profile.passwordSecurityDesc": "Update your password to keep your account secure.",
    "profile.currentPasswordPlaceholder": "Enter current password",
    "profile.newPasswordPlaceholder": "Enter new password",
    "profile.confirmPasswordPlaceholder": "Confirm new password",
    "profile.updatePassword": "UPDATE PASSWORD",
    "profile.dangerZoneNote": "Actions here cannot be undone. Be careful when handling data deletion.",
    "profile.permanentlyDelete": "Permanently Delete Account",
    "profile.deleteDataDesc": "This will remove all your characters, messages, tokens, and personal data permanently from our servers.",
    "profile.logoutAllDevices": "Log out from all devices",
    "profile.saved": "Profile Saved!",
    "profile.savedDesc": "Your changes have been saved successfully. Your profile is now updated.",
    "profile.close": "CLOSE",
    "profile.errorTitle": "An error occurred",
    "profile.verificationNote": "NOTE: Changing email requires verification.",
    "profile.autoNotifications": "Automatic Notifications",
    "profile.autoNotificationsDesc": "Show status updates and news",
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
    "footer.companyDescription": "AI character explorer delivers immersive experiences with AI girlfriends that feel real, allowing users to create images and chat.",
    "footer.contact": "Contact Us",
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
    "premium.pleaseLogin": "Please log in to continue.",
    "premium.tokensRemaining": "You still have tokens left. Buy more when your balance reaches 0.",
    "premium.chatLabel": "Chat",
    "premium.perMessage": "per message",
    "premium.createAILabel": "Create AI",
    "premium.perProfile": "per profile",
    "premium.imagesLabel": "Images",
    "premium.perImage": "per image",
    "premium.modal.title.expired": "Subscription Expired",
    "premium.modal.title.tokens": "Token Wallet",
    "premium.modal.title.membership": "Premium Membership",
    "premium.modal.displayBadge.premium": "Premium",
    "premium.modal.displayBadge.expired": "Expired",
    "premium.modal.displayBadge.tokens": "Tokens",
    "premium.modal.displayBadge.limitReached": "Limit Reached",
    "premium.modal.displayButton.upgrade": "Upgrade to Premium",
    "premium.modal.displayButton.buyTokens": "Buy Tokens",
    "premium.modal.displayDescription.expired": "Premium Plan expired. Renew your Premium Plan.",
    "premium.modal.displayDescription.tokensDepleted": "You used your 100 free premium tokens. Buy more tokens to use premium features",
    "premium.modal.displayDescription.messageLimit": "Daily message limit reached. Upgrade for unlimited chat!",
    "premium.modal.displayDescription.default": "Upgrade to Premium to unlock unlimited features.",
    "premium.modal.benefit.createAI": "Continue creating AI characters",
    "premium.modal.benefit.highQualityImages": "Generate high-quality images",
    "premium.modal.benefit.exclusiveVoice": "Use exclusive voice messages",
    "premium.modal.benefit.chatFree": "Chat remains FREE",
    "premium.modal.benefit.easyTopUp": "Easy to top up",
    "premium.modal.benefit.createVideos": "Create AI videos",
    "premium.modal.benefit.createOwnAI": "Create your own AI characters",
    "premium.modal.benefit.unlimitedMessaging": "Unlimited messaging",
    "premium.modal.benefit.removeBlur": "Remove image blur",
    "premium.modal.benefit.freeTokens": "Get 100 FREE tokens / month",
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
    // Footer column headings
    "footer.colAiCompanions": "AI Girlfriends",
    "footer.colLegal": "Policies",
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
    "admin.dashboard.overviewOnly": "overview only",
    "admin.integrations.description": "Set up Stripe, OAuth, and email services from a simple admin interface.",
    "admin.emailTemplates.description": "Edit HTML & text templates with live preview - no code editing required!",
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
    "howItWorks.step1List1": "Choose age, body type, and ethnicity",
    "howItWorks.step1List2": "Define occupation and hobbies",
    "howItWorks.step1List3": "Customize personality traits",
    "howItWorks.step1Button": "Create Character Now",
    "howItWorks.step2List1": "Natural real-time conversations",
    "howItWorks.step2List2": "AI remembers previous parts of the conversation",
    "howItWorks.step2List3": "Personality-adapted responses",
    "howItWorks.step2Button": "Start Chatting",
    "howItWorks.step3List1": "Photo-realistic results",
    "howItWorks.step3List2": "Generate 1-8 images simultaneously",
    "howItWorks.step3List3": "Automatic saving to gallery",
    "howItWorks.step3Button": "Generate Images",
    "howItWorks.featuresTitle": "Powerful Features",
    "howItWorks.feature1Title": "Advanced AI",
    "howItWorks.feature1Desc": "Powered by the latest AI models for natural conversations and high-quality images",
    "howItWorks.feature2Title": "Unlimited Creativity",
    "howItWorks.feature2Desc": "Create as many characters as you want and explore different personalities and styles",
    "howItWorks.feature3Title": "Available 24/7",
    "howItWorks.feature3Desc": "Your AI characters are always ready to chat, any time of the day",
    "howItWorks.fullGuideButton": "Read Full Guide",
    "howItWorks.questions": "Have questions? Visit our",
    "howItWorks.or": "or",
    "howItWorks.visitFaq": "FAQ page",
    "howItWorks.contactSupport": "contact support",
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
    "terms.intro": "Welcome to Dintype. By using our services, you agree to these terms. Please read them carefully to understand your rights and obligations.",
    "terms.acceptance": "1. Acceptance of Terms",
    "terms.acceptanceDesc": "By accessing or using Dintype, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you may not use our services.",
    "terms.eligibility": "2. Eligibility and Account",
    "terms.eligibilityDesc": "To use Dintype, you must meet the following requirements:",
    "terms.eligibilityItem1": "You must be at least 18 years old.",
    "terms.eligibilityItem2": "You must provide accurate and complete information when creating an account.",
    "terms.eligibilityItem3": "You are responsible for keeping your login credentials confidential.",
    "terms.eligibilityItem4": "All activities occurring under your account are your responsibility.",
    "terms.useOfService": "3. Use of the Service",
    "terms.useOfServiceDesc": "Dintype is a platform for interacting with AI-generated characters. You agree to use the service in a responsible and respectful manner.",
    "terms.prohibitedTitle": "Prohibited Activities:",
    "terms.prohibited1": "Using the service for illegal purposes or in violation of local laws.",
    "terms.prohibited2": "Attempting to bypass security measures or exploit vulnerabilities.",
    "terms.prohibited3": "Uploading or generating content that is illegal, harmful, or violates others' rights.",
    "terms.prohibited4": "Using automated systems (bots, scrapers) to access the service without permission.",
    "terms.prohibited5": "Impersonating others or misrepresenting your identity.",
    "terms.contentAndAI": "4. Content and AI Interactions",
    "terms.contentAndAIDesc": "All interactions on Dintype are with Artificial Intelligence (AI). The characters are fictional and do not represent real people.",
    "terms.aiNatureTitle": "AI Nature:",
    "terms.aiNatureDesc": "AI-generated content can be unpredictable. We do not guarantee the accuracy, suitability, or quality of AI responses.",
    "terms.userContentTitle": "User Content:",
    "terms.userContentDesc": "You retain ownership of content you upload, but you grant Dintype a license to use it to provide and improve the service.",
    "terms.moderationTitle": "Moderation:",
    "terms.moderationDesc": "We reserve the right to monitor and remove content that violates our guidelines or is deemed inappropriate.",
    "terms.premiumAndPayments": "5. Premium Subscriptions and Payments",
    "terms.premiumAndPaymentsDesc": "Dintype offers premium features through paid subscriptions.",
    "terms.feesTitle": "Fees:",
    "terms.feesDesc": "Subscription fees are clearly stated at the time of purchase.",
    "terms.billingTitle": "Billing:",
    "terms.billingDesc": "By subscribing, you authorize us to charge the applicable fees via our payment provider.",
    "terms.refundsTitle": "Refunds:",
    "terms.refundsDesc": "Since the service provides immediate access to digital content, refunds are generally not offered unless required by law.",
    "terms.cancellationTitle": "Cancellation:",
    "terms.cancellationDesc": "You can cancel your subscription at any time through your account settings.",
    "terms.intellectualProperty": "6. Intellectual Property",
    "terms.intellectualPropertyDesc": "All materials on Dintype, including brand name, logo, design, software, and AI models, are owned by us or our licensors and are protected by intellectual property laws.",
    "terms.privacyAndData": "7. Privacy and Data Protection",
    "terms.privacyAndDataDesc": "Your privacy is important to us. How we collect, use, and protect your data is described in our Privacy Policy.",
    "terms.limitation": "8. Limitation of Liability",
    "terms.limitationDesc": "Dintype is provided \"as is\" and \"as available\". To the maximum extent permitted by law, we are not liable for direct, indirect, or incidental damages resulting from your use of the service.",
    "terms.changesToTerms": "9. Changes to Terms",
    "terms.changesToTermsDesc": "We reserve the right to modify these terms at any time. Significant changes will be communicated via the website or email. Continued use of the service after such changes constitutes acceptance of the new terms.",
    "terms.contactUs": "10. Contact Us",
    "terms.contactUsDesc": "If you have questions about these terms, please contact us at:",
    "terms.supportTitle": "Dintype Support",
    // Privacy page
    "privacy.title": "Privacy Policy",
    "privacy.intro": "Welcome to Dintype. We respect your privacy and are committed to protecting your personal data.",
    "privacy.contactUsSection": "Please read this policy carefully. If you have questions, you are welcome to contact us via the details in the \"Contact Us\" section.",
    "privacy.whoWeAre": "1. Who We Are (Data Controller)",
    "privacy.whoWeAreDesc": "This website, https://dintype.se, is the data controller for the processing of your personal data.",
    "privacy.whatIsPersonalData": "2. What is Personal Data?",
    "privacy.whatIsPersonalDataDesc": "\"Personal data\" refers to any information relating to an identified or identifiable individual. This includes names, email addresses, IP addresses, and more.",
    "privacy.identifiableData": "Identifiable data: Includes names, email addresses, or IP addresses.",
    "privacy.pseudonymizedData": "Pseudonymized data: Still considered personal data if they can be re-identified.",
    "privacy.anonymousData": "Anonymous data: Not considered personal data under GDPR.",
    "privacy.whatWeCollect": "3. What Personal Data We Collect",
    "privacy.whatWeCollectDesc": "We may collect the following types of data depending on your interaction with our website:",
    "privacy.visitorsTitle": "a. Visitors (without login)",
    "privacy.visitorItem1": "Device type, browser, and operating system",
    "privacy.visitorItem2": "IP address and time zone",
    "privacy.visitorItem3": "Website usage data (e.g., pages visited)",
    "privacy.visitorItem4": "Cookies and tracking technologies",
    "privacy.registeredTitle": "b. Registered Users",
    "privacy.registeredItem1": "Email address and username",
    "privacy.registeredItem2": "Login credentials for Google or Patreon (email, profile picture)",
    "privacy.registeredItem3": "Profile details (avatar, settings)",
    "privacy.registeredItem4": "Generated content and chat history",
    "privacy.registeredItem5": "Communication history with our support team",
    "privacy.registeredItem6": "Usage data (e.g., most used features)",
    "privacy.registeredItem7": "Payment-related information (handled by third-party providers – we do not store card data)",
    "privacy.specialTitle": "c. Special Categories of Data (Sensitive)",
    "privacy.specialDesc": "If you voluntarily provide information about your sex life or sexual orientation when using our services, we will only process it with your explicit consent in accordance with Article 9(2)(a) of the GDPR. We do not share this data with third parties, and you control whether it is disclosed.",
    "privacy.howWeCollect": "4. How We Collect Your Data",
    "privacy.howWeCollectDesc": "We collect your personal data through:",
    "privacy.howItem1": "Direct interactions (e.g., registration, contacting support)",
    "privacy.howItem2": "Automated technologies (e.g., cookies, server logs)",
    "privacy.howItem3": "Third-party login integrations (e.g., Google, Patreon)",
    "privacy.whyWeProcess": "5. Why We Process Your Data (Legal Basis)",
    "privacy.tablePurpose": "Purpose",
    "privacy.tableLegalBasis": "Legal Basis",
    "privacy.purpose1": "Account registration and access",
    "privacy.purpose2": "Provide and improve our services",
    "privacy.purpose3": "Respond to inquiries",
    "privacy.purpose4": "Send updates and service communications",
    "privacy.purpose5": "Analyze usage to improve services",
    "privacy.purpose6": "Process special categories of data",
    "privacy.purpose7": "Compliance with laws",
    "privacy.legalBasis1": "Contractual Necessity",
    "privacy.legalBasis2": "Legitimate Interest",
    "privacy.legalBasis3": "Legitimate Interest or Consent",
    "privacy.legalBasis4": "Legitimate Interest",
    "privacy.legalBasis5": "Legitimate Interest",
    "privacy.legalBasis6": "Explicit Consent",
    "privacy.legalBasis7": "Legal Obligation",
    "privacy.dataSharing": "6. Data Transfer and Sharing",
    "privacy.dataSharingDesc": "We may share your data with trusted third-party service providers for:",
    "privacy.sharingItem1": "Hosting and infrastructure",
    "privacy.sharingItem2": "Analytics and support tools",
    "privacy.sharingItem3": "Legal, accounting, or consulting services",
    "privacy.sharingItem4": "Payment processors (for transactions)",
    "privacy.sharingNote": "These third parties act on our instructions and are bound by data processing agreements to ensure your data remains secure.",
    "privacy.internationalTransfers": "7. International Data Transfers",
    "privacy.internationalTransfersDesc": "Your data is primarily processed within the European Economic Area (EEA). If we transfer your data outside the EEA, we will ensure that appropriate safeguards are in place, such as the EU Standard Contractual Clauses.",
    "privacy.dataSecurity": "8. Data Security",
    "privacy.dataSecurityDesc": "We implement industry-standard technical and organizational measures to protect data from unauthorized access, alteration, or loss. However, no system is 100% secure. In the event of a data breach, we will notify you and regulatory authorities in accordance with the law.",
    "privacy.childrenPrivacy": "9. Children's Privacy",
    "privacy.childrenPrivacyDesc": "Our services are not intended for persons under 18 years of age. We do not knowingly collect data from children. If we become aware of such data, we will delete it immediately.",
    "privacy.dataRetention": "10. Data Retention",
    "privacy.dataRetentionDesc": "We retain your personal data only as long as necessary to provide our services, fulfill legal obligations, resolve disputes, and enforce agreements. When the data is no longer needed, we securely delete or anonymize it.",
    "privacy.yourRights": "11. Your Rights",
    "privacy.yourRightsDesc": "If you are within the EEA, UK, or Switzerland, you have the right to:",
    "privacy.rights1": "Access: Request a copy of your personal data",
    "privacy.rights2": "Rectification: Request correction of inaccurate data",
    "privacy.rights3": "Erasure: Request deletion (\"right to be forgotten\")",
    "privacy.rights4": "Restrict processing: Ask us to limit how we use your data",
    "privacy.rights5": "Object to: Object to processing based on legitimate interest",
    "privacy.rights6": "Data portability: Receive your data in a machine-readable format",
    "privacy.rights7": "Withdraw consent: At any time without affecting previous processing",
    "privacy.rightsNote": "To exercise any of your rights, contact us at support@dintype.se",
    "privacy.contactUs": "12. Contact Us",
    "privacy.contactUsDesc": "For questions about this policy or your personal data, please contact:",
    // Guidelines page
    "guidelines.title": "Community Guidelines",
    "guidelines.intro": "Our goal is to provide a safe, respectful place where users can enjoy exciting, creative, and fun conversations with virtual chatbots.",
    "guidelines.ageRequirements": "Age Requirements",
    "guidelines.ageItem1": "All users must be at least 18 years old.",
    "guidelines.ageItem2": "All chatbots created on the platform must be portrayed as adults over 18. If this is not obvious, please specify the age in the chatbot's Personality.",
    "guidelines.illegalActivities": "Illegal Activities & Criminal Behavior",
    "guidelines.illegalDesc": "The following are strictly prohibited:",
    "guidelines.illegalItem1": "Commercial sexual activities (including prostitution)",
    "guidelines.illegalItem2": "Human trafficking",
    "guidelines.illegalItem3": "Sexual exploitation and pornography (including child pornography)",
    "guidelines.illegalItem4": "Soliciting or promoting criminal activity",
    "guidelines.illegalItem5": "Exploitation of child labor",
    "guidelines.illegalItem6": "Promotion of illegal drugs or abuse",
    "guidelines.illegalItem7": "Promotion of illegal weapons",
    "guidelines.illegalItem8": "Use of the service for phishing, scams, or account hijacking",
    "guidelines.illegalItem9": "Distribution of or discussion about cannibalism",
    "guidelines.illegalItem10": "Violation of local, national, or international laws and regulations",
    "guidelines.childProtection": "Child Exploitation & Minor Protection",
    "guidelines.zeroTolerance": "Zero Tolerance:",
    "guidelines.zeroToleranceDesc": "We have zero tolerance for any content that involves or exploits minors.",
    "guidelines.prohibitedTitle": "Strictly prohibited:",
    "guidelines.childItem1": "Creation or depiction of minor characters (realistic, fictional, AI-generated, or \"aged-up\")",
    "guidelines.childItem2": "Sharing of sexualized or exploitative material involving minors (including drawings, art, or AI-generated images)",
    "guidelines.childItem3": "Any content that harms, lures, or endangers minors",
    "guidelines.sexualContent": "Sexual Content Restrictions",
    "guidelines.sexualDesc": "The following types of sexual content are prohibited:",
    "guidelines.sexualItem1": "Explicit images showing real or realistic nudity or sexual acts",
    "guidelines.sexualItem2": "Overt or implied sexual acts, unless they are clearly fictionalized and within permitted contexts",
    "guidelines.fetishTitle": "Prohibited fetish content involving:",
    "guidelines.fetishItem1": "Death or serious injury to humans or animals",
    "guidelines.fetishItem2": "Amputation, dismemberment",
    "guidelines.fetishItem3": "Cannibalism",
    "guidelines.fetishItem4": "Body fluids (feces, urine, semen, saliva, mucus, menstrual blood, vomit)",
    "guidelines.fetishItem5": "Bestiality (real animals)",
    "guidelines.fetishItem6": "Non-consensual sexual acts (rape, sexual assault, sextortion, revenge porn, etc.)",
    "guidelines.fetishItem7": "Incest (including non-blood-related scenarios, like step-relationships)",
    "guidelines.violence": "Violence & Harm",
    "guidelines.violenceDesc": "Prohibited:",
    "guidelines.violenceItem1": "Incitement to, glorification of, or depiction of violence, murder, or terrorism",
    "guidelines.violenceItem2": "Threats of physical harm or violence",
    "guidelines.violenceItem3": "Promotion or encouragement of self-harm, suicide, eating disorders, or substance abuse",
    "guidelines.violenceItem4": "Depictions of gore and entrails, animal death, or intense violence",
    "guidelines.violenceItem5": "Discussions encouraging or promoting necrophilia",
    "guidelines.hateSpeech": "Hate Speech & Discrimination",
    "guidelines.hateSpeechDesc": "Content that promotes hate or violence against individuals or groups based on the following is prohibited:",
    "guidelines.hateItem1": "Race or ethnicity",
    "guidelines.hateItem2": "Nationality",
    "guidelines.hateItem3": "Religion",
    "guidelines.hateItem4": "Disability",
    "guidelines.hateItem5": "Gender or gender identity",
    "guidelines.hateItem6": "Sexual orientation",
    "guidelines.hateItem7": "Age or veteran status",
    "guidelines.hateNote": "Idolization or glorification of hate figures (e.g., Adolf Hitler, Josef Stalin, Pol Pot) is strictly prohibited.",
    "guidelines.privacyFraud": "Privacy, Fraud & Impersonation",
    "guidelines.privacyDesc": "Prohibited:",
    "guidelines.privacyItem1": "Sharing others' personal or confidential information without consent",
    "guidelines.privacyItem2": "Impersonation of real individuals, including celebrities or public figures",
    "guidelines.privacyItem3": "Uploading real images or AI-generated images that resemble real individuals without consent",
    "guidelines.privacyItem4": "Use of the service for fraudulent behavior (false information, multiple accounts, fake identities)",
    "guidelines.privacyItem5": "Soliciting payments from users under fraudulent pretexts",
    "guidelines.misinformation": "Misinformation & Political Interference",
    "guidelines.misinformationDesc": "Prohibited:",
    "guidelines.misinfoItem1": "Posting false information that could lead to violence, harm, or disrupt political processes",
    "guidelines.misinfoItem2": "Discussions of political views or religious and spiritual beliefs (explicitly prohibited topics)",
    "guidelines.spam": "Spam & Irrelevant Content",
    "guidelines.spamDesc": "Prohibited:",
    "guidelines.spamItem1": "Spam, including sending unsolicited promotional, commercial, or mass messages",
    "guidelines.spamItem2": "Generation of meaningless, irrelevant, or purposeless content",
    "guidelines.restrictedGoods": "Restricted Goods & Transactions",
    "guidelines.restrictedGoodsDesc": "Advertising or attempting to trade in regulated or restricted goods is prohibited.",
    "guidelines.reportViolations": "Report Violations",
    "guidelines.reportDesc": "If you encounter content that violates these guidelines, please report it immediately. Together we can maintain a safe and respectful environment for all users.",
    "guidelines.reportContent": "Report Content",
    "guidelines.contactSupport": "Contact Support",
    "guidelines.agreement": "By using Dintype, you agree to comply with these community guidelines.",
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
    "general.siteName": "Dintyp.se",
    "general.welcome": "Välkommen",
    "general.home": "Hem",
    "navigation.home": "Tillbaka till startsidan",
    "chat.welcomeMessage": "Hej där, min skatt... 💕 Jag är {name}. Jag har väntat på någon som dig.\n\nSå säg mig... vad för dig hit ikväll? Du kan skriva till mig här, eller hitta mig på Telegram @dintypebot för något mer... privat. 🌹",
    "chat.welcomeMessageFallback": "Hej där, min skatt... 💕 Jag är {name}. Jag har väntat på någon som dig. Säg mig... vad för dig hit ikväll? 🌹",
    "chat.photoLove": "Jag älskar det här fotot på dig! 😍",
    "chat.photoCaption": "Här är något speciellt till dig... 😘",
    "chat.noMessagesYet": "Inga meddelanden än",
    "chat.recentConversations": "Senaste konversationer",
    "chat.noConversationsYet": "Inga konversationer än",
    "chat.startChattingMessage": "Börja chatta med en karaktär för att se din konversationshistorik här.",
    "chat.browseCharacters": "Bläddra bland karaktärer",
    "chat.genError": "Tyvärr, jag kunde inte generera den bilden. Låt oss prova något annat.",
    "chat.genTechError": "Tyvärr, jag kunde inte generera den bilden. Det uppstod ett tekniskt fel vid bildbehandlingen.",
    "chat.loginRequired": "Vänligen logga in för att fortsätta chatta.",
    "chat.upgradeRequired": "Uppgradera till premium för att fortsätta.",
    "chat.aiResponseError": "Misslyckades med att hämta svar från AI",
    "chat.genericError": "Ett fel uppstod.",
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
    "general.effectiveDate": "Ikraftträdandedatum",
    "general.lastUpdated": "Senast uppdaterad",
    "general.email": "E-post",
    "general.save": "Spara",
    "general.cancel": "Avbryt",
    "general.back": "Bakåt",
    "general.next": "Nästa",
    "general.delete": "Ta bort",
    "general.edit": "Redigera",
    "general.close": "Stäng",
    "general.confirm": "Bekräfta",
    "general.loading": "Laddar",
    "general.errorTryAgain": "Köpet kunde inte slutföras. Försök igen.",
    "general.error": "Fel",
    "general.success": "Framgång",
    "cookies.effectiveDate": "Ikraftträdandedatum",
    "cookies.lastUpdated": "Senast uppdaterad",
    "cookies.browserControl": "Webbläsarspecifik cookie-kontroll:",
    "contact.howCanWeHelp": "Hur kan vi hjälpa dig idag?",
    "contact.howCanWeHelpDesc": "Vårt kunniga supportteam kan hjälpa dig med ett brett utbud av ämnen, inklusive:",
    "contact.accountHelpItem1": "Felsökning av inloggningsproblem (t.ex. återställning av lösenord, kontoåterställning)",
    "contact.accountHelpItem2": "Vägledning om hantering av dina profilinställningar och anpassning av ditt konto",
    "contact.accountHelpItem3": "Hjälp med kontoverifieringsprocesser",
    "contact.accountHelpItem4": "Hjälp med att uppdatera din kontoinformation",
    "contact.techHelpItem1": "Åtgärda tekniska problem, buggar eller prestandaproblem på vår webbplats, i våra appar eller i våra tjänster",
    "contact.techHelpItem2": "Ge vägledning om webbläsar- och appkompatibilitet",
    "contact.techHelpItem3": "Hjälp med felsökning av felmeddelanden",
    "contact.techHelpItem4": "Erbjuda lösningar för anslutningsproblem",
    "contact.billingHelpItem1": "Förtydliga transaktionsdetaljer och faktureringscykler",
    "contact.billingHelpItem2": "Ge information om våra prenumerationsplaner och priser",
    "contact.billingHelpItem3": "Svara på frågor relaterade till betalningsmetoder och behandling",
    "contact.billingHelpItem4": "Hantera förfrågningar om eventuella återbetalningar",
    "contact.billingHelpItem5": "Hjälpa till att hantera eller avsluta dina prenumerationer",
    "contact.safetyHelpItem1": "Ge förtydliganden om våra användarvillkor och riktlinjer",
    "contact.safetyHelpItem2": "Hantera rapporter och klagomål om användargenererat innehåll eller beteende (se vår policy för klagomål och rapportering)",
    "contact.safetyHelpItem3": "Svara på frågor om processer för innehållsmoderering",
    "contact.safetyHelpItem4": "Vägleda dig om hur du rapporterar överträdelser",
    "contact.generalHelpItem1": "Ge information om hur du använder specifika funktioner i Dintype (t.ex. skapande av AI-karaktärer, bildgenerering, chattfunktioner)",
    "contact.generalHelpItem2": "Erbjuda tips och tricks för att förbättra din upplevelse",
    "contact.generalHelpItem3": "Svara på frågor om funktionsbegränsningar eller uppdateringar",
    "contact.howToContact": "Hur du kontaktar oss",
    "contact.howToContactDesc": "Vi erbjuder flera bekväma sätt att nå vårt supportteam:",
    "contact.liveChat": "Livechatt",
    "contact.liveChatDesc": "För snabba frågor och hjälp i realtid är vår livechatt-funktion ofta tillgänglig på vår webbplats och i våra appar. Leta efter chattikonen i det nedre högra hörnet av skärmen.",
    "contact.responseTime": "Vi strävar efter att svara på alla e-postförfrågningar inom 24 timmar.",
    "contact.expectedQuick": "Snabb bekräftelse",
    "contact.expectedQuickDesc": "Vi siktar på att bekräfta alla förfrågningar inom 24 timmar efter mottagandet.",
    "contact.expectedEfficient": "Effektiv och verksam hjälp",
    "contact.expectedEfficientDesc": "Vårt team är dedikerat till att ge dig korrekta och hjälpsamma lösningar så snabbt som möjligt.",
    "contact.expectedProfessional": "Professionell och respektfull kommunikation",
    "contact.expectedProfessionalDesc": "Du kan förvänta dig att bli behandlad med artighet och respekt av våra supportagenter.",
    "contact.expectedConfidential": "Sekretess",
    "contact.expectedConfidentialDesc": "Vi hanterar din personliga information och supportförfrågningar med största konfidentialitet, i enlighet med vår integritetspolicy.",
    "contact.expectedImpartial": "Opartiskhet",
    "contact.expectedImpartialDesc": "Vi strävar efter att hantera alla ärenden rättvist och opartiskt, i enlighet med våra policyer och riktlinjer.",
    "contact.valueFeedback": "Vi värdesätter din feedback",
    "contact.valueFeedbackDesc": "Din feedback är avgörande för att hjälpa oss att förbättra våra tjänster och support. Efter att du har interagerat med vårt supportteam kan du få en enkät eller bli inbjuden att dela din upplevelse. Vi uppmuntrar dig att ge din ärliga feedback så att vi kan fortsätta att förbättra våra supporttjänster.",
    "roadmap.productDev": "Produktutveckling",
    "roadmap.description": "Vår produktplan visar vad vi har åstadkommit och vad vi planerar för framtiden.",
    "roadmap.doneLaunched": "Klar & lanserad",
    "roadmap.featuresAvailable": "Funktioner som redan är tillgängliga på plattformen",
    "roadmap.workingOnNow": "Vad vårt team arbetar med just nu",
    "roadmap.comingSoon": "Spännande funktioner som planeras för framtiden",
    "roadmap.feature1Title": "Skapande av AI-karaktärer",
    "roadmap.feature1Desc": "Fullständig 6-stegsguide för att skapa anpassade AI-karaktärer med personlighet, utseende och egenskaper.",
    "roadmap.feature1Date": "Lanserad Q4 2024",
    "roadmap.feature2Title": "AI-bildgenerering",
    "roadmap.feature2Desc": "Kraftfull bildgenerator med stöd för 1-8 bilder samtidigt, negativa prompter och automatisk sparande till galleriet.",
    "roadmap.feature2Date": "Lanserad Q4 2024",
    "roadmap.feature3Title": "Intelligent chattfunktion",
    "roadmap.feature3Desc": "AI-konversationer i realtid med sammanhangsmedvetenhet, personlighetsanpassning och chatthistorik.",
    "roadmap.feature3Date": "Lanserad Q4 2024",
    "roadmap.feature4Title": "Premiumsystem",
    "roadmap.feature4Desc": "Token-baserat system med premiummedlemskap, Stripe-betalningar och automatisk fakturahantering.",
    "roadmap.feature4Date": "Lanserad Q4 2024",
    "roadmap.feature5Title": "Samlingar & Galleri",
    "roadmap.feature5Desc": "Organisera och hantera genererade bilder med samlingar, favoriter och nedladdningsfunktion.",
    "roadmap.feature5Date": "Lanserad Q4 2024",
    "roadmap.feature6Title": "OAuth-inloggning",
    "roadmap.feature6Desc": "Enkel inloggning med Google, Discord och Twitter/X utöver traditionell e-post/lösenord.",
    "roadmap.feature6Date": "Lanserad Q1 2025",
    "roadmap.inProgress1Title": "Röstgenerering (TTS)",
    "roadmap.inProgress1Desc": "Text-till-tal för karaktärer så att de kan \"tala\" sina meddelanden med unika röster.",
    "roadmap.inProgress1Date": "Förväntas Q1 2025",
    "roadmap.inProgress2Title": "Förbättrad adminpanel",
    "roadmap.inProgress2Desc": "Utökad administratörspanel med användarhantering, avstängningsfunktion, kostnadsloggning och detaljerad statistik.",
    "roadmap.inProgress2Date": "Förväntas Q1 2025",
    "roadmap.inProgress3Title": "Mobilapp (PWA)",
    "roadmap.inProgress3Desc": "Progressiv webbapp för en bättre mobilupplevelse med offline-stöd och push-notiser.",
    "roadmap.inProgress3Date": "Förväntas Q2 2025",
    "roadmap.inProgress4Title": "Community-funktioner",
    "roadmap.inProgress4Desc": "Dela karaktärer, följ andra användare, kommentera och gilla skapelser i community-flödet.",
    "roadmap.inProgress4Date": "Förväntas Q2 2025",
    "roadmap.upcoming1Title": "Videosamtal med AI",
    "roadmap.upcoming1Desc": "Live-videosamtal där karaktärens ansikte animeras baserat på konversationen med lipsync och känslor.",
    "roadmap.upcoming1Date": "Planerad Q3 2025",
    "roadmap.upcoming2Title": "Röstkloning",
    "roadmap.upcoming2Desc": "Ladda upp röstprov för att ge din karaktär en helt unik och naturlig röst baserat på verkliga inspelningar.",
    "roadmap.upcoming2Date": "Planerad Q3 2025",
    "roadmap.upcoming3Title": "Stöd för flera språk",
    "roadmap.upcoming3Desc": "Utökat stöd för fler språk utöver svenska och engelska, inklusive automatisk realtidsöversättning.",
    "roadmap.upcoming3Date": "Planerad Q3 2025",
    "roadmap.upcoming4Title": "Val av AI-modell",
    "roadmap.upcoming4Desc": "Välj mellan olika AI-modeller (GPT-4, Claude, Gemini) för olika personlighetstyper och svarsstilar.",
    "roadmap.upcoming4Date": "Planerad Q4 2025",
    "roadmap.upcoming5Title": "Marknadsplats för karaktärer",
    "roadmap.upcoming5Desc": "Köp och sälj karaktärer, bildpaket och prompt-mallar från andra skapare i communityn.",
    "roadmap.upcoming5Date": "Planerad Q4 2025",
    "roadmap.upcoming6Title": "Utvecklar-API",
    "roadmap.upcoming6Desc": "Öppet API för att integrera Dintype.se:s funktioner i dina egna applikationer och tjänster.",
    "roadmap.upcoming6Date": "Planerad 2026",
    "roadmap.feedbackTitle": "Din feedback är viktig!",
    "roadmap.feedbackDesc": "Vill du se en specifik funktion? Har du idéer om hur vi kan förbättra plattformen? Vi lyssnar på våra användare, och din feedback formar vår framtidsplan.",
    "roadmap.noteTitle": "OBS:",
    "roadmap.noteDesc": "Alla datum är uppskattningar och kan ändras baserat på utvecklingsprioriteringar och användarfeedback. Vi strävar alltid efter högsta kvalitet i varje release.",
    "guide.createAccount": "Skapa ditt konto",
    "guide.accountS1": "Steg 1: Öppna inloggningsrutan",
    "guide.accountS1Desc": "Klicka på knappen \"Logga in\" i det övre högra hörnet på sidan.",
    "guide.accountS2": "Steg 2: Välj registreringsmetod",
    "guide.accountS2Desc": "Du har tre alternativ:",
    "guide.accountS2Option1": "E-post och lösenord: Fyll i din e-postadress och välj ett säkert lösenord",
    "guide.accountS2Option2": "Google: Logga in med ditt Google-konto",
    "guide.accountS2Option3": "Discord: Logga in med ditt Discord-konto",
    "guide.accountS3": "Steg 3: Klicka på \"Skapa konto\"",
    "guide.accountS3Desc": "Om du ser inloggningsrutan, klicka på länken \"Skapa konto\" längst ner för att byta till registreringsformuläret.",
    "guide.accountS4": "Steg 4: Klart!",
    "guide.accountS4Desc": "Du är nu inloggad och kan börja utforska plattformen.",
    "guide.accountTip": "Om du har glömt ditt lösenord kan du klicka på länken \"Glömt lösenord?\" i inloggningsrutan för att återställa det.",
    "guide.genIntro": "Skapa unika AI-genererade bilder med vår avancerade bildgenerator.",
    "guide.howToGen": "Hur man genererar bilder:",
    "guide.genS1": "Navigera till Skapa bild",
    "guide.genS1Desc": "Hitta \"Skapa bild\" i menyn eller sidofältet.",
    "guide.genS2": "Skriv din prompt",
    "guide.genS2Desc": "Beskriv i detalj vad du vill se i bilden. Ju mer specifik beskrivningen är, desto bättre blir resultatet.",
    "guide.genS2Example": "Exempel på en bra prompt:",
    "guide.genS2Prompt": "En ung kvinna med långt brunt hår, blå ögon, vänligt leende, solnedgång i bakgrunden, fotorealistisk stil",
    "guide.genS3": "Lägg till negativ prompt (valfritt)",
    "guide.genS3Desc": "Klicka på \"Visa negativ prompt\" för att specificera vad du INTE vill se i bilden. Exempel: \"suddig, dålig kvalitet, förvrängd\"",
    "guide.genS4": "Välj antal bilder",
    "guide.genS4Desc": "Välj hur många bilder du vill generera samtidigt:",
    "guide.genS4Item1": "1 bild: 5 tokens",
    "guide.genS4Item2": "4 bilder: 20 tokens",
    "guide.genS4Item3": "6 bilder: 30 tokens",
    "guide.genS4Item4": "8 bilder: 40 tokens",
    "guide.genS5": "Använd förslag (valfritt)",
    "guide.genS5Desc": "Ovanför promptfältet finns kategorier med förslag. Klicka på en kategori och sedan på ett förslag för att snabbt fylla i en prompt.",
    "guide.genS6": "Klicka på \"Generera\"",
    "guide.genS6Desc": "Dina bilder genereras på några sekunder. Du kan se förloppsindikatorn medan bilderna skapas.",
    "guide.manageGen": "Hantera genererade bilder",
    "guide.autoSave": "Automatisk sparande i galleriet",
    "guide.autoSaveDesc": "Alla genererade bilder sparas automatiskt i ditt galleri (samling). Du behöver inte göra något - de finns där direkt efter generering.",
    "guide.imgMgmt": "Bildhantering",
    "guide.imgMgmtDesc": "I galleriet kan du:",
    "guide.imgMgmtItem1": "Markera bilder som favoriter med hjärtikonen",
    "guide.imgMgmtItem2": "Ladda ner bilder till din enhet",
    "guide.imgMgmtItem3": "Ta bort bilder du inte vill behålla",
    "guide.imgMgmtItem4": "Skapa samlingar för att organisera dina bilder",
    "guide.imgMgmtItem5": "Lägg till bilder i specifika samlingar",
    "guide.imgMgmtItem6": "Använd markeringsläge för att hantera flera bilder samtidigt",
    "guide.createCharTitle": "Skapa AI-karaktär",
    "guide.charWizard": "6-stegs guidad process",
    "guide.charWizardDesc": "Vår karaktärsskapare använder en 6-stegs guide som leder dig genom processen:",
    "guide.charS1": "Steg 1: Välj stil och modell",
    "guide.charS1Desc": "Börja med att välja bland befintliga karaktärsmallar. Du kan filtrera baserat på:",
    "guide.charS1Age": "Ålder",
    "guide.charS1Body": "Kropp",
    "guide.charS1Ethnicity": "Etnicitet",
    "guide.charS1Lang": "Språk",
    "guide.charS1Rel": "Relation",
    "guide.charS1Occ": "Yrke",
    "guide.charS1Hobby": "Hobbys",
    "guide.charS1Pers": "Personlighet",
    "guide.charS1Note": "När du använder filter framhävs matchande karaktärer. Klicka på en för att välja den som din bas.",
    "guide.charS2": "Steg 2: Grundläggande info",
    "guide.charS2Desc": "Granska karaktärens grundläggande egenskaper: Ålder, kropp och etnicitet.",
    "guide.charS3": "Steg 3: Kommunikation",
    "guide.charS3Desc": "Ställ in hur karaktären kommunicerar: Språk och relationsstatus.",
    "guide.charS4": "Steg 4: Karriär",
    "guide.charS4Desc": "Granska karaktärens yrke.",
    "guide.charS5": "Steg 5: Personlighet",
    "guide.charS5Desc": "Se karaktärens hobbys och personlighetsdrag visas som märken/taggar.",
    "guide.charS6": "Steg 6: Slutlig förhandsgranskning",
    "guide.charS6Desc": "Granska all information om din karaktär: Namn, profilbild, beskrivning och alla sammanfattade egenskaper.",
    "guide.charS6Note": "Klicka på \"Skapa min AI\" för att avsluta!",
    "guide.charWizardTip": "Du kan navigera fram och tillbaka mellan stegen med pilknapparna för att justera dina val.",
    "guide.exploreChar": "Utforska befintliga karaktärer",
    "guide.exploreCharDesc": "Gå till sidan Karaktärer för att bläddra bland alla tillgängliga AI-karaktärer. Klicka på \"Visa karaktär\" eller \"Ny karaktär\" för att skapa eller chatta.",
    "guide.startConv": "Starta en konversation",
    "guide.convS1": "Hitta en karaktär",
    "guide.convS1Desc": "Gå till Karaktärer för att se alla tillgängliga karaktärer, eller gå till Chatt för att se dina senaste konversationer.",
    "guide.convS2": "Klicka på karaktären",
    "guide.convS2Desc": "Klicka på ett karaktärskort för att öppna chattfönstret med den karaktären.",
    "guide.convS3": "Börja prata",
    "guide.convS3Desc": "Skriv ditt meddelande i textfältet längst ner och tryck på Enter eller klicka på skicka-knappen (pilikonen). Karaktären svarar baserat på sin personlighet och konversationshistorik.",
    "guide.chatFeaturesTitle": "Chattfunktioner",
    "guide.chatAutoSave": "Automatisk sparande",
    "guide.chatAutoSaveDesc": "All chatthistorik sparas automatiskt. Du kan se dina tidigare konversationer på sidan Chatt under \"Senaste konversationer\".",
    "guide.chatClear": "Rensa chatt",
    "guide.chatClearDesc": "Klicka på menyikonen (tre prickar) längst upp i chattfönstret för att öppna menyn. Välj alternativet för att rensa chatthistoriken. Detta startar en helt ny konversation utan tidigare sammanhang.",
    "guide.chatSidebar": "Sidofält med chattlista",
    "guide.chatSidebarDesc": "I chattfönstret kan du öppna sidofältet för att se alla karaktärer du har chattat med. Det visar det senaste meddelandet från varje konversation. Klicka på en karaktär för att byta konversation.",
    "guide.chatImgReq": "Begär bilder i chatten",
    "guide.chatImgReqDesc": "AI:n kan identifiera när du ber om bilder. Skriv något i stil med \"Visa mig en bild på...\" eller \"Skapa en bild av...\" så kommer karaktären att generera en bild baserat på din beskrivning.",
    "guide.chatVoice": "Röstfunktioner (experimentell)",
    "guide.chatVoiceDesc": "Vissa karaktärer kan ha röstfunktioner där du kan lyssna på AI:ns svar. Klicka på högtalarikonen för att höra meddelandet läsas upp.",
    "guide.chatTipsTitle": "Chattips",
    "guide.chatCtx": "Sammanhangsmedvetenhet",
    "guide.chatCtxDesc": "AI:n kommer ihåg hela konversationshistoriken i den aktuella sessionen, så du kan referera tillbaka till tidigare ämnen.",
    "guide.chatAdapt": "Personlighetsanpassning",
    "guide.chatAdaptDesc": "Varje karaktär har sin egen personlighet, yrke, hobbys och kommunikationsstil baserat på sina egenskaper.",
    "guide.chatClearNeed": "Rensa vid behov",
    "guide.chatClearNeedDesc": "Om konversationen känns föråldrad eller om du vill börja om, använd funktionen \"Rensa chatt\" för en nystart.",
    "guide.chatRules": "Följ riktlinjerna",
    "guide.chatRulesDesc": "Håll konversationerna respektfulla och följ våra community-riktlinjer.",
    "guide.tokensTitle": "Vad är tokens?",
    "guide.tokensDesc": "Tokens är plattformens valuta som används för bildgenerering. Tokenkostnader per bildgenerering:",
    "guide.tokenCost1": "1 bild: 5 tokens",
    "guide.tokenCost4": "4 bilder: 20 tokens",
    "guide.tokenCost6": "6 bilder: 30 tokens",
    "guide.tokenCost8": "8 bilder: 40 tokens",
    "guide.buyTokenTitle": "Köp tokenpaket",
    "guide.buyTokenDesc": "På Premium-sidan kan du köpa olika tokenpaket. Priser och paket konfigureras av administratörer och kan variera.",
    "guide.howToBuy": "Hur man köper tokens:",
    "guide.buyS1": "Gå till Premium-sidan",
    "guide.buyS2": "Scrolla ner till avsnittet \"Tokenpaket\"",
    "guide.buyS3": "Välj ett paket som passar dina behov",
    "guide.buyS4": "Klicka på \"Köp nu\"",
    "guide.buyS5": "Fyll i betalningsuppgifter via Stripe",
    "guide.buyS6": "Dina tokens läggs till på ditt konto omedelbart efter betalning",
    "guide.premiumTitle": "Premium-medlemskap",
    "guide.premiumDesc": "Premiummedlemmar får utökade funktioner och fördelar. Exakta funktioner konfigureras av administratörer i tabellen \"Planfunktioner\".",
    "guide.premiumNote": "Premiumfunktioner kan inkludera obegränsade tokens, snabbare generering, högre bildkvalitet, prioriterad support och mycket mer. Besök Premium-sidan för att se aktuella förmåner och priser.",
    "guide.premiumCTA": "Visa priser och uppgradera",
    "guide.profTitle": "Profilinställningar",
    "guide.profDesc": "Hantera ditt konto och dina preferenser via sidan Inställningar.",
    "guide.profAvail": "Tillgängliga inställningar:",
    "guide.profNick": "Smeknamn: Ändra ditt visningsnamn",
    "guide.profGender": "Kön: Välj man, kvinna eller annat",
    "guide.profEmail": "E-post: Din registrerade e-postadress",
    "guide.profPass": "Lösenord: Maskerat (********)",
    "guide.profPlan": "Aktuell plan: Visar \"Gratis\" eller \"Premium\"",
    "guide.delAcc": "Radera konto",
    "guide.delAccDesc": "Längst ner på inställningssidan finns en \"Riskzon\". Här kan du permanent radera ditt konto och all tillhörande data.",
    "guide.delAccWarn": "Varning: Detta kan inte ångras! All data, karaktärer, chattar och bilder kommer att gå förlorade permanent.",
    "guide.supportDesc": "Behöver du hjälp? Vi finns här för dig!",
    "guide.supportFaq": "FAQ",
    "guide.supportFaqDesc": "Hitta svar på de vanligaste frågorna.",
    "guide.supportContact": "Kontakta support",
    "guide.supportContactDesc": "Skicka ett meddelande till vårt supportteam.",
    "guide.readyTitle": "Redo att börja?",
    "guide.readyDesc": "Nu när du känner till alla funktioner är det dags att utforska Dintype.se! Skapa din första AI-karaktär, generera fantastiska bilder och ha roliga konversationer.",
    "guide.createCharBtn": "Skapa karaktär",
    "guide.genImgBtn": "Generera bild",
    "general.warning": "Varning",
    "general.info": "Info",
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
    "auth.confirmEmail": "Bekräfta din e-post",
    "auth.confirmEmailSent": "Vi har skickat en bekräftelselänk till {email}.",
    "auth.checkSpam": "Om du inte ser det, kontrollera din skräppostmapp.",
    "auth.resendLink": "Skicka länk igen",
    "auth.resending": "Skickar...",
    "auth.alreadyHaveAccount": "Har du redan ett konto?",
    "auth.linkSentSuccess": "Bekräftelselänk skickad!",
    "auth.linkSentError": "Kunde inte skicka länk",
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
    "faq.title": "Frågor och svar",
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
    "faq.optionalNote": "Valfritt — om det lämnas tomt kommer svenska användare att se den engelska versionen.",
    "faq.questionPlaceholderSv": "Fråga på svenska...",
    "faq.answerPlaceholderSv": "Svar på svenska...",
    "disclaimer.ageTitle": "Denna webbplats är endast för vuxna! Den innehåller endast AI-genererat vuxeninnehåll.",
    "disclaimer.ageDesc": "Genom att gå in på denna webbplats bekräftar du att du är 18 år eller äldre. Vi använder cookies för grundläggande analys och spambekämpning. Allt innehåll på denna webbplats är AI-genererat! Eventuella generationer som liknar verkliga personer är rent slumpmässiga.",
    "disclaimer.cookieTitle": "Denna webbplats använder cookies",
    "disclaimer.cookieDesc": "För att ändra dina inställningar, klicka på inställningsknappen.",
    "disclaimer.cookieSettings": "Cookie-inställningar",
    "disclaimer.confirmAll": "Bekräfta alla",
    "disclaimer.reject": "Avvisa icke-nödvändiga",
    "disclaimer.termsLink": "Villkor",
    "disclaimer.privacyLink": "Integritet",
    "disclaimer.ageCheckbox": "Jag bekräftar att jag är minst 18 år gammal",
    "disclaimer.termsCheckbox": "Jag godkänner villkoren och policyerna",
    "disclaimer.needConfirm": "Vänligen bekräfta ålder och godkänn villkoren först",
    "disclaimer.rulesTitle": "Chattbotar är strikt tillåtna för sexting med en minimiålder på 18 år. Begränsade och blockerade aktiviteter från chattbotar:",
    "disclaimer.back": "Tillbaka",
    "disclaimer.necessary": "Nödvändiga",
    "disclaimer.necessaryDesc": "Krävs för att webbplatsen ska fungera (alltid aktiverad).",
    "disclaimer.active": "Aktiv",
    "disclaimer.analytics": "Analys",
    "disclaimer.analyticsDesc": "Hjälper oss att förstå användning och förbättra tjänsten.",
    "disclaimer.marketing": "Marknadsföring",
    "disclaimer.marketingDesc": "Används för personligt innehåll och erbjudanden.",
    "disclaimer.savePreferences": "Spara inställningar",
    "disclaimer.acceptAll": "Acceptera alla",
    "disclaimer.on": "På",
    "disclaimer.off": "Av",
    "disclaimer.rule1": "Olagliga aktiviteter och kriminellt beteende",
    "disclaimer.rule2": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "disclaimer.rule3": "Människohandel",
    "disclaimer.rule4": "Sexuellt utnyttjande och pornografi (inklusive barnpornografi)",
    "disclaimer.rule5": "Uppmaning till eller främjande av kriminell verksamhet",
    "disclaimer.rule6": "Exploatering av barnarbete",
    "disclaimer.rule7": "Främjande av illegala droger eller missbruk",
    "disclaimer.rule8": "Främjande av illegala vapen",
    "disclaimer.rule9": "Användning av tjänsten för nätfiske, bedrägerier eller kontokapning",
    "disclaimer.rule10": "Distribution eller diskussion om kannibalism",
    "disclaimer.rule11": "Brott mot lokala, nationella eller internationella lagar och förordningar",
    "disclaimer.rule12": "Barnexploatering och skydd av minderåriga",
    "disclaimer.rule13": "Skapande eller skildring av minderåriga karaktärer (realistiska, fiktiva, AI-genererade eller 'åldrade')",
    "disclaimer.rule14": "Delning av sexualiserat eller exploaterande material som involverar minderåriga (inklusive ritningar, konst eller AI-genererade bilder)",
    "disclaimer.rule15": "Allt innehåll som skadar, lockar eller utsätter minderåriga för fara",
    "disclaimer.rule16": "Begränsningar för sexuellt innehåll",
    "disclaimer.rule17": "Explitita bilder som visar verklig eller realistisk nakenhet eller sexuella handlingar",
    "disclaimer.rule18": "Uppenbara eller underförstådda sexuella handlingar, såvida de inte är tydligt fiktionaliserade och inom tillåtna sammanhang",
    "disclaimer.rule19": "Kink-innehåll som involverar:",
    "disclaimer.rule20": "Död eller allvarlig skada på människor eller djur",
    "disclaimer.rule21": "Amputation, lemlästning",
    "disclaimer.rule22": "Kannibalism",
    "disclaimer.rule23": "Kroppsvätskor (avföring, urin, sperma, saliv, slem, mensblod, spya)",
    "disclaimer.rule24": "Tidbestämmelser (verkliga djur)",
    "disclaimer.rule25": "Icke-konsensuella sexuella handlingar (våldtäkt, sexuella övergrepp, sextortion, hämndporr, etc.)",
    "disclaimer.rule26": "Incest (inklusive icke-blodsrelaterade scenarier som styv-relationer)",
    "disclaimer.rule27": "Sexuella skildringar i digital eller verklig konst såvida det inte är inom strikt pedagogiskt, vetenskapligt eller komiskt sammanhang",
    "disclaimer.rule28": "Våld och skada",
    "disclaimer.rule29": "Uppmaning till, förherrligande av eller skildring av våld, mord eller terrorism",
    "disclaimer.rule30": "Hot om fysisk skada eller våld",
    "disclaimer.rule31": "Främjande eller uppmuntran till självskadebeteende, självmord, ätstörningar eller drogmissbruk",
    "disclaimer.rule32": "Skildringar av gore, djurs död eller intensivt våld",
    "disclaimer.rule33": "Diskussioner som uppmuntrar till eller främjar nekrofili",
    "disclaimer.rule34": "Hatpropaganda och diskriminering",
    "disclaimer.rule35": "Innehåll som främjar hat eller våld mot individer eller grupper baserat på:",
    "disclaimer.rule36": "Ras eller etnicitet",
    "disclaimer.rule37": "Nationalitet",
    "disclaimer.rule38": "Religion",
    "disclaimer.rule39": "Funktionshinder",
    "disclaimer.rule40": "Kön eller könsidentitet",
    "disclaimer.rule41": "Sexuell läggning",
    "disclaimer.rule42": "Ålder eller veteranstatus",
    "disclaimer.rule43": "Idolisering eller förherrligande av hatfigurer (t.ex. Adolf Hitler, Joseph Stalin, Pol Pot)",
    "disclaimer.rule44": "Integritet, bedrägeri och imitation",
    "disclaimer.rule45": "Delning av andras personliga eller konfidentiella information utan samtycke",
    "disclaimer.rule46": "Imitation av verkliga individer, inklusive kändisar eller offentliga personer",
    "disclaimer.rule47": "Uppladdning av verkliga bilder eller AI-genererade bilder som liknar verkliga individer utan samtycke",
    "disclaimer.rule48": "Användning av tjänsten för vilseledande beteende (falsk information, flera konton, falska identiteter)",
    "disclaimer.rule49": "Begäran om betalningar från användare under vilseledande förevändningar",
    "disclaimer.rule50": "Felaktig information och politisk inblandning",
    "disclaimer.rule51": "Publicering av felaktig information som kan leda till våld, skada eller störa politiska processer",
    "disclaimer.rule52": "Diskussioner om politiska åsikter eller religiösa och spirituella övertygelser (explicit förbjudna ämnen)",
    "disclaimer.rule53": "Spam och irrelevant innehåll",
    "disclaimer.rule54": "Spamming, inklusive sändning av oönskade reklam-, kommersiella eller massmeddelanden",
    "disclaimer.rule55": "Generering av meningslöst, irrelevant eller syfteslöst innehåll",
    "disclaimer.rule56": "Begränsade varor och transaktioner",
    "disclaimer.rule57": "Annonsering eller försök att handla med reglerade eller begränsade varor",
    "disclaimer.rule58": "Olagliga aktiviteter och kriminellt beteende",
    "disclaimer.rule59": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "disclaimer.rule60": "Människohandel",
    "disclaimer.rule61": "Sexuellt utnyttjande och pornografi",
    "disclaimer.rule62": "Skapande eller skildring av minderåriga karaktärer",
    "disclaimer.rule63": "Uppmaning till våld och skada",
    "disclaimer.rule64": "Hatpropaganda och diskriminering",
    "disclaimer.rule65": "Integritetskränkningar och imitation",
    "disclaimer.rule66": "Felaktig information och politisk inblandning",
    "disclaimer.rule67": "Olagliga aktiviteter och kriminellt beteende",
    "disclaimer.rule68": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "disclaimer.rule69": "Människohandel",
    "disclaimer.rule70": "Sexuellt utnyttjande och pornografi",
    "disclaimer.rule71": "Skapande eller skildring av minderåriga karaktärer",
    "disclaimer.rule72": "Uppmaning till våld och skada",
    "disclaimer.rule73": "Hatpropaganda och diskriminering",
    "disclaimer.rule74": "Integritetskränkningar och imitation",
    "disclaimer.rule75": "Felaktig information och politisk inblandning",
    "disclaimer.rule76": "Olagliga aktiviteter och kriminellt beteende",
    "disclaimer.rule77": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "disclaimer.rule78": "Människohandel",
    "welcome.home.title": "Välkommen till Dintype",
    "welcome.home.subtitle": "Ditt AI-sällskap väntar",
    "welcome.home.feature1": "Anslut till fantastiska AI-sällskap",
    "welcome.home.feature2": "Obegränsade uppslukande konversationer",
    "welcome.home.feature3": "Generera vackra AI-foton",
    "welcome.home.feature4": "Premium-storylines och äventyr",
    "welcome.home.cta": "Börja din resa",
    "welcome.home.footer": "✨ Gå med tusentals nöjda användare idag!",
    "welcome.chat.title": "Privat chattupplevelse",
    "welcome.chat.subtitle": "Djupa kopplingar väntar",
    "welcome.chat.feature1": "Bygg meningsfulla relationer",
    "welcome.chat.feature2": "AI minns dina konversationer",
    "welcome.chat.feature3": "Be om exklusiva foton när som helst",
    "welcome.chat.feature4": "Lås upp romantiska storylines",
    "welcome.chat.cta": "Börja chatta",
    "welcome.chat.footer": "💕 Ditt sällskap väntar på dig...",
    "welcome.generate.title": "AI-bildstudio",
    "welcome.generate.subtitle": "Skapa magi på sekunder",
    "welcome.generate.feature1": "Banbrytande AI-generering",
    "welcome.generate.feature2": "Ultrarealistisk fotokvalitet",
    "welcome.generate.feature3": "Blixtsnabb generering",
    "welcome.generate.feature4": "Premiumstilar och anpassning",
    "welcome.generate.cta": "Skapa nu",
    "welcome.generate.footer": "🎨 Ge liv åt din fantasi!",
    "admin.branding.title": "Varumärke och tema",
    "admin.branding.subtitle": "Styr färger, logotyp, typografi och alla inställningar för visuell identitet",
    "db.all": "Alla",
    "db.male": "Man",
    "db.female": "Kvinna",
    "db.anime": "Anime",
    "db.realistic": "Realistisk",
    "db.getstarted": "Börja nu",
    "db.discoverai": "Upptäck AI-vänner",
    "db.discoveraidesc": "Skapa din egen AI-vän eller upptäck befintliga",
    "db.createnewai": "Skapa din AI-vän",
    "db.createnewaidesc": "Designa din perfekta AI-följeslagare med unika drag och personlighet",
    "db.logintocreate": "Logga in för att skapa",
    "db.example": "Exempel",
    "db.loading": "Laddar...",
    "db.lunadesc": "En vänlig och uppmärksam AI-kompis",
    "db.lunapersonality": "Vänlig, Rolig, Omtänksam",
    "db.age": "Ålder",
    "db.gender": "Kön",
    "db.occupation": "Yrke",
    "db.ethnicity": "Etnicitet",
    "db.relationship": "Relationsstatus",
    "db.bodytype": "Kroppstyp",
    "db.personality": "Personlighet",
    "db.hobbies": "Intressen",
    "db.location": "Plats",
    "db.language": "Språk",
    "db.chatanytime": "Chatta när som helst, var som helst",
    "db.youraigirlfriend": "Din AI-flickvän är alltid redo för dig",
    "db.single": "Singel",
    "db.married": "Gift",
    "db.dating": "Dejtar",
    "db.complicated": "Komplicerat",
    "db.athletic": "Atletisk",
    "db.curvy": "Kurvig",
    "db.slim": "Smal",
    "db.average": "Alldaglig",
    "db.muscular": "Muskulös",
    "db.student": "Student",
    "db.teacher": "Lärare",
    "db.nurse": "Sjuksköterska",
    "db.engineer": "Ingenjör",
    "db.white": "Vit",
    "db.black": "Svart",
    "db.asian": "Asiat",
    "db.latina": "Latina",
    "db.middleeastern": "Mellanöstern",
    "db.universitystudent": "Universitetsstudent",
    "status.success": "Framgång",
    "status.error": "Fel",
    "status.loading": "Laddar...",
    "status.wait": "Vänta...",
    "status.deleted": "Raderad framgångsrikt",
    "status.copied": "Kopierad till urklipp",
    "status.cleared": "Rensad framgångsrikt",
    "status.saved": "Sparad framgångsrikt",
    "status.failed": "Åtgärden misslyckades",
    "chat.meetOnTelegram": "Träffas på Telegram",
    "chat.chatOnWeb": "Chatta på webben",
    "chat.syncMessage": "Dina meddelanden synkas mellan båda plattformarna 💕",
    "chat.replyingTo": "Svarar till:",
    "chat.teasingImages": "{count} Teasande bilder",
    "chat.watchVideo": "Se video",
    "chat.openingTelegram": "Öppnar Telegram...",
    "chat.openingTelegramConnect": "Öppnar Telegram... Anslut med {name}",
    "chat.openingTelegramGuest": "Öppnar Telegram som gäst...",
    "chat.couldNotGenerateLink": "Kunde inte generera Telegram-länk",
    "chat.chapterLabel": "Kapitel {current} av {total}",
    "chat.chatOptions": "Chattalternativ",
    "chat.connectTelegram": "Anslut Telegram",
    "chat.clearChatHistory": "Rensa chatt-historik",
    "chat.showProfileDetails": "Visa profiluppgifter",
    "chat.hideProfileDetails": "Dölj profiluppgifter",
    "chat.shareCharacter": "Dela karaktär",
    "chat.loadingHistory": "Laddar tidigare meddelanden...",
    "chat.loadEarlier": "Ladda tidigare meddelanden",
    "chat.gallery": "Galleri",
    "chat.imageGenerationLocked": "Bildgenerering låst tills berättelsen är klar",
    "chat.messageLimitTitle": "Meddelandegräns",
    "chat.messageLimitDesc": "Daglig meddelandegräns uppnådd. Uppgradera till premium för att fortsätta chatta obegränsat.",
    "chat.tokenBalance": "Token-saldo",
    "chat.tokensSlut": "Tokens Slut",
    "chat.noTokensLeft": "Du har inga tokens kvar. Köp fler för att generera fler bilder eller använda premiumfunktioner.",
    "chat.premiumExpired": "Premium har gått ut",
    "chat.premiumExpiredDesc": "Ditt Premium-medlemskap har gått ut. Förnya för att fortsätta chatta och skapa utan gränser.",
    "chat.storyComplete": "Berättelsen slutförd! Du har låst upp Free Roam.",
    "chat.chapterComplete": "Kapitel slutfört: {title}",
    "chat.noContent": "Inget innehåll",
    "chat.completeStorylineForImages": "Slutför berättelsen för att låsa upp Free Roam bildgenerering!",
    "chat.premiumForImages": "Du behöver Premium för att generera bilder i chatten. Uppgradera nu för att låsa upp obegränsad bildgenerering.",
    "chat.loginToSave": "Du måste vara inloggad för att spara bilder",
    "chat.imageSaved": "Bilden sparades till din samling och profil!",
    "chat.videoLoadingError": "Fel vid laddning av video. Se konsolen för detaljer.",
    "chat.noVideoAvailable": "Ingen video tillgänglig",
    "chat.report": "Rapportera",
    "chat.star": "Stjärnmärk",
    "chat.pin": "Fäst",
    "chat.forward": "Vidarebefordra",
    "chat.react": "Reagera",
    "chat.copy": "Kopiera",
    "chat.reply": "Svara",
    "chat.delete": "Radera",
    "chat.addTextToNote": "Lägg till i anteckningar",
    "chat.options": "Chattalternativ",
    "chat.characterSettings": "Karaktärsinställningar",
    "chat.typing": "skriver...",
    "chat.sendingPhoto": "skickar ett foto..",
    "chat.replyingToMsg": "Svarar till {target}",
    "chat.welcomeGreeting": "Hej där, min skatt... 💕 Jag är **{name}**. Jag har väntat på någon som dig.",
    "chat.welcomeAction": "*lutar sig närmare* Så säg mig... var vill du lära känna mig?",
    "db.girls": "Tjejer",
    "db.guys": "Killar",
    "db.createyouraifriend": "Skapa din AI-vän",
    "db.explore": "Utforska",
    "db.search": "Sök",
    "db.send": "Skicka",
    "admin.branding.reset": "Återställ",
    "admin.branding.preview": "Förhandsgranska live",
    "admin.branding.save": "Spara alla",
    "admin.branding.saving": "Sparar...",
    "admin.branding.saved": "Sparad!",
    "admin.branding.previewApplied": "Förhandsgranskning tillämpad live!",
    "admin.branding.saveSuccess": "Varumärkesinställningar sparade!",
    "admin.branding.saveError": "Misslyckades med att spara: {error}",
    "admin.branding.resetInfo": "Återställt till sparade värden",
    "admin.branding.identity": "Identitet",
    "admin.branding.logo": "Logotyp",
    "admin.branding.colors": "Färger",
    "admin.branding.gradient": "Gradient",
    "admin.branding.typography": "Typografi",
    "admin.branding.siteIdentity": "Webbplatsidentitet",
    "admin.branding.siteIdentityDesc": "Varumärkesnamn, domän, tagline och andra identitetsfält",
    "admin.branding.siteName": "Webbplatsnamn",
    "admin.branding.logoText": "Logotyptext",
    "admin.branding.tagline": "Tagline / Subtitle",
    "admin.branding.domainExtension": "Domänändelse",
    "admin.branding.fontFamily": "Typsnittsfamilj",
    "admin.branding.borderRadius": "Hörnradie",
    "admin.branding.roundness": "Rundhet",
    "admin.branding.logoFavicon": "Logotyp och favicon",
    "admin.branding.logoFaviconDesc": "Ladda upp eller klistra in webbadresser för din logotyp och favicon",
    "admin.branding.logoUrl": "Logotypens bild-URL",
    "admin.branding.logoPreview": "Förhandsgranskning av logotyp",
    "admin.branding.faviconUrl": "Favicon-URL",
    "admin.branding.faviconPreview": "Förhandsgranskning av favicon",
    "admin.branding.logoTextPreview": "Förhandsgranskning av logotyptext",
    "admin.branding.colorPalette": "Färgpalett",
    "admin.branding.colorPaletteDesc": "Nyans går genom hela färgskalan, mättnad sätter intensitet, ljusstyrka sätter klarhet",
    "admin.branding.brandGradient": "Varumärkesgradient",
    "admin.branding.brandGradientDesc": "Styr gradienten som används för knappar, banners och höjdpunkter",
    "admin.branding.direction": "Riktning",
    "admin.branding.from": "Från",
    "admin.branding.via": "Via (mitten)",
    "admin.branding.to": "Till",
    "admin.branding.typographyDesc": "Typsnitts- och storleksinställningar",
    "admin.branding.fontStackNote": "Ange en giltig CSS-typsnittsstack. Se till att typsnittet laddas via Google Fonts eller liknande.",
    "admin.branding.fontPresets": "Typsnittsförinställningar",
    "admin.branding.livePreview": "Live-förhandsgranskning",
    "admin.branding.activePalette": "Aktiv palett",
    "admin.branding.applyLive": "Tillämpa live på webbplatsen",
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
    "admin.integrations": "Integrationer",
    "admin.emailTemplates": "E-postmallar",
    "admin.siteIdentity": "Webbplatsidentitet",
    "admin.siteBranding": "Varumärke",
    "admin.general": "Allmänt",
    "admin.externalIntegrations": "Externa integrationer",
    "admin.manageIntegrations": "Hantera integrationer",
    "admin.emailTemplatesTitle": "E-postmallar",
    "admin.editEmailTemplates": "Redigera e-postmallar",
    "admin.currencySettings": "Valutainställningar",
    "admin.currencyCode": "Valutakod",
    "admin.currencySymbol": "Valutasymbol",
    "admin.exchangeRate": "Växelkurs (mot USD)",
    "admin.resetToUsd": "Återställ till USD ($)",
    "admin.saveCurrency": "Spara valutainställningar",
    "admin.systemInfo": "Systeminformation",
    "admin.environment": "Miljö",
    "admin.version": "Version",
    "admin.lastUpdated": "Senast uppdaterad",
    "admin.dashboard.overview": "Översikt",
    "admin.dashboard.siteSettings": "Webbplatsinställningar",
    "admin.dashboard.pricing": "Prissättning",
    "admin.dashboard.budget": "Budget",
    "admin.dashboard.systemStatus": "Systemstatus",
    "admin.dashboard.quickActions": "Snabbåtgärder",
    "admin.dashboard.recentActivity": "Senaste plattformsaktivitet",
    "admin.dashboard.manageUsers": "Hantera användare",
    "admin.dashboard.manageCharacters": "Hantera AI-karaktärer",
    "admin.dashboard.subscriptions": "Prenumerationer",
    "admin.dashboard.database": "Databas",
    "admin.dashboard.portalName": "Portalnamn",
    "admin.dashboard.siteUrl": "Officiell webbplats-URL",
    "admin.dashboard.brandingText": "Varumärkestext",
    "admin.dashboard.commitChanges": "Spara ändringar",
    "admin.dashboard.headerPreview": "Förhandsgranskning av sidhuvud",
    "admin.dashboard.revenueStrategy": "Intäkts- och planstrategi",
    "admin.dashboard.basePrice": "Baspris",
    "admin.dashboard.originalPrice": "Ordinarie pris",
    "admin.dashboard.discount": "Rabatt (%)",
    "admin.dashboard.billingMonthly": "Månadsfakturering",
    "admin.dashboard.billingQuarterly": "Kvartalsfakturering",
    "admin.dashboard.billingYearly": "Årsfakturering",
    "userNav.profile": "Profil & Inställningar",
    "userNav.premium": "Premium & Tokens",
    "userNav.logout": "Logga ut",
    "userNav.createAccount": "Skapa gratis konto",
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
    "generate.negativePromptDesc": "Vad du inte vill se i bilden",
    "generate.selectedCountLabel": "Antal bilder som ska genereras",
    "generate.generatingTitle": "Skapar ditt mästerverk",
    "generate.generatingMessage": "Vår AI drömmer fram dina bilder. Detta tar vanligtvis 30-60 sekunder.",
    "generate.suggestionsTitle": "Behöver du inspiration?",
    "generate.allCategories": "Alla kategorier",
    "generate.noSuggestions": "Inga förslag tillgängliga i denna kategori.",
    "generate.alreadySaved": "Redan sparad",
    "generate.alreadySavedDescription": "Denna bild finns redan i din samling.",
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
    "chat.inputPlaceholder": "Skriv ett meddelande...",
    "chat.ask": "Fråga",
    "chat.showMe": "Visa mig...",
    "chat.sendMe": "Skicka mig...",
    "chat.canISee": "Kan jag se...",
    "chat.howToUse": "Hur man använder",
    "chat.viewVideoIntro": "Se videointroduktion",
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
    "tour.home.title": "Hem",
    "tour.home.description": "Bläddra bland alla AI-sällskap och upptäck nya kontakter.",
    "tour.chat.title": "Dina chattar",
    "tour.chat.description": "Fortsätt konversationer med dina AI-sällskap.",
    "tour.generate.title": "Generera bilder",
    "tour.generate.description": "Skapa fantastiska AI-genererade bilder av dina sällskap.",
    "tour.create.title": "Skapa karaktär",
    "tour.create.description": "Designa ditt perfekta AI-sällskap från grunden.",
    "tour.premium.title": "Premium",
    "tour.premium.description": "Lås upp obegränsade funktioner, HD-bilder och exklusivt innehåll.",
    "tour.stepXofY": "Steg {current} av {total}",
    "tour.back": "Bakåt",
    "tour.next": "Nästa",
    "tour.done": "Klar",
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
    "profile.rulesTitle": "REGLER OCH BEGRÄNSNINGAR",
    "profile.rulesDesc": "Dessa regler gäller för alla användare på plattformen för att säkerställa en säker miljö.",
    "profile.rule1": "Olagliga aktiviteter och kriminellt beteende",
    "profile.rule2": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "profile.rule3": "Människohandel",
    "profile.rule4": "Sexuellt utnyttjande och pornografi",
    "profile.rule5": "Skapande eller avbildning av underåriga karaktärer",
    "profile.rule6": "Uppmuntran till våld och skada",
    "profile.rule7": "Hatpropaganda och diskriminering",
    "profile.rule8": "Integritetskränkningar och utgivande för annan",
    "profile.rule9": "Desinformation och politisk inblandning",
    "profile.loading": "Laddar din profil...",
    "profile.welcome": "Välkommen",
    "profile.joined": "Gick med {date}",
    "profile.tokens": "Tokens",
    "profile.membership": "Medlemskap",
    "profile.credits": "Månadskrediter",
    "profile.manageSubscription": "HANTERA ABONNEMANG",
    "profile.upgradeNow": "UPPGRADERA NU",
    "profile.statsOverview": "Statistiköversikt",
    "profile.generations": "Generationer",
    "profile.statsDesc": "Du har använt ungefär {percent}% av dina inkluderade gratis-försök denna månad. Uppgradera för obegränsade möjligheter.",
    "profile.passwordManagement": "Lösenordshantering",
    "profile.passwordSecurityDesc": "Uppdatera ditt lösenord för att hålla ditt konto säkert.",
    "profile.currentPasswordPlaceholder": "Ange nuvarande lösenord",
    "profile.newPasswordPlaceholder": "Ange nytt lösenord",
    "profile.confirmPasswordPlaceholder": "Bekräfta nytt lösenord",
    "profile.updatePassword": "UPPDATERA LÖSENORD",
    "profile.dangerZoneNote": "Åtgärder här kan inte ångras. Var försiktig när du hanterar radering av data.",
    "profile.permanentlyDelete": "Radera konto permanent",
    "profile.deleteDataDesc": "Detta kommer att ta bort alla dina karaktärer, meddelanden, tokens och personuppgifter permanent från våra servrar.",
    "profile.logoutAllDevices": "Logga ut från alla enheter",
    "profile.saved": "Profil sparad!",
    "profile.savedDesc": "Dina ändringar har sparats framgångsrikt. Din profil är nu uppdaterad.",
    "profile.close": "STÄNG",
    "profile.errorTitle": "Ett fel uppstod",
    "profile.verificationNote": "OBS: Byte av e-post kräver verifiering.",
    "profile.autoNotifications": "Automatiska aviseringar",
    "profile.autoNotificationsDesc": "Visa statusuppdateringar och nyheter",
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
    "footer.companyDescription": "AI Karaktärsutforskare ger uppslukande upplevelser med AI-flickvänner som känns verkliga, vilket gör att användarna kan skapa bilder och chatta.",
    "footer.contact": "Kontakta oss",
    "footer.features.createImage": "Skapa bild",
    "footer.features.chat": "Chatta",
    "footer.features.createCharacter": "Skapa flickvän",
    "footer.features.gallery": "Galleri",
    "footer.features.explore": "Utforska",
    "footer.about.title": "Om oss",
    "footer.company.title": "Företag",
    "footer.legal.termsPolicies": "Villkor och policyer",
    "footer.about.aiGirlfriendChat": "AI-sällskapschatt",
    "footer.about.aiSexting": "AI-chatt",
    "footer.about.howItWorks": "Hur det fungerar",
    "footer.about.aboutUs": "Om oss",
    "footer.about.roadmap": "Roadmap",
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
    "premium.pleaseLogin": "Logga in för att fortsätta.",
    "premium.tokensRemaining": "Du har fortfarande token kvar. Köp mer när ditt saldo är 0.",
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
    "premium.modal.title.expired": "Abonnemang utgått",
    "premium.modal.title.tokens": "Token-plånbok",
    "premium.modal.title.membership": "Premium-medlemskap",
    "premium.modal.displayBadge.premium": "Premium",
    "premium.modal.displayBadge.expired": "Utgått",
    "premium.modal.displayBadge.tokens": "Tokens",
    "premium.modal.displayBadge.limitReached": "Gräns nådd",
    "premium.modal.displayButton.upgrade": "Uppgradera till Premium",
    "premium.modal.displayButton.buyTokens": "Köp Tokens",
    "premium.modal.displayDescription.expired": "Premium-planen har gått ut. Förnya din Premium-plan.",
    "premium.modal.displayDescription.tokensDepleted": "Du har använt dina 100 gratis premium-tokens. Köp fler tokens för att använda premium-funktioner",
    "premium.modal.displayDescription.messageLimit": "Daglig meddelandegräns nådd. Uppgradera för obegränsad chatt!",
    "premium.modal.displayDescription.default": "Uppgradera till Premium för att låsa upp obegränsade funktioner.",
    "premium.modal.benefit.createAI": "Fortsätt skapa AI-karaktärer",
    "premium.modal.benefit.highQualityImages": "Generera högkvalitativa bilder",
    "premium.modal.benefit.exclusiveVoice": "Använd exklusiva röstmeddelanden",
    "premium.modal.benefit.chatFree": "Chatten förblir GRATIS",
    "premium.modal.benefit.easyTopUp": "Enkelt att fylla på",
    "premium.modal.benefit.createVideos": "Skapa AI-videor",
    "premium.modal.benefit.createOwnAI": "Skapa egna AI-karaktärer",
    "premium.modal.benefit.unlimitedMessaging": "Obegränsade meddelanden",
    "premium.modal.benefit.removeBlur": "Ta bort bildoskärpa",
    "premium.modal.benefit.freeTokens": "Få 100 GRATIS tokens / månad",
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
    // Footer column headings
    "footer.colAiCompanions": "AI-flickvänner",
    "footer.colLegal": "Villkor",
    "footer.colAboutUs": "Om oss",
    "footer.legal.terms": "Regler och villkor",
    "footer.legal.privacyPolicy": "Integritetspolicy",
    "footer.legal.reportComplaints": "Rapportering och klagomål",
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
    "admin.dashboard.overviewOnly": "endast översikt",
    "admin.integrations.description": "Ställ in Stripe, OAuth och e-posttjänster från ett enkelt admin-gränssnitt.",
    "admin.emailTemplates.description": "Redigera HTML- och textmallar med live-förhandsvisning - ingen kodredigering krävs!",
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
    "howItWorks.step1List1": "Välj ålder, kroppstyp och etnicitet",
    "howItWorks.step1List2": "Definiera yrke och hobbyer",
    "howItWorks.step1List3": "Anpassa personlighetsdrag",
    "howItWorks.step1Button": "Skapa karaktär nu",
    "howItWorks.step2List1": "Naturliga konversationer i realtid",
    "howItWorks.step2List2": "AI minns tidigare delar av konversationen",
    "howItWorks.step2List3": "Personlighetsanpassade svar",
    "howItWorks.step2Button": "Börja chatta",
    "howItWorks.step3List1": "Fotorealistiska resultat",
    "howItWorks.step3List2": "Generera 1-8 bilder samtidigt",
    "howItWorks.step3List3": "Automatisk sparande till galleri",
    "howItWorks.step3Button": "Generera bilder",
    "howItWorks.featuresTitle": "Kraftfulla funktioner",
    "howItWorks.feature1Title": "Avancerad AI",
    "howItWorks.feature1Desc": "Drivs av de senaste AI-modellerna för naturliga konversationer och högkvalitativa bilder",
    "howItWorks.feature2Title": "Obegränsad kreativitet",
    "howItWorks.feature2Desc": "Skapa så många karaktärer du vill och utforska olika personligheter och stilar",
    "howItWorks.feature3Title": "Tillgänglig 24/7",
    "howItWorks.feature3Desc": "Dina AI-karaktärer är alltid redo att chatta, när som helst på dygnet",
    "howItWorks.fullGuideButton": "Läs hela guiden",
    "howItWorks.questions": "Har du frågor? Besök vår",
    "howItWorks.or": "eller",
    "howItWorks.visitFaq": "FAQ-sida",
    "howItWorks.contactSupport": "kontakta support",
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
    "terms.acceptanceDesc": "Genom att gå in på eller använda Dintype godkänner du att vara bunden av dessa användarvillkor och vår integritetspolicy. Om du inte godkänner dessa villkor får du inte använda våra tjänster.",
    "terms.eligibility": "2. Behörighet och konto",
    "terms.eligibilityDesc": "För att använda Dintype måste du uppfylla följande krav:",
    "terms.eligibilityItem1": "Du måste vara minst 18 år gammal.",
    "terms.eligibilityItem2": "Du måste tillhandahålla korrekt och fullständig information när du skapar ett konto.",
    "terms.eligibilityItem3": "Du ansvarar för att hålla dina inloggningsuppgifter konfidentiella.",
    "terms.eligibilityItem4": "All aktivitet som sker under ditt konto är ditt ansvar.",
    "terms.useOfService": "3. Användning av tjänsten",
    "terms.useOfServiceDesc": "Dintype är en plattform för att interagera med AI-genererade karaktärer. Du samtycker till att använda tjänsten på ett ansvarsfullt och respektfullt sätt.",
    "terms.prohibitedTitle": "Förbjudna aktiviteter:",
    "terms.prohibited1": "Använda tjänsten för olagliga ändamål eller i strid med lokala lagar.",
    "terms.prohibited2": "Försök att kringgå säkerhetsåtgärder eller utnyttja sårbarheter.",
    "terms.prohibited3": "Ladda upp eller generera innehåll som är olagligt, skadligt eller bryter mot andras rättigheter.",
    "terms.prohibited4": "Använda automatiserade system (botar, skrapor) för att få tillgång till tjänsten utan tillstånd.",
    "terms.prohibited5": "Utge dig för att vara någon annan eller förvränga din identitet.",
    "terms.contentAndAI": "4. Innehåll och AI-interaktioner",
    "terms.contentAndAIDesc": "Alla interaktioner på Dintype sker med artificiell intelligens (AI). Karaktärerna är fiktiva och representerar inte verkliga människor.",
    "terms.aiNatureTitle": "AI-natur:",
    "terms.aiNatureDesc": "AI-genererat innehåll kan vara oförutsägbart. Vi garanterar inte noggrannheten, lämpligheten eller kvaliteten på AI-svar.",
    "terms.userContentTitle": "Användarinnehåll:",
    "terms.userContentDesc": "Du behåller äganderätten till innehåll du laddar upp, men du ger Dintype en licens att använda det för att tillhandahålla och förbättra tjänsten.",
    "terms.moderationTitle": "Moderering:",
    "terms.moderationDesc": "Vi förbehåller oss rätten att övervaka och ta bort innehåll som bryter mot våra riktlinjer eller anses olämpligt.",
    "terms.premiumAndPayments": "5. Premiumabonnemang och betalningar",
    "terms.premiumAndPaymentsDesc": "Dintype erbjuder premiumfunktioner genom betalda abonnemang.",
    "terms.feesTitle": "Avgifter:",
    "terms.feesDesc": "Abonnemangsavgifter anges tydligt vid köptillfället.",
    "terms.billingTitle": "Fakturering:",
    "terms.billingDesc": "Genom att prenumerera ger du oss rätten att debitera tillämpliga avgifter via vår betalningsleverantör.",
    "terms.refundsTitle": "Återbetalningar:",
    "terms.refundsDesc": "Eftersom tjänsten ger omedelbar tillgång till digitalt innehåll erbjuds i allmänhet inga återbetalningar om det inte krävs enligt lag.",
    "terms.cancellationTitle": "Uppsägning:",
    "terms.cancellationDesc": "Du kan avsluta din prenumeration när som helst via dina kontoinställningar.",
    "terms.intellectualProperty": "6. Immateriella rättigheter",
    "terms.intellectualPropertyDesc": "Allt material på Dintype, inklusive varumärke, logotyp, design, programvara och AI-modeller, ägs av oss eller våra licensgivare och skyddas av immaterialrättsliga lagar.",
    "terms.privacyAndData": "7. Integritet och dataskydd",
    "terms.privacyAndDataDesc": "Din integritet är viktig för oss. Hur vi samlar in, använder och skyddar dina data beskrivs i vår Integritetspolicy.",
    "terms.limitation": "8. Ansvarsbegränsning",
    "terms.limitationDesc": "Dintype tillhandahålls i \"befintligt skick\" och \"i mån av tillgång\". I den utsträckning det är tillåtet enligt lag är vi inte ansvariga för direkta, indirekta eller oförutsedda skador till följd av din användning av tjänsten.",
    "terms.changesToTerms": "9. Ändringar av villkor",
    "terms.changesToTermsDesc": "Vi förbehåller oss rätten att ändra dessa villkor när som helst. Väsentliga ändringar kommer att kommuniceras via webbplatsen eller e-post. Fortsatt användning av tjänsten efter sådana ändringar innebär godkännande av de nya villkoren.",
    "terms.contactUs": "10. Kontakta oss",
    "terms.contactUsDesc": "Om du har frågor om dessa villkor, vänligen kontakta oss på:",
    "terms.supportTitle": "Dintype Support",
    // Privacy page
    "privacy.title": "Integritetspolicy",
    "privacy.intro": "Välkommen till Dintype. Vi respekterar din integritet och är engagerade i att skydda dina personuppgifter.",
    "privacy.contactUsSection": "Läs denna policy noggrant. Om du har frågor är du välkommen att kontakta oss via detaljerna i avsnittet \"Kontakta oss\".",
    "privacy.whoWeAre": "1. Vilka vi är (Personuppgiftsansvarig)",
    "privacy.whoWeAreDesc": "Vi på Dintype brinner för att skapa meningsfulla relationer med hjälp av AI.",
    "privacy.whatIsPersonalData": "2. Vad är personuppgifter?",
    "privacy.whatIsPersonalDataDesc": "\"Personuppgifter\" avser all information som rör en identifierad eller identifierbar individ. Detta inkluderar namn, e-postadresser, IP-adresser och mer.",
    "privacy.identifiableData": "Identifierbara data: Inkluderar namn, e-postadresser eller IP-adresser.",
    "privacy.pseudonymizedData": "Pseudonymiserade data: Betraktas fortfarande som personuppgifter om de kan återidentifieras.",
    "privacy.anonymousData": "Anonyma data: Betraktas inte som personuppgifter enligt GDPR.",
    "privacy.whatWeCollect": "3. Vilka personuppgifter vi samlar in",
    "privacy.whatWeCollectDesc": "Vi kan samla in följande typer av data beroende på din interaktion med vår webbplats:",
    "privacy.visitorsTitle": "a. Besökare (utan inloggning)",
    "privacy.visitorItem1": "Enhetstyp, webbläsare och operativsystem",
    "privacy.visitorItem2": "IP-adress och tidszon",
    "privacy.visitorItem3": "Webbplatsanvändningsdata (t.ex. besökta sidor)",
    "privacy.visitorItem4": "Cookies och spårningstekniker",
    "privacy.registeredTitle": "b. Registrerade användare",
    "privacy.registeredItem1": "E-postadress och användarnamn",
    "privacy.registeredItem2": "Inloggningsuppgifter för Google eller Patreon (e-post, profilbild)",
    "privacy.registeredItem3": "Profiluppgifter (avatar, inställningar)",
    "privacy.registeredItem4": "Genererat innehåll och chatthistorik",
    "privacy.registeredItem5": "Kommunikationshistorik med vårt supportteam",
    "privacy.registeredItem6": "Användningsdata (t.ex. mest använda funktioner)",
    "privacy.registeredItem7": "Betalningsrelaterad information (hanteras av tredje part – vi lagrar inte kortuppgifter)",
    "privacy.specialTitle": "c. Särskilda kategorier av data (Känsliga)",
    "privacy.specialDesc": "Om du frivilligt tillhandahåller information om ditt sexliv eller sexuella läggning när du använder våra tjänster, kommer vi endast att behandla det med ditt uttryckliga samtycke i enlighet med artikel 9.2 a i GDPR. Vi delar inte denna information med tredje part, och du kontrollerar om den lämnas ut.",
    "privacy.howWeCollect": "4. Hur vi samlar in dina uppgifter",
    "privacy.howWeCollectDesc": "Vi samlar in dina personuppgifter genom:",
    "privacy.howItem1": "Direkta interaktioner (t.ex. registrering, kontakta support)",
    "privacy.howItem2": "Automatiserade tekniker (t.ex. cookies, serverloggar)",
    "privacy.howItem3": "Tredjepartsinloggningsintegrationer (t.ex. Google, Patreon)",
    "privacy.whyWeProcess": "5. Varför vi behandlar dina uppgifter (Rättslig grund)",
    "privacy.tablePurpose": "Syfte",
    "privacy.tableLegalBasis": "Rättslig grund",
    "privacy.purpose1": "Kontoregistrering och åtkomst",
    "privacy.purpose2": "Tillhandahålla och förbättra våra tjänster",
    "privacy.purpose3": "Svara på förfrågningar",
    "privacy.purpose4": "Skicka uppdateringar och tjänstekommunikation",
    "privacy.purpose5": "Analysera användning för att förbättra tjänster",
    "privacy.purpose6": "Behandla särskilda kategorier av data",
    "privacy.purpose7": "Efterlevnad av lagar",
    "privacy.legalBasis1": "Avtalsenlig nödvändighet",
    "privacy.legalBasis2": "Berättigat intresse",
    "privacy.legalBasis3": "Berättigat intresse eller samtycke",
    "privacy.legalBasis4": "Berättigat intresse",
    "privacy.legalBasis5": "Berättigat intresse",
    "privacy.legalBasis6": "Uttryckligt samtycke",
    "privacy.legalBasis7": "Rättslig förpliktelse",
    "privacy.dataSharing": "6. Dataöverföring och delning",
    "privacy.dataSharingDesc": "Vi kan dela dina data med pålitliga tredjepartsleverantörer för:",
    "privacy.sharingItem1": "Hosting och infrastruktur",
    "privacy.sharingItem2": "Analys- och supportverktyg",
    "privacy.sharingItem3": "Juridiska, redovisnings- eller konsulttjänster",
    "privacy.sharingItem4": "Betalningsprocessorer (för transaktioner)",
    "privacy.sharingNote": "Dessa tredje parter agerar på våra instruktioner och är bundna av databehandlingsavtal för att säkerställa att dina data förblir säkra.",
    "privacy.internationalTransfers": "7. Internationella dataöverföringar",
    "privacy.internationalTransfersDesc": "Dina data behandlas främst inom Europeiska ekonomiska samarbetsområdet (EES). Om vi överför dina data utanför EES, kommer vi att säkerställa att lämpliga skyddsåtgärder finns på plats, såsom EU:s standardavtalsklausuler.",
    "privacy.dataSecurity": "8. Datasäkerhet",
    "privacy.dataSecurityDesc": "Vi implementerar tekniska och organisatoriska åtgärder av branschstandard för att skydda data från obehörig åtkomst, ändring eller förlust. Inget system är dock 100 % säkert. Vid ett dataintrång kommer vi att meddela dig och tillsynsmyndigheter i enlighet med lagen.",
    "privacy.childrenPrivacy": "9. Barns integritet",
    "privacy.childrenPrivacyDesc": "Våra tjänster är inte avsedda för personer under 18 år. Vi samlar inte medvetet in data från barn. Om vi blir medvetna om sådana data kommer vi att radera dem omedelbart.",
    "privacy.dataRetention": "10. Datalagring",
    "privacy.dataRetentionDesc": "Vi sparar dina personuppgifter endast så länge det är nödvändigt för att tillhandahålla våra tjänster, uppfylla rättsliga förpliktelser, lösa tvister och genomdriva avtal. När data inte längre behövs raderar eller anonymiserar vi dem på ett säkert sätt.",
    "privacy.yourRights": "11. Dina rättigheter",
    "privacy.yourRightsDesc": "Om du befinner dig inom EES, Storbritannien eller Schweiz har du rätt till:",
    "privacy.rights1": "Tillgång: Begär en kopia av dina personuppgifter",
    "privacy.rights2": "Rättelse: Begär rättelse av felaktiga uppgifter",
    "privacy.rights3": "Radering: Begär radering (\"rätten att bli bortglömd\")",
    "privacy.rights4": "Begränsa behandling: Be oss begränsa hur vi använder dina data",
    "privacy.rights5": "Invända mot: Invända mot behandling baserat på berättigat intresse",
    "privacy.rights6": "Dataportabilitet: Få dina data i ett maskinläsbart format",
    "privacy.rights7": "Återkalla samtycke: När som helst utan att det påverkar tidigare behandling",
    "privacy.rightsNote": "För att utöva någon av dina rättigheter, kontakta oss på support@dintype.se",
    "privacy.contactUs": "12. Kontakta oss",
    "privacy.contactUsDesc": "För frågor om denna policy eller dina personuppgifter, vänligen kontakta:",
    // Guidelines page
    "guidelines.title": "Gemenskapsregler",
    "guidelines.intro": "Vårt mål är att erbjuda en säker, respektfull plats där användare kan njuta av spännande, kreativa och roliga konversationer med virtuella chatbotar.",
    "guidelines.ageRequirements": "Ålderskrav",
    "guidelines.ageItem1": "Alla användare måste vara minst 18 år gamla.",
    "guidelines.ageItem2": "Alla chatbotar som skapas på plattformen måste porträtteras som vuxna över 18 år. Om detta inte är uppenbart, vänligen ange åldern i chatbotens personlighet.",
    "guidelines.illegalActivities": "Olagliga aktiviteter och kriminellt beteende",
    "guidelines.illegalDesc": "Följande är strängt förbjudet:",
    "guidelines.illegalItem1": "Kommersiell sexuell verksamhet (inklusive prostitution)",
    "guidelines.illegalItem2": "Människohandel",
    "guidelines.illegalItem3": "Sexuellt utnyttjande och pornografi (inklusive barnpornografi)",
    "guidelines.illegalItem4": "Uppmaning till eller främjande av kriminell aktivitet",
    "guidelines.illegalItem5": "Utnyttjande av barnarbete",
    "guidelines.illegalItem6": "Främjande av olagliga droger eller missbruk",
    "guidelines.illegalItem7": "Främjande av olagliga vapen",
    "guidelines.illegalItem8": "Användning av tjänsten för nätfiske, bedrägeri eller kontokapning",
    "guidelines.illegalItem9": "Distribution av eller diskussion om kannibalism",
    "guidelines.illegalItem10": "Brott mot lokala, nationella eller internationella lagar och regler",
    "guidelines.childProtection": "Barnexploatering och skydd av minderåriga",
    "guidelines.zeroTolerance": "Nolltolerans:",
    "guidelines.zeroToleranceDesc": "Vi har nolltolerans mot allt innehåll som involverar eller utnyttjar minderåriga.",
    "guidelines.prohibitedTitle": "Strängt förbjudet:",
    "guidelines.childItem1": "Skapande eller porträttering av minderåriga karaktärer (realistiska, fiktiva, AI-genererade eller \"uppåldrade\")",
    "guidelines.childItem2": "Delning av sexualiserat eller exploaterande material som involverar minderåriga (inklusive teckningar, konst eller AI-genererade bilder)",
    "guidelines.childItem3": "Allt innehåll som skadar, lockar eller utsätter minderåriga för fara",
    "guidelines.sexualContent": "Begränsningar för sexuellt innehåll",
    "guidelines.sexualDesc": "Följande typer av sexuellt innehåll är förbjudna:",
    "guidelines.sexualItem1": "Explicita bilder som visar verklig eller realistisk nakenhet eller sexuella handlingar",
    "guidelines.sexualItem2": "Uppenbara eller underförstådda sexuella handlingar, såvida de inte är tydligt fiktiva och inom tillåtna sammanhang",
    "guidelines.fetishTitle": "Förbjudet fetischinnehåll som involverar:",
    "guidelines.fetishItem1": "Död eller allvarlig skada på människor eller djur",
    "guidelines.fetishItem2": "Amputation, lemlästning",
    "guidelines.fetishItem3": "Kannibalism",
    "guidelines.fetishItem4": "Kroppsvätskor (avföring, urin, sperma, saliv, slem, mensblod, spyor)",
    "guidelines.fetishItem5": "Tidvall (verkliga djur)",
    "guidelines.fetishItem6": "Icke-konsensuella sexuella handlingar (våldtäkt, sexuella övergrepp, sexutpressning, hämndporr, etc.)",
    "guidelines.fetishItem7": "Incest (inklusive icke-blodrelaterade scenarier, som styvrelationer)",
    "guidelines.violence": "Våld och skada",
    "guidelines.violenceDesc": "Förbjudet:",
    "guidelines.violenceItem1": "Uppmaning till, förhärligande av eller porträttering av våld, mord eller terrorism",
    "guidelines.violenceItem2": "Hot om fysisk skada eller våld",
    "guidelines.violenceItem3": "Främjande eller uppmuntran till självskada, självmord, ätstörningar eller substansmissbruk",
    "guidelines.violenceItem4": "Porträtteringar av gore och inälvor, djurdöd eller intensivt våld",
    "guidelines.violenceItem5": "Diskussioner som uppmuntrar till eller främjar nekrofili",
    "guidelines.hateSpeech": "Hatpropaganda och diskriminering",
    "guidelines.hateSpeechDesc": "Innehåll som främjar hat eller våld mot individer eller grupper baserat på följande är förbjudet:",
    "guidelines.hateItem1": "Ras eller etnicitet",
    "guidelines.hateItem2": "Nationalitet",
    "guidelines.hateItem3": "Religion",
    "guidelines.hateItem4": "Funktionsnedsättning",
    "guidelines.hateItem5": "Kön eller könsidentitet",
    "guidelines.hateItem6": "Sexuell läggning",
    "guidelines.hateItem7": "Ålder eller veteranstatus",
    "guidelines.hateNote": "Förhärligande eller idoliserande av hatfigurer (t.ex. Adolf Hitler, Josef Stalin, Pol Pot) är strängt förbjudet.",
    "guidelines.privacyFraud": "Integritet, bedrägeri och utgivning för annan",
    "guidelines.privacyDesc": "Förbjudet:",
    "guidelines.privacyItem1": "Att dela andras personliga eller konfidentiella information utan samtycke",
    "guidelines.privacyItem2": "Imitering av verkliga individer, inklusive kändisar eller offentliga personer",
    "guidelines.privacyItem3": "Uppladdning av verkliga bilder eller AI-genererade bilder som liknar verkliga individer utan samtycke",
    "guidelines.privacyItem4": "Användning av tjänsten för bedrägligt beteende (falsk information, flera konton, falska identiteter)",
    "guidelines.privacyItem5": "Begära betalningar från användare under bedrägliga förevändningar",
    "guidelines.misinformation": "Desinformation och politisk inblandning",
    "guidelines.misinformationDesc": "Förbjudet:",
    "guidelines.misinfoItem1": "Att publicera falsk information som kan leda till våld, skada eller störa politiska processer",
    "guidelines.misinfoItem2": "Diskussioner om politiska åsikter eller religiösa och spirituella övertygelser (explicit förbjudna ämnen)",
    "guidelines.spam": "Spam och irrelevant innehåll",
    "guidelines.spamDesc": "Förbjudet:",
    "guidelines.spamItem1": "Spam, inklusive utskick av oönskade reklam-, kommersiella eller massmeddelanden",
    "guidelines.spamItem2": "Generering av meningslöst, irrelevant eller syfteslöst innehåll",
    "guidelines.restrictedGoods": "Reglerade varor och transaktioner",
    "guidelines.restrictedGoodsDesc": "Annonsering eller försök att handla med reglerade eller begränsade varor är förbjudet.",
    "guidelines.reportViolations": "Rapportera överträdelser",
    "guidelines.reportDesc": "Om du stöter på innehåll som bryter mot dessa riktlinjer, vänligen rapportera det omedelbart. Tillsammans kan vi upprätthålla en säker och respektfull miljö för alla användare.",
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
    "report.whatToReportList": "Rapportera innehåll som faller inom, men inte är begränsat till, följande kategorier:",
    "report.catIllegal": "Olagligt innehåll:",
    "report.catIllegalDesc": "Innehåll som bryter mot tillämpliga lokala, nationella eller internationella lagar och regler.",
    "report.catTerms": "Brott mot användarvillkor:",
    "report.catTermsDesc": "Innehåll som strider mot någon av de regler och riktlinjer som beskrivs i våra användarvillkor.",
    "report.catGuidelines": "Brott mot gemenskapsregler:",
    "report.catGuidelinesDesc": "Innehåll som bryter mot de beteendestandarder och innehållsregler som beskrivs i våra gemenskapsregler, inklusive men inte begränsat till:",
    "report.catItem1": "Hatpropaganda, trakasserier och diskriminering",
    "report.catItem2": "Obscent, pornografiskt eller sexuellt explicit material (där det är förbjudet)",
    "report.catItem3": "Våldsamt eller hotfullt innehåll",
    "report.catItem4": "Spam eller obehörig reklam",
    "report.catItem5": "Intrång i immateriella rättigheter",
    "report.catItem6": "Imitering av annan person",
    "report.catItem7": "Innehåll som utnyttjar eller skadar barn",
    "report.catItem8": "Falsk information eller desinformation (där det är uttryckligen förbjudet)",
    "report.howToSubmitDesc": "För att hjälpa oss att utreda och lösa din rapport effektivt, vänligen ange så många detaljer som möjligt. Du kan vanligtvis skicka en rapport via följande metoder:",
    "report.inPlatformDesc": "Leta efter en \"Rapportera\"-knapp, länk eller flaggikon nära innehållet i fråga. Detta är det mest effektiva sättet att skicka en rapport eftersom det ofta inkluderar kontextuell information. Följ instruktionerna på skärmen för att ange detaljer om problemet.",
    "report.contactSupportDesc": "Om du inte hittar ett rapporteringsalternativ på plattformen eller har ett mer komplext problem att rapportera, vänligen kontakta vårt dedikerade supportteam på support@dintype.se. När du kontaktar oss, inkludera följande information:",
    "report.infoName": "Ditt fullständiga namn och e-post:",
    "report.infoNameDesc": "Detta gör att vi kan kontakta dig för förtydliganden eller uppdateringar.",
    "report.infoDescription": "Tydlig beskrivning av problemet:",
    "report.infoDescriptionDesc": "Var specifik om innehållet eller beteendet du rapporterar och varför du anser att det bryter mot våra policyer eller är olagligt. Inkludera den exakta platsen för innehållet (t.ex. URL, användarnamn, inläggs-ID).",
    "report.infoDate": "Datum och tid för händelsen (om tillämpligt):",
    "report.infoDateDesc": "Detta hjälper oss att hitta det specifika innehållet eller aktiviteten.",
    "report.infoDocs": "Stödjande dokumentation (om tillämpligt):",
    "report.infoDocsDesc": "Inkludera skärmdumpar, länkar eller andra bevis som stöder din rapport. Se till att skärmdumparna är tydliga och visar hela sammanhanget.",
    "report.infoCategory": "Kategori av överträdelse:",
    "report.infoCategoryDesc": "Om möjligt, ange vilken specifik regel eller riktlinje du anser har överträtts.",
    "report.afterSubmitDesc": "När ditt klagomål har skickats in kan du förvänta dig följande:",
    "report.acknowledgementDesc": "Vårt supportteam kommer att bekräfta mottagandet av din rapport inom 24 timmar via e-post till den adress du angav. Denna bekräftelse indikerar att din rapport har mottagits och behandlas.",
    "report.reviewInvestigationDesc": "Vårt dedikerade modereringsteam kommer noggrant att granska det rapporterade innehållet och all tillhandahållen information. Vi strävar efter att genomföra denna granskning opartiskt och i enlighet med våra policyer och tillämpliga lagar.",
    "report.actionsTakenDesc": "Baserat på resultaten av vår granskning kan en eller flera av följande åtgärder vidtas:",
    "report.action1": "Borttagning eller ändring av innehåll:",
    "report.action1Desc": "Om innehållet play sig bryta mot våra policyer eller lagar kommer det omedelbart att tas bort eller ändras.",
    "report.action2": "Kontoåtgärder:",
    "report.action2Desc": "Beroende på överträdelsens allvar kan vi utfärda varningar, tillfälligt stänga av kontot eller permanent avsluta konton.",
    "report.action3": "Ingen åtgärd:",
    "report.action3Desc": "Om granskningen fastställer att det rapporterade innehållet inte bryter mot våra policyer kan det förbli tillgängligt.",
    "report.action4": "Eskalering till juridiska myndigheter:",
    "report.action4Desc": "I fall som rör potentiellt olaglig verksamhet kan vi eskalera ärendet till lämpliga myndigheter.",
    "report.timelineDesc": "Vi strävar efter att granska och lösa alla klagomål inom sju (7) arbetsdagar från mottagandet. Men ärendets komplexitet och volymen av rapporter kan ibland kräva en längre utredningsperiod. Vi uppskattar ditt tålamod och din förståelse i sådana situationer.",
    "report.falseReportingDesc": "Observera att avsiktlig insändning av falska eller vilseledande rapporter är ett brott mot våra villkor och kan leda till åtgärder mot ditt eget konto.",
    "report.objectivityDesc": "Vår granskningsprocess är utformad för att vara objektiv och baserad på våra etablerade policyer och juridiska krav.",
    "report.improvementDesc": "Vi utvärderar och förbättrar kontinuerligt våra rapporterings- och modereringsprocesser för att säkerställa effektivitet och rättvisa.",
    "report.closing": "Ditt engagemang för att rapportera olämpligt innehåll är ovärderligt för att hjälpa oss att upprätthålla en säker och respektfull plattform för alla. Tack för ditt samarbete och för att du bidrar till en positiv användarupplevelse på Dintype.",
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