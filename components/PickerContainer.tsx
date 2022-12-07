import useImmutableSWR from 'swr/immutable';
import { seafowlFetcher, picker } from '../data/seafowl'
import Picker from './Picker'

interface PickerContainerProps {
  timestamp: string;
}
const Seafowl = ({ timestamp }: PickerContainerProps) => {
  const { data, error } = useImmutableSWR(picker(timestamp), seafowlFetcher);

  return (
    <div>
      {!!error && <h4>Sorry, an error occurred.</h4>}
      <Picker data={data} />
      <h4>{timestamp}</h4>
    </div>
  )
}
export default Seafowl