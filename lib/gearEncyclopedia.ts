// ============================================================
// Gear Encyclopedia
// Auto-generated from research; edit carefully.
// ============================================================

export interface GearNotableUser {
  artist: string;
  usage: string;
  sound: string;
}

export interface GearEntry {
  name: string;
  overview: string;
  controls: { name: string; description: string }[];
  notableUsers: GearNotableUser[];
  yearIntroduced?: string;
  manufacturer?: string;
  aliases?: string[];
}

export const GEAR_ENCYCLOPEDIA: Record<string, GearEntry> = {

  // ─────────────────────────────────────────────
  // AMPLIFIERS
  // ─────────────────────────────────────────────

  "marshall super lead plexi": {
    name: "Marshall Super Lead 1959 (Plexi)",
    manufacturer: "Marshall Amplification",
    yearIntroduced: "1966",
    overview:
      "The Marshall JMP 1959 Super Lead — universally known as the 'Plexi' after its Plexiglas control panel — is a 100-watt all-valve head produced from 1966 to 1981 and widely regarded as the definitive rock amplifier. Developed at Pete Townshend's request for a louder amp, it was updated in 1967 with EL34 power tubes, giving it the snarling, aggressive midrange that defined hard rock. With no master volume, it must be played at high volume to achieve its characteristic saturated roar. Paired with two 4x12 cabs into a 'Marshall stack,' it became the iconic sound of Jimi Hendrix, Eric Clapton, and an entire generation of rock guitar.",
    controls: [
      { name: "Volume (Input I)", description: "Controls the level of the brighter-sounding high-gain input channel." },
      { name: "Volume (Input II)", description: "Controls the level of the darker-sounding second channel. Patching the two inputs together creates a unique blended EQ." },
      { name: "Bass", description: "Passive bass frequency control affecting low-end fullness." },
      { name: "Middle", description: "Controls the midrange presence, the heart of the amp's punch and warmth." },
      { name: "Treble", description: "Shapes high-frequency content and edge." },
      { name: "Presence", description: "Boosts upper harmonics in the power amp stage via reduced negative feedback, adding bite and cut." },
    ],
    aliases: ["Plexi", "1959 SLP", "Marshall Plexi", "Super Lead"],
    notableUsers: [
      { artist: "Jimi Hendrix", usage: "Are You Experienced, Electric Ladyland, Woodstock 1969", sound: "Explosive, saturated sustain with enormous dynamic range — the raw voice of rock guitar" },
      { artist: "Eric Clapton", usage: "John Mayall's Bluesbreakers 'Beano' album (JTM45/Plexi)", sound: "Creamy, vocal-like lead tone at the edge of breakup" },
      { artist: "Pete Townshend", usage: "The Who, early albums and Live at Leeds", sound: "Thunderous, aggressive rhythm with explosive power chords" },
      { artist: "Eddie Van Halen", usage: "Van Halen I & II (modified 1968 Plexi)", sound: "Brown sound — harmonic-rich, saturated leads with explosive attack" },
      { artist: "Angus Young", usage: "AC/DC Let There Be Rock, Highway to Hell", sound: "Fierce, cutting mid-forward crunch perfect for arena rock riffing" },
      { artist: "Slash", usage: "Early Guns N' Roses live shows", sound: "Raw, organic British crunch with natural power-tube saturation" },
    ],
  },

  "marshall jcm800": {
    name: "Marshall JCM800",
    manufacturer: "Marshall Amplification",
    yearIntroduced: "1981",
    overview:
      "The Marshall JCM800 series — most famously the Model 2203 100-watt head — was introduced in 1981 and became the dominant guitar amplifier of the 1980s hard rock and heavy metal era. Its single master-volume preamp allows the preamp stage to be overdriven at manageable volumes, delivering aggressive, midrange-focused crunch and searing lead tones. EL34 power tubes (or 6550s in US exports) give it a percussive, cutting attack that defined the decade. The JCM800 was discontinued in 1990 in favor of the JCM900, but remains a studio and stage staple.",
    controls: [
      { name: "Preamp Volume", description: "Controls the amount of preamp gain and distortion — the primary tone-shaping control." },
      { name: "Master Volume", description: "Sets the overall output level, allowing the preamp to be saturated at any stage volume." },
      { name: "Bass", description: "Controls low-frequency content." },
      { name: "Middle", description: "Controls midrange punch and warmth." },
      { name: "Treble", description: "Controls high-frequency brightness and edge." },
      { name: "Presence", description: "Boosts upper harmonics and cut in the power amp section." },
    ],
    aliases: ["JCM800", "2203", "2204"],
    notableUsers: [
      { artist: "Slash", usage: "Guns N' Roses Appetite for Destruction, Use Your Illusion", sound: "Warm, harmonically rich lead tone with classic British crunch" },
      { artist: "Zakk Wylde", usage: "Ozzy Osbourne, Black Label Society", sound: "Massive, aggressive pinch harmonic-laden heavy metal tone" },
      { artist: "Kerry King", usage: "Slayer Reign in Blood, South of Heaven", sound: "Ferocious, mid-forward thrash metal aggression" },
      { artist: "Dave Grohl", usage: "First Foo Fighters album and tour (1995)", sound: "Raw, powerful alternative rock grunt" },
      { artist: "Jerry Cantrell", usage: "Alice in Chains Facelift, Dirt (Bogner-modified)", sound: "Dark, detuned sludge-rock crunch with singing lead tone" },
    ],
  },

  "fender twin reverb": {
    name: "Fender Twin Reverb",
    manufacturer: "Fender",
    yearIntroduced: "1963",
    overview:
      "The Fender Twin Reverb is an 85-watt (later 100-watt) all-tube combo amplifier introduced in 1963 during Fender's 'blackface' era, and is considered the benchmark for clean, articulate guitar amplification. Its two 12-inch speakers, 6L6 power tubes, built-in spring reverb, and vibrato circuit define the quintessential American clean tone — sparkling, wide, and authoritative. From surf and country to jazz and blues, the Twin Reverb's pristine headroom made it a studio workhorse for over six decades.",
    controls: [
      { name: "Volume (Normal)", description: "Controls the level of the normal (non-vibrato) channel." },
      { name: "Volume (Vibrato)", description: "Controls the level of the vibrato channel." },
      { name: "Treble", description: "Controls high-frequency brightness on each channel." },
      { name: "Middle", description: "Controls midrange presence." },
      { name: "Bass", description: "Controls low-frequency depth." },
      { name: "Reverb", description: "Controls the amount of spring reverb (Vibrato channel only)." },
      { name: "Speed", description: "Controls the rate of the vibrato/tremolo oscillation." },
      { name: "Intensity", description: "Controls the depth of the vibrato/tremolo effect." },
      { name: "Bright Switch", description: "Engages a treble-boost capacitor for extra shimmer on each channel." },
    ],
    aliases: ["Twin Reverb", "Blackface Twin", "Silverface Twin", "Fender Twin"],
    notableUsers: [
      { artist: "Mark Knopfler", usage: "Dire Straits Sultans of Swing, Brothers in Arms", sound: "Pristine, articulate clean tone with natural dynamic response" },
      { artist: "Steve Jones", usage: "Sex Pistols Never Mind the Bollocks", sound: "Cranked into a surprisingly full wall of overdriven rhythm guitar" },
      { artist: "Jerry Garcia", usage: "Grateful Dead early live shows", sound: "Crystalline, sparkling clean lead tone" },
      { artist: "Johnny Marr", usage: "The Smiths, debut album", sound: "Chiming, chorus-laden clean rhythm guitar" },
      { artist: "Andy Summers", usage: "The Police Outlandos d'Amour, Reggatta de Blanc", sound: "Effervescent, effects-saturated clean tone" },
    ],
  },

  "fender deluxe reverb": {
    name: "Fender Deluxe Reverb",
    manufacturer: "Fender",
    yearIntroduced: "1963",
    overview:
      "The Fender Deluxe Reverb is a 22-watt, single 12-inch combo amplifier first introduced in 1963, and is often called the most recorded guitar amplifier in history. Its modest wattage means the 6V6 power tubes begin to compress and break up at studio-friendly volumes, yielding a warm, touch-sensitive overdrive that sits beautifully in recordings. The built-in spring reverb and vibrato circuit are legendary, and the amp balances pristine clean headroom with natural grit when pushed, making it equally prized for blues, country, rock, and pop.",
    controls: [
      { name: "Volume (Normal)", description: "Level control for the normal clean channel." },
      { name: "Volume (Vibrato)", description: "Level control for the vibrato channel (also the one with reverb)." },
      { name: "Treble", description: "High-frequency shaping control." },
      { name: "Middle", description: "Midrange presence control." },
      { name: "Bass", description: "Low-frequency control." },
      { name: "Reverb", description: "Controls the mix of the onboard spring reverb tank (Vibrato channel only)." },
      { name: "Speed", description: "Rate of the tremolo/vibrato effect." },
      { name: "Intensity", description: "Depth of the tremolo/vibrato effect." },
      { name: "Bright Switch", description: "Adds a high-frequency cap bypass for extra top-end sparkle." },
    ],
    aliases: ["Deluxe Reverb", "DR", "Blackface Deluxe", "Silverface Deluxe"],
    notableUsers: [
      { artist: "Roy Buchanan", usage: "Solo recordings, live performances", sound: "Searing, controlled lead tone cranked to the edge of breakup" },
      { artist: "Dan Auerbach", usage: "The Black Keys Let's Rock (2019)", sound: "Warm, lo-fi blues-rock crunch" },
      { artist: "Neil Young", usage: "Harvest Moon, acoustic-influenced recordings", sound: "Warm, woody, intimate clean tone" },
      { artist: "Eric Clapton", usage: "Various studio and live sessions", sound: "Punchy, dynamic clean tone with touch-sensitive response" },
    ],
  },

  "fender bassman": {
    name: "Fender Bassman",
    manufacturer: "Fender",
    yearIntroduced: "1952",
    overview:
      "The Fender Bassman was introduced in 1952 as a dedicated bass amplifier, but its legendary 5F6-A circuit (1958–1960) — a 45-watt 4x10 combo — became one of the most important guitar amplifiers ever made. Jim Marshall directly copied the 5F6-A circuit as the basis for the first Marshall JTM45, establishing the Bassman's foundational influence on rock amplification. Its two channels, three-band EQ, and responsive power amp deliver a full, dynamic overdrive beloved by blues, rock, and country players. Buddy Holly, Eric Clapton, and Neil Young all found their tone through the Bassman.",
    controls: [
      { name: "Volume (Bright)", description: "Controls the level of the bright, high-gain input channel." },
      { name: "Volume (Normal)", description: "Controls the level of the darker normal channel." },
      { name: "Treble", description: "High-frequency shaping." },
      { name: "Middle", description: "Midrange character control." },
      { name: "Bass", description: "Low-frequency fullness." },
      { name: "Presence", description: "Boosts upper harmonics in the power amp stage." },
    ],
    aliases: ["Tweed Bassman", "5F6-A", "59 Bassman"],
    notableUsers: [
      { artist: "Buddy Guy", usage: "Early Chicago blues recordings", sound: "Raw, sizzling electric blues with natural amp breakup" },
      { artist: "Eric Clapton", usage: "John Mayall's Blues Breakers 'Beano' album", sound: "Smooth, vocal-like lead tone pushed to the edge of distortion" },
      { artist: "Kurt Cobain", usage: "Nirvana Nevermind recording sessions", sound: "Gritty, full alternative rock crunch" },
      { artist: "Neil Young", usage: "Live and studio work throughout career", sound: "Raw, organic rock tone with natural sag" },
    ],
  },

  "fender tweed": {
    name: "Fender Tweed Amplifiers",
    manufacturer: "Fender",
    yearIntroduced: "1948",
    overview:
      "The Fender 'tweed' era (roughly 1948–1960) produced some of the most beloved and historically important guitar amplifiers ever made, named for their distinctive lacquered tweed fabric covering. Key models include the Tweed Deluxe (5E3 — a 15-watt 1x12 with two 6V6s), the Tweed Bassman (5F6-A — a 45-watt 4x10 with two 6L6s), and the Tweed Champ (single-ended 5-watt 1x8). These amplifiers are celebrated for their wide-open, dynamically responsive tone that transitions smoothly from clean to gloriously saturated overdrive as volume increases — the blueprint for 'amp feel.' Their circuits directly inspired Marshall's first amplifiers.",
    controls: [
      { name: "Volume", description: "Controls both the clean level and the amount of natural amp distortion — the primary tone control in single-channel models." },
      { name: "Tone", description: "A simple high-frequency roll-off control on basic models; later expanded to Treble/Middle/Bass on larger models." },
      { name: "Treble", description: "High-frequency control on multi-EQ models like the Bassman." },
      { name: "Middle", description: "Midrange control on larger tweed models." },
      { name: "Bass", description: "Low-frequency control on multi-EQ models." },
      { name: "Presence", description: "Power-amp treble boost on larger models like the Bassman." },
    ],
    aliases: ["Tweed Deluxe", "Tweed Bassman", "Tweed Champ", "Tweed Pro", "5E3", "5F6-A"],
    notableUsers: [
      { artist: "Neil Young", usage: "Cinnamon Girl, Down By The River (Tweed Deluxe)", sound: "Raw, searing lead tone drenched in natural power-tube compression" },
      { artist: "Billy Gibbons", usage: "ZZ Top early albums (Tweed Deluxe)", sound: "Warm, saturated Texas blues-rock crunch" },
      { artist: "Buddy Holly", usage: "1950s rock and roll recordings", sound: "Bright, punchy rockabilly twang with a hint of grit" },
      { artist: "Bruce Springsteen", usage: "1970s studio and live work", sound: "Warm, driving rock 'n' roll with organic dynamics" },
      { artist: "Joe Bonamassa", usage: "Contemporary blues touring rigs", sound: "Lush, harmonically rich modern blues lead tone" },
    ],
  },

  "vox ac30 top boost": {
    name: "Vox AC30 Top Boost",
    manufacturer: "Vox (Jennings Musical Instruments)",
    yearIntroduced: "1959",
    overview:
      "The Vox AC30 is a 30-watt all-valve combo amplifier first built in 1959, initially to satisfy Hank Marvin's request for a louder alternative to the AC15. Its EL84 power tubes and Celestion Alnico Blue speakers create a characteristically chimey, harmonically rich sound quite unlike any American amplifier. The 'Top Boost' circuit — added around 1961 and made standard by 1963 — introduced dedicated Bass and Treble controls and an extra gain stage to the Brilliant channel, enabling the amp's trademark jangly sparkle and cream-like overdrive. The AC30 defined the British Invasion sound and remains a cornerstone of pop, rock, shoegaze, and alternative guitar.",
    controls: [
      { name: "Volume (Brilliant)", description: "Master level for the Brilliant (Top Boost) channel — the most commonly used channel." },
      { name: "Volume (Normal)", description: "Level for the Normal channel, darker and simpler in EQ." },
      { name: "Bass (Top Boost)", description: "Low-frequency control for the Brilliant channel, added by the Top Boost circuit." },
      { name: "Treble (Top Boost)", description: "High-frequency control for the Brilliant channel — crucial for the AC30's characteristic chime." },
      { name: "Tone (Normal)", description: "Simple high-cut tone control on the Normal channel." },
      { name: "Speed", description: "Controls the rate of the built-in tremolo oscillator." },
      { name: "Depth", description: "Controls the intensity of the tremolo effect." },
    ],
    aliases: ["AC30", "AC30/6", "Vox AC30", "Top Boost"],
    notableUsers: [
      { artist: "The Beatles", usage: "Early Beatles recordings and live shows 1962–1966", sound: "Jangly, bright British pop chime with a chimey overdrive on lead" },
      { artist: "Brian May", usage: "Queen 1973–present, stacked wall of AC30s", sound: "Layered, orchestral lead tone with brilliant top-end sparkle" },
      { artist: "The Edge", usage: "U2 from The Unforgettable Fire onwards", sound: "Clean, crystalline foundation for elaborate delay-driven textures" },
      { artist: "Tom Petty", usage: "Tom Petty & the Heartbreakers throughout career", sound: "Warm, American-meets-British jangle rock" },
      { artist: "Johnny Marr", usage: "The Smiths, debut album onwards", sound: "Ringing, chorus-soaked clean arpeggios and chords" },
      { artist: "Kevin Shields", usage: "My Bloody Valentine Loveless", sound: "Thick, warped shoegaze wall of sound" },
    ],
  },

  "hiwatt dr103": {
    name: "Hiwatt DR103 Custom 100",
    manufacturer: "Hiwatt (Hylight Electronics)",
    yearIntroduced: "1967",
    overview:
      "The Hiwatt DR103 is a 100-watt British tube amplifier built by Dave Reeves starting in the late 1960s, celebrated for its extraordinarily high headroom, military-spec point-to-point wiring, and pristine, hi-fi clarity. While Marshall amps were designed to saturate and distort, the Hiwatt was engineered for maximum efficiency and stability, using premium Partridge transformers and EL34 power tubes. The result is a huge, articulate clean sound with a uniquely three-dimensional tone — similar to a very powerful Fender Twin but with more body and a British character. Pushed hard or paired with fuzz and overdrive pedals, it blooms into a rich, complex saturation.",
    controls: [
      { name: "Volume (Normal)", description: "Controls the level for the Normal channel inputs." },
      { name: "Volume (Brilliant)", description: "Controls the level for the Brilliant (brighter) channel inputs — the most popular for guitar." },
      { name: "Bass", description: "Low-frequency tone control with a wider, more effective range than most amps of the era." },
      { name: "Middle", description: "Midrange EQ control." },
      { name: "Treble", description: "High-frequency control." },
      { name: "Presence", description: "Upper harmonic boost in the power amp section." },
      { name: "Master Volume", description: "Overall output level control (later models)." },
    ],
    aliases: ["Hiwatt Custom 100", "DR103W", "Custom 100"],
    notableUsers: [
      { artist: "Pete Townshend", usage: "The Who Live at Leeds, Who's Next, Quadrophenia tours 1969–1982", sound: "Thundering, powerful clean headroom used as a platform for explosive power chords" },
      { artist: "David Gilmour", usage: "Pink Floyd Animals, The Wall, Wish You Were Here tours", sound: "Immense, three-dimensional clean foundation for fuzz, delay, and reverb" },
      { artist: "J Mascis", usage: "Dinosaur Jr. throughout career", sound: "Massive, feedback-rich wall of overdriven guitar" },
      { artist: "Kevin Shields", usage: "My Bloody Valentine studio and live work", sound: "Cavernous, sustained shoegaze tone" },
    ],
  },

  "mesa dual rectifier": {
    name: "Mesa/Boogie Dual Rectifier",
    manufacturer: "Mesa/Boogie",
    yearIntroduced: "1992",
    overview:
      "The Mesa/Boogie Dual Rectifier, introduced in 1992, is widely considered the defining high-gain amplifier of the 1990s and one of the most influential rock amplifiers ever made. Designed by Randall Smith as a more 'British-voiced' alternative to the company's Mark Series, it features 100 watts from four 6L6 power tubes and selectable tube or solid-state rectification that provides either a 'sag' (vintage feel) or a tight, aggressive response. Its massive, bass-heavy roar dominated nu-metal, post-grunge, and alternative metal from the early 1990s through the 2000s. A three-channel version was introduced in 2000.",
    controls: [
      { name: "Gain (per channel)", description: "Controls the primary gain stage for each channel — the most powerful control, placed differently in each channel's circuit." },
      { name: "Treble", description: "High-frequency shaping." },
      { name: "Middle", description: "Midrange control, often scooped for the classic Recto metal tone." },
      { name: "Bass", description: "Low-frequency control — contributes to the amp's characteristic bass-heavy roar." },
      { name: "Presence", description: "Upper harmonic content in the power amp." },
      { name: "Master (per channel)", description: "Sets the output level for each channel independently." },
      { name: "Rectifier Select", description: "Switches between tube rectification (vintage sag/feel) and solid-state (tight, modern)." },
      { name: "Channel Mode", description: "Selects voicing modes per channel: Vintage, Modern, Raw (three-channel models)." },
    ],
    aliases: ["Dual Rectifier", "Dual Recto", "Recto", "3-Channel Dual Rectifier"],
    notableUsers: [
      { artist: "Metallica (James Hetfield & Kirk Hammett)", usage: "Load, Reload era and Napster-era live performances", sound: "Crushing, tight, saturated high-gain rhythm and lead" },
      { artist: "Tool (Adam Jones)", usage: "Undertow, Aenima, Lateralus", sound: "Heavy, textural, riff-driven progressive metal crunch" },
      { artist: "Soundgarden (Kim Thayil)", usage: "Superunknown era", sound: "Thick, grinding alternative metal saturation" },
      { artist: "Korn (Brian Welch & James Shaffer)", usage: "Korn, Life Is Peachy", sound: "Down-tuned, bass-heavy nu-metal aggression" },
      { artist: "Foo Fighters (Dave Grohl)", usage: "Various albums", sound: "Powerful, energetic rock overdrive" },
    ],
  },

  "mesa mark iic+": {
    name: "Mesa/Boogie Mark IIC+",
    manufacturer: "Mesa/Boogie",
    yearIntroduced: "1984",
    overview:
      "The Mesa/Boogie Mark IIC+ is a 100-watt, single-rack amplifier produced from January 1984 to March 1985 — only about 14 months — making it one of the rarest and most sought-after boutique amplifiers ever made. Evolved from the pioneering Mark series that invented channel-switching, the IIC+ refined the circuit with a new EQ section, pull-bright switch, and output transformer, producing an almost liquid lead tone of extraordinary harmonic depth and a warm, airy clean. Metallica used it on Master of Puppets, John Petrucci built his career around its sound, and Prince toured with it — a versatility that makes it one of the true 'Holy Grail' amplifiers.",
    controls: [
      { name: "Volume 1 (Rhythm)", description: "Level for the rhythm/clean mode." },
      { name: "Lead Drive", description: "Gain control for the lead channel — produces the famous 'liquid lead' saturation." },
      { name: "Lead Master", description: "Output level for the lead channel." },
      { name: "Treble", description: "High-frequency control shared between modes." },
      { name: "Middle", description: "Midrange character — critical to the IIC+'s warm, vocal lead tone." },
      { name: "Bass", description: "Low-frequency control." },
      { name: "5-Band Graphic EQ", description: "Footswitchable graphic equalizer for surgical tonal shaping — can auto-engage with the lead channel." },
      { name: "Presence", description: "Upper harmonic boost on the rear panel." },
      { name: "Reverb", description: "Built-in reverb level control on the rear panel." },
    ],
    aliases: ["Mark IIC+", "Mark 2C+", "IIC+"],
    notableUsers: [
      { artist: "Metallica (James Hetfield & Kirk Hammett)", usage: "Master of Puppets (1986)", sound: "Ferociously tight, harmonically complex thrash metal — the blueprint for modern high-gain lead" },
      { artist: "John Petrucci", usage: "Dream Theater throughout 1990s–2000s", sound: "Enormous clean headroom and silky, precise liquid lead tone" },
      { artist: "Prince", usage: "Purple Rain tour (1984) and beyond", sound: "Stunningly transparent clean and expressive, musical lead" },
      { artist: "Joe Satriani", usage: "Surfing with the Alien era", sound: "Smooth, flowing sustain with singing harmonic content" },
    ],
  },

  "bogner ecstasy": {
    name: "Bogner Ecstasy",
    manufacturer: "Bogner Amplification",
    yearIntroduced: "1992",
    overview:
      "The Bogner Ecstasy is a hand-wired, three-channel boutique amplifier released in 1992 by German-American builder Reinhold Bogner, who founded his Los Angeles company in 1989. Originally conceived to combine classic Fender clean tones with a hot-rodded Marshall-like drive in one chassis, the Ecstasy has 14 knobs and 10 micro-switches on the front panel alone, offering six distinct sonic variations through its Blue and Red gain channels and a Plexi mode. The 101B version uses EL34 power tubes for a more British character. Sometimes called 'The Rolls-Royce of Amplifiers,' it is prized by studio players and touring professionals for its exceptionally three-dimensional, layered tone.",
    controls: [
      { name: "Volume (per channel)", description: "Independent volume control for each of the three channels." },
      { name: "Gain (per channel)", description: "Controls the preamp gain stage for each channel — from clean headroom to cascading saturation." },
      { name: "Bass", description: "Low-frequency control, shared EQ section." },
      { name: "Middle", description: "Midrange control with significant impact on voicing character." },
      { name: "Treble", description: "High-frequency control." },
      { name: "Presence", description: "Dual assignable presence controls (separate for each stage)." },
      { name: "Plexi Mode", description: "Drops the preamp gain dramatically to emulate the character of a vintage British Plexi." },
      { name: "Schizo Switch", description: "Modifies the EQ character of each gain channel between two voicings." },
      { name: "Power Switch", description: "Selects between 100W, 50W, and 25W operation." },
    ],
    aliases: ["Ecstasy 101B", "Ecstasy 101A", "Ecstasy 100B", "XTC", "Bogner XTC"],
    notableUsers: [
      { artist: "Eddie Van Halen", usage: "For Unlawful Carnal Knowledge (1991)", sound: "Articulate, sophisticated high-gain tone with enormous dynamic range" },
      { artist: "Steve Vai", usage: "Sex & Religion tour", sound: "Expressive, complex multi-dimensional saturation" },
      { artist: "Jerry Cantrell", usage: "Alice in Chains later recordings", sound: "Dark, layered heavy rock distortion" },
      { artist: "Mark Tremonti", usage: "Alter Bridge recordings", sound: "Full, dynamic modern hard rock overdrive" },
      { artist: "Eric Johnson", usage: "Studio sessions", sound: "Warm, liquid clean and singing lead" },
    ],
  },

  "roland jc120": {
    name: "Roland Jazz Chorus JC-120",
    manufacturer: "Roland Corporation",
    yearIntroduced: "1975",
    overview:
      "The Roland JC-120 Jazz Chorus is a 120-watt solid-state combo amplifier released in 1975, and the most celebrated transistor guitar amplifier ever made. It changed perceptions of solid-state sound with its pristine, ultra-clean tone and — crucially — the world's first onboard stereo chorus effect, generated by an analog BBD (MN3002 bucket brigade) chip. Running two separate 60-watt power amps through twin 12-inch speakers, the chorus sends modulated signal to one speaker and dry signal to the other for a genuinely spatial, three-dimensional shimmer. From The Police to Metallica, the JC-120 has been used across virtually every genre.",
    controls: [
      { name: "Volume (Ch. 1)", description: "Level for the clean channel." },
      { name: "Volume (Ch. 2)", description: "Level for the reverb/effects channel." },
      { name: "Treble", description: "High-frequency EQ control (independent per channel)." },
      { name: "Middle", description: "Midrange EQ control." },
      { name: "Bass", description: "Low-frequency EQ control." },
      { name: "Chorus Rate", description: "Controls the speed of the internal BBD-based stereo chorus." },
      { name: "Chorus Depth", description: "Controls the intensity of the chorus effect." },
      { name: "Vibrato", description: "Selects vibrato mode instead of chorus." },
      { name: "Reverb", description: "Controls the level of the built-in spring reverb (Ch. 2)." },
      { name: "Distortion", description: "Built-in footswitchable distortion on Ch. 2." },
    ],
    aliases: ["JC-120", "Jazz Chorus", "Roland JC"],
    notableUsers: [
      { artist: "Andy Summers", usage: "The Police Every Breath You Take, Walking on the Moon", sound: "Shimmering, chorus-saturated clean tone that defined the new-wave guitar aesthetic" },
      { artist: "Johnny Marr", usage: "The Smiths debut album (1984)", sound: "Chiming, cascading clean arpeggios with creamy chorus" },
      { artist: "James Hetfield & Kirk Hammett", usage: "Metallica — used for clean tones", sound: "Warm, clean foundation in heavy metal context" },
      { artist: "Robert Smith", usage: "The Cure throughout career", sound: "Cold, stark, atmospheric clean tone" },
      { artist: "Adrian Belew", usage: "King Crimson, David Bowie's Young Americans tour", sound: "Textural, modern clean guitar with rich stereo depth" },
    ],
  },

  // ─────────────────────────────────────────────
  // OVERDRIVE / DISTORTION / FUZZ
  // ─────────────────────────────────────────────

  "tube screamer": {
    name: "Ibanez Tube Screamer",
    manufacturer: "Ibanez (Hoshino Gakki / Maxon)",
    yearIntroduced: "1979",
    overview:
      "The Ibanez Tube Screamer, designed by Susumu Tamura at Maxon and first released as the TS808 in 1979, is the most imitated overdrive pedal in guitar history. Its distinctive mid-hump — achieved not by boosting mids but by rolling off lows and highs — gives it a focused, amp-friendly character that thickens single-coil pickups and pushes tube amplifiers into harmonic saturation. The TS9 (1981) offered a slightly brighter and more aggressive voicing. Used as a clean boost or a full-range overdrive, the Tube Screamer appears on countless records across blues, country, rock, and metal.",
    controls: [
      { name: "Drive", description: "Controls the amount of overdrive saturation, from light crunch to full clipping." },
      { name: "Tone", description: "Sweeps the high-frequency content of the overdriven signal — not a full-range EQ, as lows are already filtered." },
      { name: "Level", description: "Sets the output volume of the pedal relative to bypass." },
    ],
    aliases: ["TS808", "TS9", "TS10", "Tube Screamer 808", "TS"],
    notableUsers: [
      { artist: "Stevie Ray Vaughan", usage: "Texas Flood, Couldn't Stand the Weather (TS9 as amp booster)", sound: "Searing, creamy Texas blues lead with exceptional mid-range focus" },
      { artist: "The Edge", usage: "U2 War, The Unforgettable Fire (TS9)", sound: "Warm, sustaining lead tone with clean-to-broken-up dynamics" },
      { artist: "John Mayer", usage: "Continuum, Where the Light Is (TS808)", sound: "Smooth, singing blues-pop lead tone" },
      { artist: "Trey Anastasio", usage: "Phish live and studio work (dual TS9s)", sound: "Thick, harmonically rich sustain for extended improvisational leads" },
      { artist: "Gary Moore", usage: "Still Got the Blues (TS808)", sound: "Emotional, singing lead with violin-like sustain" },
    ],
  },

  "ibanez tube screamer": {
    name: "Ibanez Tube Screamer",
    manufacturer: "Ibanez (Hoshino Gakki / Maxon)",
    yearIntroduced: "1979",
    overview:
      "The Ibanez Tube Screamer, designed by Susumu Tamura at Maxon and first released as the TS808 in 1979, is the most imitated overdrive pedal in guitar history. Its distinctive mid-hump — achieved not by boosting mids but by rolling off lows and highs — gives it a focused, amp-friendly character that thickens single-coil pickups and pushes tube amplifiers into harmonic saturation. The TS9 (1981) offered a slightly brighter and more aggressive voicing. Used as a clean boost or a full-range overdrive, the Tube Screamer appears on countless records across blues, country, rock, and metal.",
    controls: [
      { name: "Drive", description: "Controls the amount of overdrive saturation, from light crunch to full clipping." },
      { name: "Tone", description: "Sweeps the high-frequency content of the overdriven signal — not a full-range EQ, as lows are already filtered." },
      { name: "Level", description: "Sets the output volume of the pedal relative to bypass." },
    ],
    aliases: ["TS808", "TS9", "TS10", "Tube Screamer 808", "TS"],
    notableUsers: [
      { artist: "Stevie Ray Vaughan", usage: "Texas Flood, Couldn't Stand the Weather (TS9 as amp booster)", sound: "Searing, creamy Texas blues lead with exceptional mid-range focus" },
      { artist: "The Edge", usage: "U2 War, The Unforgettable Fire (TS9)", sound: "Warm, sustaining lead tone with clean-to-broken-up dynamics" },
      { artist: "John Mayer", usage: "Continuum, Where the Light Is (TS808)", sound: "Smooth, singing blues-pop lead tone" },
      { artist: "Gary Moore", usage: "Still Got the Blues (TS808)", sound: "Emotional, singing lead with violin-like sustain" },
    ],
  },

  "klon": {
    name: "Klon Centaur Professional Overdrive",
    manufacturer: "Klon (Bill Finnegan)",
    yearIntroduced: "1994",
    overview:
      "The Klon Centaur, hand-built by Bill Finnegan from 1994 to 2008 in a total run of approximately 8,000 units, is the most legendary — and most expensive — overdrive pedal ever made. Its circuit, kept secret under black epoxy for years, pioneered 'transparent overdrive': a hard-clipping design using germanium diodes paired with a dual-gang pot that blends clean and clipped signals, so at low gain it acts as a pristine clean boost and at high gain as a full-range overdrive. An 18V internal charge pump gives the op-amp higher headroom and a more 'metallic' harmonic character. Original units now sell for thousands of dollars; the successor Klon KTR preserves the circuit in a mass-produceable form.",
    controls: [
      { name: "Gain", description: "Dual-gang pot controlling the balance between the clean and clipped signals — at low settings it is essentially a boost, at high settings a full overdrive." },
      { name: "Treble", description: "Shapes high-frequency content after the clipping stage." },
      { name: "Output", description: "Sets the overall output level of the pedal." },
    ],
    aliases: ["Klon Centaur", "KTR", "Horsie", "Non-Horsie"],
    notableUsers: [
      { artist: "John Mayer", usage: "Battle Studies, Born and Raised touring rigs", sound: "Transparent, touch-sensitive boost that makes a Fender amp sing" },
      { artist: "Jeff Beck", usage: "Various studio and live work", sound: "Warm, dynamic push into natural amp saturation" },
      { artist: "Jack White", usage: "Solo and White Stripes live work (black-painted unit)", sound: "Aggressive, mid-focused overdrive with raw character" },
      { artist: "Josh Homme", usage: "Queens of the Stone Age studio sessions", sound: "Controlled, open-sounding overdrive boost" },
      { artist: "Warren Haynes", usage: "Gov't Mule live work", sound: "Warm, rich Southern rock saturation" },
    ],
  },

  "rat": {
    name: "ProCo RAT",
    manufacturer: "Pro Co Sound",
    yearIntroduced: "1978",
    overview:
      "The ProCo RAT is a distortion pedal first developed in 1978 in Pro Co's Kalamazoo, Michigan facility, born from a happy circuit accident when designer Scott Burnham installed a wrong resistor that produced unexpectedly massive gain. Built around an LM308 op-amp (later OP07DP) with hard-clipping diodes, the RAT can go from overdrive to distortion to near-fuzz depending on the Filter and Distortion settings — a range few pedals match. It became a fixture of 1980s metal pedalboards, then found an equally devoted following in alternative, shoegaze, and grunge. The RAT2 (1988) added an LED indicator and is the current standard version.",
    controls: [
      { name: "Distortion", description: "Controls the gain of the op-amp circuit — from mild crunch to extreme saturation with 67dB of gain on tap." },
      { name: "Filter", description: "A low-pass filter control: rolled back gives a brighter, more square-wave sound; fully open is warmer and more triangle-wave shaped." },
      { name: "Volume", description: "Sets the output level; unlike some pedals, does not affect tone thanks to a JFET buffer between circuit stages." },
    ],
    aliases: ["ProCo RAT", "RAT2", "Turbo RAT", "You Dirty RAT"],
    notableUsers: [
      { artist: "Kurt Cobain", usage: "Nirvana In Utero recording sessions and live", sound: "Thick, grainy, raw distortion" },
      { artist: "David Gilmour", usage: "Pink Floyd Pulse live album (RAT2)", sound: "Smooth, singing lead tone with a touch of vintage grit" },
      { artist: "James Hetfield", usage: "Metallica Kill 'Em All (early thrash work)", sound: "Aggressive, tight early thrash metal distortion" },
      { artist: "Jeff Beck", usage: "1980s studio and live work", sound: "Expressive, dynamic distortion with wide range of articulation" },
      { artist: "Jonny Greenwood", usage: "Radiohead various albums", sound: "Dark, abrasive, texture-heavy guitar parts" },
    ],
  },

  "fuzz face": {
    name: "Dallas Arbiter Fuzz Face",
    manufacturer: "Dallas Arbiter",
    yearIntroduced: "1966",
    overview:
      "The Fuzz Face is a germanium (later silicon) transistor fuzz pedal released in November 1966 by British company Arbiter Electronics, designed by Ivor Arbiter and distinctive for its circular housing — supposedly inspired by a microphone stand base. Its extraordinarily simple circuit — just two transistors, three capacitors, two potentiometers — interacts intimately with the guitar's pickups and volume knob, allowing players to go from clean to full-on fuzz by rolling the guitar's volume back. Jimi Hendrix arrived in London almost simultaneously with the pedal's release, and his adoption of it made the Fuzz Face one of the most iconic effects in rock history.",
    controls: [
      { name: "Fuzz", description: "Controls the amount of transistor gain and clipping — from mild grit to aggressive, thick fuzz saturation." },
      { name: "Volume", description: "Sets the output level. Because of the circuit's low input impedance, the guitar's own volume knob dramatically affects the fuzz character." },
    ],
    aliases: ["Fuzz Face", "Dallas Fuzz Face", "Arbiter Fuzz Face", "Silicon Fuzz Face", "Germanium Fuzz Face"],
    notableUsers: [
      { artist: "Jimi Hendrix", usage: "Purple Haze, Foxy Lady, Maui 1970, Band of Gypsys (germanium & silicon variants)", sound: "Exploding, vocal, dynamics-sensitive fuzz that cleans up with guitar volume" },
      { artist: "David Gilmour", usage: "Pink Floyd early recordings", sound: "Smooth, sustained fuzz with a warm, liquid quality" },
      { artist: "Duane Allman", usage: "Allman Brothers Band live work", sound: "Raw, singing slide guitar fuzz" },
      { artist: "Stevie Ray Vaughan", usage: "Various SRV live recordings", sound: "Thick, aggressive Texas fuzz tone" },
      { artist: "Eric Johnson", usage: "Cliffs of Dover era studio and live", sound: "Smooth, controlled fuzz complementing melodic lead lines" },
    ],
  },

  "big muff": {
    name: "Electro-Harmonix Big Muff Pi",
    manufacturer: "Electro-Harmonix",
    yearIntroduced: "1969",
    overview:
      "The Electro-Harmonix Big Muff Pi is a legendary fuzz/distortion-sustainer pedal first released in 1969, known for its thick, violin-like sustain and heavily saturated tone. Multiple circuit variants — Triangle, Ram's Head, Op-Amp, and Russian — each have distinct characters collected with cult devotion. Its mid-scooped tone circuit creates a huge, pillowy sound at high gain that cuts through in an almost orchestral way. Though called a 'distortion,' the Big Muff sits sonically between fuzz and distortion, and has defined the lead tones of David Gilmour, Billy Corgan, and J Mascis across rock, grunge, and shoegaze for over fifty years.",
    controls: [
      { name: "Sustain", description: "Controls the amount of fuzz/distortion gain and the length of sustain — from mild grit to extreme saturation." },
      { name: "Tone", description: "Sweeps from deep and bassy to sharp and trebly; the mid-position creates the signature mid-scooped sound." },
      { name: "Volume", description: "Sets the overall output level of the pedal." },
    ],
    aliases: ["Big Muff Pi", "Ram's Head", "Triangle Muff", "Op-Amp Big Muff", "Russian Big Muff", "NYC Big Muff"],
    notableUsers: [
      { artist: "David Gilmour", usage: "Pink Floyd Animals, The Wall (Ram's Head variant)", sound: "Smooth, vocal, singing sustain on melodic lead lines" },
      { artist: "Billy Corgan", usage: "Smashing Pumpkins Siamese Dream (Op-Amp variant)", sound: "Thick, aggressive, multi-layered wall of saturated guitar" },
      { artist: "J Mascis", usage: "Dinosaur Jr. throughout career (Ram's Head)", sound: "Unapologetically huge, woolly, feedback-friendly fuzz" },
      { artist: "Jack White", usage: "The White Stripes (NYC Reissue)", sound: "Raw, garage-rock saturation with compressed sustain" },
      { artist: "Dan Auerbach", usage: "The Black Keys (Russian variant)", sound: "Darker, grittier blues-rock fuzz" },
    ],
  },

  "electro-harmonix big muff": {
    name: "Electro-Harmonix Big Muff Pi",
    manufacturer: "Electro-Harmonix",
    yearIntroduced: "1969",
    overview:
      "The Electro-Harmonix Big Muff Pi is a legendary fuzz/distortion-sustainer pedal first released in 1969, known for its thick, violin-like sustain and heavily saturated tone. Multiple circuit variants — Triangle, Ram's Head, Op-Amp, and Russian — each have distinct characters collected with cult devotion. Its mid-scooped tone circuit creates a huge, pillowy sound at high gain that cuts through in an almost orchestral way. Though called a 'distortion,' the Big Muff sits sonically between fuzz and distortion, and has defined the lead tones of David Gilmour, Billy Corgan, and J Mascis across rock, grunge, and shoegaze for over fifty years.",
    controls: [
      { name: "Sustain", description: "Controls the amount of fuzz/distortion gain and the length of sustain — from mild grit to extreme saturation." },
      { name: "Tone", description: "Sweeps from deep and bassy to sharp and trebly; the mid-position creates the signature mid-scooped sound." },
      { name: "Volume", description: "Sets the overall output level of the pedal." },
    ],
    aliases: ["Big Muff Pi", "Ram's Head", "Triangle Muff", "Op-Amp Big Muff", "Russian Big Muff"],
    notableUsers: [
      { artist: "David Gilmour", usage: "Pink Floyd Animals, The Wall (Ram's Head variant)", sound: "Smooth, vocal, singing sustain on melodic lead lines" },
      { artist: "Billy Corgan", usage: "Smashing Pumpkins Siamese Dream (Op-Amp variant)", sound: "Thick, aggressive, multi-layered wall of saturated guitar" },
      { artist: "J Mascis", usage: "Dinosaur Jr. throughout career (Ram's Head)", sound: "Unapologetically huge, woolly, feedback-friendly fuzz" },
      { artist: "Jack White", usage: "The White Stripes (NYC Reissue)", sound: "Raw, garage-rock saturation with compressed sustain" },
    ],
  },

  "mxr distortion+": {
    name: "MXR Distortion+",
    manufacturer: "MXR Innovations",
    yearIntroduced: "1978",
    overview:
      "The MXR Distortion+ (M104) is a germanium diode hard-clipping distortion pedal released by MXR in the late 1970s, designed by Keith Barr and Terry Sherwood. Its simple two-knob design belies its tonal range: at low Distortion settings with a high Output it acts as an amp-pushing boost; at maximum it delivers a raw, slightly fuzzy distortion with exceptional sustain. The germanium diodes give it a warm, '70s-inflected character notably different from silicon-diode competitors. Randy Rhoads' use on the first two Ozzy Osbourne albums made it an indelible part of early heavy metal history.",
    controls: [
      { name: "Output", description: "Sets the overall output volume of the pedal." },
      { name: "Distortion", description: "Controls the amount of gain and clipping — from mild overdrive to fuzz-like extreme saturation." },
    ],
    aliases: ["MXR Distortion Plus", "M104", "D+", "Distortion +"],
    notableUsers: [
      { artist: "Randy Rhoads", usage: "Ozzy Osbourne Blizzard of Ozz, Diary of a Madman", sound: "Articulate, singing lead tone over a Marshall — defined early 1980s hard rock" },
      { artist: "Jerry Garcia", usage: "Grateful Dead late 1970s live performances", sound: "Warm, compressed lead tone" },
      { artist: "Alex Lifeson", usage: "Rush Moving Pictures tour", sound: "Full, harmonically rich rock crunch" },
      { artist: "Bob Mould", usage: "Husker Du Zen Arcade, New Day Rising", sound: "Abrasive, cathartic punk-metal saturation" },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULATION
  // ─────────────────────────────────────────────

  "shin-ei uni-vibe": {
    name: "Shin-ei Uni-Vibe",
    manufacturer: "Shin-ei (distributed by Univox)",
    yearIntroduced: "1968",
    overview:
      "The Uni-Vibe was designed by Fumio Mieda at Shin-ei in the late 1960s and distributed in the US by Univox, originally marketed as a Leslie speaker simulator for keyboards. Its four-stage phaser circuit — driven by four photocells and a rotating lamp rather than an LFO — produces a uniquely organic, warm, pulsating modulation unlike any other phaser. Jimi Hendrix acquired one in 1969 and used it at Woodstock and on the Band of Gypsys album, making it one of the most coveted and historically significant guitar effects ever made. David Gilmour and Robin Trower also made it a cornerstone of their sounds.",
    controls: [
      { name: "Chorus / Vibrato", description: "Selector switch between the two modes: Chorus adds a clean blend, Vibrato is purely pitch-shifted." },
      { name: "Intensity", description: "Controls the depth of the modulation effect." },
      { name: "Speed (Expression Pedal)", description: "An external treadle/expression pedal controls the rate of the effect, from slow chorale to fast tremolo." },
    ],
    aliases: ["Uni-Vibe", "Univibe", "Univox Uni-Vibe", "Vibra-Chorus"],
    notableUsers: [
      { artist: "Jimi Hendrix", usage: "Machine Gun (Band of Gypsys), Woodstock 1969", sound: "Deep, hypnotic swirling pulse beneath a cranked Marshall — one of the most distinctive guitar tones ever recorded" },
      { artist: "David Gilmour", usage: "Pink Floyd Dark Side of the Moon (Breathe, Any Colour You Like)", sound: "Dreamy, gentle swirl on clean amp for atmospheric textures" },
      { artist: "Robin Trower", usage: "Bridge of Sighs (1974)", sound: "Deep, throbbing, hypnotic modulation beneath a heavily processed blues-rock tone" },
      { artist: "Trey Anastasio", usage: "Phish live performances", sound: "Rich, warm pulsation adding life to sustained lead lines" },
    ],
  },

  "boss ce-1 chorus": {
    name: "Boss CE-1 Chorus Ensemble",
    manufacturer: "Boss (Roland Corporation)",
    yearIntroduced: "1976",
    overview:
      "The Boss CE-1 Chorus Ensemble, released in June 1976, is the world's first standalone chorus effect pedal, directly derived from the chorus/vibrato circuit of the Roland JC-120 Jazz Chorus amplifier released the previous year. Built around the Matsushita MN3002 Bucket Brigade Device, it delivers a warm, analog modulation distinct from later, simpler chorus pedals. Unlike the compact CE-2 that followed in 1979, the CE-1 is housed in a larger enclosure with two footswitches, stereo outputs, and separate controls for both Chorus and Vibrato modes.",
    controls: [
      { name: "Intensity", description: "Controls the depth of the chorus modulation." },
      { name: "Rate (Chorus)", description: "Controls the speed of the chorus LFO." },
      { name: "Depth (Vibrato)", description: "Controls the depth of pitch modulation in Vibrato mode." },
      { name: "Rate (Vibrato)", description: "Controls the speed of the vibrato oscillation." },
      { name: "Level", description: "Sets the overall output level." },
      { name: "Chorus / Vibrato Footswitch", description: "Toggles between the two modulation modes." },
    ],
    aliases: ["CE-1", "Chorus Ensemble", "Boss CE1"],
    notableUsers: [
      { artist: "Andy Summers", usage: "The Police Walking on the Moon, Every Breath You Take", sound: "Lush, expansive shimmering clean tone that defined new-wave guitar" },
      { artist: "John Frusciante", usage: "Red Hot Chili Peppers Scar Tissue and various tracks", sound: "Warm, organic modulation on clean and slightly overdriven parts" },
      { artist: "Brian May", usage: "Queen live rigs (heavily modified by Pete Cornish)", sound: "Rich, orchestral doubling effect added to stacked AC30 wall" },
      { artist: "Mike Rutherford", usage: "Genesis Wind and Wuthering, Duke era", sound: "Lush, wide stereo thickening of guitar and bass guitar" },
    ],
  },

  "mxr phase 90 script": {
    name: "MXR Phase 90 (Script Logo)",
    manufacturer: "MXR Innovations",
    yearIntroduced: "1974",
    overview:
      "The MXR Phase 90 was the very first product sold by MXR, designed by Keith Barr in 1974 and instantly successful for its smooth, musical four-stage phasing. The original 'Script Logo' version — named for its cursive font — is the most prized variant, with a slightly warmer, less pronounced sweep than the later 'Block Logo' production versions. A single Rate knob is the only control, making it the simplest and most plug-and-play phaser ever made. Eddie Van Halen's use of the Phase 90 on the first Van Halen album established it as an essential hard-rock tone; David Gilmour's use on Pink Floyd's Wish You Were Here made it a progressive rock staple.",
    controls: [
      { name: "Rate", description: "The only control — sets the speed of the phasing sweep from slow, ambient shimmer to fast, swirling vibrato-like effect." },
    ],
    aliases: ["Phase 90", "MXR Phase 90", "Script Phase 90", "EVH Phase 90"],
    notableUsers: [
      { artist: "Eddie Van Halen", usage: "Van Halen I Eruption, Atomic Punk, Ain't Talkin' 'Bout Love", sound: "Swirling, harmonically rich modulation beneath explosive guitar playing" },
      { artist: "David Gilmour", usage: "Pink Floyd Wish You Were Here (Shine On You Crazy Diamond, Have a Cigar)", sound: "Slow, subtle phasing adding depth and movement to singing lead lines" },
      { artist: "Tom Morello", usage: "Rage Against the Machine live performances", sound: "Rhythmic, textural phasing for percussive riff-based parts" },
      { artist: "John Frusciante", usage: "Red Hot Chili Peppers various albums and tours", sound: "Warm, expressive modulation on funk-influenced clean and overdriven tones" },
    ],
  },

  "leslie rotary speaker": {
    name: "Leslie Rotary Speaker Cabinet",
    manufacturer: "Electro-Music (Leslie)",
    yearIntroduced: "1941",
    overview:
      "The Leslie speaker cabinet, invented by Donald Leslie in 1937 and commercially produced from 1941, creates its distinctive swirling, three-dimensional sound through physical speaker rotation: a high-frequency horn and a low-frequency rotor spin in opposite directions, producing the Doppler effect as sound sources move toward and away from the listener. Originally designed for Hammond organs — ironically rejected by Hammond — it was adopted by rock and blues guitarists for its unique, organic modulation effect that no electronic circuit has fully replicated. Running a guitar through a Leslie became a studio trick of choice for The Beatles, Jimi Hendrix, and Soundgarden.",
    controls: [
      { name: "Speed (Chorale / Tremolo)", description: "Switches the rotating speakers between slow (Chorale) and fast (Tremolo) rotation speed. The mechanical ramp-up between speeds is itself musically expressive." },
      { name: "Stop", description: "Stops the rotation entirely for a static dry sound." },
    ],
    aliases: ["Leslie", "Rotary Speaker", "Rotary Cabinet", "Leslie 122", "Leslie 147"],
    notableUsers: [
      { artist: "John Lennon / The Beatles", usage: "Tomorrow Never Knows (Abbey Road, vocals), Paperback Writer", sound: "Eerie, spacious, other-worldly modulation unlike any other effect" },
      { artist: "Jimi Hendrix", usage: "Little Wing (engineer Eddie Kramer routed guitar through Leslie)", sound: "Silky, liquid, gently rotating warmth on clean tones" },
      { artist: "Chris Cornell / Soundgarden", usage: "Black Hole Sun — guitar through Leslie", sound: "Warm, swirling psychedelic depth beneath distorted chords" },
      { artist: "George Harrison", usage: "Various Beatles and solo recordings", sound: "Shimmering, organic modulation on clean and overdriven guitar" },
    ],
  },

  "chorus": {
    name: "Chorus",
    overview:
      "Chorus is a modulation effect that splits the guitar signal into two paths, slightly pitch-modulates and delays the wet path via a low-frequency oscillator (LFO), then recombines it with the dry signal. The result mimics the natural pitch and timing variations of multiple instruments playing the same part simultaneously — hence the name. First popularized by the Roland JC-120 amplifier (1975) and commercialized by the Boss CE-1 pedal (1976), chorus became the defining sound of 1980s pop and rock guitar. It works best on clean tones where the modulation's shimmer is most audible.",
    controls: [
      { name: "Rate", description: "Controls the speed of the LFO — from slow, dreamy shimmer to fast vibrato-like oscillation." },
      { name: "Depth", description: "Controls the amount of pitch modulation — from subtle widening to seasick warble." },
      { name: "Level / Mix", description: "Controls the balance of wet (chorused) signal to dry signal." },
    ],
    notableUsers: [
      { artist: "Andy Summers", usage: "The Police Walking on the Moon, Every Breath You Take", sound: "Lush, wide, shimmering clean chords" },
      { artist: "Kurt Cobain", usage: "Nirvana Come As You Are (EHX Small Clone)", sound: "Watery, detuned, hypnotic intro riff" },
      { artist: "Guns N' Roses (Slash)", usage: "Paradise City intro and clean sections", sound: "Full, rounded, gently shimmering clean tone" },
      { artist: "John Frusciante", usage: "RHCP Soul to Squeeze and various", sound: "Warm, organic modulation on funky clean chord work" },
    ],
  },

  "analog flanger": {
    name: "Analog Flanger",
    overview:
      "Flanging originated when studio engineers pressed their finger against the 'flange' of a tape reel to briefly slow it, creating a comb-filter sweep effect. Electronically, a flanger splits the signal, delays the wet path by a few milliseconds via a BBD chip, then recombines it with the dry signal — the varying delay time creates peaks and troughs that sweep as a 'comb filter,' producing the characteristic 'jet plane' whoosh. The MXR M-117 Flanger (late 1970s) is the most famous pedal example. Unlike a phaser's all-pass filter notches, the flanger's notches are harmonically related, creating a more metallic, dramatic sweep.",
    manufacturer: "Various (MXR M-117 most iconic)",
    yearIntroduced: "1975",
    controls: [
      { name: "Rate / Speed", description: "Controls the speed of the LFO sweeping the delay time." },
      { name: "Width / Depth", description: "Controls the amount of delay variation — how wide the sweep is." },
      { name: "Manual / Delay Time", description: "Sets the base delay time, determining the starting point of the sweep and its frequency range." },
      { name: "Feedback / Regeneration", description: "Controls how much output is fed back into the input, intensifying the whoosh from subtle to jet-like." },
    ],
    aliases: ["Flanger", "MXR Flanger", "MXR M-117", "EVH Flanger", "Electro-Harmonix Electric Mistress"],
    notableUsers: [
      { artist: "Eddie Van Halen", usage: "Van Halen Unchained, And the Cradle Will Rock (MXR M-117)", sound: "Iconic swooshing jet-plane effect on intro riffs" },
      { artist: "Andy Summers", usage: "The Police various tracks", sound: "Subtle, lush modulation depth behind shimmering clean chords" },
      { artist: "Heart (Nancy Wilson)", usage: "Barracuda, Other Heart tracks", sound: "Sweeping, dramatic effect on rhythm guitar parts" },
      { artist: "Slash", usage: "Guns N' Roses Coma, Estranged solo (MXR EVH-117)", sound: "Wide, dramatic flange for textural contrast in solos" },
    ],
  },

  "phaser": {
    name: "Phaser",
    overview:
      "A phaser is a modulation effect that splits the guitar signal, passes the wet path through a series of all-pass filters, then recombines it with the dry signal. Unlike a flanger, the notches produced are not harmonically related, creating a more abstract, 'swirling' quality that at slower speeds evokes a rotating speaker and at faster speeds becomes an expressive vibrato-like effect. The Univox Uni-Vibe (1968) was the first popular phaser-type effect; the MXR Phase 90 (1974) became the definitive stompbox version. Number of stages (4, 6, 8+) determines the richness and complexity of the sweep.",
    controls: [
      { name: "Rate / Speed", description: "Controls the LFO speed from slow, ambient movement to fast oscillation." },
      { name: "Depth", description: "Controls the amount of phase shift applied — from subtle to extreme." },
      { name: "Feedback / Resonance", description: "Feeds output signal back into the input, intensifying the phasing peaks for a more pronounced effect." },
      { name: "Mix / Blend", description: "Sets the ratio of wet to dry signal." },
    ],
    aliases: ["Phase Shifter", "Phase 90", "Small Stone", "Uni-Vibe"],
    notableUsers: [
      { artist: "Eddie Van Halen", usage: "Van Halen I Eruption, Atomic Punk (MXR Phase 90)", sound: "Warm, organic swirl beneath explosive guitar technique" },
      { artist: "David Gilmour", usage: "Pink Floyd Wish You Were Here, Shine On You Crazy Diamond (MXR Phase 90)", sound: "Gentle, moving shimmer on singing lead guitar" },
      { artist: "Jimi Hendrix", usage: "Star Spangled Banner (Uni-Vibe in phaser mode)", sound: "Psychedelic, swirling motion beneath feedback-saturated playing" },
      { artist: "Brian May", usage: "Queen Sheer Heart Attack and other mid-70s tracks", sound: "Large, sweeping phasing through stacked AC30s" },
    ],
  },

  "tremolo": {
    name: "Tremolo",
    overview:
      "Tremolo is a periodic variation in volume — a rhythmic pulsing of amplitude rather than pitch — and is arguably the oldest electronic guitar effect, with the first dedicated unit produced by DeArmond in 1941. Built into countless vintage amplifiers by Fender, Gibson, and Magnatone, tremolo became synonymous with 1950s and '60s surf, rockabilly, and country guitar. It is modulated by a low-frequency oscillator (LFO) whose waveform can be a smooth sine wave (gentle pulse) or a hard square wave (choppy on-off gating). The Fender Deluxe Reverb's optical tremolo and the Magnatone's harmonic vibrato are two of the most coveted versions.",
    controls: [
      { name: "Rate / Speed", description: "Controls how fast the volume pulses — from slow, lazy swell to rapid stutter." },
      { name: "Depth / Intensity", description: "Controls how dramatically the volume varies — from subtle pulse to complete amplitude silence at extremes." },
      { name: "Wave Shape", description: "On modern pedals: selects between sine (smooth), square (choppy), triangle, or other waveforms." },
    ],
    aliases: ["Vibrato (as labeled on Fender amps)", "Tremolo", "Optical Tremolo", "Harmonic Tremolo"],
    notableUsers: [
      { artist: "Link Wray", usage: "Rumble (1958)", sound: "Menacing, pulsating overdrive beneath one of rock's most famous riffs" },
      { artist: "Johnny Marr", usage: "The Smiths How Soon Is Now?", sound: "Extreme, choppy square-wave tremolo creating a stuttering, hypnotic guitar part" },
      { artist: "Duane Eddy", usage: "Rebel Rouser (1958)", sound: "Surf twang with gentle tremolo depth on low strings" },
      { artist: "Tom Morello", usage: "Rage Against the Machine live performances", sound: "Rhythmic tremolo used for textural, percussive effect" },
    ],
  },

  "detune": {
    name: "Detune (Pitch Detune)",
    overview:
      "Detune is a pitch-shifting effect that creates one or more copies of the guitar signal offset by a fixed number of cents (fractions of a semitone) — typically a few cents sharp and flat simultaneously — then mixes them back with the dry signal. Unlike chorus, which uses an LFO to sweep the pitch shift up and down, detune applies a constant offset, resulting in a natural 'doubling' or thickening effect without audible movement. Used in stereo (one copy panned left sharp, one right flat), it creates an expansive, studio-doubling-like width. Detune is particularly popular with high-gain tones where chorus modulation would be too distracting.",
    controls: [
      { name: "Detune / Cents", description: "Controls how far off pitch the shifted voice is — typically ±1 to ±25 cents. Smaller values are more subtle; larger values create obvious beating." },
      { name: "Mix / Blend", description: "Controls the balance of the pitch-shifted signal against the dry signal." },
      { name: "Balance (L/R)", description: "On stereo units: independently adjusts the detuned amount for left and right voices." },
    ],
    aliases: ["Pitch Detune", "Detuner", "Harmonizer Detune"],
    notableUsers: [
      { artist: "Alex Lifeson", usage: "Rush various 1980s and 1990s recordings", sound: "Wide, orchestral guitar texture from a single instrument" },
      { artist: "Steve Vai", usage: "Various solo recordings", sound: "Expansive, studio-crafted doubling effect for rich stereo guitar" },
      { artist: "Joe Satriani", usage: "Various studio recordings", sound: "Subtle thickening of lead guitar tone for a larger-than-life presence" },
    ],
  },

  "envelope filter / auto wah": {
    name: "Envelope Filter / Auto-Wah",
    overview:
      "An envelope filter (auto-wah) is a dynamic effect where the filter sweep is triggered not by a foot pedal but by the input signal's amplitude envelope — the harder you play, the more dramatically the filter sweeps. The Musitronics Mu-Tron III (1972), designed by Mike Beigel, was the first commercial version and remains the benchmark. Its optocoupler-based circuit reacts expressively to pick attack, making it a fundamental tool of funk, R&B, and psychedelic music. Unlike a standard wah pedal, the auto-wah responds in real time to playing dynamics, enabling envelope effects on every individual note.",
    manufacturer: "Various (Mu-Tron III by Musitronics most iconic)",
    yearIntroduced: "1972",
    controls: [
      { name: "Sensitivity / Gain", description: "Controls how responsive the filter is to the input level — higher sensitivity reacts to lighter picking." },
      { name: "Range", description: "Selects the frequency range of the filter sweep (Low or High)." },
      { name: "Direction / Drive", description: "Sets whether the filter sweeps upward (bright attack, closes down) or downward (dark attack, opens up) — opposite directions create very different sounds." },
      { name: "Peak / Resonance", description: "Controls the sharpness of the filter peak for more or less pronounced wah-wah effect." },
    ],
    aliases: ["Auto-Wah", "Mu-Tron", "Mu-Tron III", "Q-Tron", "Envelope Filter"],
    notableUsers: [
      { artist: "Bootsy Collins", usage: "Parliament-Funkadelic Mothership Connection era (Mu-Tron III)", sound: "Liquid, expressive, rhythmically syncopated bass funk — 'Without the Mu-Tron there ain't no Bootsy'" },
      { artist: "Stevie Wonder", usage: "Higher Ground, Innervisions (Mu-Tron III on Clavinet)", sound: "Funky, bubbling, speech-like filter movement" },
      { artist: "Jerry Garcia", usage: "Grateful Dead Estimated Prophet, Shakedown Street", sound: "Expressive, open-throated filter sweep on lead guitar" },
      { artist: "Flea", usage: "Red Hot Chili Peppers Sir Psycho Sexy (dying-battery Mu-Tron)", sound: "Warped, highly compressed filter effect unique to that recording" },
    ],
  },

  // ─────────────────────────────────────────────
  // WAH
  // ─────────────────────────────────────────────

  "dunlop cry baby gcb95": {
    name: "Dunlop Cry Baby GCB95",
    manufacturer: "Dunlop Manufacturing",
    yearIntroduced: "1982",
    overview:
      "The Dunlop Cry Baby GCB95 is the most widely sold wah pedal ever made, introduced by Dunlop in 1982 after they acquired the original Thomas Organ/Vox Cry Baby tooling and manufacturing rights. Based on the legendary 1966 Cry Baby circuit, the GCB95 features a 'modern' voicing with a more aggressive, focused high end suited to contemporary playing styles. The 2004 addition of the Italian-made red Fasel inductor — the heart of the wah's tonal character — brought the GCB95 closer to vintage warmth while retaining its bright, expressive sweep. With no external controls other than the rocker pedal itself, it is the definition of a set-and-forget wah.",
    controls: [
      { name: "Rocker Pedal", description: "The primary control — rocking toe-down sweeps the filter toward high frequencies (bright, open); heel-down rolls back to dark, low-frequency resonance." },
      { name: "Bypass Switch", description: "Pressing the pedal fully forward (toe-down) clicks the bypass switch engaging the wah; heel-down disengages it." },
    ],
    aliases: ["Cry Baby", "GCB95", "Dunlop Wah"],
    notableUsers: [
      { artist: "Kirk Hammett", usage: "Metallica Ride the Lightning, Master of Puppets, throughout career", sound: "Vocal, expressive lead guitar wah — one of metal's most recognizable timbres" },
      { artist: "Slash", usage: "Guns N' Roses throughout career", sound: "Classic rock wah sweep on solos and melodic lead fills" },
      { artist: "Jimi Hendrix", usage: "Voodoo Child (Slight Return) — original Cry Baby/Vox versions", sound: "Explosive, speech-like filter sweep as an integral part of the composition" },
      { artist: "Eric Clapton", usage: "Cream White Room, Badge", sound: "Dramatic, expressive wah on psychedelic blues-rock solos" },
    ],
  },

  "vox v847": {
    name: "Vox V847 Wah",
    manufacturer: "Vox",
    yearIntroduced: "1994",
    overview:
      "The Vox V847 is a modern reissue of the original 1966 Vox Wah-Wah, the very first wah pedal ever made, designed by Lester Kushner and Brad Plunkett at the Thomas Organ Company. The original circuit is a simple, elegant LC (inductor-capacitor) bandpass filter that sweeps from approximately 450 Hz to 1.6 kHz as the rocker pedal is rocked heel to toe. The V847 faithfully reproduces this circuit with a vintage-style inductor and is prized for its warm, vocal-like sweep character that many players find more subtle and musical than the aggressive Dunlop GCB95 voicing. Hendrix, Clapton, Gilmour, and countless others have used Vox-circuit wahs.",
    controls: [
      { name: "Rocker Pedal", description: "Rocks the resonant frequency of the LC filter between approximately 450 Hz (heel down) and 1.6 kHz (toe down), creating the wah sweep." },
    ],
    aliases: ["Vox Wah", "V847", "V847A", "Clyde McCoy Wah"],
    notableUsers: [
      { artist: "Jimi Hendrix", usage: "Voodoo Child (Slight Return), White Room era Vox wahs", sound: "Vocal, expressive, dramatic filter movement as a compositional element" },
      { artist: "David Gilmour", usage: "Pink Floyd early recordings", sound: "Subtle, singing wah movement on blues-influenced lead work" },
      { artist: "Eric Clapton", usage: "Cream White Room, Wheels of Fire era", sound: "Smooth, singing wah on blues-rock lead guitar" },
      { artist: "Radiohead (Jonny Greenwood)", usage: "Various Radiohead recordings", sound: "Unconventional wah use for textural, atmospheric effect" },
    ],
  },

  // ─────────────────────────────────────────────
  // COMPRESSORS
  // ─────────────────────────────────────────────

  "mxr dynacomp": {
    name: "MXR Dyna Comp",
    manufacturer: "MXR Innovations",
    yearIntroduced: "1972",
    overview:
      "The MXR Dyna Comp, released in 1972 and designed by Keith Barr and Richard Neatrou, was the first guitar compressor pedal to achieve widespread professional adoption, and it remains one of the most influential dynamics tools in electric guitar history. Built around an operational transconductance amplifier (OTA) using the CA3080 IC, it delivers fast attack and slow release compression with a distinctive, musical coloring that many players prefer over clinical transparency. Its 'squash' became a Nashville staple for country Telecaster pickers and a secret weapon for sustain-hungry blues and rock guitarists.",
    controls: [
      { name: "Output", description: "Controls the overall output level of the compressed signal." },
      { name: "Sensitivity", description: "Controls the amount of compression — higher sensitivity means more aggressive gain reduction." },
    ],
    aliases: ["Dyna Comp", "MXR Compressor", "Script Dyna Comp"],
    notableUsers: [
      { artist: "David Gilmour", usage: "Pink Floyd Animals tour (1977) and subsequent tours", sound: "Even, sustained lead tone with compressed attack for singing expression" },
      { artist: "Andy Summers", usage: "The Police Walking on the Moon (script logo Dyna Comp)", sound: "Squashed, percussive chord attack that added rhythmic definition" },
      { artist: "Pete Townshend", usage: "The Who 1970s live work (used as a clean boost for solos)", sound: "Controlled, punchy boost for solo sections" },
      { artist: "Lowell George", usage: "Little Feat various recordings (for slide work)", sound: "Smooth, even compression for sustaining slide guitar lines" },
    ],
  },

  "optical compressor": {
    name: "Optical Compressor",
    overview:
      "An optical compressor uses a light source and a light-dependent resistor (LDR or photocell) as its gain-reduction element: the louder the input signal, the brighter the light, and the brighter the light, the more the LDR reduces the gain. This electro-optical process has a naturally smooth, somewhat slow reaction time compared to VCA or FET compressors, resulting in more organic, less 'clicky' compression that lets transients breathe. The classic studio example is the Teletronix LA-2A (1962), and guitar-specific optical compressors include the Diamond CPR-1 and Effectrode PC-2A. The sound is musical, warm, and transparent — ideal for clean tones and fingerstyle playing.",
    controls: [
      { name: "Threshold / Gain", description: "Sets the level at which compression begins, or the input gain driving the optical element." },
      { name: "Ratio", description: "Controls how aggressively the compressor reduces gain above the threshold." },
      { name: "Attack", description: "Controls how quickly the optical element reacts to transients — often fixed in simpler designs." },
      { name: "Release", description: "Controls how quickly the optical element recovers after the signal drops below threshold." },
      { name: "Output / Level", description: "Makeup gain to restore volume lost to compression." },
    ],
    aliases: ["LA-2A style", "Optical Limiter", "Opto Compressor"],
    notableUsers: [
      { artist: "Eric Clapton", usage: "Various studio sessions (LA-2A on guitar recordings)", sound: "Even, smooth sustain with natural transient preservation" },
      { artist: "Mark Knopfler", usage: "Dire Straits studio recordings", sound: "Transparent, barely-audible dynamic control enhancing note clarity" },
      { artist: "John Mayer", usage: "Continuum and Trio live rigs", sound: "Soft, gentle compression that lets the guitar dynamics breathe" },
    ],
  },

  "compressor": {
    name: "Compressor",
    overview:
      "A compressor automatically reduces the dynamic range of the guitar signal by attenuating loud transients and often boosting quieter passages via makeup gain. In guitar use, compression adds sustain, evens out picking attack, thickens the tone, and can give a distinctive 'squish' that is itself considered an effect. Pedal compressors fall into several circuit types: OTA (MXR Dyna Comp), optical (LA-2A style, Diamond), FET (1176 style, Empress SPDL), and VCA. Controls, behavior, and sonic character differ significantly between types, from transparent leveling to highly colored squash.",
    controls: [
      { name: "Threshold / Sensitivity", description: "Sets where compression begins — lower threshold means more of the signal is compressed." },
      { name: "Ratio", description: "Controls how aggressively gain is reduced above the threshold." },
      { name: "Attack", description: "How quickly the compressor reacts to signal above the threshold." },
      { name: "Release", description: "How quickly the compressor stops compressing after the signal drops below threshold." },
      { name: "Output / Level / Sustain", description: "Makeup gain or overall output level to compensate for gain reduction." },
    ],
    notableUsers: [
      { artist: "Stevie Ray Vaughan", usage: "Various studio and live work", sound: "Smooth, even dynamic control allowing singing lead lines" },
      { artist: "Country Nashville session players", usage: "Telecaster-based studio sessions", sound: "Classic squashed attack that defines the Nashville chicken-picking sound" },
      { artist: "Mark Knopfler", usage: "Dire Straits studio recordings", sound: "Invisible dynamic control enhancing clarity and presence" },
    ],
  },

  "rack/studio compressor": {
    name: "Rack / Studio Compressor",
    overview:
      "Rack-mount studio compressors — such as the Teletronix LA-2A, Universal Audio 1176, and dbx 160 — bring professional studio-grade dynamics processing to guitar recording and live performance rigs. Unlike compact pedal compressors optimized for pedalboard use, rack units typically offer higher dynamic range, lower noise floors, and more precise parameter control. The LA-2A's optical gain reduction (1962) produces warm, program-dependent compression ideal for vocals and guitar leads; the 1176's FET-based design gives fast, punchy character; the dbx 160's VCA circuit delivers clean, transparent control. Many professional guitarists use rack compressors in their touring and studio rigs for that extra dimension of control and tone.",
    controls: [
      { name: "Threshold / Peak Reduction", description: "Sets the level at which compression engages." },
      { name: "Ratio", description: "Controls compression intensity — from gentle 2:1 to limiting-style 20:1 or higher." },
      { name: "Attack", description: "Controls transient response — faster attacks compress the initial strike of notes." },
      { name: "Release", description: "Controls how quickly the compressor recovers after the signal falls." },
      { name: "Gain / Output", description: "Makeup gain to restore the compressed signal to desired level." },
      { name: "Meter", description: "VU or LED meter showing gain reduction amount in real time." },
    ],
    aliases: ["LA-2A", "1176", "dbx 160", "Tube Compressor", "FET Compressor", "VCA Compressor"],
    notableUsers: [
      { artist: "Eric Clapton", usage: "dbx 160 in Bob Bradshaw rack mid-to-late 1980s", sound: "Clean, transparent dynamic control supporting Clapton's expressive clean tone" },
      { artist: "David Gilmour", usage: "Various rack gear in Pink Floyd live rigs", sound: "Even, consistent sustain across all dynamics for lengthy lead passages" },
      { artist: "Steve Vai", usage: "Studio recording rigs throughout career", sound: "Precise dynamic control allowing maximum expressiveness on lead guitar" },
    ],
  },

  "ross compressor": {
    name: "Ross Compressor",
    manufacturer: "Ross Musical (Bud Ross)",
    yearIntroduced: "1974",
    overview:
      "The Ross Compressor is an OTA-based compressor pedal produced by Ross Musical from approximately 1974 to the early 1980s, founded by Kustom Amplification's Bud Ross. Closely related to the MXR Dyna Comp circuit — using the same CA3080 IC in a similar OTA topology — the Ross is generally considered slightly warmer, more musical, and less prone to noise than its MXR counterpart. It remained a relative obscurity until Trey Anastasio of Phish adopted it as his primary compressor, at which point its cult status exploded and used units began fetching hundreds of dollars. JHS Pedals has produced a licensed reissue.",
    controls: [
      { name: "Sustain", description: "Controls the amount of compression — from subtle dynamic evening to full sustain-boosting squash." },
      { name: "Level", description: "Sets the overall output volume." },
    ],
    aliases: ["Ross", "Ross Compressor Pedal"],
    notableUsers: [
      { artist: "Trey Anastasio", usage: "Phish Divided Sky, You Enjoy Myself (YEM) and virtually all live work", sound: "Rich, singing, infinite sustain that defines the Phish lead guitar sound" },
      { artist: "Alex Lifeson", usage: "Rush various", sound: "Even, punchy dynamic control" },
    ],
  },

  // ─────────────────────────────────────────────
  // BOOST
  // ─────────────────────────────────────────────

  "treble booster": {
    name: "Treble Booster (Dallas Rangemaster)",
    manufacturer: "Dallas Musical Ltd.",
    yearIntroduced: "1965",
    overview:
      "The Dallas Rangemaster Treble Booster, produced by London's Dallas Musical Ltd. from 1965, was a germanium transistor-based preamplifier designed to push British tube amplifiers — particularly the Vox AC30 and Marshall JTM45 — out of their naturally dark, muddy overdrive and into a brighter, cutting, harmonically rich distortion. Its simple one-transistor circuit emphasized frequencies above 2.6 kHz, adding presence and upper-harmonic content. Brian May used it on the first Queen album; Tony Iommi used it to craft Black Sabbath's heavy riffs; Eric Clapton reportedly used one on the Beano album. No longer in production, original units are rare and highly collectible.",
    controls: [
      { name: "Boost Set", description: "Controls the amount of treble boost and gain boost provided — the primary tonal control." },
      { name: "On / Off Switch", description: "Hard-wired desktop unit with a simple power switch rather than a traditional footswitch bypass." },
    ],
    aliases: ["Rangemaster", "Dallas Rangemaster", "Treble Booster"],
    notableUsers: [
      { artist: "Brian May", usage: "Queen debut album (1973), early Queen tours through 1973", sound: "Singing, harmonically bright lead tone through stacked AC30s" },
      { artist: "Tony Iommi", usage: "Black Sabbath early albums (1970–1972)", sound: "Dark, thundering heavy riff tone with a cutting midrange edge" },
      { artist: "Eric Clapton", usage: "John Mayall's Bluesbreakers Beano album (reportedly)", sound: "Thick, saturated blues-rock lead pushing a Marshall into harmonic overdrive" },
      { artist: "Rory Gallagher", usage: "Various solo recordings and live work", sound: "Raw, aggressive, cutting blues-rock tone through vintage Marshalls" },
    ],
  },

  "clean boost": {
    name: "Clean Boost",
    overview:
      "A clean boost is a simple amplification pedal that increases the signal level with minimal tonal coloration — its purpose is to make the guitar louder and push the amplifier harder, rather than to add distortion or alter the EQ. Guitarists use clean boosts to push a tube amp's preamp tubes into saturation for more break-up and harmonic richness, to lift solo volumes above the rhythm level, or as an 'always-on' pedal to compensate for signal loss from a long chain of other effects. While ideally transparent, most clean boosts add some slight coloration — a slight upper-midrange lift being common and often desirable.",
    controls: [
      { name: "Level / Volume / Boost", description: "Controls the amount of signal boost applied — typically 0 to +20dB or more." },
      { name: "Tone / EQ (some models)", description: "Some clean boosts add minimal treble or bass controls for subtle tonal shaping." },
    ],
    aliases: ["Boost Pedal", "Line Booster", "EP Booster", "LPB-1"],
    notableUsers: [
      { artist: "Brian May", usage: "Queen guitar rig — clean boost pushing Vox AC30s", sound: "Singing, harmonically saturated lead tone with natural amp compression" },
      { artist: "Angus Young", usage: "AC/DC — Schaffer-Vega wireless system provided up to 30dB of boost", sound: "Explosive, natural power-tube saturation at high stage volumes" },
      { artist: "David Gilmour", usage: "Pink Floyd — various boost pedals in long signal chain", sound: "Even, powerful clean signal driving delays and reverbs without loss" },
      { artist: "The Strokes (Nick Valensi)", usage: "Is This It era (MXR Micro Amp)", sound: "Tight, punchy boost for cutting lead lines" },
    ],
  },

  // ─────────────────────────────────────────────
  // NOISE GATE
  // ─────────────────────────────────────────────

  "noise gate": {
    name: "Noise Gate",
    overview:
      "A noise gate is a dynamics processor that silences a guitar signal when it falls below a user-set threshold, effectively eliminating hiss, hum, and electromagnetic interference during pauses in playing. Unlike a compressor which reduces dynamic range, a noise gate is essentially binary — it either passes the signal or mutes it. In high-gain and metal contexts, noise gates are essential for preventing amp and pedal hiss from becoming audible between notes and riffs. The Boss NS-2 (1987) — the first compact noise suppressor with a send/return effects loop — and the ISP Decimator are the two most widely used professional solutions.",
    controls: [
      { name: "Threshold", description: "Sets the level below which the gate closes and mutes the signal — lower values let more signal through, higher values cut more aggressively." },
      { name: "Decay / Release", description: "Controls how quickly the gate closes after the signal falls below threshold — slower settings sound more natural; faster settings create tight, choppy effect useful for metal." },
      { name: "Mode", description: "On units like the Boss NS-2: selects between Reduction mode (suppression) and Gate mode (hard on/off)." },
    ],
    aliases: ["Noise Suppressor", "Boss NS-2", "ISP Decimator", "Noise Reduction"],
    notableUsers: [
      { artist: "Metallica (James Hetfield & Kirk Hammett)", usage: "Throughout career with high-gain rigs", sound: "Dead silence between riffs, tight palm-muted chug" },
      { artist: "Slash", usage: "Guns N' Roses and solo work (MXR Smart Gate)", sound: "Clean noise floor between complex lead passages" },
      { artist: "Jerry Cantrell", usage: "Alice in Chains high-gain studio work", sound: "Silent rests and precise note cutoffs in heavy rhythm playing" },
    ],
  },

  // ─────────────────────────────────────────────
  // EQ
  // ─────────────────────────────────────────────

  "parametric eq": {
    name: "Parametric EQ",
    overview:
      "A parametric equalizer allows precise control over specific frequency ranges by offering adjustable frequency center, gain (boost or cut), and bandwidth (Q factor) for each band. Unlike a graphic EQ with fixed frequency bands, a parametric EQ lets the player dial in exactly which frequency to target — critical for cutting harsh resonances, boosting specific midrange character, or shaping the overall frequency curve with surgical precision. In guitar applications, parametric EQs are particularly valued for managing the midrange, where most of the guitar's fundamental character and overtones live.",
    controls: [
      { name: "Frequency", description: "Selects the center frequency of the EQ band being adjusted." },
      { name: "Gain", description: "Boosts or cuts the selected frequency — typically ±15dB or more." },
      { name: "Q / Bandwidth", description: "Controls the width of the frequency band affected — narrow Q is surgical, wide Q is musical and gentle." },
      { name: "Level", description: "Overall output level compensation." },
    ],
    aliases: ["Parametric EQ", "Semi-Parametric", "Para EQ"],
    notableUsers: [
      { artist: "Steve Lukather", usage: "Toto studio sessions", sound: "Precision frequency sculpting for mixing-friendly, studio-polished guitar tones" },
      { artist: "Eric Johnson", usage: "Studio and live rigs", sound: "Detailed frequency shaping to achieve his famously sculpted, complex lead tone" },
      { artist: "Various session guitarists", usage: "Studio recording — corrective and creative EQ", sound: "Precise tone matching and correction in professional recording environments" },
    ],
  },

  "graphic eq": {
    name: "Graphic EQ",
    overview:
      "A graphic EQ divides the frequency spectrum into fixed bands — typically 5, 7, or 10 bands per octave — each with a dedicated slider, so the EQ curve is visually 'drawn' by the slider positions. Unlike parametric EQ, the frequency centers are fixed, making graphic EQ faster to adjust but less surgically precise. In guitar applications, the Boss GE-7 (7 bands, 100Hz–6.4kHz) and MXR 10-Band EQ are the two most widely used pedals. Used before a distortion pedal, a graphic EQ acts like a tone shaper; used in the effects loop, it sculpts the overall amp character.",
    controls: [
      { name: "Band Sliders (per frequency)", description: "Individual boost/cut sliders for each fixed frequency band — typically ±15dB per band." },
      { name: "Level", description: "Overall output level control for gain-compensating the EQ cut or boost." },
    ],
    aliases: ["Graphic EQ", "Boss GE-7", "MXR 10-Band EQ", "6-Band EQ"],
    notableUsers: [
      { artist: "Slash", usage: "Guns N' Roses Use Your Illusion era (Boss GE-7)", sound: "Precise mid-boost and frequency sculpting for his signature warm-yet-cutting lead tone" },
      { artist: "Metallica", usage: "James Hetfield's rhythm guitar rig", sound: "Mid-scooped tone shaping for the classic scooped Recto metal sound" },
      { artist: "Steve Vai", usage: "Various touring rigs for precise frequency control", sound: "Complex EQ curves achieving harmonically balanced lead tones" },
    ],
  },

  // ─────────────────────────────────────────────
  // DELAY / ECHO
  // ─────────────────────────────────────────────

  "analog delay": {
    name: "Analog Delay",
    overview:
      "Analog delay pedals use Bucket Brigade Device (BBD) chips — analog shift-register integrated circuits — to store and replay the audio signal after a short delay. Invented by Philips engineers in 1969, BBD technology enabled compact delay effects previously requiring tape machines. The key characteristic of analog delay is the natural high-frequency roll-off with each repeat (the BBD's bandwidth is limited), giving repeats a warm, progressively darker character that blends musically into the dry signal. The Electro-Harmonix Memory Man (1976) is the most iconic example. Analog delays typically max out at around 300–600ms of delay time.",
    controls: [
      { name: "Delay Time", description: "Controls the time between the dry signal and its repeat — from slapback (50ms) to longer echoes (300–600ms)." },
      { name: "Feedback / Repeat", description: "Controls how many times the delay repeats — a few echoes to infinite self-oscillation." },
      { name: "Mix / Blend", description: "Controls the balance between the dry signal and the delayed repeats." },
      { name: "Modulation Rate / Depth (some units)", description: "Some analog delays (like the Memory Man) add LFO modulation to the delay time for chorus or vibrato on the repeats." },
    ],
    aliases: ["BBD Delay", "Memory Man", "Analog Echo", "EHX Memory Man"],
    notableUsers: [
      { artist: "The Edge", usage: "U2 I Will Follow, With or Without You (Memory Man early rig)", sound: "Chiming, repeating melodic lines that define the U2 guitar sound" },
      { artist: "David Gilmour", usage: "Pink Floyd solo work", sound: "Warm, organic echo that enhances singing lead notes" },
      { artist: "Brian May", usage: "Queen studio recordings", sound: "Rich, warm analog echo adding dimension to guitar parts" },
      { artist: "Andy Summers", usage: "The Police various recordings", sound: "Rhythmically synchronized delay creating melodic counterpoint" },
    ],
  },

  "rack / pedal digital delay": {
    name: "Rack / Pedal Digital Delay",
    overview:
      "Digital delay units — from the Lexicon PCM70 rack unit (1985) to modern Boss DD series pedals — use analog-to-digital conversion to create pristine, bit-perfect repeats that faithfully reproduce the original signal without the high-frequency roll-off of analog delays. The Lexicon PCM70 and TC Electronic 2290 became studio standards in the 1980s, while Boss's DD-2 (1983) was the first compact digital delay pedal. Digital delays offer far longer delay times (often several seconds), programmable presets, MIDI control, and modulation options, making them the preferred tool for studio and large-venue live work.",
    controls: [
      { name: "Delay Time", description: "Sets the echo repeat time — digital delays typically offer much longer times than analog (up to several seconds)." },
      { name: "Feedback", description: "Number of repeats from a single echo to near-infinite looping." },
      { name: "Mix / Effect Level", description: "Balance of wet delay signal against dry signal." },
      { name: "Tap Tempo", description: "On modern units: sets delay time by tapping in the desired rhythm." },
      { name: "Modulation", description: "Applies LFO-based pitch modulation to the delay repeats for a chorus-like effect on the echoes." },
    ],
    aliases: ["Digital Delay", "DD Delay", "Boss DD-2", "DD-7", "Lexicon PCM70", "TC 2290"],
    notableUsers: [
      { artist: "The Edge", usage: "U2 360° Tour and various large-scale live rigs (Lexicon PCM70)", sound: "Crystal-clear rhythmic repeats locked to the song's tempo" },
      { artist: "Steve Vai", usage: "David Lee Roth and Whitesnake tours 1988–1990 (Lexicon PCM70)", sound: "Elaborate, studio-grade multi-tap delay for complex lead guitar textures" },
      { artist: "Andy Summers", usage: "The Police Can't Stand Losing You intro (Lexicon PCM70)", sound: "Precise, programmed delay patterns integral to the song's composition" },
      { artist: "David Gilmour", usage: "Pink Floyd Division Bell live tour (digital delays replacing older analog units)", sound: "Pristine, spacious echo for enormous-sounding lead guitar in stadium settings" },
    ],
  },

  "tape echo / binson-like echo": {
    name: "Tape Echo / Binson Echorec",
    overview:
      "Tape-based and magnetic drum echo units were the primary delay technology from the 1950s through the 1970s. The Binson Echorec — designed by Dr. Bonfiglio Bini of Milan, Italy in the mid-1950s — is the most celebrated example in rock history, using a rotating steel-alloy drum with four playback heads rather than conventional tape, giving it exceptional stability and a uniquely warm, metallic character. The playback heads can be selected in various combinations, producing complex rhythmic echo patterns. David Gilmour used a Binson Echorec 2 as his primary delay from 1968 to 1977, defining the Pink Floyd echo sound on Dark Side of the Moon, Wish You Were Here, and Animals.",
    controls: [
      { name: "Repeat Heads Selector", description: "Selects which combination of the four playback heads are active — each combination creates a different rhythmic repeat pattern." },
      { name: "Repeat Volume", description: "Controls the level of the echo repeats." },
      { name: "Input Volume", description: "Controls the level of signal going into the unit." },
      { name: "Bass / Treble", description: "Tone shaping of the echo signal." },
      { name: "Mode (Echo / Repeat / Swell)", description: "Echo: slapback-style. Repeat: standard delay. Swell: overlapping echoes approaching reverb." },
    ],
    aliases: ["Binson Echorec", "Echorec 2", "Tape Echo", "Roland Space Echo", "Echoplex"],
    notableUsers: [
      { artist: "David Gilmour", usage: "Pink Floyd Dark Side of the Moon, Wish You Were Here, Animals (Binson Echorec 2)", sound: "Warm, shimmering, rhythmically complex echo integral to every Pink Floyd guitar sound of the era" },
      { artist: "Hank Marvin", usage: "The Shadows mid-to-late 1960s recordings", sound: "Clean, ringing slapback and repeat echo defining the Shadows' twangy, shimmering sound" },
      { artist: "Syd Barrett", usage: "Pink Floyd early recordings 1966–1968", sound: "Psychedelic, unpredictable echo effects on experimental guitar work" },
      { artist: "Jimmy Page", usage: "Led Zeppelin studio drum sound on When the Levee Breaks", sound: "Room-capture and echo on John Bonham's drums, not guitar — but iconic Binson use" },
    ],
  },

  // ─────────────────────────────────────────────
  // REVERB TYPES
  // ─────────────────────────────────────────────

  "spring reverb": {
    name: "Spring Reverb",
    overview:
      "Spring reverb uses a mechanical spring (or multiple springs) suspended in a tank to create reverberation: an input transducer drives vibrations into one end of the spring, and a pickup transducer at the other end captures the vibrations after they have bounced back and forth, creating a characteristic reverb decay. Hammond invented it in the 1930s for organs; Fender licensed the circuit and incorporated it into their amplifiers from 1961 onward. The Fender spring reverb's distinctive metallic drip — especially audible when the amp is bumped — became synonymous with surf guitar, country, and vintage rock. No digital reverb has fully replicated the springs' unique 'boing.'",
    controls: [
      { name: "Reverb", description: "Controls the mix level of the spring reverb — from a subtle ambient bloom to a cavernous, dripping wash." },
    ],
    aliases: ["Spring Tank", "Fender Reverb", "Amp Reverb"],
    notableUsers: [
      { artist: "Dick Dale", usage: "Misirlou and all surf guitar work through Fender amp reverb", sound: "Splashy, oceanic reverb defining the California surf sound" },
      { artist: "Duane Eddy", usage: "1950s–60s twangy guitar recordings", sound: "Deep, resonant space around clean guitar notes" },
      { artist: "David Gilmour", usage: "Pink Floyd studio recordings using Fender spring reverb", sound: "Natural, warm spatial ambience on clean and lightly overdriven guitar" },
      { artist: "Hank Marvin", usage: "The Shadows various UK hits", sound: "Ringing, shimmering reverb tail beneath melodic lead lines" },
    ],
  },

  "hall reverb": {
    name: "Hall Reverb",
    overview:
      "Hall reverb simulates the acoustic characteristics of a large concert hall — long decay times (typically 1.8–2.5 seconds), a slow build of echo density, and smooth, evenly distributed reflections that create the impression of a grand, prestigious performance space. In the studio, hall reverb has been created using actual echo chambers (Abbey Road, Capitol Studios) and since 1957 via the EMT 140 plate reverb, and digitally since the EMT 250 (1976) and Lexicon 224 (1978). Unlike spring reverb, hall reverb sounds genuinely spacious and musical, and has been used on countless classic recordings from Beatles' albums to Pink Floyd to modern pop.",
    controls: [
      { name: "Decay / Size", description: "Controls the length of the reverb tail — longer times simulate larger, more reverberant halls." },
      { name: "Pre-Delay", description: "Adds a gap before the reverb begins, separating the dry signal from the reverb for clarity at longer decay settings." },
      { name: "Mix / Blend", description: "Controls the balance of wet reverb against dry signal." },
      { name: "Damping / Tone", description: "Controls how the reverb tail changes tonally over time — higher damping means the highs fade faster." },
    ],
    aliases: ["Hall", "Concert Hall Reverb", "Large Hall"],
    notableUsers: [
      { artist: "David Gilmour", usage: "Pink Floyd Time, Comfortably Numb (Lexicon rack reverb)", sound: "Vast, cathedral-like space beneath singing lead guitar" },
      { artist: "The Edge", usage: "U2 various albums (Lexicon 480L rack unit)", sound: "Expansive, cinematic ambience that doubles as a compositional element" },
      { artist: "Eric Clapton", usage: "Slowhand era studio recordings", sound: "Natural-sounding room around clean guitar to give it depth and context" },
    ],
  },

  "studio room": {
    name: "Studio Room Reverb",
    overview:
      "Studio room reverb simulates the acoustic character of a small-to-medium studio recording room — shorter decay times (0.3–1.0 second), fast-building initial reflections, and a relatively dense, intimate ambience that places the instrument in a believable physical space without overwhelming the mix. Before digital reverb, studios achieved this using dedicated reverb chambers — Abbey Road's underground tiled chambers and Capitol Records' underground trapezoidal chambers being the most famous examples. As a guitar effect, room reverb adds a sense of presence and three-dimensionality without the long decay that can muddy a dense mix.",
    controls: [
      { name: "Decay / Size", description: "Controls how long the reverb tail lasts — shorter for a tight booth sound, longer for a larger studio room." },
      { name: "Pre-Delay", description: "Adds a gap before early reflections begin." },
      { name: "Mix", description: "Ratio of wet reverb to dry signal." },
      { name: "Damping", description: "Controls how quickly high frequencies fade in the reverb tail." },
    ],
    aliases: ["Room Reverb", "Studio Room", "Small Room"],
    notableUsers: [
      { artist: "The Beatles", usage: "Abbey Road echo chambers used on Revolver, Sgt. Pepper, Abbey Road", sound: "Natural, warm studio room ambience on guitars and vocals" },
      { artist: "Led Zeppelin", usage: "Led Zeppelin IV — When the Levee Breaks (stairwell room reverb)", sound: "Massive, cavernous natural room reverb on John Bonham's drums, emulated for guitar applications" },
      { artist: "Phil Spector productions", usage: "Gold Star Studios echo chambers — Wall of Sound", sound: "Dense, rich studio room reverb at the heart of the Wall of Sound production technique" },
    ],
  },

  "studio plate reverb": {
    name: "Studio Plate Reverb",
    overview:
      "Plate reverb was invented in 1957 by EMT (Elektromesstechnik) with the EMT 140, the world's first artificial reverberation unit. A large, thin steel plate (approximately 6×4 feet, weighing 600 lbs) is suspended in a frame; a transducer drives vibrations into the plate, and contact microphones capture the resulting reverb. Plates produce a dense, bright, smooth reverb with no discrete early reflections — a quality quite different from rooms or halls — making them especially beloved for vocals and lead instruments. Abbey Road Studios purchased the first EMT 140 and used it on Pink Floyd and Beatles albums; the EMT 140's sound lives on in countless digital plug-in emulations.",
    controls: [
      { name: "Decay / Reverb Time", description: "Controls the length of the reverb tail via a damping pad that reduces plate vibrations — the physical contact can be adjusted." },
      { name: "Pre-Delay", description: "On digital emulations: adds a gap before the plate reverb begins." },
      { name: "Mix", description: "Wet/dry balance between the plate reverb and the dry signal." },
      { name: "Low Cut", description: "High-pass filter often applied to remove excessive low-frequency rumble from the plate." },
    ],
    aliases: ["Plate Reverb", "EMT 140", "Studio Plate"],
    notableUsers: [
      { artist: "Pink Floyd", usage: "Time (Dark Side of the Moon), Wish You Were Here — Abbey Road EMT 140", sound: "Rich, bright, dense studio ambience that defined the Pink Floyd guitar and drum sound" },
      { artist: "The Beatles", usage: "Revolver, Sgt. Pepper's, Let It Be — Abbey Road EMT 140", sound: "Smooth, distinctive studio reverb on countless classic recordings" },
      { artist: "The Who", usage: "Quadrophenia — Abbey Road EMT 140", sound: "Dense, dramatic room that enhances the album's theatrical scope" },
    ],
  },

  "shimmer reverb": {
    name: "Shimmer Reverb",
    overview:
      "Shimmer reverb is a modern reverb type that combines conventional reverberation with pitch-shifting — typically an octave up, sometimes with additional harmonies — applied to the reverb tail. The effect creates an ethereal, 'angelic' quality beloved by ambient, post-rock, and worship music guitarists. The sound was originally achieved in the early 1980s when Brian Eno and Daniel Lanois built elaborate rack feedback loops using Lexicon hall reverbs and AMS pitch shifters. It became widely accessible through the Electro-Harmonix Holy Grail (2000), the Strymon Blue Sky, and ultimately the Strymon Big Sky (2013), which offers shimmer as its own dedicated algorithm.",
    controls: [
      { name: "Decay", description: "Controls the length of the reverb tail." },
      { name: "Mix", description: "Wet/dry balance." },
      { name: "Shimmer Level", description: "Controls how much of the octave-up (or harmony) signal is blended into the reverb tail." },
      { name: "Pitch Interval", description: "On advanced units like the Strymon Big Sky: selects the pitch-shift interval for the shimmer voice (octave up, fifth, etc.)." },
      { name: "Pre-Delay", description: "Gap before the reverb begins." },
    ],
    aliases: ["Shimmer", "Octave Reverb", "Strymon Shimmer"],
    notableUsers: [
      { artist: "The Edge", usage: "U2 Where the Streets Have No Name and ambient guitar parts", sound: "Vast, celestial harmonic bloom beneath chiming clean guitar" },
      { artist: "Brian Eno", usage: "Ambient Music productions, No Line on the Horizon era U2 production", sound: "Evolving, otherworldly harmonic texture used as an ambient production tool" },
      { artist: "Johnny Greenwood", usage: "Radiohead various atmospheric passages", sound: "Eerie, floating harmonic shimmer on experimental guitar textures" },
    ],
  },

  // ─────────────────────────────────────────────
  // SPEAKER CABINETS
  // ─────────────────────────────────────────────

  "marshall 4x12 greenback": {
    name: "Marshall 4x12 Cabinet (Greenback)",
    manufacturer: "Marshall / Celestion",
    yearIntroduced: "1966",
    overview:
      "The Marshall 4x12 cabinet loaded with Celestion G12M 'Greenback' speakers is one of the most iconic speaker configurations in rock history, forming the bottom half of the classic 'Marshall Stack.' The Celestion G12M-25 (rated 25 watts per speaker) was the standard speaker in Marshall lead guitar 4x12 cabs from the mid-1960s through the early 1980s. Its characteristic 'woody,' compressed midrange and limited power handling cause it to break up gently when pushed — adding harmonic richness to the already-overdriven amp signal. The Pulsonic-cone era Greenbacks (pre-1973) are especially prized and now command significant collector prices.",
    controls: [],
    aliases: ["Greenback Cab", "Marshall 1960A Greenback", "G12M Cab", "Celestion Greenback"],
    notableUsers: [
      { artist: "Jimi Hendrix", usage: "Live performances 1966–1969 — Marshall Super Lead into Greenback cabs", sound: "Explosive, warm bottom end beneath the Plexi's raw power" },
      { artist: "Eric Clapton", usage: "Cream live performances", sound: "Full, harmonically complex classic British rock tone" },
      { artist: "AC/DC (Angus Young)", usage: "Let There Be Rock era live setups", sound: "Punchy, mid-forward British rock tone in a massive wall of cabinets" },
      { artist: "Pete Townshend", usage: "The Who live — wall of Marshall stacks", sound: "Thunderous, room-filling low end beneath the DR103 Hiwatt signal" },
    ],
  },

  "4x12 vintage 30": {
    name: "4x12 Cabinet (Celestion Vintage 30)",
    manufacturer: "Various / Celestion",
    yearIntroduced: "1986",
    overview:
      "The 4x12 cabinet loaded with Celestion Vintage 30 speakers is the dominant high-gain guitar cabinet configuration of the modern era. The Vintage 30 speaker was developed in 1986 using laser Doppler interferometry to model the Celestion Alnico Blue, resulting in a 60-watt ceramic-magnet speaker with an unusually detailed and complex midrange, a warm low end, and a bright, revealing top end. Its high sensitivity (100dB/W) makes it sound dramatically louder than rated wattage would suggest, and its midrange character cuts through dense mixes. Slash's endorsement of the V30 as his favorite speaker cemented its dominance in rock and metal.",
    controls: [],
    aliases: ["V30 Cab", "Vintage 30 Cabinet", "Celestion V30"],
    notableUsers: [
      { artist: "Slash", usage: "Guns N' Roses and solo career — Vintage 30s in Marshall cabs", sound: "Warm, rich, harmonically complex tone with excellent presence and cut" },
      { artist: "Steve Stevens", usage: "Billy Idol solo work and studio sessions", sound: "Bright, articulate high-gain tone with clear note definition" },
      { artist: "Adam Jones", usage: "Tool studio and live — Vintage 30-loaded cabs", sound: "Thick, complex midrange supporting progressive metal riffing" },
    ],
  },

  "generic 2x12 open back": {
    name: "Generic 2x12 Open-Back Cabinet",
    overview:
      "The 2x12 open-back cabinet is a versatile, mid-sized speaker configuration that balances the punch of a 4x12 with the portability of a 1x12. Its open back allows sound to project both forward and backward, creating a more dispersed, three-dimensional, ambient tone compared to the focused projection of a closed-back design. Bass response is slightly looser and less defined — a characteristic that many blues, jazz, and clean-tone players prefer for its natural, airy quality. Commonly used with medium-wattage heads from Fender, Vox, and boutique builders, the open-back 2x12 is a studio workhorse and gigging standard.",
    controls: [],
    aliases: ["2x12 Open Back", "Open Back 2x12"],
    notableUsers: [
      { artist: "Eric Clapton", usage: "Various studio sessions — Fender-style 2x12 configurations", sound: "Open, airy, natural clean tone with room-filling ambience" },
      { artist: "Stevie Ray Vaughan", usage: "Various Fender combo-style configurations", sound: "Wide, dispersed Texas blues tone with natural three-dimensional presence" },
    ],
  },

  "1x12 open back": {
    name: "1x12 Open-Back Cabinet",
    overview:
      "The 1x12 open-back cabinet houses a single 12-inch speaker in an enclosure with an open rear panel, allowing sound to project in multiple directions for a wide, airy tone. This is the classic configuration for boutique combo amplifiers — Fender Deluxe Reverbs, Princeton Reverbs, Vox AC15s — where portability is as important as tone. The open back creates natural ambience and excellent response in the upper midrange and high frequencies, while bass response is slightly reduced compared to closed-back designs. Ideal for smaller venues, studio work, and any playing environment where a full, room-filling sound is needed without the size of larger cabinets.",
    controls: [],
    aliases: ["1x12 Combo", "Single 12 Cabinet", "1x12 Open"],
    notableUsers: [
      { artist: "Neil Young", usage: "Fender Deluxe 1x12 combo throughout career", sound: "Raw, woody, intimate tone with natural single-speaker compression" },
      { artist: "Tom Petty", usage: "Vox AC15-style 1x12 configurations", sound: "Jangly, chiming clean tone with Alnico speaker character" },
      { artist: "Eric Clapton", usage: "Fender Deluxe Reverb 1x12 combo for studio work", sound: "Warm, touch-sensitive clean tone that breaks up naturally at volume" },
    ],
  },

  "2x12 alnico": {
    name: "2x12 Alnico Cabinet (Celestion Blue)",
    manufacturer: "Vox / Celestion",
    yearIntroduced: "1959",
    overview:
      "The 2x12 Alnico cabinet loaded with Celestion Alnico Blue speakers is the defining speaker configuration of the Vox AC30 and the British Invasion sound. The Celestion Blue (originally the G12 T530) was the world's first purpose-built guitar speaker — created in the late 1950s from a radio speaker — and its alnico (aluminium-nickel-cobalt) magnet gives it uniquely musical compression when pushed. The resulting tone is characterized by brilliant high-frequency chime, smooth midrange, and a gently saturated quality under high drive. From the Beatles to Brian May to The Edge, the Blue's sound is woven into the fabric of rock history.",
    controls: [],
    aliases: ["Celestion Blue Cabinet", "Alnico Blue 2x12", "Vox 2x12"],
    notableUsers: [
      { artist: "The Beatles", usage: "Early Beatlemania live shows and recordings — Vox AC30 2x12", sound: "Chimey, jangly, bright British pop with characterful speaker compression" },
      { artist: "Brian May", usage: "Queen throughout career — wall of AC30s with Blues", sound: "Brilliant, harmonically layered lead tone — uniquely recognizable" },
      { artist: "The Edge", usage: "U2 from The Unforgettable Fire onwards", sound: "Crystal-clear, shimmering clean foundation for elaborate delay work" },
      { artist: "Tom Petty", usage: "Tom Petty & the Heartbreakers recordings and tours", sound: "Warm, American-meets-British jangle with natural speaker bloom" },
    ],
  },

};
