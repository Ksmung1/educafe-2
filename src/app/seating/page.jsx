"use client";

import { useEffect, useState } from "react";
import { seatLayout } from "@/data/seatLayout";
import { SLOT_OVERLAPS } from "@/data/slotRules";

const SELECTED_SLOT_ID = "SLOT_5"; // 6–12 PM

export default function SeatingChart() {
  const [seatData, setSeatData] = useState([]);

  useEffect(() => {
    fetch("/api/seats")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(setSeatData)
      .catch(() => setSeatData([]));
  }, []);

  const findSeat = (num) => seatData.find((s) => s.seatNumber === num);

  const getSeatStatus = (num) => {
    const seat = findSeat(num);
    if (!seat) return "open";
    if (seat.reserved) return "reserved";
    if (seat.slots.some((s) => s.slotId === SELECTED_SLOT_ID && s.booked))
      return "booked";
    return "open";
  };

  const isSeatDisabled = (num) => {
    const seat = findSeat(num);
    if (!seat) return false;
    if (seat.reserved) return true;

    if (seat.slots.some((s) => s.slotId === SELECTED_SLOT_ID && s.booked))
      return true;

    const blocked = SLOT_OVERLAPS[SELECTED_SLOT_ID] || [];
    return seat.slots.some((s) => s.booked && blocked.includes(s.slotId));
  };

  const seatSize =
    "w-[7vw] h-[7vw] text-[2.4vw] sm:w-7 sm:h-7 sm:text-xs md:w-8 md:h-8 md:text-sm";

  const statusStyle = {
    open: "bg-gray-100 border border-gray-300 text-gray-800",
    booked: "bg-blue-500 text-white shadow",
    reserved: "bg-[#16424a] text-white shadow",
  };

  return (
    <div className="w-full overflow-hidden flex justify-center px-2">
      <div className="w-full max-w-[360px] sm:max-w-[520px] md:max-w-[640px]">
        {/* MAP */}
        <div className="bg-white rounded-lg shadow-sm p-2">
          <div className="origin-top scale-[0.95] sm:scale-100">
            <div className="flex justify-center gap-3">
              {/* LEFT COLUMN */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-10 border border-gray-400 mb-1" />
                {[43, 42, 41, 40].map((num) => (
                  <div
                    key={num}
                    className={`${seatSize} rounded-sm flex items-center justify-center ${
                      statusStyle[getSeatStatus(num)]
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* MAIN SEATS */}
              <div className="space-y-[2vw] sm:space-y-2">
                {seatLayout.map((row) => (
                  <div
                    key={row.rowId}
                    className="flex justify-center gap-[1vw] sm:gap-2"
                  >
                    {row.seats.map((num) => {
                      const status = getSeatStatus(num);
                      const disabled = isSeatDisabled(num);

                      return (
                        <button
                          key={num}
                          disabled={disabled}
                          className={`
                            ${seatSize}
                            rounded-sm flex items-center justify-center
                            font-medium transition
                            ${statusStyle[status]}
                            ${
                              disabled
                                ? "opacity-60 cursor-not-allowed"
                                : "active:scale-95"
                            }
                          `}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-3 flex justify-center">
          <div className="flex gap-4 text-[11px] sm:text-sm">
            <Legend color="bg-[#16424a]" label="Reserved" />
            <Legend color="bg-blue-500" label="Booked" />
            <Legend color="bg-gray-200 border border-gray-300" label="Open" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-gray-800">{label}</span>
    </div>
  );
}
