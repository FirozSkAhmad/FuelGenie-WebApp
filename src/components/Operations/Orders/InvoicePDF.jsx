import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Download as DownloadIcon } from "@mui/icons-material"; // Import the Download icon
import { Button, CircularProgress, Box } from "@mui/material";
import Logo from "/Fuel.png";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingTop: 60,
    paddingBottom: 80,
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottom: "2px solid #1a365d",
    paddingBottom: 15,
  },
  companyInfo: {
    width: "60%",
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 12,
  },
  invoiceInfo: {
    width: "40%",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a365d",
    marginBottom: 8,
  },
  infosection: {
    marginTop: 10,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    width: "48%",
  },
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeader: {
    backgroundColor: "#f7fafc",
    fontWeight: "bold",
  },
  tableColHeader: {
    width: "40%",
    color: "#4a5568",
  },
  tableCol: {
    width: "40%",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalSection: {
    backgroundColor: "#f7fafc",
    padding: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 20,
  },
  currency: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#718096",
    paddingHorizontal: 40,
    fixed: true,
  },
  paymentSection: {
    marginTop: 5,
    // marginBottom: 70,
  },
});

const formatCurrency = (amount) => {
  // Check for invalid values and return ₹0.00 as a fallback
  if (isNaN(amount) || amount == null) return "₹0.00";

  try {
    // Ensure the amount is a number
    const value = typeof amount === "number" ? amount : parseFloat(amount);

    // Format the currency using Indian locale with ₹ symbol
    let formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    // Remove superscript digits and any unwanted superscript characters
    formattedAmount = formattedAmount.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters

    // Remove superscript "1" (U+00B9) specifically
    formattedAmount = formattedAmount.replace("\u00B9", "");

    // // Add ₹ symbol explicitly to ensure it’s always at the start
    // formattedAmount = "₹" + formattedAmount.replace("₹", ""); // Ensure only one ₹ symbol

    return formattedAmount;
  } catch (error) {
    // In case of an error, return ₹0.00
    console.error("Currency formatting error:", error);
    return "₹0.00";
  }
};

const InvoiceDocument = ({ data }) => {
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Image style={styles.logo} src={Logo} />
            <Text>
              123 Business Street, Hyderabad, Telangana 500032
              {"\n"}
              GSTIN: 29ABCDE1234F1Z5 | Phone: +91 40 1234 5678
            </Text>
          </View>
          <View style={(styles.invoiceInfo, { marginTop: 20 })}>
            <Text style={styles.title}>INVOICE</Text>
            <View style={styles.infosection}>
              <Text>
                Order ID: {data.orderDetails.orderId}
                {"\n"}
                Invoice Date: {formatDate(data.orderDetails.dateOfOrder)}
                {"\n"}
                Delivery Slot: {data.orderDetails.dateAndSlot}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Billed To
            </Text>
            <Text>
              {data.customerDetails.customerName}
              {"\n"}
              {data.billingAddress.split(",").join(",\n")}
              {"\n"}
              Phone: {data.customerDetails.contactNumber}
              {"\n"}
              Email: {data.customerDetails.mailId}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Shipping To
            </Text>
            <Text>{data.shippingAddress.split(/[.,]/).join("\n")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 12 }}>
            Product Details
          </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableColHeader, { width: "40%" }]}>
                Description
              </Text>
              <Text style={[styles.tableColHeader, { width: "20%" }]}>
                Quantity
              </Text>
              <Text style={[styles.tableColHeader, { width: "20%" }]}>
                Unit Price
              </Text>
              <Text style={[styles.tableColHeader, { width: "20%" }]}>
                Amount
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { width: "40%" }]}>
                {data.productDetails.productName}
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                {data.productDetails.quantity} L
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                INR {formatCurrency(data.productDetails.priceAtOrder)}
              </Text>
              <Text style={[styles.tableCol, { width: "20%" }]}>
                INR {formatCurrency(data.productDetails.totalQuantityPrice)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.amountRow}>
            <Text>Subtotal:</Text>
            <Text style={styles.currency}>
              INR {formatCurrency(data.paymentDetails.totalAmount)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text>Delivery Fee:</Text>
            <Text style={styles.currency}>
              INR {formatCurrency(data.paymentDetails.deliveryFee)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text>Discount:</Text>
            <Text style={styles.currency}>
              INR {formatCurrency(-data.paymentDetails.discountApplied)}
            </Text>
          </View>
          <View style={[styles.amountRow, { marginTop: 12 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              Total Amount:
            </Text>
            <Text style={{ ...styles.currency, fontSize: 14 }}>
              INR {formatCurrency(data.paymentDetails.finalAmount)}
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.paymentSection]}>
          <Text style={{ fontWeight: "bold" }}>Payment Information</Text>
          <Text>
            Payment Method: {data.paymentDetails.paymentMode}
            {"\n"}
            Payment Status: {data.paymentDetails.paymentStatus}
            {data.paymentDetails.creditTransaction && (
              <>
                {"\n"}
                Transaction ID:{" "}
                {data.paymentDetails.creditTransaction.transactionId}
                {"\n"}
                Due Date:{" "}
                {formatDate(data.paymentDetails.creditTransaction.dueDate)}
              </>
            )}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            This is a computer-generated invoice - No signature required
            {"\n"}
            FuelGenie Pvt. Ltd. | GSTIN: 29ABCDE1234F1Z5 | CIN:
            U40109TG2023PTC123456
            {"\n"}
            Bank Details: HDFC Bank | A/C No: 12345678901234 | IFSC: HDFC0000123
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const InvoiceDownload = ({ data }) => (
  <PDFDownloadLink
    document={<InvoiceDocument data={data} />}
    fileName={`INVOICE_${data.orderDetails.orderId}.pdf`}
  >
    {({ loading }) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loading ? (
          <CircularProgress size={24} sx={{ mr: 2 }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
          >
            Download Invoice
          </Button>
        )}
      </Box>
    )}
  </PDFDownloadLink>
);

export default InvoiceDownload;
