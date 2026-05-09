#!/usr/bin/env node
import pg from 'pg';
import { config } from 'dotenv';

config(); // load .env

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('🌱 Seeding database...');

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = [
    { name: 'Technology',    slug: 'technology',    description: 'Tech news and insights' },
    { name: 'Design',        slug: 'design',        description: 'Design trends and tips' },
    { name: 'Innovation',    slug: 'innovation',    description: 'New ideas and breakthroughs' },
    { name: 'Sustainability',slug: 'sustainability', description: 'Sustainable practices' },
    { name: 'Research',      slug: 'research',      description: 'Research and publications' },
  ];

  const catIds = {};
  for (const cat of categories) {
    const res = await pool.query(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
       RETURNING id, slug`,
      [cat.name, cat.slug, cat.description]
    );
    catIds[res.rows[0].slug] = res.rows[0].id;
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // ── Articles ─────────────────────────────────────────────────────────────
  const articles = [
    {
      title: 'Empowering Businesses Through Smart Digital Solutions',
      slug: 'empowering-businesses-smart-digital-solutions',
      excerpt: 'Discover how modern digital transformation is reshaping the way businesses operate, scale, and serve their customers in a connected world.',
      content: `<h2>Why Digital Transformation Matters</h2>
<p>In today's rapidly evolving business landscape, digital transformation is no longer a luxury—it's a necessity. Companies that embrace technology-driven solutions are outpacing their competition and delivering exceptional value to their customers.</p>
<h3>Key Pillars of Digital Excellence</h3>
<p>Successful digital transformation rests on three core pillars: <strong>people</strong>, <strong>process</strong>, and <strong>technology</strong>. Ignoring any one of these can derail even the most well-funded initiatives.</p>
<blockquote><p>"The best way to predict the future is to create it." – Peter Drucker</p></blockquote>
<p>At Soho Solusi Digital, we help businesses build resilient, scalable digital foundations that drive measurable outcomes. From custom software to cloud infrastructure, our solutions are crafted with your growth in mind.</p>
<h3>What We've Seen Work</h3>
<p>Across dozens of projects, the businesses that succeed are those that start with clear goals, invest in the right tools, and continuously iterate based on data. Digital transformation is a journey, not a destination.</p>
<p>Ready to start yours? <a href="/contact">Get in touch with our team.</a></p>`,
      cover_image: '/img/blog/1.jpg',
      author_name: 'Soho Team',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'digital transformation, business, technology',
    },
    {
      title: 'The Future of Custom Software Development',
      slug: 'future-custom-software-development',
      excerpt: 'Off-the-shelf software rarely fits perfectly. Here\'s why custom-built solutions are becoming the gold standard for growing businesses.',
      content: `<h2>One Size Does Not Fit All</h2>
<p>Every business has unique workflows, requirements, and growth trajectories. Generic software products often force companies to adapt their processes to the tool—when it should be the other way around.</p>
<h3>Benefits of Going Custom</h3>
<ul>
<li><strong>Tailored to your workflow</strong> — built around how your team actually works</li>
<li><strong>Scalable from day one</strong> — architecture designed for your growth plan</li>
<li><strong>Full ownership</strong> — no vendor lock-in or unexpected price hikes</li>
<li><strong>Competitive advantage</strong> — capabilities your competitors can't simply buy</li>
</ul>
<h3>Our Development Process</h3>
<p>We follow an agile, transparent process: discovery, design, development, testing, and deployment—with your team involved at every stage. No black boxes, no surprises.</p>
<p>The result? Software that your team loves to use and your customers notice the difference.</p>`,
      cover_image: '/img/blog/2.jpg',
      author_name: 'Soho Team',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'software development, custom software, technology',
    },
    {
      title: 'Design Principles That Drive Conversion',
      slug: 'design-principles-drive-conversion',
      excerpt: 'Great design isn\'t just about aesthetics — it\'s about guiding users toward action. Learn the principles behind high-converting digital experiences.',
      content: `<h2>Design With Purpose</h2>
<p>The best digital experiences feel effortless. Users find what they need, understand what to do, and take action—all without friction. That's intentional design at work.</p>
<h3>Core Principles We Follow</h3>
<p><strong>1. Clarity over cleverness.</strong> Users shouldn't have to think. Every element on the page should have a clear purpose.</p>
<p><strong>2. Hierarchy guides the eye.</strong> Visual weight tells users what matters most. Typography, spacing, and color are powerful tools for directing attention.</p>
<p><strong>3. Consistency builds trust.</strong> Consistent UI patterns reduce cognitive load and make your product feel reliable and professional.</p>
<h3>Measuring Design Success</h3>
<p>Good design is measurable. We track conversion rates, time-on-page, scroll depth, and user feedback to continuously refine every interface we create.</p>`,
      cover_image: '/img/blog/3.jpg',
      author_name: 'Soho Creative Team',
      category_slug: 'design',
      type: 'blog',
      status: 'published',
      tags: 'design, ux, conversion, web design',
    },
    {
      title: 'Digital Transformation in Indonesian SMEs: A Research Overview',
      slug: 'digital-transformation-indonesian-smes-research',
      excerpt: 'A comprehensive look at how small and medium enterprises across Indonesia are adopting digital technologies and what barriers remain.',
      content: `<h2>Executive Summary</h2>
<p>This research examines the state of digital adoption among Indonesian SMEs, drawing on survey data from 200+ businesses across Jakarta, Surabaya, and Bandung. The findings reveal both significant progress and persistent gaps.</p>
<h3>Key Findings</h3>
<p><strong>Adoption rate:</strong> 67% of surveyed SMEs have adopted at least one digital tool in the past three years, up from 42% in the prior period.</p>
<p><strong>Primary barriers:</strong> Cost (58%), lack of skilled personnel (47%), and uncertainty about ROI (39%) remain the top obstacles to further adoption.</p>
<p><strong>Highest-impact tools:</strong> Point-of-sale software, inventory management systems, and social commerce platforms delivered the strongest reported business impact.</p>
<h3>Recommendations</h3>
<p>SMEs are encouraged to start with high-ROI, low-complexity tools before investing in enterprise-grade platforms. Partner ecosystems and government subsidy programs can significantly reduce the financial barrier to entry.</p>
<h3>Methodology</h3>
<p>Data was collected via structured interviews and digital surveys over a six-month period. Respondents represented businesses in retail, F&B, professional services, and manufacturing sectors.</p>`,
      cover_image: '/img/blog/5.jpg',
      author_name: 'Soho Research Division',
      category_slug: 'research',
      type: 'blog',
      status: 'published',
      tags: 'research, SME, Indonesia, digital transformation',
    },
    {
      title: 'UX Audit Framework for Enterprise Web Applications',
      slug: 'ux-audit-framework-enterprise-web-applications',
      excerpt: 'A practical framework for evaluating and improving user experience in complex enterprise software, with real-world case examples.',
      content: `<h2>Why Enterprise UX Is Different</h2>
<p>Enterprise applications serve power users with deep domain expertise. Standard consumer UX heuristics apply, but must be balanced against efficiency, information density, and workflow specificity.</p>
<h3>The Audit Framework</h3>
<p>Our five-stage framework covers:</p>
<ol>
<li><strong>Heuristic evaluation</strong> — mapping against Nielsen's 10 usability heuristics adapted for enterprise contexts</li>
<li><strong>Task flow analysis</strong> — shadowing real users performing core workflows</li>
<li><strong>Accessibility audit</strong> — WCAG 2.1 AA compliance check</li>
<li><strong>Performance impact assessment</strong> — how load times affect user behavior</li>
<li><strong>Stakeholder alignment review</strong> — ensuring UX goals map to business objectives</li>
</ol>
<h3>Case Example: Internal ERP Portal</h3>
<p>Applying this framework to a mid-sized manufacturer's ERP portal reduced average task completion time by 34% and support ticket volume by 28% within two quarters of redesign.</p>`,
      cover_image: '/img/blog/6.jpg',
      author_name: 'Soho UX Practice',
      category_slug: 'design',
      type: 'blog',
      status: 'published',
      tags: 'UX, enterprise, audit, design',
    },
    {
      title: 'Building Scalable APIs: REST vs GraphQL in 2025',
      slug: 'building-scalable-apis-rest-vs-graphql-2025',
      excerpt: 'A side-by-side comparison of REST and GraphQL for modern backend development, with practical guidance on when to choose each approach.',
      content: `<h2>The Great API Debate</h2>
<p>REST has been the dominant API paradigm for over a decade, but GraphQL has steadily gained ground, especially in frontend-heavy applications. Which should you choose in 2025?</p>
<h3>When REST Wins</h3>
<p>REST remains the right choice for public APIs, simple CRUD services, and teams that value predictability and cacheability. Its simplicity means shorter onboarding and a broader ecosystem of tools.</p>
<h3>When GraphQL Wins</h3>
<p>GraphQL shines when the client needs flexible data fetching, when you're aggregating multiple data sources, or when you want to minimize over-fetching in mobile applications with limited bandwidth.</p>
<h3>Our Recommendation</h3>
<p>Start with REST. Migrate specific, high-complexity data domains to GraphQL only when the pain is real. Premature optimization in API design is as costly as anywhere else in software.</p>`,
      cover_image: '/img/blog/1.jpg',
      author_name: 'Soho Engineering',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'API, REST, GraphQL, backend, technology',
    },
    {
      title: 'Sustainable Tech: Building a Greener Digital Future',
      slug: 'sustainable-tech-greener-digital-future',
      excerpt: 'The tech industry\'s carbon footprint is larger than many realize. Here\'s how software teams can make more environmentally conscious decisions.',
      content: `<h2>Software Has a Carbon Cost</h2>
<p>Every query, every image, every unnecessary background process consumes energy. Data centers account for roughly 1% of global electricity use — and that number is growing with AI workloads.</p>
<h3>Green Software Principles</h3>
<p><strong>Efficiency:</strong> Do more with less. Optimized code runs faster and uses fewer CPU cycles.</p>
<p><strong>Carbon-aware scheduling:</strong> Run intensive batch jobs when the grid is powered by renewables.</p>
<p><strong>Smaller payloads:</strong> Compress assets, lazy-load images, and avoid shipping unused JavaScript.</p>
<h3>What We Do at Soho</h3>
<p>We host on infrastructure with verified renewable energy commitments, optimize our builds for minimal payload size, and routinely audit our dependencies for bloat. Small choices compound over millions of page views.</p>`,
      cover_image: '/img/blog/2.jpg',
      author_name: 'Soho Team',
      category_slug: 'sustainability',
      type: 'blog',
      status: 'published',
      tags: 'sustainability, green tech, environment',
    },
    {
      title: 'Why Your Website Needs a Performance Budget',
      slug: 'why-website-needs-performance-budget',
      excerpt: 'Performance budgets keep your site fast as it grows. Learn how to set one, track it, and enforce it in CI before things slow down.',
      content: `<h2>Speed Is a Feature</h2>
<p>A 1-second delay in page load time can reduce conversions by 7%. For mobile users on slower connections, the impact is even greater. Yet performance is often the first casualty of feature velocity.</p>
<h3>What Is a Performance Budget?</h3>
<p>A performance budget is a set of limits on metrics that affect page performance — total page weight, number of requests, Largest Contentful Paint (LCP), Time to Interactive (TTI), and so on.</p>
<h3>Setting Your Budget</h3>
<p>Start with your top competitor. Measure their Core Web Vitals. Set your budget to beat them by 20%. Then enforce it in CI so no PR can ship code that breaks the budget.</p>
<h3>Tools We Use</h3>
<p>Lighthouse CI, WebPageTest, and Bundle Buddy are our go-to tools for monitoring and enforcing performance budgets across projects.</p>`,
      cover_image: '/img/blog/3.jpg',
      author_name: 'Soho Engineering',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'performance, web, optimization, technology',
    },
    {
      title: 'Design Systems: The ROI Beyond Consistency',
      slug: 'design-systems-roi-beyond-consistency',
      excerpt: 'Design systems are often justified on consistency alone — but the real return on investment lies in speed, collaboration, and reduced design debt.',
      content: `<h2>More Than a Component Library</h2>
<p>A design system is a shared language between design and engineering. When done well, it eliminates a whole class of recurring decisions, disputes, and rework.</p>
<h3>The Hidden Costs It Eliminates</h3>
<p>Without a design system, every new screen starts a negotiation: which button style? what spacing? how does this state look on mobile? These micro-decisions accumulate into weeks of lost time per quarter.</p>
<h3>Measuring the ROI</h3>
<p>Teams with mature design systems report 30–50% faster feature delivery once adoption is established. Design review cycles shorten. Developer questions drop. QA finds fewer visual inconsistencies.</p>
<h3>Where to Start</h3>
<p>Audit your existing UI. Find the 10 most-repeated patterns. Extract them into tokens and components. Don't boil the ocean — a focused system that's actually used beats a comprehensive one that isn't.</p>`,
      cover_image: '/img/blog/5.jpg',
      author_name: 'Soho Creative Team',
      category_slug: 'design',
      type: 'blog',
      status: 'published',
      tags: 'design system, design, UI, ROI',
    },
    {
      title: 'AI-Assisted Development: What Actually Works in Production',
      slug: 'ai-assisted-development-what-works-production',
      excerpt: 'After 12 months of using AI coding tools across multiple client projects, here\'s an honest assessment of what delivers value and what doesn\'t.',
      content: `<h2>Cutting Through the Hype</h2>
<p>AI-assisted development tools have generated enormous excitement — and enormous skepticism. We've spent the past year using them across real client projects to find out what's actually useful.</p>
<h3>Where AI Genuinely Helps</h3>
<p><strong>Boilerplate generation:</strong> CRUD endpoints, form validation, test scaffolding — AI handles these well and saves real time.</p>
<p><strong>Code explanation:</strong> Understanding unfamiliar codebases is faster with AI assistance. Junior developers particularly benefit.</p>
<p><strong>Documentation drafts:</strong> AI produces good first drafts of inline docs and README content that humans then refine.</p>
<h3>Where It Falls Short</h3>
<p>Complex domain logic, subtle security requirements, and architectural decisions still require experienced human judgment. AI confidently produces plausible-looking code that can be subtly wrong in ways that are hard to catch in review.</p>
<h3>Our Verdict</h3>
<p>AI tools are a multiplier for skilled developers, not a replacement. Use them for the routine; keep humans on the critical path.</p>`,
      cover_image: '/img/blog/6.jpg',
      author_name: 'Soho Engineering',
      category_slug: 'innovation',
      type: 'blog',
      status: 'published',
      tags: 'AI, development, innovation, technology',
    },
    {
      title: 'State of UX Research in Southeast Asia 2025',
      slug: 'state-of-ux-research-southeast-asia-2025',
      excerpt: 'A survey of UX research maturity across Southeast Asian tech companies reveals a region rapidly closing the gap with global practices.',
      content: `<h2>Research Overview</h2>
<p>This report synthesizes findings from 150 product teams across Indonesia, Vietnam, Thailand, and the Philippines, examining how user research is practiced, valued, and resourced.</p>
<h3>Maturity Distribution</h3>
<p>Only 18% of surveyed teams operate at full research maturity — with dedicated researchers, systematic synthesis, and research repositories. However, 54% have at least one researcher embedded in a product team, up from 31% three years ago.</p>
<h3>Most Common Methods</h3>
<p>Usability testing (71%), user interviews (64%), and analytics review (82%) are the most practiced methods. Eye-tracking, diary studies, and longitudinal research remain rare outside well-funded product organizations.</p>
<h3>Key Barriers</h3>
<p>Timeline pressure (68%), stakeholder skepticism (52%), and recruitment difficulty (44%) are the top barriers to more rigorous research practice.</p>
<h3>Outlook</h3>
<p>The trend is positive. Investment in research tooling, researcher hiring, and research operations is accelerating across the region. Teams that invest now will have a meaningful advantage within three to five years.</p>`,
      cover_image: '/img/blog/1.jpg',
      author_name: 'Soho Research Division',
      category_slug: 'research',
      type: 'blog',
      status: 'published',
      tags: 'UX, research, Southeast Asia, design',
    },
    {
      title: 'Microservices vs Monolith: Choosing the Right Architecture',
      slug: 'microservices-vs-monolith-choosing-right-architecture',
      excerpt: 'The microservices vs monolith debate has no universal winner. Here\'s a framework for making the right call based on your team and product stage.',
      content: `<h2>The Architecture Decision That Defines Everything</h2>
<p>Architectural decisions are among the hardest to reverse. Choosing between a monolith and microservices early shapes your team structure, deployment pipeline, and technical roadmap for years.</p>
<h3>Start with the Monolith</h3>
<p>For most early-stage products, a well-structured monolith is the right choice. It's simpler to develop, deploy, and debug. The "modular monolith" pattern — clean internal boundaries without network overhead — gives you most of the organizational benefits of microservices without the operational complexity.</p>
<h3>When to Decompose</h3>
<p>Consider microservices when: different parts of your system have genuinely different scaling needs, you have multiple teams working on independent domains, or specific services need different technology stacks for legitimate technical reasons.</p>
<h3>The Real Cost of Microservices</h3>
<p>Distributed systems are harder. Network latency, partial failures, data consistency, service discovery, and observability all require dedicated investment. Make sure your team has the experience and tooling before going down this path.</p>`,
      cover_image: '/img/blog/2.jpg',
      author_name: 'Soho Engineering',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'architecture, microservices, backend, technology',
    },
    {
      title: 'Accessible Design Is Good Business',
      slug: 'accessible-design-good-business',
      excerpt: 'Accessibility is often treated as a compliance checkbox. Here\'s why designing for everyone actually expands your market and improves the product for all users.',
      content: `<h2>Beyond Compliance</h2>
<p>WCAG compliance is a legal requirement in many jurisdictions, but framing accessibility solely as compliance misses the point. Accessible design makes products better for everyone.</p>
<h3>The Numbers</h3>
<p>Over 1 billion people worldwide live with some form of disability. In Indonesia alone, that represents tens of millions of potential users. An inaccessible product excludes them entirely.</p>
<h3>The Curb-Cut Effect</h3>
<p>Accessibility improvements consistently benefit non-disabled users too. Captions help viewers in noisy environments. High-contrast modes benefit users in bright sunlight. Keyboard navigation helps power users. Designing for the edges improves the center.</p>
<h3>Where to Start</h3>
<p>Run an automated accessibility audit with axe or Lighthouse. Fix the critical issues first: missing alt text, insufficient color contrast, and unlabeled form fields. Then bring in users with disabilities for qualitative testing.</p>`,
      cover_image: '/img/blog/3.jpg',
      author_name: 'Soho Creative Team',
      category_slug: 'design',
      type: 'blog',
      status: 'published',
      tags: 'accessibility, design, inclusive design, UX',
    },
    {
      title: 'Green Cloud: Measuring and Reducing Your Cloud Carbon Footprint',
      slug: 'green-cloud-measuring-reducing-carbon-footprint',
      excerpt: 'Cloud infrastructure is not inherently green. This guide covers practical steps to measure, report, and reduce the environmental impact of your cloud workloads.',
      content: `<h2>The Cloud Is Not Green by Default</h2>
<p>Moving to the cloud can reduce emissions compared to on-premise data centers — but only if you make deliberate choices. Idle resources, over-provisioned instances, and inefficient architectures waste energy regardless of where they run.</p>
<h3>Measuring Your Footprint</h3>
<p>AWS, GCP, and Azure all provide carbon footprint dashboards. Start by measuring. You can't manage what you don't measure, and the numbers are often surprising.</p>
<h3>Quick Wins</h3>
<ul>
<li>Right-size instances — oversized instances are the biggest source of waste</li>
<li>Use spot/preemptible instances for non-critical batch workloads</li>
<li>Turn off dev and staging environments outside working hours</li>
<li>Move to serverless for low-traffic workloads — pay-per-invocation eliminates idle waste</li>
</ul>
<h3>Longer-Term Strategies</h3>
<p>Choose regions powered by renewable energy. Design for efficiency at the application level. Include carbon metrics in your engineering KPIs alongside cost and reliability.</p>`,
      cover_image: '/img/blog/5.jpg',
      author_name: 'Soho Team',
      category_slug: 'sustainability',
      type: 'blog',
      status: 'published',
      tags: 'sustainability, cloud, green tech, infrastructure',
    },
    {
      title: 'How We Build Innovation Culture at Soho',
      slug: 'how-we-build-innovation-culture-soho',
      excerpt: 'Innovation isn\'t a department — it\'s a practice. Here\'s how we\'ve built a culture where new ideas surface, get tested, and sometimes ship.',
      content: `<h2>Innovation Is a System, Not a Spark</h2>
<p>Most organizations say they value innovation. Few build the systems that make it happen consistently. At Soho, we've spent years learning what actually works.</p>
<h3>What We Do</h3>
<p><strong>Protected exploration time:</strong> Every team member has dedicated time each sprint for exploration — reading, prototyping, or experimenting with new tools. No deliverables required.</p>
<p><strong>Low-stakes experiments:</strong> We run internal experiments with a 2-week timebox and a clear success metric. If it doesn't show promise quickly, we cut it and document the learning.</p>
<p><strong>Cross-functional problem sessions:</strong> Our best ideas come from engineers, designers, and client-facing team members in the same room. Silos kill innovation.</p>
<h3>What Doesn't Work</h3>
<p>Hackathons without follow-through. Innovation labs disconnected from real products. Reward systems that punish failure. All of these generate the optics of innovation without the substance.</p>`,
      cover_image: '/img/blog/6.jpg',
      author_name: 'Soho Team',
      category_slug: 'innovation',
      type: 'blog',
      status: 'published',
      tags: 'innovation, culture, team, business',
    },
    {
      title: 'IT Consultation: What Good Looks Like',
      slug: 'it-consultation-what-good-looks-like',
      excerpt: 'Not all IT consultation engagements are created equal. Here\'s what distinguishes advice that creates lasting value from advice that collects dust.',
      content: `<h2>The Consultation Trap</h2>
<p>Many IT consultation engagements produce beautiful slide decks and comprehensive reports that are filed away within weeks of delivery. The problem isn't the quality of the analysis — it's the disconnect from implementation reality.</p>
<h3>What Good Consultation Looks Like</h3>
<p><strong>Starts with listening:</strong> Before recommending anything, good consultants spend significant time understanding the business, the constraints, and the people involved.</p>
<p><strong>Recommends what's implementable:</strong> The best recommendation is the one your team can actually execute with their current capabilities and budget, not the theoretically optimal one.</p>
<p><strong>Stays through implementation:</strong> Advice without accountability is just opinion. We stay involved through execution to ensure recommendations translate into real outcomes.</p>
<h3>How We Approach IT Consultation</h3>
<p>We combine strategic clarity with technical depth. We've built and run the systems we advise on, which means we understand trade-offs in practice, not just in theory.</p>`,
      cover_image: '/img/blog/1.jpg',
      author_name: 'Soho Team',
      category_slug: 'technology',
      type: 'blog',
      status: 'published',
      tags: 'IT consultation, strategy, technology, business',
    },
  ];

  for (const a of articles) {
    await pool.query(
      `INSERT INTO articles
         (title, slug, excerpt, content, cover_image, author_name,
          category_id, type, status, tags, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [
        a.title, a.slug, a.excerpt, a.content,
        a.cover_image, a.author_name,
        catIds[a.category_slug] ?? null,
        a.type, a.status, a.tags,
      ]
    );
    console.log(`  ✓ Article [${a.type}]: ${a.title}`);
  }

  console.log('\n✅ Seed complete.');
  console.log(`   ${categories.length} categories, ${articles.length} articles inserted.`);
} catch (err) {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
