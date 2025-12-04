// scripts/seedBlogs.ts
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

console.log("Loaded blog env:", {
  NEXT_PUBLIC_SUPABASE_BLOG_URL: process.env.NEXT_PUBLIC_SUPABASE_BLOG_URL,
  HAS_BLOG_SERVICE_KEY: !!process.env.SUPABASE_BLOG_SERVICE_ROLE_KEY,
});

const blogUrl = process.env.NEXT_PUBLIC_SUPABASE_BLOG_URL;
const blogServiceKey = process.env.SUPABASE_BLOG_SERVICE_ROLE_KEY;

if (!blogUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_BLOG_URL is not set");
}
if (!blogServiceKey) {
  throw new Error("SUPABASE_BLOG_SERVICE_ROLE_KEY is not set");
}

const supabase = createClient(blogUrl, blogServiceKey, {
  auth: { persistSession: false },
});

function dateOnDec4(time: string) {
  // time format "HH:MM", Brussels local time (+01:00)
  return `2025-12-04T${time}:00+01:00`;
}

async function main() {
  console.log("🌱 Seeding Blog data...");

  // 1) AUTHORS
  const authors = [
    {
      handle: "ebrahim-hdida",
      name: "Ebrahim Hdida",
    },
    {
      handle: "alfie-vercammen",
      name: "Alfie Vercammen",
    },
    {
      handle: "dries-vanderstukken",
      name: "Dries Vanderstukken",
    },
    {
      handle: "ilias-benabdellah",
      name: "Ilias Benabdellah",
    },
    {
      handle: "yasmine-rahou",
      name: "Yasmine Rahou",
    },
  ];

  const { data: authorRows, error: authorError } = await supabase
    .from("authors")
    .upsert(authors, { onConflict: "handle" })
    .select("*");

  if (authorError) {
    console.error("❌ Failed to upsert authors:", authorError);
    process.exit(1);
  }

  console.log("✅ Authors seeded:", authorRows?.length ?? 0);

  const authorsByHandle = new Map(
    (authorRows ?? []).map((a) => [a.handle as string, a])
  );

  const ebrahim = authorsByHandle.get("ebrahim-hdida");
  const alfie = authorsByHandle.get("alfie-vercammen");
  const dries = authorsByHandle.get("dries-vanderstukken");
  const ilias = authorsByHandle.get("ilias-benabdellah");
  const yasmine = authorsByHandle.get("yasmine-rahou");

  if (!ebrahim || !alfie || !dries || !ilias || !yasmine) {
    console.error("❌ Missing one or more authors, aborting.");
    process.exit(1);
  }

  // 2) POSTS
  // NOTE: fill the `content` fields before running, you can use multiline template literals.
  const posts = [
    // Alfie Vercammen
    {
      slug: "rip-the-underground",
      title: "R.I.P The Underground?",
      content: `
I have been listening to a lot of rap lately, and I started wondering what people actually mean when they say an artist is "underground". It used to be simple. It meant you were unsigned, you sold CDs out of your trunk and you probably couldn’t get on the radio. But after reading the article by Andree Gee, I'm starting to think the term doesn’t make as much sense as it used to.

The internet has changed a lot. The big wall between “mainstream” and “underground” has kind of disappeared. The digital evolution has allowed artists to operate with a direct-to-consumer model, eliminating many of the barriers that kept certain acts obscure. These days all artists are a Tik Tok trend away from a platinum single. Are all the artists “underground” in the same way? It's difficult to explain exactly what that phrase means today.

To me underground music means “Everything that is different and diverse from the mainstream, music that is somewhat niche.” I think this somewhat aligns with what renowned A&R executive Dante Ross thinks “Underground rap means everything that’s not mainstream and has a somewhat determined ceiling.”  However I think that “ceiling” is getting harder to smash through, even if it's easier to upload music. Sure everyone can put a song on Spotify, but that doesn't mean they are being heard or paid. I was pretty shocked to learn that Spotify recently stopped paying royalties on tracks that have fewer than 1000 plays. To be honest, that feels like a slap in the face to the true underground. It basically tells them that only mass appeal is appreciated and small art is worth literally nothing.

This forces artists to chase trends instead of building a unique sound. As Whalar points out, Tik Tok has become a massive force in the music industry. It’s great for discovery but it also creates a pressure to make music that works in short viral clips. If an "underground" rapper is just tweaking their sound to please the tik tok algorithm, are they really even underground anymore? Or are they just trying to be mainstream?

I used Gemini to help me summarize the main points of the article, and it highlighted that the “underground” used to be about a shared ideology and community, not just sales. I feel like we are losing the community spirit within the underground scene. Now it just feels like all the artists are fighting a lonely battle against an algorithm.

Ultimately, I don't think the underground is dead, but it has definitely changed. It isn’t about trunk sales anymore, it’s about survival in a digital ocean. If you find a  niche artist you love, you should support them directly, buy their merch or go to a show, because streaming definitely isn’t paying their bills.


References:
Gee, A. (2024, December 11). What Does 'Underground Rap' Mean Today? Complex. https://www.complex.com/music/a/andre-gee/underground-rap-evolution
Google. (2025). Gemini [Large language model]. https://gemini.google.com
Stassen, M. (2023, November 21). Confirmed: Spotify to stop paying royalties on tracks with less than 1,000 plays. Music Business Worldwide. https://www.musicbusinessworldwide.com/confirmed-spotify-to-stop-paying-royalties-on-tracks-with-less-than-1000-plays/
Whalar. (2023, June 15). The TikTok Effect: How the platform is changing the music industry. Whalar. https://whalar.com/insights/the-tiktok-effect

`.trim(),
      author_id: alfie.id,
      published_at: dateOnDec4("10:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("10:00"),
      updated_at: dateOnDec4("10:00"),
    },
    {
      slug: "authenticity-in-underground-music",
      title: "Authenticity in underground music?",
      content: `
Most artists' dream is to create something meaningful and be heard.
But in reality it’s not an easy hobby or job to continue without the necessary funds.
That’s when reality starts setting in and it becomes more about paying rent and pumping out music consistently.

But is that really what music needs? Do artists need to consistently make music to get famous and be able to pay the bills or is authentic music the way to go.

In this day and age it seems like authentic music is extremely rare. Artists seem to forget why they started making music in the first place. This leads to them losing big parts of their loyal oldschool fanbase. 
These artists start asking the wrong questions when making music. Instead of asking if it has meaning to themselves they start asking will it perform on the big stage, or is it a good Tik Tok audio.

In my opinion artists should focus more on their origins, on why they started music. Trying to make their own sound and tell their own story. Artists should be able to find themselves in music not lose themselves. 
Most platforms don't care about being real anymore. This causes people to be drowning  in content but deprived of a connection. The whole world needs to go short and quick, time seems to be costing a lot of money. That doesn’t mean we can't enjoy a longer and more heartfelt connection with the artist. 

An artist should not be forced to choose one or the other. I personally think the best choice is both, finding a sweet spot where the practical realities of the industry support the creative vision rather than stifle it. You don’t have to choose between being broke and being a sellout.

it is possible to treat your music as a business without treating your art like a product. The smartest artists today use the algorithms and the short-form content not to chase trends, but to amplify their real story. They use the tools of the “new” underground to build a platform, but once they have the audience’s attention, they deliver something with depth and soul.

Ultimately, sustainability allows for longevity. If you can pay your rent with your music, you buy yourself the time to evolve and experiment. But that financial freedom should be the shield that protects your authenticity, not the sword that kills it. In a world of fleeting viral moments, the artists who remain true to their origins are the ones who will build a legacy that outlasts the next scroll.

References: 

Ruppert, P. (2025, 6 mei). The New Underground: Authenticity in an Age of Algorithms. Peter Ruppert. https://www.peterruppert.com/p/the-new-underground-authenticity
`.trim(),
      author_id: alfie.id,
      published_at: dateOnDec4("10:30"),
      reading_time_minutes: 5,
      status: "published" as const,
      created_at: dateOnDec4("10:30"),
      updated_at: dateOnDec4("10:30"),
    },
    {
      slug: "the-new-sound-of-liverpool",
      title: "The new sound of Liverpool",
      content: `
Everyone knows Liverpool for The Beatles or for football, but there is
A new wave of rappers from Liverpool's working-class areas is gaining international recognition. Unlike the polished, welcoming image often projected by the city, this underground scene paints a gritty, raw picture of Liverpool. The music is characterised by the distinct Scouse accent described as breathless, aggressive, yet casual and diverse. 

Personally, I find this shift fascinating. For years, the UK rap scene has been dominated by London accents and slang. Scouse rappers like Mazza L20 and Young LS are finally breaking the mold. Listening to tracks like Murdaside, you don’t hear the friendly “Liverpool FC” version of the city, you hear a voice that has been ignored. In my opinion, the aggressive delivery isn’t just for show, it feels like a real release of frustration, especially on Tik Tok where snippets of these songs are going viral.

It is important to look at the facts behind this anger. This music is not coming from nowhere. Liverpool has historically suffered from high levels of poverty and neglect. According to a recent report, the Liverpool City Council has faced budget cuts of 35% over the last 14 years. When you look at the music with that in mind it isn’t just “gangster rap”, it becomes a form of social commentary. They are rapping about their everyday lives.

It's not just about the big picture. It is the specific details in the lyrics that really grabbed my attention. They are rapping about what they see every day, and they do it on their own terms. For example rappers like Kasst 8, use “Scouse Backslang” in their tracks, a coded language used to keep conversations private from the police. That isn’t something you hear on mainstream radio. It shows how deep the divide is between their world and the rest of society. They aren’t trying to make it easy for outsiders to understand. They are speaking directly to their own people.

Critics might argue that the violence in the lyrics is problematic. This is the same criticism people always make about the wider UK drill genre, However, I believe that silencing these artists would be a mistake. They are documenting their reality. THe rise of the “Scousemix” where rappers from rival areas collaborate shows a unity that politicians often fail to achieve.

Ultimately, this new sound is vital. It is loud, it is uncomfortable and it is undeniably Scouse. If you are tired of the same old chart music, I highly recommend diving into this scene. It might just change how you see the city.


References:
Evans, N. (2025, July 9). Scouse Rap: Inside Liverpool's raw, rowdy underground scene. Dazed. https://www.dazeddigital.com/music/article/68212/1/murdaside-liverpool-gritty-scouse-rap-mazza-l20-essdeekid-young-ls

Thapar, C. (2019, May 16). Drill music is not the enemy – it's a symptom of a divided society. The Guardian. https://www.theguardian.com/commentisfree/2019/may/16/drill-music-knife-crime-violence-london

Google. (2025). Gemini [Large language model]. https://gemini.google.com

`.trim(),
      author_id: alfie.id,
      published_at: dateOnDec4("11:00"),
      reading_time_minutes: 5,
      status: "published" as const,
      created_at: dateOnDec4("11:00"),
      updated_at: dateOnDec4("11:00"),
    },

    // Dries Vanderstukken
    {
      slug: "internet-and-the-blooming-of-the-underground-music-industry",
      title: "Internet, and the blooming of the (underground) music industry.",
      content: `
What has the internet brought us? In recent times it might seem like it has done little good. It has inserted meaningless vocal stims into the vocabulary of the younger generations (I’m referring to brain rot for those unaware). Social media has eroded our real social life bit by bit, decreasing overall mental health, causing poor sleep, memory issues and academic struggles (How Social Media Affects Mental Health, 2025). And to top it all off Twitter now exists.
But! Despite all of this, the internet has actually—believe it or not—brought us some benefits. One of those benefits being the democratization of the music industry. Have you ever wanted to make music? Well, you’re in luck! We’re in the 21st century, making and releasing music has never been this easy! Just download a free program, muck about in it for a couple hours and just like that you’ve got a symphony the likes of which SoundCloud has never seen before! Jokes aside, due to the internet, just about every possible aspect of the music creation process has been significantly simplified.
Starting from the very beginning, the actual tools you need to start making music. As I mentioned before, anyone can start producing music with affordable (or completely free) digital audio workstations (DAWs) and virtual instruments (VSTs). Software like FL studio, Ableton Live and Logic Pro X have made it possible for anyone with a computer to make music with basically no barrier to entry (Ruff, 2025).
On top of that, learning to make music has also gotten way easier. There are countless online guides and tutorials for any instrument or concept you can imagine. Physical music lessons are also more accessible than ever, albeit still expensive (Ruff, 2025).
Good, you’ve made a song, now what? Well… Distribution! And yes, this too is easier. Platforms like Bandcamp, SoundCloud, YouTube, and of course Spotify have made it super easy to reach a worldwide audience. You don’t need a big-label contract to go viral or make money from making music. On top of that, social media platforms like Instagram and TikTok offer an easy way for artists to build an audience and engage with their community (Mdlbeast, 2024).
This goes for the fans’ side as well, never has it been this easy to both find and play music. And here’s where we get to the crux, all of this combines to make the underground music scene more accessible than ever.
 Of course there are some concerns for the future, such as the fact that, due to the rise of algorithms—and AI—there could be a problem of the homogenization of music taste (Mdlbeast, 2024). This would be detrimental to niche and underground genres and artists. If we just take measures to protect and nurture these weaker, independent artists, we can stop worrying about the negatives and accept the future with open arms. Because, while AI is developing faster than ever and wars seem ever more prevalent day by day, for all music enthusiasts out there, all in all, it’s a great time to be alive.

References:

How social media affects mental health. (2025, 5 juli). https://deconstructingstigma.org/guides/social-media

Ruff, N. (2025, 22 januari). How the internet has changed the music industry. Recording Connection. https://recordingconnection.com/reference-library/how-the-internet-has-changed-the-music-industry/

Mdlbeast. (2024, 17 september). The Evolution of Music in the Digital Age. MDLBEAST. https://mdlbeast.com/xp-feed/music-industry/the-evolution-of-music-in-the-digital-age


`.trim(),
      author_id: dries.id,
      published_at: dateOnDec4("11:30"),
      reading_time_minutes: 7,
      status: "published" as const,
      created_at: dateOnDec4("11:30"),
      updated_at: dateOnDec4("11:30"),
    },
    {
      slug: "ai-in-the-music-industry",
      title: "AI in the music industry.",
      content: `
Let me paint a picture for you. You are a 20 year veteran of the music industry, a known figure with many accolades to your name. A kid, perhaps about 14 years old, comes up to you and wants to talk about music. Being the nice senior you are, you try to help him: “So, you want to make music? It’s not that simple. You have to spend a lot of time learning theory, practicing and–” You are interrupted by the young guy, his face transforms into a grimace filled with disgust as he responds with something along the lines of: “Get with the times old man, unc over here thinks he’s Mozart.” He didn’t want to learn to make music through those tedious and arduous means, studying is boring after all. He… makes AI music.

It’s inescapable nowadays, artificial intelligence, everyone knows what it is by now. AI here, AI there, AI everywhere! AI chatbots, AI Gift ideas, AI nsfw… roleplay bots? (yeah, that’s a real thing) And of course the crux for this article, AI music generators. A good example is Suno. Using Suno, in just about 3 minutes you can choose a theme, lyrics and a singer to generate a song that sounds… scarily real. Naturally the songs it generates are still relatively unimaginative, stale, boring, sloppy, etc. but it’s only going to keep getting better.

AI is something every industry has to think about, and for creative, artistic industries like the music industry, that’s even more so. If rules and agreements aren’t established, human artists might just get drowned by the flood of AI songs that will inevitably stream in. There’s numerous concerns regarding this, including copyright issues, loss of royalties, concerns around creativity and the loss of some specialized jobs (The Role Of AI in Modern Music Production ? LCCM Blog, 2025). 

To quickly expand on those points: AI music is trained on many different pieces of music, all belonging to different artists. That means AI models are indirectly “copying” thousands of artists. The current copyright laws aren’t really too clear on this, is it copyright or not (Berger, 2025)? The second point relates to how cheap and easy AI is to use. When companies are faced with the question of getting an artist or an AI to make a tune for them, AI is faster, cheaper and easier to work with (Berger, 2025). Royalty streams shrink as a result. On top of that, when a tsunami of new songs flood the market, it will inevitably dilute the uniqueness and value of each individual song, making it harder for artists to stand out and be heard (How AI Is Transforming The Creative Economy And Music Industry, 2025).

AI isn’t necessarily all bad though, AI tools can be used by artists to speed up their work, gain some inspiration or tips and to reduce the barrier-to-entry of creating music (The Role Of AI in Modern Music Production ? LCCM Blog, 2025). All we have to do is not fall into the trap of complacency and let AI do all the work. This way we can use AI for the amazingly useful tool it is, without completely losing our own voice and creativity. 






References:

The Role of AI in Modern Music Production ? LCCM Blog. (2025, 24 juli). London College Of Contemporary Music | LCCM. https://www.lccm.org.uk/blog/the-role-of-ai-in-modern-music-production/

Berger, V. (2025, 3 januari). AI’s Impact on music in 2025: Licensing, creativity and industry survival. Forbes. https://www.forbes.com/sites/virginieberger/2024/12/30/ais-impact-on-music-in-2025-licensing-creativity-and-industry-survival/

How AI is transforming the creative economy and music industry. (2025, 4 februari). OHIO Today. https://www.ohio.edu/news/2024/04/how-ai-transforming-creative-economy-music-industry

`.trim(),
      author_id: dries.id,
      published_at: dateOnDec4("12:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("12:00"),
      updated_at: dateOnDec4("12:00"),
    },
    {
      slug: "im-not-telling-you-what-this-article-is-about",
      title: "I’m not telling you what this article is about.",
      content: `
Gatekeeping. The article is about gatekeeping. Specifically gatekeeping within the art world. There are currently 2 large ‘Gatekeepers’ present for artists and art enthusiasts. Both work in tandem to starve newer artists of a means to promote themselves and show their work. The 2 gatekeepers in question are: Social media algorithms (Parr, 2025) and human art ‘experts’ (Delagrange & Delagrange, 2024).

Let’s start with the humans. The use of the word ‘experts’ earlier refers to decision-makers within the art scene. Think about gallery owners and museums, they have to choose which artworks to present and which to drop. Since they often have their own subjective preferences it becomes difficult for artists that have different styles to ever get featured in such galleries. Not to mention newer artists have no way to compete with more established artists other than the whims of whoever chooses what artworks to display (Delagrange & Delagrange, 2024).

And then we get to social media. Newer artists might want to turn to the internet to share their art. Nowadays everything is available online and there are numerous forums and mediums to share and explore art. Therefore social media brings the possibility for anyone to establish themselves. The problem with that is the fact that algorithms are geared towards showing popular content. An algorithm inherently doesn’t care for artists that might have eccentric styles. Styles that fit with current trends get pushed, others do not. Simple as that. This leaves artists with a choice, keep their style and their own “identity” or lose that identity to copy whatever is popular at the time. Ultimately enjoying more visibility but losing what you really wanted to show (Artists, Gatekeeping, And Social Media Struggles, 2023).

I also gatekept the fact that there is a third form of gatekeeping. And it lies in the eyes of the beholders. At the final step, when your art makes it through the algorithms and is seen by the masses, some of the people will make up whatever excuse to devalue your art. You didn’t go to art school? You’re not a real artist. You make digital art? You’re not a real artist. You used [insert tool here]? You’re not a real artist (Parr, 2025). Every now and then you might see one of these comments and it’s truly disappointing to think there are still purists like that. Of course everyone is entitled to their own opinion but such views are outdated and harmful. Such comments are in no way constructive criticism and are therefore completely pointless. Shrugging away countless pieces of art because they weren’t made according to how you want them to is a huge shame and honestly a tragedy. You are not some white knight “protecting” the art world from anything. You are a tumor actively eating away at it.








References:

Parr, J. (2025, August 31). Gatekeeping in Art: The barriers that hold creatives back. DIYvinci. https://www.diyvinci.com/post/gatekeeping-in-art-the-barriers-that-hold-creatives-back

Delagrange, J., & Delagrange, J. (2024, 9 oktober). Gatekeeping & the Subjectivity of Art in the Art World — CAI. Contemporary Art Issue - Platform, Publisher & Gallery on Contemporary Art. https://www.contemporaryartissue.com/gatekeeping-the-subjectivity-of-art-in-the-art-world/

Artists, Gatekeeping, and Social Media Struggles. (2023, 24 oktober). Medium. https://medium.com/@artivists/artists-gatekeeping-and-social-media-struggles-a0fc36442337

`.trim(),
      author_id: dries.id,
      published_at: dateOnDec4("12:30"),
      reading_time_minutes: 5,
      status: "published" as const,
      created_at: dateOnDec4("12:30"),
      updated_at: dateOnDec4("12:30"),
    },

    // Ebrahim Hdida
    {
      slug: "struggle-of-underground-artists",
      title: "Struggle of underground artists",
      content: `
As someone who likes underground music, I see many talented artists putting their best effort into their music, yet they still struggle to earn money and get recognition. In my opinion, the music industry today makes it very hard for these artists to be noticed and to earn from their art.
Below, I will discuss the challenges they face, based on my research

Financial Struggle
One of the biggest struggles is financial. Streaming platforms pay artists only a very small part of the total income (Spears, 2025. The payment is so low that even millions of streams might not be enough to cover basic monthly rent. Spotify and YouTube usually pay estimates around $0.0003 to $0.0005 per stream.

Without financial support from bigger platforms or labels, underground artists often need to work multiple jobs just to pay their bills. But that also means they can’t focus fully on their music, which prevents them from reaching their full potential.

Algorithm
Another issue that makes their struggle worse is the platform algorithm, which lowers their visibility. There is an overwhelming flood of music released every day tens of thousands of new songs get uploaded daily, increasing the competition. It is shocking that 4 out of 5 songs on major platforms are never played at all (Rosenblatt, 2025). This means a huge amount of underground music never reaches any listeners.

The problem is that instead of helping underground artists shine, the algorithms usually push already famous artists even more (Smith, 2020; Spears, 2025), while underground artists become even less visible.

In my opinion, there should be changes to the algorithm to make it more fair and to give new, creative artists a real chance to shine.


References:

Rosenblatt, B. (2025, 22 maart). 4 out of 5 songs sent to music services are never played; what this means for the industry. Forbes. https://www.forbes.com/sites/billrosenblatt/2025/03/06/4-out-of-5-songs-sent-to-music-services-are-never-played-what-this-means-for-the-industry/

Spears, N. (2025, 14 oktober). The Struggle of Independent Artists in the Age of Streaming Giants. Canary. https://www.thecanary.co/discovery/lifestyle/2025/03/12/the-struggle-of-independent-artists-in-the-age-of-streaming-giants/

Smith, D. (2021, 24 februari). 1% of Artists Generate 90% of All Music Streams, Latest Data Shows. Digital Music News. https://www.digitalmusicnews.com/2020/09/10/music-streams-data/

`.trim(),
      author_id: ebrahim.id,
      published_at: dateOnDec4("13:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("13:00"),
      updated_at: dateOnDec4("13:00"),
    },
    {
      slug: "how-ai-affects-underground-musicians",
      title: "How AI Affects Underground Musicians",
      content: `
As you may already know, AI can be used in many fields like programming or writing text, it is part of every-day life of every person in modern society. This new technology is also affecting other fields, like music.  In music, AI can now help underground artists to create songs, mix tracks, and even write lyrics. So AI tools can be a big help. However, AI can also create challenges for these musicians. In this blog, I will look at how AI impacts underground music artists, both the positive effects and the negative ones, based on recent research and information. I will also share my personal opinion at the end.

AI’s positive Impact On Underground Music
AI offers numerous advantages for underground artists. It can make music production easier and cheaper, which is one of the important aspects for underground artists. For example, AI tools can handle tasks like creating a backing track or remastering a song. Which saved a lot of time and money. According to many reports, AI already helps musicians create high-quality music more easily, experiment with new sounds, and reach wider audiences (Gera, 2025), and AI has “made music production more accessible to aspiring artists..allowing anyone with a creative vision to bring their musical ideas to life” (Soundraw, 2025). These advantages make music creation more affordable and accessible.

It is not only about cheap, easy production, but also about creativity. It can generate new melodies or beats that artists might not think of on their own. It also automates some of the routine work, so AI gives artists more time to focus on creative parts of the music. AI systems can help musicians experiment with different genres and sounds, expanding their creative possibilities. It is not only about the production of music but also about the algorithms, big platforms make use of AI to recommend underground artists to more viewers. In short, AI can be a useful tool for underground artists by lowering costs, giving new ideas, and possibly reaching new fans.

AI Negative Impact On Underground Music
On the other hand, AI brings several challenges, problems and risks for underground artists. One big issue is the loss of human touch in music. Music created by humans often carries personal experience  and stories. There is fear that AI-produced music might lack the nuanced expression and emotional resonance that human musicians bring to their craft (Soundraw, 2025). As one writer notes, AI is diminishing the traditional bond because AI can quickly create music without the emotional depth of human experience, replacing the personal connection between artists and their audience. (Reilley, 2025). This might make music feel less personal or meaningful to listeners over time.

Another problem is that AI makes a lot of music that sounds literally the same, because all AI are fed with already made songs on the internet. A company blog about AI in music warns that there is a risk of “a saturation of similar-sounding music, potentially stifling diversity” (Soundraw, 2025). What makes underground music unique is the creativity and uniqueness in their song, but if AI favors things that are already popular it won’t bring anything new to the music world.

AI could also lead to legal issues that hurt some artists. A striking example happened in 2023, when an AI-generated track mimicking the voices of famous artists Drake and The Weeknd went viral without their permission (Gera, 2025). If AI clones and copies other people's voices, it could do the same to an underground artist's unique style too. Overall, these issues show that uncontrolled use of AI might exploit artists rather than support them.
My personal opinion
While AI can be a powerful tool, we still need to be careful when using it. For independent underground artists, AI can offer a great help for free. It can give them cheap ways to make professional sounding music. However, I also feel worried about AI taking creativity too far  away from the human taste. If every song starts to be made  by an AI following a specific algorithm, music could become boring and repetitive. I believe AI and artists can work together. The AI can do the heavy things, and humans can focus on art and uniqueness. We just have to make sure that we don’t let technology completely take over the music we love.


References:

Gera, S. (2025-March). https://nhsjs.com/2025/the-impact-of-artificial-intelligence-on-music-production-creative-potential-ethical-dilemmas-and-the-future-of-the-industry/

SOUNDRAW blog. (2025, Jan). https://soundraw.io/blog/post/pros-and-cons-of-using-ai-in-music-production

Reilley, M. (2025, March). Opinion: Generative AI’s Profound Impact on the Music Industry. Opinion: Generative AI’s Profound Impact On The Music Industry. https://redlineproject.news/2025/03/20/opinion-generative-ais-profound-impact-on-the-music-industry-2/

`.trim(),
      author_id: ebrahim.id,
      published_at: dateOnDec4("13:30"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("13:30"),
      updated_at: dateOnDec4("13:30"),
    },
    {
      slug: "why-underground-music-artists-are-special",
      title: "Why Underground Music Artists Are Special",
      content: `
Underground music artists are artists who perform outside the mainstream music industry. They might not be famous, but they definitely have a unique “appeal”. These artists work independently most of the time. Many music fans find underground artists special because of their creativity and originality.

Why Underground Artists Are Special
Createtivity and freedom: underground artists often dare to try creative music. They are “unrestricted by major label demands” (Blog, 2024). Without big companies telling them what to do they explore new genres, possibilities and express themselves fully

Authenticity: Many underground artists focus on making honest music that really connects with the listeners, “underground music, as a genre , distinguishes artists as genuine… in distinction to those with commercial ambitions” (Aroesti, 2020b). Their music is personal and real that connects with the listeners real world they are living in.

Cultural impact: Underground music has a big cultural impact. These artists bring new ideas and different styles into the music world. They use influences from their own communities and create music that feels real and unique. This makes the music scene richer and more diverse.

My Opinion
In my opinion, underground music is special. I find their music more creative and connecting than a lot of mainstream music. As a fan, I love discovering new ideas on small streaming platforms. They also often talk about real-life issues which mainstream music doesn't. To me, these underground artists keep music interesting. They prove that you don’t need to be a superstar on the radio to make an impact on someone’s life. Supporting underground musicians feels like being part of a close community, and that makes their music even more meaningful.

References:

Aroesti, R. (2020b, september 22). “People are taking safer choices”: six alternative artists on today’s musical underground. The Guardian. https://www.theguardian.com/music/2017/nov/27/alternative-artists-interviews-thurston-moore-black-madonna

Blog, J. (2024, 27 mei). Beyond the Mainstream: Exploring the Diverse World of Independent Music – Jukeboxy. Jukeboxy Blog. https://www.jukeboxy.com/blog/beyond-the-mainstream-exploring-the-diverse-world-of-independent-music/


`.trim(),
      author_id: ebrahim.id,
      published_at: dateOnDec4("14:00"),
      reading_time_minutes: 4,
      status: "published" as const,
      created_at: dateOnDec4("14:00"),
      updated_at: dateOnDec4("14:00"),
    },

    // Ilias Benabdellah
    {
      slug: "the-right-way-to-do-the-wrong-thing",
      title: "The Right Way to Do the Wrong Thing",
      content: `
Everyone knows it’s “wrong”, yet so many of us still do it.
In the underground music world, sometimes it feels like there’s no other choice. How do we
make sense of doing something that’s technically illegal, but still feels morally right?
Introduction
Many beginning artists might remember the first cracked VST they downloaded. In the moment
they might’ve told themselves: “I’ll pay for it when I can.”. This isn’t rationalizing theft so much as
rationalizing access. When you’re in a moment where money is tight, many producers see
piracy as a detour rather than the final path they’ll be taking.

Main content
Piracy isn’t a free pass. When you pirate, you violate copyright laws, undermine developers'
work and rob corporations of sales (though the latter might be more myth than truth).
From a purely legal point of view, many arguments condemn piracy as unethical (Bytescare,
n.d).
But in practice moral judgement isn’t so black and white.
Chan et al. (2009) describes the four-component model of moral reasoning: recognition (is
piracy seen as a moral issue?), judgement (is it judged permissible), intention (do you intend to
pirate) and behavior. Interestingly, their study found that even when people recognized piracy
as infringement, they didn’t always see it as morally wrong. People often compartmentalize,
especially when their motive comes from necessity instead of greed.
Big corporations often claim piracy costs them millions of dollars in “lost revenue.”, they do this
by counting every pirated copy as a sale. But this argument assumes every pirate was able to
afford their software in the first place, which is very rarely true. Research shows that there’s little
consistent evidence that piracy does lead to lower sales. In some industries, it might even boost
exposure (Oberholzer-Gee & Strumpf, 2010).
Many wouldn’t have actually purchased the software anyway. Claiming a “lost sale” is literally
like saying you lost a customer who never even existed in the first place! These corporations
already make massive profits (looking at you, Adobe), and their anti-piracy campaigns only
punish paying users more than they do pirates through DRM (Smith, 2008; Electronic Frontier
Foundation [EFF], 2008)
Piracy may be illegal, but when there’s a system in place that controls access to software and
locks creativity behind an unrealistic paywall, you could also call it resistance. When a young
artist simply wants to experiment and downloads a cracked plugin to start making music, then

that isn’t criminal, they’re simply exploring their interests (imagine paying 1000 USD as a
teenager just to find out you aren’t interested.) That doesn’t make it fully right, but it does make
it feel right. The real “right way” to do the wrong way might be: understanding the “harm”,
supporting developers when you actually can and to keep fighting for fair access. In the end,
piracy isn’t really about stealing but rather about refusing to pay outrageous prices.

References:

Bytescare. (n.d.) Ethical and legal issues in software piracy. Retrieved October 8, 2025, from
https://bytescare.com/blog/ethical-and-legal-issues-in-software-piracy
Oberholzer-Gee, F., & Strumpf, K. (2010). FIle-sharing and copyright. Innovation Policy and the
Economy, 10(1), 19-55. https://doi.org/10.1086/605852
Smith, K. L. (2008). DRM: Digital rights management or digital restrictions management?
Proceedings of the American Society for Information Science and Technology, 45(1), 1-3.
https://doi.org/10.1002/meet.2008.1450450114
Electronic Frontier Foundation. (2008, January 3). 2008: DRM continues to punish paying
customers. https://www.eff.org/deeplinks/2008/01/2008-drm-continues-punish-paying-customers
`.trim(),
      author_id: ilias.id,
      published_at: dateOnDec4("14:30"),
      reading_time_minutes: 7,
      status: "published" as const,
      created_at: dateOnDec4("14:30"),
      updated_at: dateOnDec4("14:30"),
    },
    {
      slug: "drowning-in-sound-is-the-music-market-too-saturated",
      title: "Drowning in Sound, Is the Music Market Too Saturated?",
      content: `
Everyone knows it’s “wrong”, yet so many of us still do it. In the underground music world, sometimes it feels like there’s no other choice. How do we make sense of doing something that’s technically illegal, but still feels morally right?

Introduction
Many beginning artists might remember the first cracked VST they downloaded. In the moment they might’ve told themselves: “I’ll pay for it when I can.”. This isn’t rationalizing theft so much as rationalizing access. When you’re in a moment where money is tight, many producers see piracy as a detour rather than the final path they’ll be taking.

Main content
Piracy isn’t a free pass. When you pirate, you violate copyright laws, undermine developers' work and rob corporations of sales (though the latter might be more myth than truth). From a purely legal point of view, many arguments condemn piracy as unethical (Bytescare, n.d). But in practice moral judgement isn’t so black and white. Chan et al. (2009) describes the four-component model of moral reasoning: recognition (is piracy seen as a moral issue?), judgement (is it judged permissible), intention (do you intend to pirate) and behavior. Interestingly, their study found that even when people recognized piracy as infringement, they didn’t always see it as morally wrong. People often compartmentalize, especially when their motive comes from necessity instead of greed.

Big corporations often claim piracy costs them millions of dollars in “lost revenue.”, they do this by counting every pirated copy as a sale. But this argument assumes every pirate was able to afford their software in the first place, which is very rarely true. Research shows that there’s little consistent evidence that piracy does lead to lower sales. In some industries, it might even boost exposure (Oberholzer-Gee & Strumpf, 2010). Many wouldn’t have actually purchased the software anyway. Claiming a “lost sale” is literally like saying you lost a customer who never even existed in the first place! These corporations already make massive profits (looking at you, Adobe), and their anti-piracy campaigns only punish paying users more than they do pirates through DRM (Smith, 2008; Electronic Frontier Foundation [EFF], 2008).

Piracy may be illegal, but when there’s a system in place that controls access to software and locks creativity behind an unrealistic paywall, you could also call it resistance. When a young artist simply wants to experiment and downloads a cracked plugin to start making music, then that isn’t criminal, they’re simply exploring their interests (imagine paying 1000 USD as a teenager just to find out you aren’t interested.) That doesn’t make it fully right, but it does make it feel right. The real “right way” to do the wrong way might be: understanding the “harm”, supporting developers when you actually can and to keep fighting for fair access. In the end, piracy isn’t really about stealing but rather about refusing to pay outrageous prices.

References:
Bytescare. (n.d.) Ethical and legal issues in software piracy. Retrieved October 8, 2025, from https://bytescare.com/blog/ethical-and-legal-issues-in-software-piracy

Oberholzer-Gee, F., & Strumpf, K. (2010). FIle-sharing and copyright. Innovation Policy and the Economy, 10(1), 19-55. https://doi.org/10.1086/605852

Smith, K. L. (2008). DRM: Digital rights management or digital restrictions management? Proceedings of the American Society for Information Science and Technology, 45(1), 1-3. https://doi.org/10.1002/meet.2008.1450450114

Electronic Frontier Foundation. (2008, January 3). 2008: DRM continues to punish paying customers. https://www.eff.org/deeplinks/2008/01/2008-drm-continues-punish-paying-customers
      `.trim(),
      author_id: ilias.id,
      published_at: dateOnDec4("15:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("15:00"),
      updated_at: dateOnDec4("15:00"),
    },
    {
      slug: "mental-health-in-the-underground",
      title: "Mental Health in the Underground",
      content: `
Introduction
There is a dangerous myth that persists in the underground scene: the idea of the “tortured
artist.” We grow up idolizing figures who struggled, subconsciously telling ourselves that to
make great art, one must suffer. But if you look around at the people in the local scenes, you
won’t see “romantic suffering.” you see exhaustion, anxiety, and a relentless pressure to
success that is actively harming the scene.
Main content
The reality of being a small independent artist today is not just about being able to write songs;
it is about being a social media manager, a booking agent, and a promoter, often whilst working
a minimum wage job. This “hustle culture” is taking a huge toll.
Research backs up this feeling of despair. A landmark study titled “Can Music Make You Sick?”
found that musicians are three times more likely to suffer from anxiety and depression than the
generic public (Gross & Musgrave, 2016). The study highlights that the nature of the gig
economy, not knowing when the next paycheck is coming, is a massive driver of said crisis.
What also doesn’t help is the economic climate that is making it way harder to survive. A recent
report highlighted by The Guardian reveals that 98% of musicians are concerned about rising
costs, with many unable to afford equipment or travel to gigs (Bugel, 2022). It is terrifying to
realize that the very thing we love, music, is the very thing making us sick.
Even for those who do “make it”, the reality is often grim. Duerden (2022) described the industry
as a “brutal business” where artists are often discarded the moment they stop trending, leaving
them without a support system. We are told to “grind” and &quot;hustle&quot; until we break, and if we
complain, we are then told we just don’t want it bad enough.
We need to stop normalizing the idea that you must destroy yourself to create something better.
The underground scene prides itself on community and individuals, but we often fail to check in
on the well being of each other. Structural change is slow, so we must try to redefine success
for ourselves (and especially for artists). If “making it” requires sacrificing your sanity, then the
price is simply way too high.

References:

Bugel, S. (2022, November 14) ‘Music could wither’: new report finds 98% of musicians
concerned about rising costs in the UK. The Guardian.
https://www.theguardian.com/music/2022/nov/14/report-finds-98-per-cent-music-makers-
concerned-costs-help-musicians
Duerden, N. (2022, April 16). ‘That’s it? It’s over? I was 30. What a brutal business’: pop stars
on life after the spotlight moves on. The Guardian.
https://www.theguardian.com/music/2022/apr/16/pop-stars-spotlight-bob-geldof-robbie-williams-
lisa-maffia
Gross, S. A., & Musgrave, G. (2016). Can music make you sick? Music and depression: A study
into the incidence of musicians’ mental health. University of Westminster / Help Mucisians UK.
https://westminsterresearch.westminster.ac.uk/item/q33qy/can-music-make-you-sick-part-1-a-
study-into-the-incidence-of-musicians-mental-health
`.trim(),
      author_id: ilias.id,
      published_at: dateOnDec4("15:30"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("15:30"),
      updated_at: dateOnDec4("15:30"),
    },

    // Yasmine Rahou
    {
      slug: "why-underground-bands-disband-before-their-peak",
      title: "Why underground bands disband before their peak",
      content: `
The problem with a lot of underground/niche bands is that they disband right before they hit their peak, or in some cases after their peak (Why Did All The Post-grunge Bands Rip Off Of The OG, 2023). This causes a decline in fans or people that may be interested in them. And from an objective perspective, this early collapse isn’t totally random. Studies of the music industry show that most of the bands disbandings are caused by predictable and avoidable factors. Like financial pressure, conflicts within the group, burnouts and the list goes on and on. The reason why underground bands are more vulnerable to disband early is because they rely on selfmade labels, low budgets and only being locally known, usually without a financial safety net. An example of this is the band ‘Skin Yard’, a band from Seattle who helped define the genre ‘grunge’s’ early sound (Wikipedia contributors, 2025). They directly influenced a lot of bands, but yet they never reached a mainstream audience. The lack of industry support weakened their long-term momentum and they burned out before the world caught up. Personally, I find this a bit tragic. When you listen to a lot of these underground bands, you hear the potential of becoming something massive. But because these underground bands rely so heavily on passion instead of money. They tend to collapse very early in their career. And when that happens, the fanbase declines too. People move on and everyone forgets about them.

References:
Bandmixblog. (2025, 23 februari). Why bands break up: Our comprehensive list - BANDMIX BLOG. BANDMIX BLOG. https://blog.bandmix.com/why-do-bands-break-up-our-comprehensive-list

Why did all the post-grunge bands rip off of the OG. (2023). Reddit. Geraadpleegd op 3 december 2025, van https://www.reddit.com/r/LetsTalkMusic/comments/1akg5u1/why_did_all_the_postgrunge_bands_rip_off_all_the

Wikipedia contributors. (2025, 22 oktober). Skin yard. Wikipedia. https://en.wikipedia.org/wiki/Skin_Yard
`.trim(),
      author_id: yasmine.id,
      published_at: dateOnDec4("16:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("16:00"),
      updated_at: dateOnDec4("16:00"),
    },
    {
      slug: "do-musicians-know-what-the-basics-of-marketing-are",
      title: "Do musicians know what the basics of marketing are?",
      content: `
Musicians gain an audience by basically selling themselves in instagram posts, ads and playing the long game. Though turns out that’s naive. It’s the consistent practice, building a brand, creating content and understanding your target audience that help a band to grow in popularity and fans. But since most artists don’t understand how to self-promote this usually means they will most likely never gain a mainstream audience.

Most artists don’t realize that when you are an independent artist, you won’t get much outside help. You might get some help from a close friend who likes your songs, but other than that, you can’t rely on record labels or fans to promote your music. The reason behind this is because record labels don’t work with unproven artists, most of the time those artists are a risk the labels aren’t willing to take.

So in order to move things forward, artists need to get to know the basics of marketing to increase their status all by themselves. A mistake most artists make is that they only promote their music online. If you only market online, you’re missing out on a whole lot of opportunities. Playing gigs is one of the biggest reasons why you shouldn’t stick to only promoting online (7 Music Marketing Truths ALL Musicians Should Know - MTT - Music Think Tank, z.d.). By gigging, you get to connect in real life with your audience and make money by selling tickets and merch. Trying to reach record labels also works a lot better offline. Sending an e-mail can be a slow process, but a phone call or getting an appointment and seeing them face-to-face can work a lot better. 

References:
Gaetano, & Gaetano. (2025, 21 januari). Music Marketing for Independent Musicians: The 2024 Guide. Gaetano | Who Is Gaetano? A Proven Growth Marketer, Musician & Business Leader - All Rolled Into One. Get His Digital Marketing Tips And Music Industry Insights. https://officialgaetano.com/music-industry/music-marketing

7 Music Marketing Truths ALL Musicians should Know - MTT - Music Think Tank. (z.d.). https://musicthinktank.squarespace.com/blog/7-music-marketing-truths-all-musicians-should-know.html

`.trim(),
      author_id: yasmine.id,
      published_at: dateOnDec4("16:30"),
      reading_time_minutes: 5,
      status: "published" as const,
      created_at: dateOnDec4("16:30"),
      updated_at: dateOnDec4("16:30"),
    },
    {
      slug: "is-music-production-a-reliable-career",
      title: "Is music production a reliable career?",
      content: `
        Many people look at music production like it’s some kind of glamorous, dream job where you sit in a studio, meet famous musicians, play around with sounds and suddenly become the next best thing. But the reality is much less exciting. Music production can be a reliable career, but only if you treat it like an actual job/business instead of a hobby that you hope will magically pay off sooner or later.

The first obstacle most aspiring producers come across is underestimating how slow the growth initially is. Just like how some musicians think posting on instagram is marketing, producers think dropping random beats online or sending random emails to artists will get them paid work. But that is not how it works at all. The producers who actually make a living are the ones who build a portfolio with years of experience, collaborate with different artists consistently, network with lots of people and understand how the industry works behind the scenes . If you don’t do that, you end up being one of the thousands of producers who make good beats but never get discovered.

And one of the biggest misconceptions people have about music production, is that they think it’s a stable career because the music industry is big. But the truth is that nobody is going to randomly fund your studio, give you placements, or promote your sound. You have to build your own sound (Unison, 2025). And that takes years. Most producers who “blew up overnight” spent 5 to 10 years grinding before the world even heard of them. 

So is music production a reliable career? It can be! But only if you are willing to do everything outside the fun part. You need consistency, networking, marketing, social skills and a lot of patience. Music production is the kind of career where you need to build your own opportunities from scratch.

References:

Broadcast, Sound, and Video Technicians. (2025). bls.gov. https://www.bls.gov/ooh/media-and-communication/broadcast-and-sound-engineering-technicians.htm
Unison. (2025, 9 januari). Average music producer salary in 2025 (+ awesome tips). Unison. https://unison.audio/music-producer-salary

        `.trim(),
      author_id: yasmine.id,
      published_at: dateOnDec4("17:00"),
      reading_time_minutes: 6,
      status: "published" as const,
      created_at: dateOnDec4("17:00"),
      updated_at: dateOnDec4("17:00"),
    },
  ];

  const { data: postRows, error: postError } = await supabase
    .from("posts")
    .upsert(posts, { onConflict: "slug" })
    .select("*");

  if (postError) {
    console.error("❌ Failed to upsert posts:", postError);
    process.exit(1);
  }

  console.log("✅ Posts seeded:", postRows?.length ?? 0);
  console.log("🌱 Blog seed complete.");
}

main().catch((err) => {
  console.error("❌ Blog seed script crashed:", err);
  process.exit(1);
});
