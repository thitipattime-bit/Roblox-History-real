import { Volume, QuizQuestion, LimitedItem } from "./types";

export const VOLUMES_DATA: Volume[] = [
  {
    id: 1,
    romanId: "VOLUME I",
    title: "The Genesis",
    subtitle: "2004-2021 Foundations",
    snippets: [
      {
        id: "v1-1",
        title: "DynaBlocks to Roblox",
        icon: "Layers",
        description: "Founded by David Baszucki and Erik Cassel, originally rooted in an interactive physics simulator. Launched out of beta to the public in 2006.",
        extendedDetails: "Before Roblox, David Baszucki founded Knowledge Revolution, which built an educational 2D physics engine called Interactive Physics. Applying these mechanics to a 3D block environment led to DynaBlocks, rebranded as Roblox in 2005. Early builds were simple, featuring virtual brick-building in sandbox environments, laying the groundwork for user-generated worlds.",
        category: "milestone",
        stats: { label: "Beta Launch", value: "2004-2006" }
      },
      {
        id: "v1-2",
        title: "The DevEx Shift",
        icon: "Coins",
        description: "The 2013 Developer Exchange program changed everything, allowing creators to cash out Robux for real money, sparking a professional developer ecosystem.",
        extendedDetails: "Prior to DevEx, games were built for community passion or internal items. By enabling a conversion rate of Robux to US Dollars, Roblox turned game creation from a hobby into a lucrative career. Entire studios emerged (such as Redmanta and Uplift Games), employing developers, 3D artists, and project managers to build immersive experiences.",
        category: "economy",
        stats: { label: "Introduced", value: "Oct 2013" }
      },
      {
        id: "v1-3",
        title: "Going Public (NYSE: RBLX)",
        icon: "TrendingUp",
        description: "In 2021, Roblox listed on the NYSE via a direct listing, reaching a massive valuation of $41 Billion and proving the metaverse concept to Wall Street.",
        extendedDetails: "Listing under the ticker 'RBLX' on March 10, 2021, the direct listing saw shares open at $64.50. This moment cemented Roblox not just as a game, but as a dominant social utility platform. Its valuation surpassed legacy gaming giants like EA and Take-Two, highlighting the tremendous financial power of user-generated content.",
        category: "milestone",
        stats: { label: "NYSE Valuation", value: "$41 Billion" }
      }
    ]
  },
  {
    id: 2,
    romanId: "VOLUME II",
    title: "Economy & Culture",
    subtitle: "Tokens, Avatars, and Virtual Brands",
    snippets: [
      {
        id: "v2-1",
        title: "The End of Tix",
        icon: "Ticket",
        description: "In 2016, Roblox controversially removed 'Tickets' (the free daily currency) to combat botting and streamline the economy around Robux.",
        extendedDetails: "Tickets (Tix) were given to players daily just for logging in or having visitors. Although loved by non-paying users, Tix allowed massive botting schemes where creators set up dummy accounts to channel free Tix into Robux. The removal caused widespread protest, including 'Tix rest-in-peace' places, but successfully stabilized the virtual market.",
        category: "economy",
        stats: { label: "Removal Date", value: "April 2016" }
      },
      {
        id: "v2-2",
        title: "Avatars & Identity",
        icon: "User",
        description: "From the classic 'Noob' colors to 'Bacon Hair' (Pal Hair), default avatars became beloved community memes and symbols of platform history.",
        extendedDetails: "The signature yellow-head, blue-torso, and green-leg palette is recognized globally as the 'Noob.' Later, when character models evolved with R15 rigs, default avatars like the male 'Bacon Hair' and female 'Acorn Hair' emerged. These styles, once seen as default badges, became celebrated social status statements worn ironically by elite creators.",
        category: "community",
        stats: { label: "Avatars Served", value: "2B+ created" }
      },
      {
        id: "v2-3",
        title: "The Brand Metaverse",
        icon: "Sparkles",
        description: "Major brands like Gucci, Nike (Nikeland), and Vans began launching official, persistent worlds, turning Roblox into a premier marketing destination.",
        extendedDetails: "In May 2021, the 'Gucci Garden' exhibition made shockwaves when a digital Gucci Queen Bee handbag re-sold on the platform's aftermarket for over $4,115 - more than the physical purse's real-life cost. Today, massive corporations treat Roblox as a crucial demographic medium to engage Gen Z and Alpha consumers.",
        category: "community",
        stats: { label: "Top Brand Visits", value: "30M+ weekly" }
      }
    ]
  },
  {
    id: 3,
    romanId: "VOLUME III",
    title: "Maturation & Challenges",
    subtitle: "Security, Growth, and Infrastructure Failures",
    snippets: [
      {
        id: "v3-1",
        title: "The 73-Hour Outage",
        icon: "WifiOff",
        description: "In October 2021, a massive internal infrastructure failure took the platform offline for three days. It was jokingly blamed on a Chipotle promotion.",
        extendedDetails: "The outage began on October 28, 2021. Contrary to rumors that Chipotle's free burrito giveaway broke the servers, the actual culprit was a Consul service cluster breakdown. A performance bottleneck caused database locking under heavy load, forcing the engineers to work around the clock in a highly scrutinized, historic recovery operation.",
        category: "tech",
        stats: { label: "Downtime Period", value: "73 Hours" }
      },
      {
        id: "v3-2",
        title: "Aging Up (17+ Content)",
        icon: "ShieldAlert",
        description: "Recognizing that over half its audience was older, Roblox introduced ID-verified 17+ experiences allowing mature themes and crude humor.",
        extendedDetails: "Historically viewed as a game for young children, Roblox's fastest-growing demographic became 17-to-24-year-olds. To cater to them, the platform launched age guidelines permitting more intense action, realistic violence, and moderate romance within specially designated, ID-verified spaces.",
        category: "community",
        stats: { label: "Target Age", value: "17+ Verified" }
      },
      {
        id: "v3-3",
        title: "Bloxburg Goes Free",
        icon: "Home",
        description: "After years in paid beta, 'Welcome to Bloxburg' transitioned to free-to-play in 2024, reshaping the social hierarchy of roleplay games.",
        extendedDetails: "Developed by Coeptus and later acquired, Welcome to Bloxburg required a 25 Robux entrance fee for over a decade. It raised a highly dedicated class of homebuilders. Going free-to-play opened the gates to millions of new players, which existing players jokingly 'segregated' by building blockades to stay separate from the newcomers.",
        category: "community",
        stats: { label: "Player Record", value: "15B+ Visits" }
      }
    ]
  },
  {
    id: 4,
    romanId: "VOLUME IV",
    title: "Community & Tech",
    subtitle: "Pioneering Events, Graphics, and Experiences",
    snippets: [
      {
        id: "v4-1",
        title: "The Egg Hunts",
        icon: "Award",
        description: "Starting in 2008, the annual Egg Hunt became the most anticipated event, eventually evolving into decentralized, massive developer hunts.",
        extendedDetails: "Originally, Roblox staff dropped eggs in dedicated maps. By 2013, the hunts became sophisticated narrative adventure games (like Egg Hunt 2018: The Great Yolktales). Eventually, the event decentralised into 'Dev Hunt' models where dozens of independent developers hosted unique eggs in their games, culminating in the 2024 'The Hunt' initiative.",
        category: "community",
        stats: { label: "First Egg Hunt", value: "April 2008" }
      },
      {
        id: "v4-2",
        title: "The Concert Era",
        icon: "Music",
        description: "Lil Nas X's 2020 virtual concert brought in 33 million views, proving Roblox's capability to host massive, real-time global entertainment.",
        extendedDetails: "The concert featured dynamic, enormous avatars of Lil Nas X transitioning through themed environments while playing hits like 'Old Town Road' and 'Holiday.' This pioneered the virtual concert era, followed by appearances from Zara Larsson, Twenty One Pilots, and Charli XCX, demonstrating cutting-edge motion capture tech.",
        category: "community",
        stats: { label: "Peak Audience", value: "33 Million Views" }
      },
      {
        id: "v4-3",
        title: "Future Is Bright Dynamic Engine",
        icon: "Zap",
        description: "Roblox deployed its advanced voxel lighting engine, enabling photorealistic shadows, transparency, and pushing graphics closer to Unreal Engine.",
        extendedDetails: "The 'Future is Bright' update phased in over multiple stages, replacing legacy flat global lighting. By introducing shadow maps, dynamic light probes, and micro-surface reflections, Roblox allowed talented modern builders to achieve atmospheric, filmic scenes that competed directly with traditional AA stand-alone engines.",
        category: "tech",
        stats: { label: "Render Tech", value: "Phase 3 Voxel" }
      }
    ]
  },
  {
    id: 5,
    romanId: "VOLUME V",
    title: "Infrastructure & Myths",
    subtitle: "Edge Performance, Lore, and Scarcity Trading",
    snippets: [
      {
        id: "v5-1",
        title: "Global Edge Network",
        icon: "Server",
        description: "Unlike traditional MMOs, Roblox built a decentralized edge computing network to ensure low latency physics for millions of players globally.",
        extendedDetails: "Roblox operates a massive global hybrid cloud infrastructure, establishing proximity server nodes near user populaces. This edge routing manages complex high-frequency physical box collisions, rigid bodies, and joint constraints live across hundreds of active players in real time without lag spikes.",
        category: "tech",
        stats: { label: "Server Speed", value: "Sub-50ms latency" }
      },
      {
        id: "v5-2",
        title: "Myths & Legends",
        icon: "Eye",
        description: "Early platform lore was dominated by creepypastas like 'John Doe' hacking panics and mysterious groups, fueling early social engagement.",
        extendedDetails: "Legends of 'John Doe' and 'Jane Doe' (two accounts made by Baszucki/Cassel in 2005 to test the avatar database) sparked rumors of active hacks on March 18th. Community-led 'Myth Hunting' groups formed, cataloging mysterious, creepy, or puzzle-centric maps created by enigmatic figures like 'G003Y' and 'The Cult Family.'",
        category: "community",
        stats: { label: "Hacker Scare", value: "March 18th Panic" }
      },
      {
        id: "v5-3",
        title: "The 'Limiteds' Economy",
        icon: "Gem",
        description: "Roblox pioneered digital scarcity. Classic items like the Dominus series are traded on a stock-market structure, worth thousands of real dollars.",
        extendedDetails: "By issuing items with restricted supply counts (e.g. only 26 pieces of Dominus Frigidus), Roblox built a massive trading resale ecosystem. Using features like serial numbers and price charts, young users master macroeconomics, arbitrage, and demand forecasting, trading items valued at millions of Robux.",
        category: "economy",
        stats: { label: "De facto Crown", value: "Dominus Series" }
      },
      {
        id: "v5-4",
        title: "The Mobile Revolution",
        icon: "Smartphone",
        description: "Roblox launched on iOS in 2012 and Android in 2014, shifting its core player base towards a portable on-the-go ecosystem.",
        extendedDetails: "The release of Roblox on mobile devices completely changed the platform's demographic and scaling speed. By prioritizing touch controls and a responsive interface, it allowed millions of younger players worldwide to access the platform. Today, over 70% of standard active users experience Roblox via modern mobile iOS and Android devices rather than legacy desktop computers.",
        category: "milestone",
        stats: { label: "Mobile Access", value: "70%+ Players" }
      },
      {
        id: "v5-5",
        title: "The Forum Era (2006-2017)",
        icon: "MessageSquare",
        description: "A golden age of classic community message boards where early Robloxian users ran sub-cultures, clans, debates, and trade discussions before being retired in late 2017.",
        extendedDetails: "The Roblox Forums were legendary centers for user communities. Sub-forums like 'Roblox Talk' (RT), 'Let's Make a Game' (LMAD), and 'Clans & Guilds' (C&G) birthed many memes, cultural jokes, and trading values. However, as the user base scaled massively, moderating the forums became impossible, leading to their complete closure in December 2017 in favor of modern social channels and the Roblox Developer Forum.",
        category: "community",
        stats: { label: "Forum Erasure", value: "Dec 2017" }
      },
      {
        id: "v5-6",
        title: "1x1x1x1: The Mythic Hacker",
        icon: "Terminal",
        description: "The ultimate classic hacker legend of Roblox, blamed for the legendary April Fools 2012 defacement and mysterious creepy occurrences.",
        extendedDetails: "1x1x1x1 was originally a test account created by Roblox but became a major creepypasta. It is historically linked to the chaotic April Fools' Day exploit of 2012, where administrators' panels were breached to create giant heads, customize faces, and send green banners across the platform. Millions of classic Robloxians feared the name as the Boogeyman of the blocky world.",
        category: "community",
        stats: { label: "Primary Suspect", value: "2012 April Fools" }
      },
      {
        id: "v5-7",
        title: "The Guest Wars & Legacy",
        icon: "Swords",
        description: "The legendary era of unregistered 'Guest' players, creating a deep community divide and eventual tragic retirement in 2017.",
        extendedDetails: "Unregistered users originally played Roblox as 'Guests' (sporting iconic black Guest caps). This led to a playful but mock conflict (the 'Guest Wars') between standard registered players and mute guests who couldn't use chat. To enhance child safety and encourage signup registration, Roblox officially retired the guest system on October 16, 2017, making them a legendary nostalgic icon of Roblox history.",
        category: "community",
        stats: { label: "Active Era", value: "2008 - 2017" }
      }
    ]
  }
];

export const TRIVIA_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "What was Roblox originally called in its early development prototype?",
    options: ["Ro-Craft", "DynaBlocks", "LegoSimulator", "PhysicBlocks"],
    correctAnswerIndex: 1,
    explanation: "Roblox was originally named DynaBlocks in 2004, before founders David Baszucki and Erik Cassel rebranded it to 'Roblox' in 2005 (combining 'Robots' and 'Blocks')."
  },
  {
    id: 2,
    question: "In what year did Roblox introduce the revolutionary Developer Exchange (DevEx) system?",
    options: ["2008", "2010", "2013", "2016"],
    correctAnswerIndex: 2,
    explanation: "The Developer Exchange was launched in October 2013, allowing creators to make actual income by converting earned game Robux into US Dollars."
  },
  {
    id: 3,
    question: "Which dual currency of Roblox was controversially retired in April 2016?",
    options: ["Points (PTS)", "Tickets (Tix)", "Credits", "Blocks"],
    correctAnswerIndex: 1,
    explanation: "Tickets, commonly known as Tix, were removed in 2016 to prevent account botting and stabilize the primary economy entirely around Robux."
  },
  {
    id: 4,
    question: "What actually caused the historic 73-hour platform outage in October 2021?",
    options: [
      "Chipotle's free burrito promo crashed the server",
      "A database lock and performance bottleneck in the Consul backend system",
      "An anonymous group of hacktivists targeted the game",
      "The NYSE launch overloaded the platform servers"
    ],
    correctAnswerIndex: 1,
    explanation: "While players humorously blamed Chipotle's virtual event, the actual technical breakdown was a Consul cluster lockout under elevated microservice load."
  },
  {
    id: 5,
    question: "Which high-value virtual status accessory series has been called the crown jewels of Roblox Limiteds?",
    options: ["Valkyrie Helmets", "Dominus Series", "Fedora Collections", "Sparkle Time Hats"],
    correctAnswerIndex: 1,
    explanation: "Representing some of the absolute highest values on the resale market, the Dominus series (e.g., Dominus Frigidus/Infernus) represent legendary digital status symbols."
  }
];

export const LIMITED_MARKET: LimitedItem[] = [
  {
    id: "lim-1",
    name: "Dominus Frigidus",
    color: "#60A5FA",
    basePrice: 39000,
    estimatedRobux: 2800000,
    volatility: 0.15,
    currentTrend: [2400000, 2550000, 2600000, 2500000, 2750000, 2800000]
  },
  {
    id: "lim-2",
    name: "Sparkle Time Fedora",
    color: "#EF4444",
    basePrice: 10000,
    estimatedRobux: 1200000,
    volatility: 0.22,
    currentTrend: [950000, 1100000, 1050000, 1300000, 1150000, 1200000]
  },
  {
    id: "lim-3",
    name: "Valkyrie Helm",
    color: "#10B981",
    basePrice: 5000,
    estimatedRobux: 350000,
    volatility: 0.08,
    currentTrend: [310000, 325000, 330000, 340000, 345000, 350000]
  },
  {
    id: "lim-4",
    name: "Clockwork's Headphones",
    color: "#F59E0B",
    basePrice: 150,
    estimatedRobux: 180000,
    volatility: 0.12,
    currentTrend: [160000, 175000, 170000, 190000, 185000, 180000]
  },
  {
    id: "lim-5",
    name: "Classic Noob Crown",
    color: "#EAB308",
    basePrice: 500,
    estimatedRobux: 45000,
    volatility: 0.28,
    currentTrend: [32000, 38000, 42000, 36000, 41000, 45000]
  }
];
