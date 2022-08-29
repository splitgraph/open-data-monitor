import { type Dispatch, type SetStateAction } from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 1;
const COLORS = ['#0C2960', '#276EF1', '#ccc'];

interface RangeSliderProps {
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
  tags: string[];
  min: number;
  max: number;
  className: string;
}

const RangeSlider = ({ values, setValues, tags, min, max, className }: RangeSliderProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
      className={className}
    >
      <Range
        draggableTrack
        values={values}
        step={STEP}
        min={0}
        max={tags.length - 1}
        onChange={(values) => setValues(values)}
        renderMark={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '16px',
              width: '5px',
              backgroundColor: '#548BF4'
            }}
          />
        )}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: COLORS,
                  min,
                  max
                }),
                alignSelf: 'center'
              }}
            >
              {children}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',

              }}>
                <p>newer</p>
                <p>older</p>
              </div>
            </div>
          </div>
        )}
        renderThumb={({ index, props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              borderRadius: '4px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '48px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: '#548BF4'
              }}
            >
              {tags[values[index]]}
            </div>
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC'
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default RangeSlider