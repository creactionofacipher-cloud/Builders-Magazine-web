// Lightweight local shape for authoring Sanity schemas without the
// `sanity` package as a dependency. defineType/defineField (from the
// real package) are identity functions at runtime — a plain object
// literal following this shape is a fully valid, directly usable Sanity
// schema with zero adaptation needed once a real Studio project exists.
// This type exists purely for authoring-time structure, not because the
// real package is required for compatibility.

// Array member (the entries inside `of: [...]`). Sanity allows these to
// be unnamed for primitive/block members (e.g. `{ type: "block" }`) —
// only object/reference members that need disambiguation are named.
export interface SchemaArrayMember {
  name?: string;
  type: string;
  to?: { type: string }[];
  fields?: SchemaField[];
}

export interface SchemaField {
  name: string;
  title?: string;
  type: string;
  to?: { type: string }[];
  of?: SchemaArrayMember[];
  fields?: SchemaField[];
  options?: Record<string, unknown>;
}

export interface SchemaTypeDefinition {
  name: string;
  title?: string;
  type: "document" | "object";
  fields: SchemaField[];
}
