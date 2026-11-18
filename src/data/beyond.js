import guitarStreet from '../assets/beyond/guitar-street.jpg';
import guitarStage from '../assets/beyond/guitar-stage.jpg';
import kalisungan from '../assets/beyond/kalisungan-summit.jpg';
import craterLake from '../assets/beyond/crater-lake.jpg';
import ashPlains from '../assets/beyond/ash-plains.jpg';
import makiling from '../assets/beyond/makiling-peak-2.jpg';
import sunriseRidge from '../assets/beyond/sunrise-ridge.jpg';
import trailBreak from '../assets/beyond/trail-break.jpg';
import trailheadCrew from '../assets/beyond/trailhead-crew.jpg';
import posterFrieren from '../assets/beyond/poster-frieren.jpg';
import posterJonSnow from '../assets/beyond/poster-jon-snow.jpg';
import posterCat from '../assets/beyond/poster-cat.jpg';
import hackTheFlood from '../assets/beyond/hack-the-flood.jpg';
import spacesTeam from '../assets/beyond/spaces-team.jpg';
// 4:5 crops sized for the stack's prints.
import guitarStreetCard from '../assets/beyond/cards/guitar-street.jpg';
import guitarStageCard from '../assets/beyond/cards/guitar-stage.jpg';
import kalisunganCard from '../assets/beyond/cards/kalisungan-summit.jpg';
import craterLakeCard from '../assets/beyond/cards/crater-lake.jpg';
import ashPlainsCard from '../assets/beyond/cards/ash-plains.jpg';
import makilingCard from '../assets/beyond/cards/makiling-peak-2.jpg';
import sunriseRidgeCard from '../assets/beyond/cards/sunrise-ridge.jpg';
import trailBreakCard from '../assets/beyond/cards/trail-break.jpg';
import trailheadCrewCard from '../assets/beyond/cards/trailhead-crew.jpg';
import posterFrierenCard from '../assets/beyond/cards/poster-frieren.jpg';
import posterJonSnowCard from '../assets/beyond/cards/poster-jon-snow.jpg';
import posterCatCard from '../assets/beyond/cards/poster-cat.jpg';
import hackTheFloodCard from '../assets/beyond/cards/hack-the-flood.jpg';
import spacesTeamCard from '../assets/beyond/cards/spaces-team.jpg';

// "Beyond the code": four sides of Jason, told through his own photos.
export const chapters = [
    { id: 'music', verb: 'play', rest: 'guitar.', note: 'Acoustic on the street, electric on stage with a band.' },
    { id: 'mountains', verb: 'chase', rest: 'summits.', note: 'Kalisungan, Makiling, crater lakes and sunrise ridges, usually with friends.' },
    { id: 'posters', verb: 'make', rest: 'posters.', note: 'Fan posters for the stories I love, plus one cat pun.' },
    { id: 'people', verb: 'build', rest: 'with people.', note: 'Hackathon teams and class projects, like Hack the Flood and SPACES.' },
];

export const photos = [
    { chapter: 'music', src: guitarStreet, card: guitarStreetCard, caption: 'Acoustic guitar on the street, Christmas 2021.' },
    { chapter: 'music', src: guitarStage, card: guitarStageCard, caption: 'On stage with the band, electric guitar in hand.' },
    { chapter: 'mountains', src: kalisungan, card: kalisunganCard, caption: 'The Mt. Kalisungan summit marker, 760 MASL.' },
    { chapter: 'mountains', src: craterLake, card: craterLakeCard, caption: 'A crater lake at the end of the trail.' },
    { chapter: 'mountains', src: ashPlains, card: ashPlainsCard, caption: 'Arms out on the ash-grey plains of the trek in.' },
    { chapter: 'mountains', src: makiling, card: makilingCard, caption: 'Peak 2 of the Mt. Makiling trail.' },
    { chapter: 'mountains', src: sunriseRidge, card: sunriseRidgeCard, caption: 'Sunrise on a summit ridge.' },
    { chapter: 'mountains', src: trailBreak, card: trailBreakCard, caption: 'A trail break, shot from the ground up.' },
    { chapter: 'mountains', src: trailheadCrew, card: trailheadCrewCard, caption: 'Trailhead selfie with the hiking crew.' },
    { chapter: 'posters', src: posterFrieren, card: posterFrierenCard, caption: "A Frieren: Beyond Journey's End poster." },
    { chapter: 'posters', src: posterJonSnow, card: posterJonSnowCard, caption: 'A Jon Snow poster in ink-splatter black and white.' },
    { chapter: 'posters', src: posterCat, card: posterCatCard, caption: '"You\'ve cat to be kitten me right meow."' },
    { chapter: 'people', src: hackTheFlood, card: hackTheFloodCard, caption: 'Hack the Flood: team GraviTEE takes the Innovation Award.' },
    { chapter: 'people', src: spacesTeam, card: spacesTeamCard, caption: 'The SPACES team.' },
];
