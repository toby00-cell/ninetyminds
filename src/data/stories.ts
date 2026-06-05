import p1 from "@/assets/player-1.jpg";
import p2 from "@/assets/player-2.jpg";
import p3 from "@/assets/player-3.jpg";
import hero from "@/assets/hero.jpg";
import wellness from "@/assets/wellness.jpg";

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  read: string;
  img: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string[];
  quote?: { text: string; attribution: string };
};

const imgs = [p1, p2, p3, hero, wellness];

const raw: Omit<Story, "img">[] = [
  {
    slug: "surulere-to-premier",
    title: "From a Surulere car park to a Premier trial.",
    excerpt: "How Chidera went from playing barefoot tournaments to a verified scout meeting in eleven months.",
    tag: "Discovery",
    read: "6 min",
    date: "May 14, 2026",
    author: {
      name: "Ngozi Adimora",
      role: "Grassroots Editor",
      avatar: p2,
    },
    content: [
      "It was 5:47 a.m. when Chidera laced his boots under the flickering streetlight of Bode Thomas. The Surulere car park was still half-asleep, except for a group of boys who treated the cracked asphalt like the Santiago Bernabeu. The nets were tied to abandoned shop poles. The floodlights were the sun rising over Lagos Island.",
      "Chidera was not the tallest, nor the fastest. But he was the only one who could see the pass nobody else saw — a diagonal through-ball that split three defenders and landed on a teammate's toe like it had been GPS-guided. That was his currency.",
      "In eleven months, the currency appreciated. A NinetyMinds scout filmed two games on a Tuesday. By Thursday, the video was in Enugu. By Sunday, Chidera had a WhatsApp message that began with the words every Lagos boy dreams of: 'Can you come for a trial?'",
      "The trial was not glamorous. It was three hours of pressing drills, a bleep test, and a small-sided game in 38-degree heat. Chidera did not score. But he completed 94% of his passes, won every second ball, and spoke to teammates in three languages — Igbo, Pidgin, and a little Hausa he had picked up from a Kano striker.",
      "'Clubs don't just sign skill anymore,' the scout told me later. 'They sign presence. Chidera had presence before he had a contract.'",
      "He still trains at the car park on weekends. The floodlights are still the sunrise. But now he wears boots with his name printed on the tongue — and a trial date in his calendar he still can't quite believe.",
    ],
    quote: {
      text: "I didn't leave Surulere. Surulere left me — it followed me into every trial, every stadium, every handshake with a scout.",
      attribution: "Chidera Okonkwo, Midfielder",
    },
  },
  {
    slug: "amina-burnout",
    title: "The day Amina told her coach she was burning out.",
    excerpt: "A striker, a season of silence, and the wellness circle that gave her the words to ask for help.",
    tag: "Wellness",
    read: "4 min",
    date: "April 22, 2026",
    author: {
      name: "Dr. Femi Oladipo",
      role: "Sports Psychologist",
      avatar: p3,
    },
    content: [
      "Amina had scored seventeen goals by December. By February, she could not sleep through the night. By March, she was vomiting before training sessions — not from illness, but from a dread she could not name.",
      "Nigerian football does not have a word for burnout. It has 'tired,' which is fixed by sleep. It has 'pressure,' which is solved by prayer. It has 'weakness,' which is corrected by silence. Amina had been silent for three seasons.",
      "The NinetyMinds wellness circle met in a community centre in Garki every Tuesday. Amina walked in on a rainy evening, wet boots in hand, and sat in the back. She did not speak for three sessions. On the fourth, she said one sentence: 'I think I'm breaking.'",
      "The circle did not offer advice. It offered witness. Six other athletes — a goalkeeper from Kano, a midfielder from Jos, two wingers from Lagos, a defender from Onitsha, and a striker from Aba — nodded. They had all broken, in their own ways.",
      "Within six weeks, Amina was sleeping again. Within ten, she scored a hat-trick against her former club. But the real victory, she told me, was not the goals. It was the conversation she had with her coach — the first honest conversation of her career.",
      "'I used to think mental health was for people who couldn't handle the game,' she said. 'Now I know: handling the game is mental health.'",
    ],
    quote: {
      text: "The circle did not fix me. It sat with me until I could fix myself.",
      attribution: "Amina Ibrahim, Forward",
    },
  },
  {
    slug: "ibadan-dawn-pitch",
    title: "Ibadan's dawn pitch — where 80 boys train before school.",
    excerpt: "Inside the grassroots academy turning out the country's most underrated wingers.",
    tag: "Community",
    read: "5 min",
    date: "March 8, 2026",
    author: {
      name: "Tolu Adebayo",
      role: "Field Reporter",
      avatar: p1,
    },
    content: [
      "The pitch at Molete wakes up before the city does. By 5:30 a.m., seventy or eighty boys are already there, some in jerseys, some in school uniforms they will change out of. The floodlights are paid for by a former player who never made it past the state league but never stopped believing someone else would.",
      "Coach Seyi does not use tactics boards. He uses chalk on concrete. He does not have a sports scientist. He has a former nurse who checks knees before rain. He does not have GPS trackers. He has a stopwatch he bought in 2011 that still works because he never dropped it.",
      "And yet, in the last three years, this pitch has produced four players now in NPFL squads, two in the national U-20 setup, and one — Tunde Bakare — who just signed his first professional contract at seventeen.",
      "The secret is not methodology. It is volume. Eighty boys, six days a week, two hours before school, two hours after. The ones who stay for three years without quitting are the ones who make it. The ones who quit on the first rainy morning were never going to make it anyway.",
      "'We don't discover talent here,' Coach Seyi told me, wiping chalk off his hands. 'We just don't let it leave early.'",
      "The boys are running sprints now. The sun is barely up. Somewhere in that group is a winger who will play in Europe one day, and a goalkeeper who will captain his country, and a defender who will become a coach and buy floodlights for another pitch. The cycle continues. The pitch never sleeps.",
    ],
    quote: {
      text: "We don't discover talent here. We just don't let it leave early.",
      attribution: "Coach Seyi, Molete Academy",
    },
  },
  {
    slug: "what-clubs-look-for",
    title: "What clubs actually look for in a 17-year-old.",
    excerpt: "Three scouts, one café in Lekki, and the metrics that decide who gets a contract.",
    tag: "Scouting",
    read: "7 min",
    date: "February 19, 2026",
    author: {
      name: "Ngozi Adimora",
      role: "Grassroots Editor",
      avatar: p2,
    },
    content: [
      "The café at Lekki Phase 1 does not look like a football headquarters. It serves cold brew and has Wi-Fi slower than a goalkeeper's distribution. But every Tuesday, three scouts sit at the corner table with laptops open, reviewing the week's grassroots footage.",
      "I spent a morning with them. Not to reveal secrets — scouts love secrets — but to understand what separates a trial invitation from a polite 'we'll be in touch.'",
      "Scout One, who works for a Premier League academy, starts every review with body language. 'Before the ball comes, how does he stand? Is he on his toes? Is he watching the game, or is the game watching him?' He says 60% of his rejections happen in the first ninety seconds of footage.",
      "Scout Two looks for error response. 'Every kid can play well when it's going well. I fast-forward to the mistake. Does he hide? Does he blame? Or does he chase the ball like he owes it an apology?'",
      "Scout Three, the only woman at the table, checks the data layer. Verified stats, match context, opponent quality. But she also reads the bio. 'I want to know where he comes from. Lagos street football teaches different survival skills than an academy in Abuja. Both are valuable. Both are different.'",
      "None of them mentioned step-overs. None mentioned pace in isolation. All three mentioned consistency — the ability to show the same level in game twelve that you showed in game two.",
      "'The best 17-year-old in Nigeria might not be the most talented,' Scout One said, closing his laptop. 'He's the one who still shows up when nobody's watching.'",
    ],
    quote: {
      text: "The best 17-year-old in Nigeria might not be the most talented. He's the one who still shows up when nobody's watching.",
      attribution: "Premier League Academy Scout",
    },
  },
  {
    slug: "pidgin-therapy",
    title: "Pidgin therapy: making mental health speak the player's language.",
    excerpt: "Why our sessions in Pidgin, Yoruba, Igbo and Hausa changed the conversation entirely.",
    tag: "Wellness",
    read: "3 min",
    date: "January 30, 2026",
    author: {
      name: "Dr. Femi Oladipo",
      role: "Sports Psychologist",
      avatar: p3,
    },
    content: [
      "The first wellness session I ran in Pidgin felt like a betrayal of my degree. I had spent six years learning clinical terminology — cognitive restructuring, somatic experiencing, dialectical behaviour therapy. And here I was, saying 'Your body dey tell you say something no dey right.'",
      "But the room changed. The boys who had sat silent in English sessions began to speak in paragraphs. The girls who had nodded politely started arguing, laughing, translating for each other across languages.",
      "We now run circles in four languages: Pidgin, Yoruba, Igbo, and Hausa. The content is the same. The framework is identical. But the vocabulary is theirs. 'Depression' becomes 'the thing wey dey make your chest heavy.' 'Anxiety' becomes 'when your mind no gree rest.'",
      "A striker from Kano told me: 'Doctor, when you speak English, I hear textbook. When you speak Hausa, I hear my mother.' That was the moment I knew we had it right.",
      "Language is not decoration. It is the architecture of trust. If a player cannot name their pain in the tongue they dream in, they will not name it at all. And if they cannot name it, they cannot heal it.",
    ],
    quote: {
      text: "When you speak English, I hear textbook. When you speak Hausa, I hear my mother.",
      attribution: "Anonymous striker, Kano",
    },
  },
  {
    slug: "verified-profile",
    title: "How a verified profile beat a thousand WhatsApp clips.",
    excerpt: "The case for footage, stats, and stories that scouts can trust on first open.",
    tag: "Discovery",
    read: "5 min",
    date: "January 12, 2026",
    author: {
      name: "Tolu Adebayo",
      role: "Field Reporter",
      avatar: p1,
    },
    content: [
      "Scout inboxes are graveyards of potential. Every Monday, a Lagos-based agent receives two hundred WhatsApp clips: shaky camera footage, vertical video, no context, no date, no opponent. He deletes 90% before the first cup of coffee.",
      "The problem is not talent. The problem is trust. A clip from a friendly game in 2023 looks identical to a clip from a state final in 2025 if you remove the metadata. And most grassroots footage has no metadata.",
      "NinetyMinds was built on the idea that verification is the new visibility. Every profile links to match footage with timestamps. Every stat is cross-referenced against a league database. Every story is written by a journalist who met the player, not a template filled out by an uncle.",
      "Kelechi Uche was the test case. A striker from Aba with 18 goals in 16 games — but no video, no verified data, no context. His first NinetyMinds profile included three match clips, a heat map, a scout report, and a 600-word story about his childhood.",
      "Within two weeks, three clubs had viewed his profile. Within a month, he had a trial. Within six weeks, a reserve contract. Not because he was unknown — he had been unknown in a pile of known-unknowns. The profile made him findable.",
      "'Before, I was a number in someone's phone,' Kelechi told me. 'Now I'm a name on a screen, with a story and stats that don't lie.'",
    ],
    quote: {
      text: "Before, I was a number in someone's phone. Now I'm a name on a screen, with a story and stats that don't lie.",
      attribution: "Kelechi Uche, Striker",
    },
  },
];

export const stories: Story[] = raw.map((s, i) => ({ ...s, img: imgs[i % imgs.length] }));

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
