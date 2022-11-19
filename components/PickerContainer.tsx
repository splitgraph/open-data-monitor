import useImmutableSWR from 'swr/immutable';
import type { Dispatch, SetStateAction } from 'react';
import { seafowlFetcher, picker } from '../data/seafowl'
import Picker from './Picker'

interface PickerContainerProps {
  timestamp: string;
  setTimestamp: (timestamp: string) => void;
}
const Seafowl = ({ timestamp, setTimestamp }: PickerContainerProps) => {
  const { data, error } = useImmutableSWR(picker(timestamp), seafowlFetcher);

  return (
    <div>
      {!!error && <h4>Sorry, an error occurred.</h4>}
      <Picker timestamp={timestamp} setTimestamp={setTimestamp} data={data} />
      <h4>{timestamp}</h4>
    </div>
  )
}
export default Seafowl