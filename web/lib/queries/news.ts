import slugReference from './common/slugReference'

const newsFields = /* groq */ `
  "id": _id,
  "updatedAt": _updatedAt,
  title,
  heroImage,
  "publishDateTime": coalesce(publishDateTime, _createdAt),
  "slug": slug.current,
  ingress,
`

export const allNewsQuery = /* groq */ `
*[_type == "news"] | order(publishDateTime desc, _updatedAt desc) {
  ${newsFields}
}`

export const newsQuery = /* groq */ `
{
  "news": *[_type == "news" && slug.current == $slug] | order(_updatedAt desc)[0] {
    "documentTitle": seo.documentTitle,
    "metaDescription": seo.metaDescription,
    openGraphImage,
    "content": content[]{
      ...,
      _type == "pullQuote" => {
        "type": _type,
        "id": _key,
        author,
        authorTitle,
        image,
        quote,
        "designOptions": {
          "imagePosition": coalesce(imagePosition, 'right'),
        }
      },
      _type == "positionedInlineImage" => {
        ...,
        // For these images, we don't want crop and hotspot
        // because we don't know the aspect ratio
        "image": image{
          _type,
          "asset": asset,
          "alt": alt
        }
      },
      "markDefs": markDefs[]{
        ...,
        _type == "internalLink" => {
          "internalLink": reference->{
            name,
            "id": ${slugReference},
            "type": _type,
          },
        },
      }, 
    },
    "relatedLinks": relatedLinks{
      title,
      heroImage,
      "links": links[]{
        _type == "internalUrl" => {
        "type": _type,
        "id": _key,
        label,
        "link": reference-> {
          "type": _type,
          "slug": ${slugReference}
        },
      },
      _type == "externalUrl" => {
          "id": _key,
          "type": _type,
          label,
          "href": url,
        },
      _type == "downloadableFile" => {
        "id": _key,
        "type": _type,
        "label": filename,
        "href": file.asset-> url,
        "extension": file.asset-> extension 
      },
      _type == "downloadableImage" => {
        "id": _key,
        "type": _type,
        label,
        "href": image.asset-> url, 
        "extension": image.asset-> extension 
      },
    }
  },
    ${newsFields}
  },
  "latestNews": *[_type == "news" && slug.current != $slug] | order(publishDateTime desc, _updatedAt desc)[0...3] {
    ${newsFields}
  }
}`

export const newsSlugsQuery = /* groq */ `
*[_type == "news" && defined(slug.current)][].slug.current
`

// @TODO: why does the 'match' filter in groq not work here?
// "&& _id match $id" where $id = the base id without __i18n
export const queryLocalizedNewsById = /* groq */ `
*[_type == "news" && !(_id in path("drafts.**")) && _id == $id_en || _id == $id_no] {
  "slug": slug.current,
  "lang": _lang,
}
`
