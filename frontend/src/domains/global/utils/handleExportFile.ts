interface HandleExportFileProperties {
  data: Response;
  fileName: string;
  type: "pdf" | "sheet";
}

function formatExportTypeExtension(
  type: HandleExportFileProperties["type"]
): string {
  switch (type) {
    case "pdf":
      return "pdf";
    case "sheet":
      return "xlsx";
  }
}

export default async function handleExportFile({
  data,
  fileName,
  type,
}: HandleExportFileProperties): Promise<void> {
  const blob = await data.blob();
  const url = window.URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = `${fileName}.${formatExportTypeExtension(type)}`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
