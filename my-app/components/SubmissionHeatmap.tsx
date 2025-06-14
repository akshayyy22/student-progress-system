import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format, addDays } from "date-fns";

interface HeatmapProps {
  submissions: any[];
}

export default function SubmissionHeatmap({ submissions }: HeatmapProps) {
  const today = new Date();
  const startDate = subDays(today, 365);

  const counts: Record<string, number> = {};
  submissions.forEach((s) => {
    const d = format(new Date(s.creationTimeSeconds * 1000), "yyyy-MM-dd");
    counts[d] = (counts[d] || 0) + 1;
  });

  const values = [];
  for (let d = startDate; d <= today; d = addDays(d, 1)) {
    const dayStr = format(d, "yyyy-MM-dd");
    values.push({ date: dayStr, count: counts[dayStr] || 0 });
  }

  return (
    <div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(v: any) =>
          v.count > 0 ? `color-scale-${Math.min(v.count, 4)}` : "color-empty"
        }
        tooltipDataAttrs={(v) =>
          ({
            "data-tip": `${v?.date ?? "No date"}: ${v?.count ?? 0} submissions`,
          } as { [key: string]: string })
        }
        showWeekdayLabels={true}
      />
    </div>
  );
}
