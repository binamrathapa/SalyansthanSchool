import Swal from "sweetalert2";
import { exportPDF } from "./exportPDF";

interface ScheduleEntry {
  day: number; // 0 = Sunday
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const exportScheduleWithPreview = (
  data: ScheduleEntry[],
  title: string
) => {
  if (!data.length) {
    Swal.fire("No schedule found", "Nothing to export.", "warning");
    return;
  }

  // Group by day
  const grouped = DAYS.map((day, index) => ({
    day,
    entries: data.filter((e) => e.day === index),
  }));

  const previewHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <img src="/salyansthan-logo.png" style="width:80px; margin-bottom:10px;" />
      <h2 style="margin:0;">SALYANSTHAN SECONDARY SCHOOL</h2>
      <p style="margin:4px 0; font-size:12px;">
        Kirtipur-4, Kathmandu | 01-5904264
      </p>
    </div>

    <h3 style="text-align:center; margin-bottom:10px;">
      ${title}
    </h3>

    ${grouped
      .map(
        (dayGroup) => `
      <h4 style="margin-top:20px;">${dayGroup.day}</h4>
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc; padding:6px;">Time</th>
            <th style="border:1px solid #ccc; padding:6px;">Subject</th>
            <th style="border:1px solid #ccc; padding:6px;">Teacher</th>
          </tr>
        </thead>
        <tbody>
          ${
            dayGroup.entries.length
              ? dayGroup.entries
                  .map(
                    (e) => `
                <tr>
                  <td style="border:1px solid #ccc; padding:6px;">
                    ${e.startTime} – ${e.endTime}
                  </td>
                  <td style="border:1px solid #ccc; padding:6px;">
                    ${e.subject}
                  </td>
                  <td style="border:1px solid #ccc; padding:6px;">
                    ${e.teacher}
                  </td>
                </tr>
              `
                  )
                  .join("")
              : `<tr>
                  <td colspan="3" style="text-align:center; padding:6px;">
                    No classes
                  </td>
                </tr>`
          }
        </tbody>
      </table>
    `
      )
      .join("")}
  `;

  Swal.fire({
    html: previewHTML,
    width: "85%",
    showCloseButton: true,
    confirmButtonText: "Export PDF",
  }).then((result) => {
    if (result.isConfirmed) {
      exportPDF(previewHTML, title);
    }
  });
};
