import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#1a365d",
    paddingBottom: 15,
    marginBottom: 20,
  },
  companySection: {
    width: "60%",
  },
  invoiceSection: {
    width: "35%",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a365d",
    marginBottom: 4,
  },
  companyDetails: {
    color: "#666666",
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a365d",
    textAlign: "right",
    marginBottom: 8,
  },
  invoiceDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  detailLabel: {
    width: "40%",
    fontWeight: "bold",
    color: "#1a365d",
  },
  detailValue: {
    width: "60%",
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a365d",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 4,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  column: {
    width: "48%",
  },
  table: {
    width: "100%",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    alignItems: "center",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#1a365d",
    color: "white",
    fontWeight: "bold",
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#ffffff",
  },
  tableCell: {
    padding: 6,
  },
  amountCell: {
    textAlign: "right",
    width: 90,
  },
  totalsSection: {
    width: "40%",
    marginLeft: "auto",
    marginTop: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 4,
  },
  grandTotal: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    paddingTop: 8,
  },
});

const InvoiceDocument = ({ orderDetails, instantOrderId }) => {
  const formattedDate = format(
    new Date(orderDetails.orderDetails.orderDate),
    "dd MMM yyyy"
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>FUEL GENIE</Text>
            <Text style={styles.companyDetails}>123 Energy Plaza, Mumbai</Text>
            <Text style={styles.companyDetails}>Maharashtra, India 400001</Text>
            <Text style={styles.companyDetails}>GSTIN: XXAAAAA0000A1Z5</Text>
            <Text style={styles.companyDetails}>
              Tel: +91 22 1234 5678 | Email: accounts@fuelgenie.in
            </Text>
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <View style={styles.invoiceDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice #:</Text>
                <Text style={styles.detailValue}>{instantOrderId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice Date:</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order #:</Text>
                <Text style={styles.detailValue}>{orderDetails.orderId}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer/Pump Details */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>BILL TO</Text>
            <Text style={{ fontWeight: "bold" }}>
              {orderDetails.customerDetails.customerName}
            </Text>
            <Text>{orderDetails.customerDetails.contactNumber}</Text>
            {orderDetails.customerDetails.address && (
              <Text>{orderDetails.customerDetails.address}</Text>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>PUMP DETAILS</Text>
            <Text style={{ fontWeight: "bold" }}>
              {orderDetails.pumpDetails.pumpName}
            </Text>
            <Text>ID: {orderDetails.pumpDetails.pumpId}</Text>
            <Text>{orderDetails.pumpDetails.address}</Text>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEM DETAILS</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text
                style={[styles.tableCell, styles.tableHeader, { width: "30%" }]}
              >
                Product
              </Text>
              <Text
                style={[styles.tableCell, styles.tableHeader, { width: "15%" }]}
              >
                Type
              </Text>
              <Text
                style={[styles.tableCell, styles.tableHeader, { width: "15%" }]}
              >
                Qty
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.amountCell,
                ]}
              >
                Unit Price
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.amountCell,
                ]}
              >
                Total
              </Text>
            </View>

            {/* Table Rows */}
            {orderDetails.productDetails.map((product, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {product.productName}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {product.productType}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {product.quantity} {product.unit}
                </Text>
                <Text style={[styles.tableCell, styles.amountCell]}>
                  ₹{Number(product.pricePerUnit).toLocaleString("en-IN")}
                </Text>
                <Text style={[styles.tableCell, styles.amountCell]}>
                  ₹{Number(product.totalPrice).toLocaleString("en-IN")}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>
              ₹
              {Number(orderDetails.orderDetails.itemTotal).toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery Fee:</Text>
            <Text>
              ₹
              {Number(orderDetails.orderDetails.deliveryFee).toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
            <Text style={{ fontWeight: "bold" }}>
              ₹
              {Number(orderDetails.orderDetails.grandTotal).toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>E.&.O.E. | Terms: Payment due immediately upon receipt</Text>
          <Text>
            FUEL GENIE | Bank: State Bank of India | A/C: 123456789012 | IFSC:
            SBIN0001234
          </Text>
          <Text>
            This is a computer generated invoice and does not require physical
            signature
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Keep the InvoiceDownload component the same as before

const InvoiceDownload = ({ orderDetails, instantOrderId }) => (
  <PDFDownloadLink
    document={
      <InvoiceDocument
        orderDetails={orderDetails}
        instantOrderId={instantOrderId}
      />
    }
    fileName={`Invoice_${instantOrderId}.pdf`}
    style={{
      textDecoration: "none",
      padding: "10px 20px",
      color: "#fff",
      backgroundColor: "#2980b9",
      borderRadius: 4,
      fontWeight: "bold",
    }}
  >
    {({ loading }) => (loading ? "Generating..." : "Download Invoice")}
  </PDFDownloadLink>
);

export default InvoiceDownload;
