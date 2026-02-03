import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20.5,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#000000",
  },
  bold: {
    fontFamily: "Helvetica",
  },

  // Header
  headerImage: {
    width: "100%",
    height: "auto",
    marginBottom: 15,
    marginTop: 3,
  },

  // Address
  address: {
    fontSize: 10.1,
    textAlign: "center",
    marginBottom: 8,
  },

  // BIN Row
  binRow: {
    marginTop: 12,
    marginBottom: 7,
    paddingLeft: 2,
  },
  binText: {
    fontSize: 9,
  },

  // Title
  titleSection: {
    marginBottom: 18,
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginBottom: 7,
  },
  subTitle: {
    fontSize: 10,
  },

  // Details Grid
  gridContainer: {
    flexDirection: "row",
    marginBottom: 12,
    fontSize: 10,
  },
  leftCol: {
    width: "60%",
  },
  rightCol: {
    width: "40%",
    textAlign: "right",
    marginTop: 25,
    paddingRight: 13,
  },
  rightColDate: {
    marginTop: 5,
  },
  rowItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 100,
  },
  separator: {
    width: 5,
  },
  value: {
    flex: 1,
  },

  // Money Lines
  lineRow: {
    flexDirection: "row",
    marginBottom: 5,
    fontSize: 10,
  },
  lineLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 23,
  },
  lineLabelNormal: {
    marginRight: 13,
  },
  flex1: {
    flex: 1,
    marginLeft: 2,
  },
  underline: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
    paddingBottom: 4,
    marginLeft: 2,
  },

  // Split Line (Mode of Payment / Dated)
  splitRow: {
    flexDirection: "row",
    marginBottom: 6,
    fontSize: 10,
  },

  modeDate: {
    marginRight: 10,
  },

  // Payment Table
  tableContainer: {
    marginTop: 30,
    marginLeft: 5,
    flexDirection: "row",
    fontSize: 10,
  },
  tableWrapper: {
    width: "42%",
    marginRight: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#333",
    height: 20,
    alignItems: "center",
  },
  tableRowHead: {
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
  tableRowBody: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
  tableRowLast: {
    borderBottomWidth: 0.5,
  },
  colLabel: {
    width: "50%",
    paddingLeft: 10,
    borderRightWidth: 0.5,
    borderColor: "#333",
    height: "100%",
    justifyContent: "center",
  },
  colCurrency: {
    width: "15%",
    textAlign: "center",
    borderRightWidth: 0.5,
    borderColor: "#333",
    height: "100%",
    justifyContent: "center",
  },
  colAmount: {
    width: "50%",
    textAlign: "right",
    paddingRight: 3,
    height: "100%",
    justifyContent: "center",
  },
  bgGray: {
    backgroundColor: "#c2c0c0",
  },

  // Footer
  footer: {
    marginTop: 80,
    textAlign: "center",
    color: "#6c757d",
    fontSize: 9,
  },
  validBox: {
    marginTop: 4,
    backgroundColor: "#c2c0c0",
    padding: 4,
    textAlign: "center",
    color: "#000000",
    fontSize: 9,
  },
  noteRed: {
    marginTop: 3,
    color: "#ff0000",
    fontSize: 9,
    textAlign: "left",
  },
});

const COMPANY_CONFIG = {
  GLOBAL: {
    headerSrc: "/global/header.webp",
    alt: "Global Insurance PLC",
    address: `Head Office: Al-Razi Complex (12th Floor), 166-167, Shaheed Syed Nazrul Islam Sarani, \nPurana Paltan, Dhaka- 1000. Tel: PABX: 55111601-3, 9570147, 9570450 Fax: 88-02-9556103, \nemail: globalho2000@gmail.com web: www.globalinsurancebd.com`,
  },
  FEDERAL: {
    headerSrc: "/federal/header.webp",
    alt: "Federal Insurance PLC",
    address: `Head Office: Navana D.H. Tower (6th Floor), 6, Panthapath, Dhaka-1215, Bangladesh. \nPhone: 02223374054-55, 02223374056, 02223374057, 02223374058 \nFax: 02223374062 Email: headoffice@federalinsubd.com Web: www.federalinsubd.com`,
  },
  TAKAFUL: {
    headerSrc: "/takaful/takaful.webp",
    alt: "Takaful Islami Insurance Limited",
    address: `Head Office: Monir Tower (7th, 8th & 9th Floor), 167/1, D.I.T. Extension Road, Motijheel (Fakirapool), \nDhaka. Bangladesh Phone: 88-02-41070071-3 Fax: 880-2-41070083\nemail: takaful@dhaka.net web: www.takaful.com.bd`,
  },
};

const formatCurrency = (val) => {
  return parseFloat(val || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Layout for Payment Table Row
const TableRow = ({ label, amount, isTotal = false }) => (
  <View
    style={[
      styles.tableRow,
      isTotal ? styles.bgGray : {},
      isTotal ? null : { borderBottomWidth: 0.5 },
    ]}
  >
    <View style={styles.colLabel}>
      <Text>{label}</Text>
    </View>
    <View style={styles.colCurrency}>
      <Text>BDT</Text>
    </View>
    <View style={styles.colAmount}>
      <Text>{formatCurrency(amount)}</Text>
    </View>
  </View>
);

export const ReceiptDocument = ({ data, qrCodeDataUrl, shortCode }) => {
  const config = COMPANY_CONFIG[data.companyType] || COMPANY_CONFIG.GLOBAL;

  const getImageUrl = (src) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${src}`;
    }
    return src;
  };

  return (
    <Document title={shortCode} author="Q-Receipt" subject="Money Receipt">
      <Page size="A4" style={styles.page}>
        {/* Header Image */}
        <Image src={getImageUrl(config.headerSrc)} style={styles.headerImage} />

        {/* Address */}
        <Text style={styles.address}>{config.address}</Text>

        {/* BIN */}
        <View style={styles.binRow}>
          <Text style={styles.binText}>BIN : {data.bin || ""}</Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>MONEY RECEIPT</Text>
          <Text style={styles.subTitle}>MUSHAK : 6.3</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.leftCol}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Issuing Office</Text>
              <Text style={styles.separator}>:</Text>
              <Text style={styles.value}>
                {data.issuingOffice || "Rangpur Branch"}
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Money Receipt No.</Text>
              <Text style={styles.separator}>:</Text>
              <Text style={styles.value}>{data.receiptNo || "N/A"}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Class of Insurance</Text>
              <Text style={styles.separator}>:</Text>
              <Text style={styles.value}>{data.classOfInsurance || "N/A"}</Text>
            </View>
          </View>
          <View
            style={[
              styles.rightCol,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              },
            ]}
          >
            <Text style={{ marginRight: 3 }}>Date :</Text>
            <Text> {data.date} </Text>
          </View>
        </View>

        {/* Money Lines */}
        <View style={styles.lineRow}>
          <Text style={[styles.lineLabel]}>Received with thanks from</Text>
          <View style={styles.flex1}>
            <Text>{data.receivedFrom || ""}</Text>
          </View>
        </View>

        <View style={styles.lineRow}>
          <Text style={styles.lineLabelNormal}>The sum of</Text>
          <View style={styles.underline}>
            <Text>Tk. {data.sumOf || ""}</Text>
          </View>
        </View>

        {/* Split Row: Mode of Payment | Dated */}
        <View style={styles.splitRow}>
          <Text style={styles.modeDate}>Mode of Payment</Text>
          <View style={[styles.underline, { flex: 5.5 }]}>
            <Text>{data.modeOfPayment || ""}</Text>
          </View>

          <Text style={[styles.modeDate, { marginLeft: 8, marginRight: 6 }]}>
            Dated
          </Text>
          <View style={[styles.underline, { flex: 1 }]}>
            <Text>{data.chequeDate || ""}</Text>
          </View>
        </View>

        <View style={[styles.lineRow, { marginTop: -2 }]}>
          <Text style={[styles.lineLabelNormal, { marginRight: 5 }]}>
            Drawn on
          </Text>
          <View style={styles.underline}>
            <Text>{data.drawnOn || " "}</Text>
          </View>
        </View>

        <View style={[styles.lineRow, { marginTop: 1 }]}>
          <Text style={{ marginRight: 9 }}>Issued against</Text>
          <View style={[styles.underline, { fontSize: 11 }]}>
            <Text>{data.issuedAgainst || ""}</Text>
          </View>
        </View>

        {/* Payment Table */}
        <View style={{ position: "relative" }}>
          <View style={styles.tableContainer}>
            <View style={styles.tableWrapper}>
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderLeftWidth: 0.5,
                  borderRightWidth: 0.5,
                  borderColor: "black",
                }}
              >
                <TableRow label="Premium" amount={data.premium} />
                <TableRow label="VAT" amount={data.vat} />
                {parseFloat(data.stamp || 0) > 0 && (
                  <TableRow label="Stamp" amount={data.stamp} />
                )}
                <TableRow label="Total" amount={data.total} isTotal={true} />
              </View>
            </View>
          </View>

          {/* QR Code placed absolute relative to this container or using negative margins/flex */}
          {qrCodeDataUrl && (
            <View style={{ position: "absolute", right: 90, top: 45 }}>
              <Image src={qrCodeDataUrl} style={{ width: 110, height: 110 }} />
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 1, fontWeight: "bold" }}>
            This RECEIPT is computer generated, authorized signature is not
            required.
          </Text>
          <View style={styles.validBox}>
            <Text>Receipt valid subject to encashment of cheque/P.O./D.D.</Text>
          </View>
          <Text style={styles.noteRed}>
            * Note: If have any complain about Insurance, call 16130.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
