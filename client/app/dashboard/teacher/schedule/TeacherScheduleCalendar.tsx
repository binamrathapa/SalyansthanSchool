"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ScheduleEntry } from "@/app/dashboard/data/teacherScheduleData";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  data: ScheduleEntry[];
}

const COLORS = [
  "#EF4444",
  "#22C55E",
  "#3B82F6",
  "#A855F7",
  "#F59E0B",
  "#14B8A6",
  "#EC4899",
  "#6366F1",
];

export default function TeacherScheduleCalendar({ data }: Props) {
  /* Subject → Color mapping */
  const subjectColorMap: Record<string, string> = {};
  let colorIndex = 0;

  data.forEach((item) => {
    if (!subjectColorMap[item.subject]) {
      subjectColorMap[item.subject] = COLORS[colorIndex % COLORS.length];
      colorIndex++;
    }
  });

  const events = data.map((item) => ({
    title: item.subject,
    daysOfWeek: [item.day],
    startTime: item.startTime,
    endTime: item.endTime,
    backgroundColor: subjectColorMap[item.subject],
    borderColor: subjectColorMap[item.subject],
    extendedProps: {
      subject: item.subject,
      teacher: item.teacher,
    },
  }));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        allDaySlot={false}
        firstDay={0}
        hiddenDays={[6]}
        slotMinTime="10:00:00"
        slotMaxTime="15:30:00"
        slotDuration="00:45:00"
        height="auto"
        nowIndicator
        stickyHeaderDates
        events={events}
        eventContent={(arg) => {
          const start = arg.event.start;
          const end = arg.event.end;

          const startTime = start?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const endTime = end?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const isCompact =
            start && end && end.getTime() - start.getTime() <= 30 * 60 * 1000;

          return (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`fc-event-custom ${
                      isCompact ? "fc-event-compact" : ""
                    }`}
                  >
                    {/* Subject + Time */}
                    <div className="subject">
                      {arg.event.extendedProps.subject}
                      <span className="time-inline">
                        {" "}
                        ({startTime}–{endTime})
                      </span>
                    </div>

                    {/* Teacher (hidden for compact events) */}
                    {!isCompact && (
                      <div className="teacher">
                        {arg.event.extendedProps.teacher}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="top" className="text-xs">
                  <div className="font-medium">
                    {arg.event.extendedProps.subject}
                  </div>
                  <div>Teacher: {arg.event.extendedProps.teacher}</div>
                  <div className="mt-1 text-muted-foreground">
                    Time: {startTime} – {endTime}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }}
      />
    </div>
  );
}
