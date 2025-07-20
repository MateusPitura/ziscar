import Button from "@/design-system/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Resource } from "@shared/types";
import { type ReactElement } from "react";

interface ExportButtonProperties {
  document: ReactElement;
  fileName?: string;
  resource?: Resource;
}

export default function ExportButton({
  document,
  fileName,
  resource,
}: ExportButtonProperties): ReactElement {
  return (
    <PDFDownloadLink document={document} fileName={`${fileName}.pdf`}>
      {({ loading }) => {
        return (
          <Button
            variant="primary"
            color="darkBlue"
            label="Exportar como PDF"
            iconRight="FileDownload"
            state={loading ? "loading" : undefined}
            resource={resource}
            action="READ"
          />
        );
      }}
    </PDFDownloadLink>
  );
}
