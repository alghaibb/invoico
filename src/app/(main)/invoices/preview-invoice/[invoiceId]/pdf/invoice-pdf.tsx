/* eslint-disable import/named */
import { Invoice } from "@prisma/client";
import { Text, Page, Document, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

// Define enhanced styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#333",
  },
  section: {
    marginBottom: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  subheading: {
    fontSize: 10,
    marginBottom: 4,
    color: "#555",
  },
  text: {
    fontSize: 11,
    color: "#555",
    marginBottom: 4,
  },
  itemsTable: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    borderBottomStyle: "solid",
    paddingVertical: 6,
    alignItems: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#333",
  },
  descriptionCell: {
    textAlign: "left",
    flex: 2,
  },
  quantityCell: {
    textAlign: "center",
    width: "10%",
  },
  priceCell: {
    textAlign: "right",
    width: "15%",
  },
  totalCell: {
    textAlign: "right",
    width: "15%",
  },
  tableCell: {
    fontSize: 11,
    color: "#333",
  },
  totalSection: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginVertical: 8,
  },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoicePDFProps {
  invoice: Invoice & { items: InvoiceItem[] };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>{invoice.invoiceTitle}</Text>
          <Text style={styles.subheading}>
            Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
          </Text>
          <Text style={styles.subheading}>
            Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <Text style={styles.text}>From: {invoice.fromName}</Text>
          <Text style={styles.text}>To: {invoice.toName}</Text>
        </View>
      </View>

      <View style={styles.separator}></View>

      {/* Items Table */}
      <View style={styles.itemsTable}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.descriptionCell]}>
            Description
          </Text>
          <Text style={[styles.tableHeader, styles.quantityCell]}>
            Quantity
          </Text>
          <Text style={[styles.tableHeader, styles.priceCell]}>Price</Text>
          <Text style={[styles.tableHeader, styles.totalCell]}>Total</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, styles.quantityCell]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.priceCell]}>
              ${item.price.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.totalCell]}>
              ${item.total.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Subtotal, Tax, and Total Section */}
      <View style={styles.totalSection}>
        <View>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalLabel}>GST ({invoice.taxRate}%):</Text>
          <Text style={styles.totalLabel}>Total Amount:</Text>
        </View>
        <View>
          <Text style={styles.totalAmount}>
            AUD ${(invoice.totalAmount - (invoice.taxAmount ?? 0)).toFixed(2)}
          </Text>
          <Text style={styles.totalAmount}>
            AUD ${invoice.taxAmount?.toFixed(2)}
          </Text>
          <Text style={styles.totalAmount}>
            AUD ${invoice.totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
