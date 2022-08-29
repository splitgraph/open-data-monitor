// This was an initial experiment for a dropdown-based tag chooser. Replaced with <RangeSlider>
// because it lets the user pick two dates in one place

import { filterUseableTags } from '../data/index';

export const SelectTag = ({ data, error }: { data: any, error: any }) => {
  const useableNodes = filterUseableTags(data?.tags?.nodes || [])

  if (error) {
    return (
      <div>
        <h3>Sorry, something went wrong</h3>
        {error.toString()}
      </div>
    )
  }

  return (
    <select>
      {useableNodes.map((tag) => <option key={tag}>{tag}</option>)}
    </select >
  )
}