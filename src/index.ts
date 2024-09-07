interface ScheduleEntry {
  date: string;
  day: string;
  rink: string;
  time: string;
  note?: string;
}

const schedule: ScheduleEntry[] = [
  { date: "9/7", day: "Sat", rink: "Rink 2", time: "12:00 PM" },
  { date: "9/10", day: "Tue", rink: "Rink 3", time: "5:45 PM" },
  { date: "9/14", day: "Sat", rink: "Rink 2", time: "11:00 AM" },
  { date: "9/17", day: "Tue", rink: "Rink 3", time: "6:45 PM" },
  {
    date: "9/21",
    day: "Sat",
    rink: "Rink 2",
    time: "12:00 PM",
    note: "Evaluation Day (scrimmage)",
  },
  { date: "9/24", day: "Tue", rink: "Rink 3", time: "5:45 PM" },
  { date: "9/28", day: "Sat", rink: "Rink 2", time: "11:00 AM" },
];

function generateICS(schedule: ScheduleEntry[]): string {
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hockey Schedule ICS Generator//EN",
  ];

  schedule.forEach((entry, index) => {
    const year = new Date().getFullYear();
    const [month, day] = entry.date.split("/");
    const [hours, minutes, period] = entry.time
      .match(/(\d+):(\d+)\s*(AM|PM)/)!
      .slice(1);

    let startDate = new Date(year, parseInt(month) - 1, parseInt(day));
    startDate.setHours(
      period === "PM" && hours !== "12"
        ? parseInt(hours) + 12
        : parseInt(hours),
      parseInt(minutes)
    );

    let endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

    icsContent = icsContent.concat([
      "BEGIN:VEVENT",
      `UID:hockeyevent${index}@example.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Hockey Practice - ${entry.rink}`,
      `LOCATION:${entry.rink}`,
      `DESCRIPTION:Hockey practice at ${entry.time}${
        entry.note ? ". " + entry.note : ""
      }`,
      "END:VEVENT",
    ]);
  });

  icsContent.push("END:VCALENDAR");
  return icsContent.join("\r\n");
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

const icsContent = generateICS(schedule);
Bun.write("./output/hockey_schedule.ics", icsContent);

console.log("ICS file has been generated: ./output/hockey_schedule.ics");
