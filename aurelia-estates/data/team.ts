import { unsplash } from "@/lib/images";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const team: TeamMember[] = [
  {
    name: "Isabella Marchetti",
    role: "Founder & Principal Broker",
    bio: "Two decades representing landmark homes from Malibu to Montecito.",
    image: unsplash("1494790108377-be9c29b29330"),
  },
  {
    name: "Julian Ashford",
    role: "Partner, Private Clients",
    bio: "Advises families and family offices on discreet, off-market acquisitions.",
    image: unsplash("1507003211169-0a1dd7228f2d"),
  },
  {
    name: "Amara Okafor",
    role: "Director of Leasing",
    bio: "Leads our luxury leasing desk with an eye for the exceptional.",
    image: unsplash("1438761681033-6461ffad8d80"),
  },
  {
    name: "Theo Lindqvist",
    role: "Head of Investments",
    bio: "Former architect turned investment strategist for residential portfolios.",
    image: unsplash("1500648767791-00dcc994a43e"),
  },
];
