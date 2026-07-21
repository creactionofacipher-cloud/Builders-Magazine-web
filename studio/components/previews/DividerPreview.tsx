function DividerMedia() {
  return (
    <div style={{ width: 32, height: 32, display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", height: 2, background: "#b3b3b3" }} />
    </div>
  );
}

// No fields to select from — divider is a pure marker (see the "at least
// one field" comment on its schema definition). The horizontal-line
// glyph is the whole point: an editor scanning the block list sees a
// literal divider instead of a generic "Divider" label with no visual.
export const dividerPreview = {
  prepare() {
    return { title: "Разделитель", media: <DividerMedia /> };
  },
};
