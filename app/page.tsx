"use client";

import { useState } from "react";
import { format, startOfDay, addDays, subDays, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { Button, Tabs, Tab, ScrollShadow, Divider } from "@/components/ui";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEvents, useEventTypes, AppEvent } from "@/hooks/use-firestore";
import { EventModal } from "@/components/event-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [view, setView] = useState("day");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  let startDate = startOfDay(selectedDate);
  let endDate = startOfDay(addDays(selectedDate, 1));
  
  if (view === "week") {
    startDate = startOfWeek(selectedDate);
    endDate = endOfWeek(selectedDate);
  } else if (view === "month") {
    startDate = startOfMonth(selectedDate);
    endDate = endOfMonth(selectedDate);
  }

  const { events, loading } = useEvents(
    startDate.getTime(),
    endDate.getTime()
  );
  
  const { types } = useEventTypes();

  const handleNext = () => {
    if (view === "day") setSelectedDate(addDays(selectedDate, 1));
    else if (view === "week") setSelectedDate(addDays(selectedDate, 7));
    else if (view === "month") setSelectedDate(addDays(startOfMonth(addDays(selectedDate, 32)), 0));
  };
  const handlePrev = () => {
    if (view === "day") setSelectedDate(subDays(selectedDate, 1));
    else if (view === "week") setSelectedDate(subDays(selectedDate, 7));
    else if (view === "month") setSelectedDate(addDays(startOfMonth(selectedDate), -1));
  };

  const formatEventTime = (time: number) => format(time, "h:mm a");

  return (
    <div className="flex flex-col h-full bg-[#f4f4f7] font-sans">
      {/* Header */}
      <div className="bg-white pt-safe pb-4 px-6 sticky top-0 z-10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] border-b border-zinc-100 flex flex-col gap-2">
        <div className="flex justify-between items-end mt-6">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#71717a] mb-1">{format(selectedDate, view === "month" ? "yyyy" : "EEEE, MMM d")}</h2>
            <h1 className="text-[32px] font-black leading-none text-[#18181b] tracking-tight">{isSameDay(selectedDate, new Date()) && view === "day" ? "Today" : format(selectedDate, "MMMM yyyy")}</h1>
          </div>
          <Button className="font-bold text-[13px] bg-[#18181b] text-white rounded-xl" size="sm" onPress={() => setSelectedDate(startOfDay(new Date()))}>
            TODAY
          </Button>
        </div>
        
        {/* Date Navigator */}
        <div className="flex justify-between items-center mt-4">
          <Button isIconOnly variant="light" size="sm" onPress={handlePrev} className="text-[#18181b]">
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1 flex px-2 space-x-1">
            <button className={`${view === "day" ? "bg-[#18181b] text-white shadow-lg" : "text-[#71717a] hover:bg-zinc-100"} flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-all`} onClick={() => setView("day")}>Day</button>
            <button className={`${view === "week" ? "bg-[#18181b] text-white shadow-lg" : "text-[#71717a] hover:bg-zinc-100"} flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-all`} onClick={() => setView("week")}>Week</button>
            <button className={`${view === "month" ? "bg-[#18181b] text-white shadow-lg" : "text-[#71717a] hover:bg-zinc-100"} flex-1 py-1.5 text-[13px] font-bold rounded-xl transition-all`} onClick={() => setView("month")}>Month</button>
          </div>
          <Button isIconOnly variant="light" size="sm" onPress={handleNext} className="text-[#18181b]">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Events List / Grid */}
      <ScrollShadow className="flex-1 px-6 mt-6 pb-24 overflow-x-hidden">
        {loading ? (
          <div className="w-full h-32 flex items-center justify-center">
             <div className="animate-spin h-6 w-6 border-b-2 border-[#18181b] rounded-full" />
          </div>
        ) : view === "month" ? (
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-zinc-400 mb-2">{d}</div>
            ))}
            {eachDayOfInterval({ start: startOfWeek(startDate), end: endOfWeek(endDate) }).map((day) => {
              const dayEvents = events.filter(e => isSameDay(e.startTime, day));
              return (
                <div 
                  key={day.toISOString()} 
                  className={`flex flex-col aspect-square border border-zinc-100 rounded-lg p-1 cursor-pointer transition-colors ${!isSameMonth(day, startDate) ? 'bg-zinc-50/50 opacity-50' : isSameDay(day, new Date()) ? 'bg-amber-50 border-amber-200' : 'bg-white hover:bg-zinc-50'}`}
                  onClick={() => { setSelectedDate(day); setView("day"); }}
                >
                  <span className={`text-[10px] font-bold text-center ${isSameDay(day, new Date()) ? 'text-amber-800' : 'text-zinc-700'}`}>{format(day, "d")}</span>
                  <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                    {dayEvents.slice(0,3).map(e => {
                      const c = types.find(t => t.id === e.eventTypeId)?.color || "#18181b";
                      return (
                        <div key={e.id} className="w-full h-1.5 rounded-full" style={{ backgroundColor: c }} />
                      )
                    })}
                    {dayEvents.length > 3 && <span className="text-[8px] text-zinc-400 font-bold text-center">+{dayEvents.length - 3}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#a1a1aa] gap-2">
            <CalendarIcon />
            <p className="text-[14px] font-bold">No events scheduled</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const eType = types.find((t) => t.id === event.eventTypeId);
              const colorStr = eType?.color || "#18181b";

              return (
                <div 
                  key={event.id}
                  onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }}
                  className="bg-white cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-transform p-4 rounded-2xl border border-zinc-100 flex gap-4 items-start shadow-sm"
                >
                  <div className="w-14 text-right pt-0.5">
                    <span className="text-[12px] font-black text-[#18181b] block">{format(event.startTime, "h:mm")}</span>
                    <span className="text-[10px] font-bold text-[#a1a1aa] uppercase block">{format(event.startTime, "a")}</span>
                  </div>
                  <div 
                    className="flex-1 p-4 rounded-2xl border ml-2 relative"
                    style={{ backgroundColor: `${colorStr}0A`, borderColor: `${colorStr}20` }}
                  >
                    <div className="absolute left-0 top-3 bottom-3 w-[4px] rounded-r-lg" style={{ backgroundColor: colorStr }} />
                    <h4 className="text-[15px] font-bold text-[#18181b]">{event.title}</h4>
                    {event.location && <div className="text-[11px] text-[#71717a] mt-1 font-medium">{event.location}</div>}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="text-[11px] text-[#71717a] mt-1 font-medium">👥 {event.attendees.join(", ")}</div>
                    )}
                    {eType && (
                      <div className="flex items-center gap-2 mt-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorStr }}></div>
                         <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colorStr }}>{eType.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollShadow>

      {/* FAB */}
      <Button
        className="absolute bottom-20 right-8 z-50 w-[56px] h-[56px] bg-[#18181b] text-white rounded-full shadow-[0_16px_32px_-8px_rgba(0,0,0,0.3)] flex items-center justify-center border-0"
        isIconOnly
        onPress={() => router.push(`/events/new?date=${selectedDate.getTime()}`)}
      >
        <Plus size={24} strokeWidth={3} />
      </Button>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
        currentDate={selectedDate.getTime()}
      />
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
