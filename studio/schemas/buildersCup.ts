import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";
import { SortedMediaAssetReferenceInput } from "../components/inputs/SortedMediaAssetReferenceInput";
import { NominationSelectInput } from "../components/inputs/NominationSelectInput";
import { gallerySettingsField } from "./gallerySettings";

// Ported from cms/schemas/buildersCup.ts — field-for-field.
export default defineType({
  name: "buildersCup",
  title: "Builders Cup",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: portableTextBlocks,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      components: { input: SortedMediaAssetReferenceInput },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          name: "galleryImage",
          type: "reference",
          to: [{ type: "mediaAsset" }],
          components: { input: SortedMediaAssetReferenceInput },
        }),
      ],
    }),
    gallerySettingsField,
    defineField({
      name: "nominations",
      title: "Nominations",
      description: "Award categories for this event (e.g. Best Paint, Best Chopper). Edit titles here — winners below pick from this list.",
      type: "array",
      of: [
        defineArrayMember({
          name: "nomination",
          title: "Nomination",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }: { title?: string }) => ({ title: title || "Untitled nomination" }),
          },
        }),
      ],
    }),
    defineField({
      name: "participants",
      title: "Participants",
      description:
        "Existing plain reference entries keep working as-is. Add new entries as “Participant” to mark a Winner and pick a Nomination.",
      type: "array",
      of: [
        // Legacy shape — unchanged so documents authored before nominations
        // existed keep working without any migration (see
        // cms/queries/buildersCup.ts, which still reads these).
        defineArrayMember({
          name: "participant",
          title: "Participant (legacy)",
          type: "reference",
          to: [{ type: "bike" }],
        }),
        defineArrayMember({
          name: "participantEntry",
          title: "Participant",
          type: "object",
          fields: [
            defineField({
              name: "participant",
              title: "Bike",
              type: "reference",
              to: [{ type: "bike" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "winner",
              title: "Winner",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "nomination",
              title: "Nomination",
              type: "string",
              components: { input: NominationSelectInput },
              hidden: ({ parent }) => !parent?.winner,
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as { winner?: boolean } | undefined;
                  if (parent?.winner && !value) {
                    return "Nomination is required when Winner is checked";
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              bikeName: "participant.name",
              winner: "winner",
              nominationKey: "nomination",
              nominations: "^.nominations",
            },
            prepare({ bikeName, winner, nominationKey, nominations }: {
              bikeName?: string;
              winner?: boolean;
              nominationKey?: string;
              nominations?: { _key: string; title?: string }[];
            }) {
              const title = bikeName || "Untitled bike";
              if (!winner) return { title };
              const nomination = nominations?.find((item) => item._key === nominationKey);
              return { title, subtitle: `Winner: ${nomination?.title || "—"}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "winners",
      title: "Winners (Legacy)",
      description:
        "Superseded by the Winner toggle on each participant above. Kept so events created before nominations existed keep rendering unchanged.",
      type: "array",
      of: [defineArrayMember({ name: "winner", type: "reference", to: [{ type: "bike" }] })],
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      // weak: deleting a Story shouldn't be blocked by a Builders Cup
      // still listing it. Not currently fetched by any GROQ query in the
      // app (see cms/queries/buildersCup.ts), so no dangling-reference
      // filtering is needed on the query side.
      of: [
        defineArrayMember({
          name: "cupStory",
          type: "reference",
          to: [{ type: "story" }],
          weak: true,
        }),
      ],
    }),
  ],
});
