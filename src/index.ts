import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "..", "data");

function loadJSON(filename: string): any {
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

const tokens = loadJSON("tokens.json");
const components = loadJSON("components.json");
const guidelines = loadJSON("guidelines.json");

if (tokens) console.error("[waffy] tokens loaded");
if (components) console.error("[waffy] components loaded:", components.components?.length);
if (guidelines) console.error("[waffy] guidelines loaded:", guidelines.guidelines?.length);

// ─── TOOL IMPLEMENTATIONS ───

function getDesignTokens(args: any): string {
  if (!tokens) return JSON.stringify({ error: "no tokens.json" });

  const cat = args?.category ?? "all";

  if (cat === "all") {
    return JSON.stringify(
      {
        colors: tokens.colors,
        gradients: tokens.gradients,
        typography: tokens.typography,
        spacing: tokens.spacing,
        radii: tokens.radii,
      },
      null,
      2
    );
  }

  const val = tokens[cat];
  return val
    ? JSON.stringify({ [cat]: val }, null, 2)
    : JSON.stringify({ error: "unknown category" });
}

function listComponents(): string {
  if (!components?.components) {
    return JSON.stringify({ error: "no components.json" });
  }

  return JSON.stringify(
    components.components.map((c: any) => ({
      name: c.name,
      category: c.category,
      description: c.description,
    })),
    null,
    2
  );
}

function lookupComponent(args: any): string {
  if (!components?.components) {
    return JSON.stringify({ error: "no components.json" });
  }

  const q = (args?.name ?? "").toLowerCase();
  const m = components.components.find((c: any) =>
    c.name.toLowerCase().includes(q)
  );

  return m ? JSON.stringify(m, null, 2) : "Not found. Use list_components.";
}

function getGuidelines(args: any): string {
  const results: any[] = [];
  const q = args?.component?.toLowerCase();

  if (components?.components) {
    for (const c of components.components) {
      if (c.guidelines && (!q || c.name.toLowerCase().includes(q))) {
        results.push({ source: c.name, text: c.guidelines });
      }
    }
  }

  if (guidelines?.guidelines) {
    for (const g of guidelines.guidelines) {
      if (!q || g.source.toLowerCase().includes(q) || g.text.toLowerCase().includes(q)) {
        results.push(g);
      }
    }
  }

  return results.length > 0
    ? JSON.stringify(results, null, 2)
    : "No guidelines found.";
}

function generateCode(args: any): string {
  if (!components?.components) return "No components.";

  const q = (args?.component ?? "").toLowerCase();
  const comp = components.components.find((x: any) =>
    x.name.toLowerCase().includes(q)
  );

  if (!comp) return "Component not found.";

  const safeName = comp.name.replace(/[^a-zA-Z0-9]/g, "");
  const props = comp.props ?? [];
  const fw = args?.framework ?? "react";

  if (fw === "react") {
    const types = props
      .map((p: any) => {
        if (p.type === "enum") {
          return (
            "  " +
            p.name +
            "?: " +
            (p.options ?? []).map((o: string) => `"${o}"`).join(" | ") +
            ";"
          );
        }
        if (p.type === "boolean") return "  " + p.name + "?: boolean;";
        if (p.type === "number") return "  " + p.name + "?: number;";
        return "  " + p.name + "?: string;";
      })
      .join("\n");

    return [
      "// Waffy — " + comp.name,
      `import { ${safeName} } from "@waffy/ui";`,
      "",
      `interface ${safeName}Props {`,
      types || "  // no typed props yet",
      "}",
    ].join("\n");
  }

  if (fw === "vue") {
    return `<template>
  <${safeName} />
</template>
<script setup>
import { ${safeName} } from "@waffy/ui";
</script>`;
  }

  return `<div class="waffy-${safeName.toLowerCase()}" dir="rtl"></div>`;
}

function searchDS(args: any): string {
  const q = (args?.query ?? "").toLowerCase();
  const results: any[] = [];

  if (components?.components) {
    for (const c of components.components) {
      if (
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      ) {
        results.push({
          type: "component",
          name: c.name,
          description: c.description,
        });
      }
    }
  }

  if (tokens?.colors) {
    for (const [group, shades] of Object.entries(tokens.colors)) {
      if (group.toLowerCase().includes(q)) {
        results.push({ type: "colors", group, shades });
      }
    }
  }

  return results.length > 0
    ? JSON.stringify(results.slice(0, 20), null, 2)
    : "No results.";
}

// ─── WRITE OPERATIONS ───

const CODE_DIR = path.resolve(DATA_DIR, "component-code");
if (!fs.existsSync(CODE_DIR)) fs.mkdirSync(CODE_DIR, { recursive: true });

function updateComponent(args: any): string {
  if (!components?.components) {
    return JSON.stringify({ error: "no components.json" });
  }

  const name = args?.name;
  if (!name) return JSON.stringify({ error: "name is required" });

  const idx = components.components.findIndex(
    (c: any) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (idx === -1) {
    const newComp: any = { name };
    if (args.category) newComp.category = args.category;
    if (args.description) newComp.description = args.description;
    if (args.figmaNodeId) newComp.figmaNodeId = args.figmaNodeId;
    if (args.variants) newComp.variants = JSON.parse(args.variants);
    if (args.props) newComp.props = JSON.parse(args.props);
    if (args.guidelines) newComp.guidelines = args.guidelines;
    components.components.push(newComp);
  } else {
    const comp = components.components[idx];
    if (args.category) comp.category = args.category;
    if (args.description) comp.description = args.description;
    if (args.figmaNodeId) comp.figmaNodeId = args.figmaNodeId;
    if (args.variants) comp.variants = JSON.parse(args.variants);
    if (args.props) comp.props = JSON.parse(args.props);
    if (args.guidelines) comp.guidelines = args.guidelines;
  }

  const fp = path.join(DATA_DIR, "components.json");
  fs.writeFileSync(fp, JSON.stringify(components, null, 2), "utf-8");

  console.error("[waffy] component updated:", name);

  return JSON.stringify({
    success: true,
    component: name,
    action: idx === -1 ? "created" : "updated",
  });
}

function uploadComponentCode(args: any): string {
  const componentName = args?.name;
  const code = args?.code;
  const framework = args?.framework ?? "react";
  const filename = args?.filename;

  if (!componentName) return JSON.stringify({ error: "name is required" });
  if (!code) return JSON.stringify({ error: "code is required" });

  const safeName = componentName.replace(/[^a-zA-Z0-9_-]/g, "");
  const ext =
    framework === "vue" ? ".vue" : framework === "html" ? ".html" : ".jsx";
  const fname = filename || safeName + ext;
  const fp = path.join(CODE_DIR, fname);

  fs.writeFileSync(fp, code, "utf-8");
  console.error("[waffy] component code saved:", fp);

  return JSON.stringify({
    success: true,
    component: componentName,
    framework,
    file: fname,
    path: fp,
    size: code.length,
  });
}

function getComponentCode(args: any): string {
  const componentName = args?.name;
  if (!componentName) return JSON.stringify({ error: "name is required" });

  const safeName = componentName.replace(/[^a-zA-Z0-9_-]/g, "");

  for (const ext of [".jsx", ".tsx", ".vue", ".html", ".css"]) {
    const fp = path.join(CODE_DIR, safeName + ext);
    if (fs.existsSync(fp)) {
      const code = fs.readFileSync(fp, "utf-8");
      return JSON.stringify({
        component: componentName,
        file: safeName + ext,
        code,
      });
    }
  }

  const files = fs
    .readdirSync(CODE_DIR)
    .filter((f) => f.toLowerCase().startsWith(safeName.toLowerCase()));

  if (files.length > 0) {
    return JSON.stringify({ component: componentName, files });
  }

  return JSON.stringify({ error: "No code found for " + componentName });
}

function listComponentCode(): string {
  if (!fs.existsSync(CODE_DIR)) return JSON.stringify({ files: [] });

  const files = fs.readdirSync(CODE_DIR).filter((f) => !f.startsWith("."));
  return JSON.stringify({ files });
}

// ─── TOOL DEFINITIONS ───

const TOOLS = [
  {
    name: "get_design_tokens",
    description: "Get Waffy design tokens: colors, typography, spacing, gradients, radii.",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          enum: ["colors", "typography", "spacing", "gradients", "radii", "all"],
        },
      },
    },
  },
  {
    name: "list_components",
    description: "List all Waffy design system components.",
    inputSchema: { type: "object" as const, properties: {} },
  },
  {
    name: "lookup_component",
    description: "Look up a component by name. Returns props, variants, guidelines.",
    inputSchema: {
      type: "object" as const,
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  {
    name: "get_usage_guidelines",
    description: "Get usage guidelines, optionally filtered by component.",
    inputSchema: {
      type: "object" as const,
      properties: { component: { type: "string" } },
    },
  },
  {
    name: "generate_code_snippet",
    description: "Generate React/Vue/HTML code for a Waffy component.",
    inputSchema: {
      type: "object" as const,
      properties: {
        component: { type: "string" },
        framework: { type: "string", enum: ["react", "vue", "html"] },
      },
      required: ["component"],
    },
  },
  {
    name: "search_design_system",
    description: "Search across tokens, components, and guidelines.",
    inputSchema: {
      type: "object" as const,
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "update_component",
    description: "Create or update a component in the design system. Updates components.json on disk.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Component name (e.g. InputField)" },
        category: { type: "string", description: "Component category (e.g. Forms, Actions)" },
        description: { type: "string", description: "Component description" },
        figmaNodeId: { type: "string", description: "Figma node ID" },
        variants: { type: "string", description: "JSON string of variants array" },
        props: { type: "string", description: "JSON string of props array" },
        guidelines: { type: "string", description: "Usage guidelines text" },
      },
      required: ["name"],
    },
  },
  {
    name: "upload_component_code",
    description: "Upload implementation code (React/Vue/HTML) for a component to the design system.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Component name (e.g. InputField)" },
        code: { type: "string", description: "The full component source code" },
        framework: { type: "string", enum: ["react", "vue", "html"], description: "Framework" },
        filename: { type: "string", description: "Optional filename override" },
      },
      required: ["name", "code"],
    },
  },
  {
    name: "get_component_code",
    description: "Retrieve the saved implementation code for a component.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Component name" },
      },
      required: ["name"],
    },
  },
  {
    name: "list_component_code",
    description: "List all uploaded component code files.",
    inputSchema: { type: "object" as const, properties: {} },
  },
];

// ─── MCP SERVER + SSE TRANSPORT ───

function createServer(): Server {
  const server = new Server(
    { name: "waffy-design-system", version: "3.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;
    let text: string;

    switch (name) {
      case "get_design_tokens":
        text = getDesignTokens(args);
        break;
      case "list_components":
        text = listComponents();
        break;
      case "lookup_component":
        text = lookupComponent(args);
        break;
      case "get_usage_guidelines":
        text = getGuidelines(args);
        break;
      case "generate_code_snippet":
        text = generateCode(args);
        break;
      case "search_design_system":
        text = searchDS(args);
        break;
      case "update_component":
        text = updateComponent(args);
        break;
      case "upload_component_code":
        text = uploadComponentCode(args);
        break;
      case "get_component_code":
        text = getComponentCode(args);
        break;
      case "list_component_code":
        text = listComponentCode();
        break;
      default:
        text = "Unknown tool: " + name;
    }

    return {
      content: [{ type: "text", text }],
    };
  });

  return server;
}

// ─── EXPRESS APP WITH SSE ───

const app = express();
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

// IMPORTANT: exclude /messages from body parsing — the MCP SSE transport
// needs to read the raw request stream itself. express.json() consumes it.
app.use((req, res, next) => {
  if (req.path === '/messages') return next();
  express.json({ limit: '10mb' })(req, res, next);
});

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Expose-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Health check
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    name: "waffy-design-system",
    version: "3.0.0",
    endpoints: {
      health: "/health",
      sse: "/sse",
      messages: "/messages?sessionId=...",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    server: "waffy-design-system",
    version: "3.0.0",
  });
});

// Active transports
const transports = new Map<string, SSEServerTransport>();

// SSE endpoint
app.get("/sse", async (req, res) => {
  console.error("[waffy] SSE connection from", req.ip);

  try {
    const transport = new SSEServerTransport("/messages", res);
    const server = createServer();

    transports.set(transport.sessionId, transport);

    req.on("close", () => {
      console.error("[waffy] SSE client disconnected:", transport.sessionId);
      transports.delete(transport.sessionId);
      server.close().catch(console.error);
    });

    await server.connect(transport);
  } catch (error) {
    console.error("[waffy] SSE error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to establish SSE connection" });
    }
  }
});

// POST message endpoint
app.post("/messages", async (req, res) => {
  try {
    const sessionId = req.query["sessionId"] as string;
    const transport = transports.get(sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId query parameter" });
    }

    if (!transport) {
      return res.status(400).json({
        error: "No active SSE session for this sessionId",
        sessionId,
      });
    }

    await transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("[waffy] POST /messages error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to handle MCP message" });
    }
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.error(`[waffy] MCP SSE server listening on http://0.0.0.0:${PORT}`);
  console.error(`[waffy] Health check: http://0.0.0.0:${PORT}/health`);
  console.error(`[waffy] SSE endpoint: http://0.0.0.0:${PORT}/sse`);
});
