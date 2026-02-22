"use client"

import { useTranslations } from "@/lib/use-translations"
import Link from "next/link";
import { 
  Sparkles, 
  MessageSquare, 
  ImagePlus, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Crown,
  Coins,
  FolderOpen,
  Settings,
  Trash2,
  Mail,
  Lock
} from "lucide-react";

export function GuideContent() {
  const { t } = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("guide.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("guide.subtitle")}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
        
        {/* Section 1: Getting Started */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.gettingStarted")}</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Create Your Account</h3>
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Step 1: Open the login box</p>
                    <p className="text-sm text-muted-foreground">
                      Click the "Login" button in the top right corner of the page.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Step 2: Choose registration method</p>
                    <p className="text-sm text-muted-foreground">
                      You have three options:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                      <li>• <strong>Email and Password:</strong> Fill in your email address and choose a secure password</li>
                      <li>• <strong>Google:</strong> Log in with your Google account</li>
                      <li>• <strong>Discord:</strong> Log in with your Discord account</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Step 3: Click "Create account"</p>
                    <p className="text-sm text-muted-foreground">
                      If you see the login box, click the "Create account" link at the bottom to switch to the registration form.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Step 4: Done!</p>
                    <p className="text-sm text-muted-foreground">
                      You are now logged in and can start exploring the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
              <p className="text-sm">
                <strong>💡 Tip:</strong> If you've forgotten your password, you can click the "Forgot password?" link in the login box to reset it.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Image Generation */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.imageGeneration")}</h2>
          </div>

          <div className="space-y-6">
            <p>
              Create unique AI-generated images with our advanced image generator.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">How to Generate Images:</h3>
              
              <ol className="space-y-4 list-decimal list-inside">
                <li className="font-medium">
                  Navigate to <Link href="/generate" className="text-primary hover:underline">Create Image</Link>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Find "Create Image" in the menu or sidebar.
                  </p>
                </li>
                
                <li className="font-medium">
                  Write your prompt
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Describe in detail what you want to see in the image. The more specific the description, the better the result.
                  </p>
                  <div className="bg-background border border-border rounded p-3 ml-6 mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Example of a good prompt:</p>
                    <p className="text-sm font-mono">
                      "A young woman with long brown hair, blue eyes, friendly smile, sunset in background, photo-realistic style"
                    </p>
                  </div>
                </li>
                
                <li className="font-medium">
                  Add negative prompt (optional)
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Click on "Show negative prompt" to specify what you DO NOT want in the image. Example: "blurry, poor quality, distorted"
                  </p>
                </li>
                
                <li className="font-medium">
                  Select number of images
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Choose how many images you want to generate simultaneously:
                  </p>
                  <ul className="text-sm text-muted-foreground ml-6 mt-1 space-y-1">
                    <li>• <strong>1 image:</strong> 5 tokens</li>
                    <li>• <strong>4 images:</strong> 20 tokens</li>
                    <li>• <strong>6 images:</strong> 30 tokens</li>
                    <li>• <strong>8 images:</strong> 40 tokens</li>
                  </ul>
                </li>
                
                <li className="font-medium">
                  Use suggestions (optional)
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Above the prompt field, there are categories with suggestions. Click a category and then a suggestion to quickly fill in a prompt.
                  </p>
                </li>

                <li className="font-medium">
                  Click "Generate"
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Your images are generated in seconds. You can see the progress indicator while the images are being created.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Manage Generated Images</h3>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Automatic saving in Gallery</h4>
                  </div>
                  <p className="text-sm">
                    All generated images are automatically saved in your <Link href="/collections" className="text-primary hover:underline">Gallery</Link> (Collection). You don't have to do anything - they are there immediately after generation.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-zinc-800 dark:text-white">Image Management</h4>
                  <p className="text-sm text-muted-foreground">In the gallery, you can:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Mark images as favorites with the heart icon</li>
                    <li>• Download images to your device</li>
                    <li>• Delete images you don't want to keep</li>
                    <li>• Create collections to organize your images</li>
                    <li>• Add images to specific collections</li>
                    <li>• Use selection mode to manage multiple images at once</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: AI Characters */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">3. Create AI Character</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">6-step Guided Process</h3>
              
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Our character creator uses a 6-step wizard that guides you through the process:
                </p>

                <div className="space-y-3">
                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold">Step 1: Choose style and model</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by choosing from existing character templates. You can filter based on:
                    </p>
                    <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                      <li>• <strong>Age</strong> 🎂</li>
                      <li>• <strong>Body</strong> 💪</li>
                      <li>• <strong>Ethnicity</strong> 🌎</li>
                      <li>• <strong>Language</strong> 🗣️</li>
                      <li>• <strong>Relationship</strong> 💑</li>
                      <li>• <strong>Occupation</strong> 💼</li>
                      <li>• <strong>Hobbies</strong> 🎨</li>
                      <li>• <strong>Personality</strong> ✨</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      When you use filters, matching characters are highlighted. Click on one to select it as your base.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold">Step 2: Basic Info</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review the character's basic traits: Age, Body, and Ethnicity.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold text-zinc-800 dark:text-white">Step 3: Communication</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set how the character communicates: Language and Relationship Status.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold text-zinc-800 dark:text-white">Step 4: Career</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review the character's Occupation.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold text-zinc-800 dark:text-white">Step 5: Personality</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      See the character's hobbies and personality traits displayed as badges/tags.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-4">
                    <h4 className="font-semibold text-zinc-800 dark:text-white">Step 6: Final Preview</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review all information about your character: Name, Profile Picture, Description, and all summarized traits.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click "Create my AI" to finish!
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    <strong>💡 Tip:</strong> You can navigate back and forth between steps using the arrow buttons to adjust your choices.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Explore Existing Characters</h3>
              <p className="mb-4">
                Go to the <Link href="/characters" className="text-primary hover:underline">Characters</Link> page to browse all available AI characters. Click "View Character" or "New Character" to create or chat.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Chat */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.chatFeature")}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Start a Conversation</h3>
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <ol className="space-y-3 list-decimal list-inside">
                  <li className="font-medium">
                    Find a Character
                    <p className="text-sm text-muted-foreground ml-6 mt-1">
                      Go to <Link href="/characters" className="text-primary hover:underline">Characters</Link> to see all available characters, or go to <Link href="/chat" className="text-primary hover:underline">Chat</Link> to see your recent conversations.
                    </p>
                  </li>
                  
                  <li className="font-medium">
                    Click the Character
                    <p className="text-sm text-muted-foreground ml-6 mt-1">
                      Click a character card to open the chat window with that character.
                    </p>
                  </li>
                  
                  <li className="font-medium">
                    Start Talking
                    <p className="text-sm text-muted-foreground ml-6 mt-1">
                      Type your message in the text field at the bottom and press Enter or click the send button (arrow icon). The character responds based on its personality and conversation history.
                    </p>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Chat Features</h3>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💾 Automatic Saving</h4>
                  <p className="text-sm text-muted-foreground">
                    All chat history is saved automatically. You can see your previous conversations on the <Link href="/chat" className="text-primary hover:underline">Chat</Link> page under "Recent Conversations".
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🧹 Clear Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on the menu icon (three dots) at the top of the chat window to open the menu. Select the option to clear chat history. This starts a brand new conversation without previous context.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📋 Chat List Sidebar</h4>
                  <p className="text-sm text-muted-foreground">
                    In the chat window, you can open the sidebar to see all the characters you have chatted with. It shows the latest message from each conversation. Click a character to switch conversations.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🖼️ Request Images in Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    The AI can identify when you ask for images. Write something like "Show me a picture of..." or "Create an image of..." and the character will generate an image based on your description.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🔊 Voice Features (Experimental)</h4>
                  <p className="text-sm text-muted-foreground">
                    Some characters may have voice features where you can listen to the AI's response. Click the speaker icon to hear the message read aloud.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Chat Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Context Awareness
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The AI remembers the entire conversation history in the current session, so you can refer back to previous topics.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Personality Adaptation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Each character has its own personality, occupation, hobbies, and communication style based on its traits.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Clear When Needed
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    If the conversation feels outdated or you want to start over, use the "Clear Chat" feature for a fresh start.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Follow Guidelines
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Keep conversations respectful and follow our <Link href="/guidelines" className="text-primary hover:underline">Community Guidelines</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Tokens & Premium */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.tokensAndPremium")}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">What are Tokens?</h3>
              <p className="mb-4">
                Tokens are the platform currency used for image generation. Token costs per image generation:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-zinc-800 dark:text-white">1 image</h4>
                  <p className="text-sm text-muted-foreground">5 tokens</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-zinc-800 dark:text-white">4 images</h4>
                  <p className="text-sm text-muted-foreground">20 tokens</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-zinc-800 dark:text-white">6 images</h4>
                  <p className="text-sm text-muted-foreground">30 tokens</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-zinc-800 dark:text-white">8 images</h4>
                  <p className="text-sm text-muted-foreground">40 tokens</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Buy Token Packs</h3>
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  On the <Link href="/premium" className="text-primary hover:underline">Premium</Link> page, you can buy various token packs. Prices and packs are configured by administrators and may vary.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-zinc-800 dark:text-white">How to Buy Tokens:</h4>
                  <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                    <li>Go to the <Link href="/premium" className="text-primary hover:underline">Premium</Link> page</li>
                    <li>Scroll down to the "Token Packs" section</li>
                    <li>Choose a pack that fits your needs</li>
                    <li>Click "Buy Now"</li>
                    <li>Fill in payment details via Stripe</li>
                    <li>Your tokens are added to your account immediately after payment</li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Premium Membership</h3>
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-bold text-zinc-800 dark:text-white">Premium Membership</h4>
                </div>
                
                <p className="text-muted-foreground">
                  Premium members get enhanced features and benefits. Exact features are configured by administrators in the "Plan Features" table.
                </p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>💡 Note:</strong> Premium features may include unlimited tokens, faster generation, higher image quality, priority support, and much more. Visit the <Link href="/premium" className="text-primary hover:underline">Premium</Link> page to see current benefits and prices.
                  </p>
                </div>

                <div className="pt-4">
                  <Link 
                    href="/premium" 
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
                  >
                    View Pricing and Upgrade
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Settings & Account */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.profileSettings")}</h2>
          </div>

          <div className="space-y-6">
            <p>
              Manage your account and preferences via the <Link href="/settings" className="text-primary hover:underline">Settings</Link> page.
            </p>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-800 dark:text-white">Profile Settings</h3>
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-zinc-800 dark:text-white">Available Settings:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Nickname:</strong> Change your display name
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Gender:</strong> Select Male, Female, or other
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Email:</strong> Your registered email address
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Password:</strong> Masked (********)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Crown className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Current Plan:</strong> Shows "Free" or "Premium"
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-lg text-destructive m-0">Delete Account</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                At the bottom of the settings page is a "Danger Zone". Here you can permanently delete your account and all associated data.
              </p>
              <p className="text-sm text-destructive mt-3 font-semibold">
                ⚠️ Warning: This cannot be undone! All data, characters, chats, and images will be permanently lost.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Support */}
        <section className="border-l-4 border-primary pl-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold m-0 text-zinc-800 dark:text-white">{t("guide.support")}</h2>
          </div>

          <div className="space-y-6">
            <p>Need help? We're here for you!</p>

            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/faq" className="border border-border rounded-lg p-5 hover:border-primary transition-colors space-y-2">
                <h3 className="font-semibold text-lg text-zinc-800 dark:text-white">❓ FAQ</h3>
                <p className="text-sm text-muted-foreground">
                  Find answers to the most frequently asked questions.
                </p>
              </Link>

              <Link href="/contact" className="border border-border rounded-lg p-5 hover:border-primary transition-colors space-y-2">
                <h3 className="font-semibold text-lg text-zinc-800 dark:text-white">📧 Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Send a message to our support team.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final Section: Next Steps */}
        <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-lg p-8 text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Now that you know all the features, it's time to explore Dintype.se! Create your first AI character, generate amazing images, and have fun conversations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/create-character" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
            >
              <Users className="h-5 w-5" />
              Create Character
            </Link>
            <Link 
              href="/generate" 
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors font-semibold"
            >
              <ImagePlus className="h-5 w-5" />
              Generate Image
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
