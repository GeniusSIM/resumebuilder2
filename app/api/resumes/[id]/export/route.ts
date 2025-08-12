import { NextResponse } from "next/server";
import { auth } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ResumeSchema } from "@/lib/utils";
import { pdf, Document, Page, Text, View, StyleSheet, Link as PdfLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 18, fontWeight: 700 },
  sectionTitle: { marginTop: 10, fontSize: 12, fontWeight: 700, textTransform: "uppercase" },
  pill: { padding: 4, marginRight: 4, backgroundColor: "#eee", borderRadius: 4 }
});

export async function GET(_: Request, { params }:{ params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const r = await prisma.resume.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!r || r.user.email !== session.user.email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = ResumeSchema.safeParse(r.data);
  const data = parsed.success ? parsed.data : null;
  if (!data) return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{data.basics.fullName}</Text>
            {data.basics.title ? <Text>{data.basics.title}</Text> : null}
          </View>
          <View>
            {data.basics.email ? <Text>{data.basics.email}</Text> : null}
            {data.basics.phone ? <Text>{data.basics.phone}</Text> : null}
            {data.basics.location ? <Text>{data.basics.location}</Text> : null}
            {data.basics.website ? <PdfLink src={data.basics.website}>{data.basics.website}</PdfLink> : null}
          </View>
        </View>

        {data.summary ? (<>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text>{data.summary}</Text>
        </>) : null}

        {data.skills?.length ? (<>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {data.skills.map((s, i)=>(<Text key={i} style={styles.pill}>{s.name}</Text>))}
          </View>
        </>) : null}

        {data.experience?.length ? (<>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((e, i)=>(
            <View key={i} style={{ marginBottom: 6 }}>
              <Text>{e.role} • {e.company} • {e.start} - {e.end || "Present"}</Text>
              {e.bullets?.length ? e.bullets.map((b, bi)=>(<Text key={bi}>• {b}</Text>)) : null}
            </View>
          ))}
        </>) : null}

        {data.education?.length ? (<>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((ed, i)=>(
            <Text key={i}>{ed.degree} • {ed.school} • {ed.start} - {ed.end || "Present"}</Text>
          ))}
        </>) : null}

        {data.projects?.length ? (<>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((p, i)=>(
            <View key={i}>
              <Text>{p.name} {p.link ? `• ${p.link}` : ""}</Text>
              {p.bullets?.length ? p.bullets.map((b, bi)=>(<Text key={bi}>• {b}</Text>)) : null}
            </View>
          ))}
        </>) : null}
      </Page>
    </Document>
  );

  const pdfBuffer = await pdf(doc).toBuffer();
  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume.pdf"`
    }
  });
}
