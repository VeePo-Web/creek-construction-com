import saunaMountain from "@/assets/sauna-mountain-premium.jpg";
import saunaBackyard from "@/assets/sauna-backyard-premium.jpg";
import saunaInterior from "@/assets/sauna-interior-premium.jpg";
import saunaRitual from "@/assets/blog-sauna-ritual.jpg";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "outdoor-sauna-alberta-winter",
    title: "Outdoor Sauna in Alberta Winter: What Matters",
    excerpt: "Insulation, sealing, heat retention — what actually determines whether your outdoor sauna performs in -30°C. A plain-English breakdown.",
    content: `
## Why Winter Performance Is the Real Question

Alberta winters test everything. An outdoor sauna that works beautifully in September can become a frustrating, energy-draining disappointment by January — if it wasn't built for the conditions.

The difference comes down to three things: insulation, sealing, and moisture management.

## Insulation: More Than Just Thickness

Wall insulation matters, but so does ceiling insulation (heat rises), floor insulation (cold ground conducts), and door insulation. A sauna built like a garden shed will lose heat faster than the heater can produce it at -30°C.

What to look for:
- Continuous insulation envelope (no thermal bridges)
- Vapour barrier on the warm side
- Minimum R-value appropriate for Alberta climate zones

## Sealing: Where Most Saunas Fail

The biggest heat loss in most outdoor saunas isn't through the walls — it's through gaps. Door seals, window frames, roof-to-wall junctions, and electrical penetrations all create paths for warm air to escape and cold air to infiltrate.

A winter-ready sauna treats every junction as a potential failure point.

## Moisture Management: The Hidden Issue

Saunas produce moisture. In winter, that moisture hits cold surfaces and condenses. Without proper vapour management, you get:
- Mould in wall cavities
- Rotting framing
- Ice formation in insulation
- Premature structural failure

The solution is a properly designed vapour barrier system combined with ventilation that allows the sauna to dry between sessions.

## What This Means for Your Decision

When evaluating an outdoor sauna for Alberta, ask these questions:
- What's the insulation value and where is it continuous?
- How are penetrations (door, window, electrical) sealed?
- What's the vapour management strategy?
- Has this design been proven through Alberta winters?

These aren't luxury features — they're the baseline for a sauna that works when you need it most.
    `,
    author: "B&P Sauna",
    date: "2025-01-15",
    readTime: "6 min read",
    category: "WINTER PREP",
    image: saunaMountain
  },
  {
    id: "electrical-requirements-guide",
    title: "Electrical Requirements: A Plain-English Guide",
    excerpt: "What your electrician needs to know before your sauna arrives. Panel capacity, wire gauge, disconnect — all in plain English.",
    content: `
## The Electrical Question Everyone Has

"What do I need for electrical?" is the most common question we hear. Here's the straightforward answer.

## What a Traditional Electric Sauna Heater Needs

Most residential sauna heaters require a dedicated 240V circuit. The specific requirements depend on heater size:

- **6kW heater** (suits most 8×8 saunas): 30-amp circuit, 10-gauge wire
- **8kW heater** (larger custom builds): 40-amp circuit, 8-gauge wire
- **9kW+ heater** (large custom): 50-amp circuit, 6-gauge wire

## What Your Electrician Needs to Know

Before your sauna arrives, share this with your electrician:

1. **Circuit type**: Dedicated 240V circuit (no sharing with other loads)
2. **Wire gauge**: Matched to heater amperage (we specify this in your Sauna Plan)
3. **Disconnect**: A visible disconnect switch within sight of the sauna
4. **Conduit run**: Distance from panel to sauna location (affects wire sizing)
5. **Panel capacity**: Confirm your panel has space for the new breaker

## When to Call Your Electrician

Ideally, have your electrician assess your panel capacity before you commit to a build slot. We include electrical notes in every Sauna Plan so your electrician has exactly what they need.

## Common Concerns

**"Will my panel handle it?"** Most modern homes have 200-amp panels with room for a sauna circuit. Older homes with 100-amp panels may need an assessment.

**"How far can the sauna be from my panel?"** Longer runs may require upsizing the wire gauge. Your electrician will determine this based on the specific distance.

**"Do I need a permit?"** In most Alberta municipalities, a dedicated 240V circuit requires an electrical permit. Your electrician handles this as part of their scope.

## The B&P Approach

We include detailed electrical specifications in every Sauna Plan. You share the document with your electrician, they handle the prep, and when your sauna arrives, we connect and commission the heater as part of the install.

No guesswork. No surprises.
    `,
    author: "B&P Sauna",
    date: "2025-01-08",
    readTime: "5 min read",
    category: "ELECTRICAL",
    image: saunaBackyard
  },
  {
    id: "traditional-vs-infrared",
    title: "Traditional vs Infrared: Why We Build Traditional",
    excerpt: "Two different experiences, two different philosophies. Here's why we chose traditional electric heat — and why it matters for your ritual.",
    content: `
## Two Approaches to Heat

The traditional vs infrared question comes up in nearly every conversation. Both produce heat. Both have advocates. But they deliver fundamentally different experiences.

## Traditional Sauna: The Authentic Ritual

A traditional sauna heats the air and the stones. You experience:
- Air temperatures of 80–100°C (175–210°F)
- The option to create steam by pouring water on stones (löyly)
- Deep, enveloping heat that warms from the outside in
- The full sensory ritual: heat, steam, aroma, contrast

This is the experience that's been refined over thousands of years in Finland and Scandinavia. It's what most people picture when they think "sauna."

## Infrared: A Different Category

Infrared panels heat your body directly with radiant energy, similar to sunlight. The air stays cooler (typically 50–65°C). There's no steam, no stones, no löyly.

Infrared has its place — particularly for people who find traditional heat overwhelming or who want a lower-temperature experience.

## Why We Build Traditional

Our decision to build exclusively traditional saunas comes down to three factors:

### 1. The Ritual Is the Point
The sauna ritual — heat, steam, cool-down, repeat — is what creates the physiological and psychological benefits that keep people coming back daily. Traditional heat enables the full ritual. Infrared doesn't.

### 2. Winter Performance
In Alberta winters, a traditional heater with proper stones creates massive thermal mass. The stones store heat and release it steadily. This matters when it's -30°C outside — you want thermal inertia working for you, not against you.

### 3. Longevity and Simplicity
Traditional electric heaters are mechanically simple — a heating element and stones. No circuit boards, no infrared panels to replace. A quality heater lasts decades with minimal maintenance.

## The Bottom Line

If you want a heated room with radiant panels, infrared works. If you want the sauna ritual — stones, steam, deep heat, the full experience — traditional is the only path.

We build for the ritual. That's why every B&P Sauna uses traditional electric heat.
    `,
    author: "B&P Sauna",
    date: "2024-12-20",
    readTime: "5 min read",
    category: "PLANNING",
    image: saunaRitual
  }
];
