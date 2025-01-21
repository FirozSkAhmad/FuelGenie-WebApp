import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Description,
  PictureAsPdf,
  Download as DownloadIcon,
  InsertDriveFile,
} from "@mui/icons-material";

const DocumentsSection = ({ customer, handleViewDocument }) => {
  const getRequiredDocuments = (firmType) => {
    switch (firmType) {
      case "PROPRIETORSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "gstr3bPdfUrl",
        ];
      case "PARTNERSHIP":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "partnershipDeedPdfUrl",
          "listOfPartnersPdfUrl",
          "partnershipLetterPdfUrl",
          "gstr3bPdfUrl",
        ];
      case "PRIVATE LTD / LTD.":
        return [
          "auditedFinancialItrNumber",
          "auditedFinancialItrPdfUrl",
          "gstNumber",
          "gstCertificatePdfUrl",
          "bankStatementPdfUrl",
          "aadhaarNumber",
          "aadhaarCardPdfUrl",
          "boardResolutionPdfUrl",
          "listOfDirectorsPdfUrl",
          "companyPanNumber",
          "companyPanPdfUrl",
          "certificateOfIncorporationPdfUrl",
          "moaAoaPdfUrl",
          "gstr3bPdfUrl",
        ];
      default:
        return [];
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Extract file name from URL
    link.click(); // Trigger download
  };

  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6" gutterBottom>
        <Description
          fontSize="small"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Documents
      </Typography>
      <Grid container spacing={3}>
        {getRequiredDocuments(customer.firmType).map((docKey) => {
          const docValue = customer.documents[docKey];
          const isPdfField = docKey.endsWith("PdfUrl");

          const documentName = docKey
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/PdfUrl/g, " PDF")
            .replace(/Number/g, "");

          const pdfFileName =
            docValue instanceof File
              ? docValue.name
              : typeof docValue === "string" && docValue.startsWith("http")
              ? docValue.split("/").pop()
              : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={docKey}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #e0e0e0",
                  "&:hover": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{documentName}</strong>
                  </Typography>
                  {docValue ? (
                    isPdfField ? (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ fontStyle: "italic" }}
                      >
                        {pdfFileName}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        {docValue}
                      </Typography>
                    )
                  ) : (
                    <Typography variant="body2" color="error">
                      {isPdfField ? "Not Uploaded" : "Not Provided"}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ marginTop: "auto" }}>
                  {docValue && isPdfField && (
                    <>
                      <Tooltip title="View Document">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDocument(docValue)}
                        >
                          <PictureAsPdf />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Download Document">
                        <IconButton
                          color="secondary"
                          onClick={() => handleDownload(docValue)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip> */}
                    </>
                  )}
                  {docValue && !isPdfField && (
                    <Tooltip title="View Details">
                      <IconButton color="primary">
                        <InsertDriveFile />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default DocumentsSection;
