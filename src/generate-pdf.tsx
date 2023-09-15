/** @jsxImportSource react */
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import { type Style } from "@react-pdf/types";
import dayjs from "dayjs";
import path from "path";
import { content } from "~/content/cv-content";

const colors = {
  primary: "rgb(5, 122, 255)",
  primaryContent: "rgb(219, 255, 255)",
  background: "rgb(255, 255, 255)",
  content: "rgba(57, 78, 106, 0.8)",
} as const;

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: colors.background,
    fontFamily: "Helvetica",
    color: "rgba(57, 78, 106, 0.8)",
  },
  head: {
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "rgb(5, 122, 255)",
    color: colors.primaryContent,
    alignItems: "center",
  },
  headAside: {
    flexDirection: "column",
    fontSize: 10,
    justifyContent: "space-between",
  },
  headLink: { color: colors.primaryContent, marginTop: 6 },
  content: { flexGrow: 1, padding: 16, marginVertical: 32 },
  headline: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    paddingBottom: 6,
    borderBottom: 1,
    borderBottomColor: colors.primary,
    marginBottom: 16,
  },
  experience: { marginBottom: 16 },
});

const listStyles = StyleSheet.create({
  list: { flexDirection: "column", fontSize: 10 },
  entry: { flexDirection: "row", marginBottom: 4 },
  bullet: { marginRight: 4 },
});

const jobStyle = StyleSheet.create({
  header: {
    fontSize: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  view: { marginBottom: 16 },
});

const ListComponent = ({
  entries,
  style,
}: {
  entries: readonly string[];
  style?: Style;
}) => {
  return (
    <View style={{ ...listStyles.list, ...style }}>
      {entries.map((entry, i) => (
        <View style={listStyles.entry} key={i}>
          <Text style={listStyles.bullet}>•</Text>
          <Text>{entry}</Text>
        </View>
      ))}
    </View>
  );
};

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.head}>
        <View style={styles.headAside}>
          <Text>Berlin, Germany</Text>
          <Link src="mailto:contact@rackles.io" style={styles.headLink}>
            contact@rackles.io
          </Link>
        </View>
        <Text>Johannes Rackles</Text>
        <View style={styles.headAside}>
          <Link src="https://rackles.io" style={styles.headLink}>
            Website
          </Link>
          <Link
            src="https://www.linkedin.com/in/johannes-rackles/"
            style={styles.headLink}
          >
            LinkedIn
          </Link>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.headline}>Work Experience</Text>
        <View style={styles.experience}>
          {content.workExperience.map((job) => (
            <View key={job.position} style={jobStyle.view}>
              <View style={jobStyle.header}>
                <Text>
                  {job.position} @ {job.company}
                </Text>
                <Text>
                  {dayjs(job.timeframe[0]).format("MMMM YYYY")} -{" "}
                  {dayjs(job.timeframe[1]).format("MMMM YYYY")}
                </Text>
              </View>
              <ListComponent entries={job.description} />
            </View>
          ))}
        </View>
        <Text style={styles.headline}>Education</Text>
        <View style={styles.experience}>
          {content.education.map((job) => (
            <View
              key={job.position}
              style={{
                ...jobStyle.view,
                fontSize: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>{job.position}</Text>
              <Text>{job.company}</Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {dayjs(job.timeframe[0]).format("MMMM YYYY")} -{" "}
                {dayjs(job.timeframe[1]).format("MMMM YYYY")}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.headline}>Technologies</Text>
        <ListComponent
          style={styles.experience}
          entries={content.technologies}
        />
      </View>
    </Page>
  </Document>
);
await renderToFile(
  <MyDocument />,
  path.join(__dirname, "../public/CV_Johanes-Rackles.pdf")
);
