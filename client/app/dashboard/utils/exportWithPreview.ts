import Swal from "sweetalert2";
import { exportExcel, exportPDF } from "./exportData";

export const exportWithPreview = <T>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  title: string
) => {
  if (data.length === 0) {
    Swal.fire("No rows selected", "Please select at least one row.", "warning");
    return;
  }

  const logoUrl = "/salyansthan-logo.png"; // ✅ Correct way for Next.js public folder

  const previewHTML = `
  <div style="
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    margin-bottom:20px;
    text-align:center;
  ">
      <img src="${logoUrl}" style="width:80px; height:80px; object-fit:cover; margin-bottom:10px;" />

      <div style="font-style:italic; font-size:14px; margin:2px 0;">
          “Dedicated to Excellence”
        </div>
        
      <div style="line-height:1.4;">
        <div style="font-size:22px; font-weight:900; text-transform:uppercase;">
          SALYANSTHAN SECONDARY SCHOOL
        </div>

        

        <div style="font-size:12px; margin-top:4px;">
          Kirtipur-4, Salyansthan, Kathmandu
        </div>

        <div style="font-size:12px;">Email: schoolsalyansthan@gmail.com</div>
        <div style="font-size:12px;">Phone: 01-5904264</div>
      </div>
  </div>

  <h2 style="margin-top:10px; margin-bottom:10px; text-align:center;">
    ${title}
  </h2>

  <table style="width:100%; border-collapse: collapse; font-size:12px;">
    <thead>
      <tr>
        <th style="border:1px solid #ccc; padding:4px;">SN</th>
        ${columns.map(col => `<th style="border:1px solid #ccc; padding:4px;">${col.label}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${data.map((row, idx) => `
        <tr>
          <td style="border:1px solid #ccc; padding:4px;">${idx + 1}</td>
          ${columns.map(col => `
            <td style="border:1px solid #ccc; padding:4px;">
              ${col.key === "photo"
      ? `<img src="${(row[col.key] as any) || ""}" style="width:40px;height:40px;border-radius:4px;" />`
      : (row[col.key] ?? "")
    }
            </td>
          `).join("")}
        </tr>
      `).join("")}
    </tbody>
  </table>
  `;

  Swal.fire({
    title: "",
    html: previewHTML,
    width: "80%",
    showCancelButton: true,
    confirmButtonText: "Export Excel",
    cancelButtonText: "Export PDF",
  }).then((result) => {
    if (result.isConfirmed) {
      exportExcel(data, columns, title);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      exportPDF(data, columns, title);
    }
  });
};
