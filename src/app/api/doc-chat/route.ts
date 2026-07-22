import { NextResponse } from "next/server";

const mockDocumentStore = [
  {
    page: 12,
    document: "Introduction_to_Algorithms.pdf",
    content: "Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable to problems exhibiting overlapping subproblems and optimal substructure.",
  },
  {
    page: 45,
    document: "Introduction_to_Algorithms.pdf",
    content: "Graph Traversals: Breadth-First Search (BFS) explores neighbor nodes at the present depth before moving to nodes at the next depth level using a FIFO Queue.",
  },
  {
    page: 88,
    document: "Database_Systems_Guide.pdf",
    content: "ACID properties in Relational Databases guarantee transaction safety: Atomicity, Consistency, Isolation, and Durability.",
  },
];

export async function POST(req: Request) {
  try {
    const { query = "dynamic programming", filename } = await req.json();

    const lowerQuery = query.toLowerCase();

    // Word overlap keyword search
    const results = mockDocumentStore.filter((doc) => {
      const matchQuery =
        doc.content.toLowerCase().includes(lowerQuery) ||
        lowerQuery.split(" ").some((w: string) => doc.content.toLowerCase().includes(w));
      const matchFile = filename ? doc.document === filename : true;
      return matchQuery && matchFile;
    });

    const sources = results.length > 0 ? results : [mockDocumentStore[0]];

    return NextResponse.json({
      success: true,
      query,
      answer: `Based on your textbook sources, ${sources[0].content}`,
      sources: sources.map((s) => ({
        document: s.document,
        page: s.page,
        snippet: s.content,
      })),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to search document", details: String(err) }, { status: 500 });
  }
}
