import p1 from "@/assets/player-1.jpg";
import p2 from "@/assets/player-2.jpg";
import p3 from "@/assets/player-3.jpg";

export type Player = {
  slug: string;
  name: string;
  pos: string;
  age: number;
  city: string;
  club: string;
  rating: number;
  number: number;
  img: string;
  bio: string;
  highlights: string[];
  stats: [string, string][];
};

const imgs = [p1, p2, p3];

const raw: Omit<Player, "img">[] = [
  {
    slug: "chidera-okonkwo", name: "Chidera Okonkwo", pos: "Midfielder", age: 19, city: "Lagos",
    club: "Lagos Island FC Academy", rating: 83, number: 8,
    bio: "A box-to-box engine from the streets of Surulere. Chidera plays with the calmness of a veteran and the lungs of a teenager who has never stopped running.",
    highlights: ["Top assist provider, Lagos U-20 League 2025", "MVP — Naija Youth Cup quarter-final", "Trial invitation, Enyimba FC"],
    stats: [["187","Caps"],["42","Goals"],["67","Assists"]],
  },
  {
    slug: "amina-ibrahim", name: "Amina Ibrahim", pos: "Forward", age: 21, city: "Abuja",
    club: "Abuja Queens FC", rating: 84, number: 9,
    bio: "A clinical 9 who reads space before defenders feel it. Amina led her state side to back-to-back national finals before turning twenty.",
    highlights: ["Golden Boot — Naija Women's Premier 2024", "Hat-trick vs Bayelsa Queens", "Super Falcons U-23 call-up"],
    stats: [["115","Caps"],["62","Goals"],["34","Assists"]],
  },
  {
    slug: "tunde-bakare", name: "Tunde Bakare", pos: "Winger", age: 17, city: "Ibadan",
    club: "Shooting Stars Youth", rating: 80, number: 11,
    bio: "Left foot like a whip. Tunde took a bus six hours to his first trial and walked into the starting XI by the second week.",
    highlights: ["Fastest U-17 in Oyo combine (10.9s)", "8 goals in 6 youth league games", "Featured in BBC Africa Sport"],
    stats: [["64","Caps"],["28","Goals"],["19","Assists"]],
  },
  {
    slug: "ifeanyi-eze", name: "Ifeanyi Eze", pos: "Defender", age: 20, city: "Enugu",
    club: "Rangers Int'l Feeder", rating: 81, number: 4,
    bio: "A centre back who reads the game two passes ahead. Ifeanyi grew up in Coal City and learned to defend on broken concrete.",
    highlights: ["Best Defender — Coal City Cup", "Clean sheets in 11 of 14 games", "Trial: FC Ifeanyi Ubah"],
    stats: [["92","Caps"],["6","Goals"],["12","Assists"]],
  },
  {
    slug: "blessing-adeyemi", name: "Blessing Adeyemi", pos: "Goalkeeper", age: 18, city: "Ogun",
    club: "Sunshine Queens U-20", rating: 79, number: 1,
    bio: "Tall, brave, and fearless on crosses. Blessing started in goal because she was the tallest at school. She never left.",
    highlights: ["Penalty hero — Ogun State Final 2025", "Clean sheets in 9 straight games", "U-20 national camp invite"],
    stats: [["48","Caps"],["0","Goals"],["3","Assists"]],
  },
  {
    slug: "kelechi-uche", name: "Kelechi Uche", pos: "Striker", age: 19, city: "Aba",
    club: "Abia Warriors Academy", rating: 82, number: 10,
    bio: "Powerful runner with a poacher's instinct. Kelechi has been hunting in the box since he could walk in boots two sizes too big.",
    highlights: ["18 goals in 16 academy games", "Brace vs Heartland Youth", "Trial invitation — Plateau United"],
    stats: [["73","Caps"],["41","Goals"],["12","Assists"]],
  },
  {
    slug: "fatima-musa", name: "Fatima Musa", pos: "Midfielder", age: 18, city: "Kano",
    club: "Kano Pillarettes", rating: 81, number: 6,
    bio: "A creative 10 who plays football like she's writing poetry. Fatima trains in Kano at dawn before school, every day.",
    highlights: ["MVP — Northern Women's Cup", "11 assists in a single season", "Featured in CAF Online"],
    stats: [["58","Caps"],["17","Goals"],["31","Assists"]],
  },
  {
    slug: "samuel-okeke", name: "Samuel Okeke", pos: "Right Back", age: 20, city: "Onitsha",
    club: "Niger Tornadoes Youth", rating: 80, number: 2,
    bio: "Tireless overlap, gutsy tackle. Samuel runs the right channel like it owes him money.",
    highlights: ["Most distance covered — Eastern Combine", "5 assists from full-back", "Trial: Akwa United"],
    stats: [["81","Caps"],["3","Goals"],["22","Assists"]],
  },
  {
    slug: "joy-okafor", name: "Joy Okafor", pos: "Winger", age: 17, city: "Port Harcourt",
    club: "Rivers Angels U-17", rating: 80, number: 7,
    bio: "Two-footed, two-faced — a smile off the pitch and a nightmare on it. Joy beats defenders for fun.",
    highlights: ["12 goals, 9 assists — U-17 league", "MVP — South-South Tournament", "Falconets shadow squad"],
    stats: [["44","Caps"],["19","Goals"],["18","Assists"]],
  },
  {
    slug: "musa-yakubu", name: "Musa Yakubu", pos: "Defensive Mid", age: 22, city: "Jos",
    club: "Plateau United Reserves", rating: 82, number: 5,
    bio: "Anchor in midfield, calm under pressure. Musa breaks play and starts attacks with the same casual genius.",
    highlights: ["Captain — Plateau Reserves", "92% pass completion (season)", "Trial: Remo Stars"],
    stats: [["134","Caps"],["8","Goals"],["27","Assists"]],
  },
];

export const players: Player[] = raw.map((p, i) => ({ ...p, img: imgs[i % imgs.length] }));

export const getPlayer = (slug: string) => players.find((p) => p.slug === slug);
