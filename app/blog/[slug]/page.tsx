import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Tag, Share2, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

// Blog posts data - matching main blog page
const blogPosts = [
  {
    id: "1",
    slug: "from-richard-gere-to-zendaya",
    title: "From Richard Gere to Zendaya: America's Celebrity Crushes Through the Generations",
    excerpt: "Dream A from 1929 to 2024. Who is your celebrity? Let it be known to your audience through famous crushers cycling if you just for the last – it's just a little for everything.",
    content: `
      <h2>A Journey Through Hollywood's Heartthrobs</h2>
      <p>From the golden era of Hollywood to today's modern celebrities, American audiences' celebrity crushes have evolved and changed through the generations.</p>
      
      <h3>1920-1950: The Classical Era</h3>
      <p>Stars like Clark Gable, Humphrey Bogart, and later James Dean defined what it meant to be a Hollywood legend.</p>
      
      <h3>1960-1980: New Icons</h3>
      <p>Richard Gere, Harrison Ford, and others became symbols of the modern male ideal. Female stars like Audrey Hepburn and Marilyn Monroe continued to fascinate.</p>
      
      <h3>1990-2010: The Millennial Generation</h3>
      <p>Leonardo DiCaprio, Brad Pitt, Jennifer Aniston, and many more took over as the generation's celebrity crushes.</p>
      
      <h3>2020-Present: The New Generation</h3>
      <p>Zendaya, Timothée Chalamet, and other young stars represent a new era of diversity and representation in Hollywood.</p>
      
      <h3>What Makes a Celebrity Crush Timeless?</h3>
      <p>Certain qualities persist through all generations: charisma, talent, and the ability to connect with the audience on a deeper level.</p>
    `,
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop&q=80",
    category: "Culture",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-25",
    readTime: "6 min read",
  },
  {
    id: "2",
    slug: "worldwide-alert-worst-cities",
    title: "Worldwide Alert: The Worst Cities for Genuine Online Dating Revealed",
    excerpt: "See the worst. In just a natural sign of things like for others do is think, and you should matter a matter failure approach is the business in any case. However that you too, single fathers, these, don't worry. Here's a color match.",
    content: `
      <h2>Online Dating Around the World</h2>
      <p>A new study has mapped where it is hardest to find genuine love online. The results are surprising.</p>
      
      <h3>The Methodology</h3>
      <p>The study is based on user behavior, response frequency, and matching success in various cities worldwide.</p>
      
      <h3>The Most Challenging Cities</h3>
      <p>Fast-paced, high-stress major cities top the list of the hardest places for online dating.</p>
      
      <h3>Why are Some Cities Harder?</h3>
      <ul>
        <li>Fast pace and lack of time</li>
        <li>Overabundance of choice creates the "paradox of choice"</li>
        <li>Less genuine interest in long-term relationships</li>
        <li>Demographic factors</li>
      </ul>
      
      <h3>Tips for Success</h3>
      <p>Regardless of where you live, you can increase your chances by being authentic, clear about what you are looking for, and having patience.</p>
    `,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
    category: "Dating",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-22",
    readTime: "5 min read",
  },
  {
    id: "3",
    slug: "new-survey-reveals-39-percent",
    title: "New Survey Reveals: 39% of Americans Admit to Having a BDSM Fetish",
    excerpt: "39% read every. In just a natural part of being like for others. do is think, and you... when that you also, maybe resistance approach is the business in any case, moved that you, too, single fathers a fetish, don't worry: We are in order teller.",
    content: `
      <h2>Sexuality and Openness in Modern Times</h2>
      <p>A new comprehensive survey shows that more people than ever are open about their sexual preferences.</p>
      
      <h3>Survey Results</h3>
      <p>39% of the surveyed American adults admitted interest in BDSM-related activities.</p>
      
      <h3>What Does This Mean?</h3>
      <p>The increased openness reflects a society becoming more accepting of diverse sexual expressions.</p>
      
      <h3>Safety and Consent First</h3>
      <p>Regardless of preferences, it is important to always prioritize:</p>
      <ul>
        <li>Clear consent from all parties</li>
        <li>Safe words and boundaries</li>
        <li>Open communication</li>
        <li>Respect for one another</li>
      </ul>
      
      <h3>Normalizing the Conversation</h3>
      <p>Talking openly about sexuality helps reduce stigma and create healthier relationships.</p>
    `,
    image: "https://images.unsplash.com/photo-1583001680373-0c815e327759?w=800&h=600&fit=crop",
    category: "Research",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-20",
    readTime: "4 min read",
  },
  {
    id: "4",
    slug: "top-10-ai-girlfriend-generators",
    title: "Top 10 AI Girlfriend Generators",
    excerpt: "The advancement of artificial intelligence (AI) has begun and it began subs/ding for realistic AI GF. Different characters can be used on diverse purposes in the world of NSFW content and more. AI has bringing out new...",
    content: `
      <h2>AI Companions: The New Generation of Digital Interaction</h2>
      <p>AI technology has revolutionized how we create and interact with virtual characters.</p>
      
      <h3>1. Pocketlove.ai - Premium Quality</h3>
      <p>Our own platform offers advanced AI technology with a focus on safety and user experience.</p>
      
      <h3>2-10. International Alternatives</h3>
      <p>There are many alternatives on the market, each with its own strengths and focus areas.</p>
      
      <h3>What to Consider?</h3>
      <ul>
        <li>Privacy and data security</li>
        <li>Quality of the AI model</li>
        <li>Customization options</li>
        <li>Price and features</li>
        <li>Language support</li>
      </ul>
      
      <h3>The Future of AI Companions</h3>
      <p>The technology is evolving rapidly, and we can expect even more advanced and natural interactions in the future.</p>
    `,
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop",
    category: "Guide",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-18",
    readTime: "8 min read",
  },
  {
    id: "5",
    slug: "what-is-an-ai-girlfriend",
    title: "What is an AI Girlfriend?",
    excerpt: "In 2024, technology has reached the point for inter-wave in many of commonplace in the digital era. The introduction of AI girlfriends, virtual companions driven by artificial intelligence is only such trend...",
    content: `
      <h2>Introduction to AI Companions</h2>
      <p>AI girlfriends and virtual companions have become a natural part of the digital landscape in 2024.</p>
      
      <h3>What is an AI Girlfriend?</h3>
      <p>An AI girlfriend is a virtual character driven by artificial intelligence that can conduct natural conversations, adapt to your preferences, and offer digital companionship.</p>
      
      <h3>How Does It Work?</h3>
      <p>Advanced language models combine with personality customization to create unique and engaging experiences.</p>
      
      <h3>Benefits of AI Companions</h3>
      <ul>
        <li>Available 24/7</li>
        <li>Judgment-free communication</li>
        <li>Customizable personality</li>
        <li>Practice social interaction</li>
        <li>Creative exploration</li>
      </ul>
      
      <h3>Ethical Considerations</h3>
      <p>It's important to remember that AI companions are tools and should not replace real human relationships.</p>
    `,
    image: "https://images.unsplash.com/photo-1620794108219-ba1d8b93e194?w=800&h=600&fit=crop",
    category: "Guide",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-15",
    readTime: "5 min read",
  },
  {
    id: "6",
    slug: "virtual-companionship",
    title: "Virtual Companionship",
    excerpt: "Will you explore for a virtual companion but don't know the significant high on the market and especially to meet your needs?",
    content: `
      <h2>Finding the Right Virtual Companion</h2>
      <p>With so many options on the market, it can be hard to know where to start.</p>
      
      <h3>Define Your Needs</h3>
      <p>Before choosing a platform, think about what you're looking for:</p>
      <ul>
        <li>Casual conversation or deep discussions?</li>
        <li>Creative exploration or practical support?</li>
        <li>Visual representation importance?</li>
        <li>Language support and cultural context?</li>
      </ul>
      
      <h3>Evaluate Platforms</h3>
      <p>Check reviews, try free versions, and compare features before deciding.</p>
      
      <h3>Safety and Privacy</h3>
      <p>Always choose platforms that take your data and privacy seriously.</p>
      
      <h3>Getting Started</h3>
      <p>Once you've chosen a platform, take the time to customize your experience for the best results.</p>
    `,
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&h=600&fit=crop",
    category: "Guide",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-12",
    readTime: "4 min read",
  },
  {
    id: "7",
    slug: "hot-ai-girls",
    title: "Hot AI Girls",
    excerpt: "Are you looking for hot AI Girls? Look no further, you are in the right place!",
    content: `
      <h2>Create Your Perfect AI Character</h2>
      <p>With modern AI image generators and character creators, you can design exactly the character you want.</p>
      
      <h3>Customization is Key</h3>
      <p>From appearance to personality - everything can be tailored to your preferences:</p>
      <ul>
        <li>Physical attributes and appearance</li>
        <li>Clothing style and fashion</li>
        <li>Personality traits</li>
        <li>Interests and hobbies</li>
        <li>Communication style</li>
      </ul>
      
      <h3>High-Quality Images</h3>
      <p>Use advanced image generation tools for professional results.</p>
      
      <h3>Respectful Usage</h3>
      <p>Remember to always follow platform guidelines and use technology responsibly.</p>
      
      <h3>Start Creating Today</h3>
      <p>At Pocketlove.ai, you can easily create and customize your AI character in just a few minutes.</p>
    `,
    image: "https://images.unsplash.com/photo-1534008757030-27299c4371b6?w=800&h=600&fit=crop",
    category: "Guide",
    author: "Adam Sending-Power",
    publishedAt: "2024-09-10",
    readTime: "3 min read",
  },
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  
  if (!post) {
    return {
      title: "Article not found - Pocketlove",
    };
  }

  return {
    title: `${post.title} - Pocketlove Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current post)
  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-zinc-800 dark:text-zinc-200">
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to blog</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Meta Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              <Tag className="h-3 w-3" />
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white leading-tight">{post.title}</h1>

        {/* Author */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {post.author[0]}
            </div>
            <div>
              <div className="font-semibold text-zinc-900 dark:text-white">{post.author}</div>
              <div className="text-sm text-muted-foreground">Author</div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12 shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div 
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-zinc-900 dark:prose-h2:text-white prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-zinc-900 dark:prose-h3:text-white prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-ul:mb-6 prose-li:mb-2 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-sm">
          <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Ready to start?</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Create your first AI character today and experience the future of conversation.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/create-character"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Create Character
            </Link>
            <Link 
              href="/guide"
              className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Read Guide
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Related articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article className="group h-full">
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                            <Tag className="h-3 w-3" />
                            {relatedPost.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Read article</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
