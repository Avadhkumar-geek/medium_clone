import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-10-21",
    useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);
const builder = createImageUrlBuilder(config);

export function urlFor(source) {
    return builder.image(source);
}
// export const useCurrentUser = createCurrentUserHook(config);
