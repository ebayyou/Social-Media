import { createClient } from '@sanity/client'
import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2022-02-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.REACT_APP_SANITY_PROJECT_TOKEN,
}

export const client = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source)