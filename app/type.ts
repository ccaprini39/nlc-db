
interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  ringName: string;
  name: string;
  bio: string;
  dob: string;
  height: string;
  weight: string;
  hometown: string;
  gym: string;
  profilePic: string;
}

interface Fight {
  id: string;
  redCorner: string; //this is a fighter id
  blueCorner: string; //this is a fighter id
  youtubeUrl: string;
  date: string;
  method?: string; //this is for the method of the fight end, if its a KO, TKO, Submission, Decision, etc.  
  round?: string;
  time?: string;
  type?: string; //this is for the type of fight, if its a title fight, non-title fight, etc.
  winner?: string; //this is a fighter id.  Null if draw.
  loser?: string; //this is a fighter id.  Null if draw.
  event: string; //this is an event id
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  venue: string;
}

interface ExpandedFight extends Fight {
  expand: {
    blueCorner: Fighter;
    redCorner: Fighter;
    event: Event;
  }
}


