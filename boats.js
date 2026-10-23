// ive used some real boat names, and made up the others.
// dialogue writing was real fun

const miss = (from, off) => (((from + 180 + off) % 360) + 360) % 360;

// =====================================================================
// ACT I
// =====================================================================

// First boat, tells you about the plague
addBoat({
  name: "WREN",
  arrivalTime: "00:10",
  location: 300,
  heading: miss(300, 28),
  speed: 28,
  turnRadius: 70,
  dockingTime: 70,
  dialogueEnter:
    "Greetings, Lightkeeper. I've brought supplies. Please light the way.",
  dialogueDock:
    "Thank you. Rumour is that a plague is spreading through the seas. Stay safe, keeper",
  dialogueCrash: "Mayday! Mayday! We're hit!",
  money: 60,
  food: 15,
});

// Teaches you about contracts and the lights
addBoat({
  name: "TUNA TRADER",
  arrivalTime: "01:05",
  location: 100,
  heading: miss(100, -30),
  speed: 28,
  turnRadius: 70,
  dockingTime: 70,
  dialogueEnter:
    "Fresh fish for $60. White light and I dock and we trade. Red, and I sail on.",
  dialogueDock: "Fair trade, Fair trade...",
  dialogueCrash: "My boat! My poor boat!",
  money: -60,
  food: 25,
  plague: 1,
});

// Teaches you not to trust everybody (Masks)
addBoat({
  name: "NAUTI BOUY",
  arrivalTime: "01:50",
  location: 60,
  heading: miss(60, 28),
  speed: 36,
  turnRadius: 65,
  dockingTime: 10,
  dialogueEnter: "Can I pwease dock?",
  dialogueDock: "Sorry mister, but I'll have to steal some food.",
  dialogueCrash: "AHHHH!",
  plunders: true, // a thief: takes whatever money you have, up to $50
  money: -50,
  food: -5,
});

// Low infection, honest trade
addBoat({
  name: "ORCHARD QUEEN",
  arrivalTime: "02:35",
  location: 320,
  heading: miss(320, -28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 45,
  dialogueEnter:
    "I'll give $70 and some apples for a dock - [cough] - sorry 'bout that.",
  dialogueDock: "Thank you. Eat well.",
  dialogueCrash: "The apples! Oh no!",
  money: 70,
  food: 20,
  plague: 6,
});

// Long dock
addBoat({
  name: "SANTA MARIA",
  arrivalTime: "03:30",
  location: 200,
  heading: miss(200, 30),
  speed: 34,
  turnRadius: 85,
  dockingTime: 180,
  dialogueEnter:
    "The previous harbor has shut its gates. I'll give $120 for a very long dock, Keeper.",
  dialogueDock: "Unloading will take a while. That's your fee.",
  dialogueCrash: "We're sinking! Mayday!",
  money: 120,
  plague: 4,
  size: 26,
});

// The infected repeat their words
addBoat({
  name: "SWIMMING MOTH",
  arrivalTime: "04:10",
  location: 30,
  heading: miss(30, 28),
  speed: 38,
  turnRadius: 65,
  dockingTime: 40,
  dialogueEnter: "We are fine. We are fine. We'll take some food for $90",
  dialogueDock: "Thank you. We are fine.",
  dialogueCrash: "Help!",
  money: 90,
  food: -5,
  plague: 8,
});

// Honest food
addBoat({
  name: "MEAT FOR THE SEAS",
  arrivalTime: "04:55",
  location: 270,
  heading: miss(270, -28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 40,
  dialogueEnter: "Smoked ham for $100. Honest trade!",
  dialogueDock: "Good choice. Enjoy!",
  dialogueCrash: "We're taking water!",
  money: -100,
  food: 25,
});

// ---- RUSH 1: DUSK RUSH (

// Honest trade. Rumour: the real Fair Winds sank.
// The player must notice that for when the pirates come
addBoat({
  name: "SPARROW",
  arrivalTime: "05:45",
  location: 30,
  heading: miss(30, -28),
  turnRadius: 65,
  speed: 30,
  dockingTime: 70,
  dialogueEnter:
    "Heard the Fair Winds went down. Pirates, they say. Dock for $80",
  dialogueDock: "Keep a sharp eye out for those pirates",
  dialogueCrash: "Mayday! Mayday!",
  money: -80,
});

addBoat({
  name: "MERRY ANNE",
  arrivalTime: "06:10",
  location: 280,
  heading: miss(280, 28),
  turnRadius: 70,
  dockingTime: 120,
  dialogueEnter: "Grain for $116. No tricks, Keeper.",
  dialogueDock: "Pleasure doing business",
  dialogueCrash: "We are going down!",
  money: 116,
  food: 25,
});

// Infected ship -> overpays
addBoat({
  name: "MARIGOLD",
  arrivalTime: "06:17",
  location: 280,
  speed: 45,
  heading: "harbor",
  turnRadius: 80,
  dockingTime: 90,
  dialogueEnter:
    "[cough] ...Marigold. We are fine. We'll pay triple. Let us in.",
  dialogueDock: "Thank you... it's warm here.",
  dialogueCrash: "We are fine... we are fine...",
  money: 300,
  food: -10,
  plague: 25,
});

// Small cure
addBoat({
  name: "PILGRIM'S AID",
  arrivalTime: "07:00",
  location: 220,
  heading: miss(220, -28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 50,
  dialogueEnter: "Medicine for $60, to save the infected",
  dialogueDock:
    "Stay well. A note: The ill forget the day and repeat themselves",
  dialogueCrash: "Save us!",
  money: -60,
  plague: -8,
  health: 10,
});

// very low infection
addBoat({
  name: "WILLOW",
  arrivalTime: "07:35",
  location: 130,
  heading: miss(130, 28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 40,
  dialogueEnter: "Cider and wine! $60 for a berth. Pardon the sniffle.",
  dialogueDock: "Cheers, Keeper.",
  dialogueCrash: "NOOO SAVE THE WINE!",
  money: 60,
  food: 10,
  plague: 5,
});

// =====================================================================
// ACT II
// =====================================================================

// THE PIRATE. Wears the name of the ship that sank
addBoat({
  name: "FAIR WINDS",
  arrivalTime: "08:00",
  location: 330,
  heading: miss(330, -26),
  speed: 34,
  lightResponse: "toward",
  turnRadius: 75,
  dockingTime: 20, // plunders and leaves
  dialogueEnter: "Ahoy matey, honest trade! $300 for one berth. Light us in!",
  dialogueDock: "Ha! Hands up! We're pirates, and we're looting it all!",
  dialogueCrash: "Curse you, lighthouse!",
  plunders: true, // takes whatever money you have, up to $400
  money: -400,
  food: -30,
  health: -25,
});

addBoat({
  name: "TERN",
  arrivalTime: "08:50",
  location: 90,
  heading: miss(90, -28),
  speed: 38,
  turnRadius: 65,
  dockingTime: 40,
  dialogueEnter: "Spices for your tastes! $90! [sniff] Very spicy indeed!",
  dialogueDock: "Spices and thanks.",
  dialogueCrash: "WHAT THE HELL",
  money: -90,
  food: 10,
  plague: 10,
});

addBoat({
  name: "FISH AND CHIPS",
  arrivalTime: "09:20",
  location: 255,
  heading: miss(255, 28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 40,
  dialogueEnter: "Read the name. $70 for the lot.",
  dialogueDock: "A fair trade",
  dialogueCrash: "THE FISH ARE ESCAPING",
  money: -70,
  food: 25,
  plague: 1,
});

addBoat({
  name: "GREY MAGGOT",
  arrivalTime: "09:35",
  location: 350,
  heading: "harbor",
  speed: 36,
  turnRadius: 75,
  dockingTime: 150,
  dialogueEnter:
    "What day is it...? Let us stay for a while, Keeper, for $1000",
  dialogueDock: "So warm. We are well.",
  dialogueCrash: "We are well... we are well...",
  money: 1000,
  food: -15,
  plague: 30,
});

// another tush

// The doctor
addBoat({
  name: "Dr. Quill",
  arrivalTime: "10:00",
  location: 30,
  heading: miss(30, 28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 100,
  dialogueEnter:
    "Medicine for $100. The sick repeat themselves and forget the day. Remember that.",
  dialogueDock: "Medicine delivered. I'll stay a while and tend the sick.",
  dialogueCrash: "The medicine! Save the medicine!",
  money: -100,
  plague: -25,
  health: 20,
});

// the refugees
addBoat({
  name: "MAYFLOWER",
  arrivalTime: "10:15",
  location: 200,
  heading: miss(200, 30),
  speed: 28,
  turnRadius: 95,
  dockingTime: 120,
  size: 28,
  lightResponse: "toward", // They ignore red, as they are desparate
  dialogueEnter: "We are refugees. Please we have no food. Please",
  dialogueDock: "We are sorry keeper. We needed to dock",
  dialogueCrash: "The children! Oh no!",
  food: -25,
  plague: 15,
  health: 8,
});

addBoat({
  name: "PEDDLER",
  arrivalTime: "10:30",
  location: 250,
  heading: miss(250, 30),
  turnRadius: 60,
  dockingTime: 60,
  dialogueEnter: "Salt and bread, $80 the lot. A fair price.",
  dialogueDock: "Good business",
  dialogueCrash: "Mayday!",
  money: -80,
  food: 30,
  plague: 1,
});

// Infected, wearing a happy face
addBoat({
  name: "SEA WAIFU",
  arrivalTime: "10:45",
  location: 110,
  heading: "harbor",
  turnRadius: 80,
  dockingTime: 90,
  dialogueEnter:
    "I am well. I am happy. I have food, money, everything, for you. Let me in",
  dialogueDock: "Warm... so warm here. Thank you.",
  dialogueCrash: "I am well... I am happy...",
  money: 180,
  food: 25,
  plague: 30,
});

addBoat({
  name: "PALE LILY",
  arrivalTime: "11:15",
  location: 150,
  heading: miss(150, -28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 50,
  dialogueEnter:
    "$100 for a simple docking. [cough] Long crossing, that's all.",
  dialogueDock: "Bless you, Keeper.",
  dialogueCrash: "She's going over!",
  money: 100,
  food: 15,
  plague: 8,
});

addBoat({
  name: "WOOLLY MAMMOTH",
  arrivalTime: "11:45",
  location: 15,
  heading: miss(15, 28),
  speed: 38,
  turnRadius: 60,
  dockingTime: 40,
  dialogueEnter: "Wool trader. $90 for a berth, no tricks.",
  dialogueDock: "Pleasure doing business.",
  dialogueCrash: "Mayday! Mayday!",
  money: 90,
});

addBoat({
  name: "BOLTING BEER",
  arrivalTime: "12:10",
  location: 280,
  heading: miss(280, 28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 50,
  dialogueEnter: "Wine and Beer! $160 for a berth. We are all fine here.",
  dialogueDock: "All fine. All fine.",
  dialogueCrash: "We're not fine! We're not fine!",
  money: 160,
  food: 20,
  plague: 12,
});

addBoat({
  name: "BEAGLE",
  arrivalTime: "12:40",
  location: 160,
  heading: miss(160, -28),
  speed: 36,
  turnRadius: 65,
  dockingTime: 60,
  dialogueEnter: "Quiet seas today, Keeper. $100 for a berth and a rest?",
  dialogueDock: "Thank you. It's good to see a lamp still lit.",
  dialogueCrash: "We're taking water!",
  money: 100,
  food: 10,
});

addBoat({
  name: "FLOATING BAKERY",
  arrivalTime: "13:20",
  location: 190,
  heading: miss(190, -28),
  speed: 34,
  turnRadius: 65,
  dockingTime: 40,
  dialogueEnter: "Warm bread for $60",
  dialogueDock: "Eat it while it's warm.",
  dialogueCrash: "Save the bread!",
  money: -60,
  food: 25,
  plague: 1,
});

addBoat({
  name: "SKIPPER JOE",
  arrivalTime: "13:50",
  location: 70,
  heading: miss(70, 28),
  speed: 38,
  turnRadius: 65,
  dockingTime: 35,
  dialogueEnter:
    "I'll give $80 for some food, Keeper. Crew has some allergies.",
  dialogueDock: "Cheers, Keeper.",
  dialogueCrash: "Joe's gone over!",
  money: 80,
  food: -15,
  plague: 6,
});

// Infected. This is one of my favorite ship names
addBoat({
  name: "CALLIOPE",
  arrivalTime: "14:25",
  location: 175,
  heading: "harbor",
  speed: 34,
  turnRadius: 80,
  dockingTime: 60,
  dialogueEnter: "Same song, same song. We'll pay $390. Let us in.",
  dialogueDock: "Same song. Same song.",
  dialogueCrash: "Same song... same song...",
  money: 390,
  plague: 15,
});

// Cure
addBoat({
  name: "SMALL MERCY",
  arrivalTime: "14:40",
  location: 135,
  heading: miss(135, -28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 50,
  dialogueEnter: "Medic ship. Remedies for $90.",
  dialogueDock: "Use them well.",
  dialogueCrash: "The medicine!",
  money: -90,
  plague: -18,
  health: 18,
});

// The friend returns, sick
addBoat({
  name: "WREN",
  arrivalTime: "15:00",
  location: 300,
  heading: "harbor",
  speed: 32,
  turnRadius: 70,
  dockingTime: 150,
  dialogueEnter: "I'm back, Keeper. Just a cough. Please, you know me.",
  dialogueDock: "Bless you, Keeper. I'll rest in the hold. The cargo is yours.",
  dialogueCrash: "Keeper... why...",
  money: 80,
  food: 30,
  plague: 30,
});

// =====================================================================
// ACT III
// =====================================================================

addBoat({
  name: "REFUGE",
  arrivalTime: "16:00",
  location: 100,
  heading: miss(100, -28),
  speed: 36,
  turnRadius: 65,
  dockingTime: 45,
  dialogueEnter: "We'll pay $120. [cough] We left in a hurry.",
  dialogueDock: "Thank you. We'll rest.",
  dialogueCrash: "The ship is breaking up!",
  money: 120,
  food: 10,
  plague: 9,
  health: 1,
});

addBoat({
  name: "LONG TIDE",
  arrivalTime: "16:30",
  location: 230,
  heading: miss(230, 28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 40,
  dialogueEnter:
    "Long Tide. $100 for a berth, Keeper. A little fever aboard, nothing worse.",
  dialogueDock: "Much obliged.",
  dialogueCrash: "Hard to starboard!",
  money: 100,
  food: 10,
  plague: 7,
});

// ---- third rush

// A poor family. They will crash into the infected ship unless u act fast
const tide = addBoat({
  name: "FISHERMAN",
  arrivalTime: "17:00",
  location: 150,
  heading: miss(150, -28),
  speed: 34,
  size: 15,
  turnRadius: 40,
  dockingTime: 150,
  departHeading: 270,
  dialogueEnter:
    "We are a fishing family. No coin, no catch. Seven mouths, all healthy. Please.",
  dialogueDock: "You'll not regret this, Keeper. We'll mend your nets.",
  dialogueCrash: "May god save us...",
  food: -10,
  health: 8,
});

// Infected
addBoat({
  name: "VESPER",
  arrivalTime: "17:15",
  location: 40,
  heading: "harbor",
  turnRadius: 80,
  dockingTime: 50,
  dialogueEnter:
    "Crew is healthy, very healthy, hold full of wheat. $350 for a berth.",
  dialogueDock: "A pleasure. The wheat is yours too.",
  dialogueCrash: "AHHHH",
  money: 350,
  food: 25,
  plague: 30,
});

addBoat({
  name: "CARPATHIA",
  arrivalTime: "17:30",
  location: 270,
  heading: miss(270, 28),
  turnRadius: 70,
  dockingTime: 90,
  dialogueEnter: "Rescue ship. Medicine for $120. Guide us in, Keeper.",
  dialogueDock: "Take these. Keep your harbor clean.",
  dialogueCrash: "Man overboard!",
  money: -120,
  plague: -10,
  health: 10,
});

addBoat({
  name: "GANNET",
  arrivalTime: "17:45",
  location: 100,
  heading: miss(100, -28),
  turnRadius: 65,
  dockingTime: 70,
  dialogueEnter: "Grain and oil. $140 for a berth. Honest cargo, Keeper.",
  dialogueDock: "Good doing business. Stay safe.",
  dialogueCrash: "She's breaking up!",
  money: 140,
  food: 20,
  plague: 1,
});

// hehe a reference
addBoat({
  name: "TITANIC",
  arrivalTime: "18:00",
  location: 20,
  heading: miss(20, 28),
  speed: 36,
  turnRadius: 65,
  dockingTime: 45,
  dialogueEnter: "We'll give $150 for some food. We are not sick.",
  dialogueDock: "Nobody is sick.",
  dialogueCrash: "Not again...", // hehe
  money: 150,
  food: -20,
  plague: 11,
});

// THE INFECTED
// Will kill the aw-so poor family unless you save them
// Save the family, or save yourselves?
addBoat({
  name: "HOLLOW BELL",
  arrivalTime: "18:30",
  latest: "21:00",
  spawnWhen: () => tide.state === "docked" && gameTime >= tide.dockedUntil - 13, //
  location: () => ({
    bearing: BERTH_BEARINGS[tide.target ?? 1],
    distance: 440,
  }),
  heading: "harbor",
  speed: 22,
  turnRadius: 80,
  lightResponse: "ignore",
  onHarbor: "ram",
  dialogueEnter:
    "...the helm won't answer... we can't turn... we are coming in...",
  dialogueCrash: "...so quiet...",
  health: -25,
  plague: 35,
});

addBoat({
  name: "MEAT FOR THE SEAS",
  arrivalTime: "18:40",
  location: 160,
  heading: miss(160, -28),
  speed: 34,
  turnRadius: 65,
  dockingTime: 45,
  dialogueEnter: "Salty fried squid for $100. Honest trade!",
  dialogueDock: "Good choice. Enjoy!",
  dialogueCrash: "We're taking water!",
  money: -100,
  food: 30,
  plague: 1,
});

addBoat({
  name: "FOGHORN",
  arrivalTime: "19:10",
  location: 260,
  heading: "harbor",
  speed: 60,
  turnRadius: 75,
  dockingTime: 45,
  dialogueEnter: "We are fine, fine, fine. $170, let us in.",
  dialogueDock: "Fine. Fine. Fine.",
  dialogueCrash: "Fine... fine... fine...",
  money: 170,
  food: 15,
  plague: 23,
});

addBoat({
  name: "TWO SISTERS",
  arrivalTime: "19:30",
  location: 60,
  heading: miss(60, -28),
  speed: 36,
  turnRadius: 65,
  dockingTime: 40,
  dialogueEnter:
    "Siblings here! $50 for a dock. One of us has a cough. But we have food!",
  dialogueDock: "God bless you, Keeper.",
  dialogueCrash: "SISTER!",
  money: 50,
  food: 10,
  plague: 8,
});

// Interesting name. Its a real ship
addBoat({
  name: "KITTIWAKE",
  arrivalTime: "20:05",
  location: 340,
  heading: miss(340, 28),
  speed: 34,
  turnRadius: 70,
  dockingTime: 50,
  dialogueEnter: "Last of the remedies, $130.",
  dialogueDock: "Keep it dry. Keep it close.",
  dialogueCrash: "The last of it!",
  money: -130,
  plague: -25,
  health: 20,
});

addBoat({
  name: "DRIFTWOOD",
  arrivalTime: "20:30",
  location: 200,
  heading: miss(200, -28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 40,
  dialogueEnter: "$140 - [cough] Sorry that was wood smoke.",
  dialogueDock: "Wood smoke.",
  dialogueCrash: "Mayday! Mayday!",
  money: 140,
  food: 10,
  plague: 10,
});

// friend is back, they'll die
addBoat({
  name: "WREN",
  arrivalTime: "20:55",
  location: 40,
  heading: "harbor",
  speed: 50,
  lightResponse: "ignore",
  turnRadius: 80,
  dockingTime: 40,
  onHarbor: "ram",
  dialogueEnter: "...[cough]...[cough]... I am sorry, Keeper",
  dialogueCrash: "Bliss...",
  health: -30,
  plague: 35,
});

// Last honest contract. High price medicine. It will not be enough
addBoat({
  name: "LAST TRADER",
  arrivalTime: "21:30",
  location: 90,
  heading: miss(90, 28),
  speed: 36,
  turnRadius: 70,
  dockingTime: 10,
  dialogueEnter: "Medicine for $400. No haggling. After me, there is no more.",
  dialogueDock: "Take it. It won't be enough.",
  dialogueCrash: "Nothing left to save...",
  money: -400,
  plague: -30,
  health: 15,
});

// =====================================================================
// THE END: six infected boats from every direction. There is no good ending muahahahahhahahahah
// =====================================================================
[0, 60, 120, 180, 240, 300].forEach((bearing, i, all) => {
  addBoat({
    name: "...",
    arrivalTime: "22:50",
    location: bearing,
    heading: "harbor",
    speed: 25,
    turnRadius: 80,
    lightResponse: "ignore",
    onHarbor: "ram",
    endsGame: true,
    dialogueEnter: "We are fine. We are fine. We are fine. We are fine.",
    dialogueCrash: "NA",
  });
});
