// Experimental - port slugify logic to JS

interface SocrataDatasetKey {
  id: string;
  domain: string;
  name: string;
}

export const socrataExternalRepo = (datasets: Array<SocrataDatasetKey>) => {
  return datasets.map((dataset) => ({
    namespace:  getNamespace(dataset.domain),
    repository: getRepository(dataset.name, dataset.id)
  }))
}

const getNamespace = (domain: string, suffix?: string) => {
  let domainParts = domain.split(".")

  // Strip common TLDs
  if (["com", "org", "net"].includes(domainParts[domainParts.length - 1]) {
    domainParts.pop()
  }

  // Strip common prefixes
  if (["data", "www"].includes(domainParts[0])) {
    const [_, ...rest] = domainParts;
    domainParts = rest;
  }

  if (suffix) {
    domainParts.push(suffix)
  }

  return domainParts.join("-")
}

const getRepository = (datasetName: string, socrataId: string): string => {
  return slugify(datasetName).replace("_", "-") + "-" + socrataId
}

const slugify = (text: string, maxLength: number = 50): string => {
  text = text.replace(new RegExp(/[^\sa-zA-Z0-9]/), text.toLowerCase()).trim()
  const parts = text.split(/\s+/)
  let result = parts[0]
  for (const r of result.slice(1)) {
    const j = result + "_" + r;
    if (j.length > maxLength) {
      break
    }
    result = j
  }

  return result.slice(0, maxLength-1)
}