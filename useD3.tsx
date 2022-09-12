import { useEffect, useRef, type RefObject } from 'react';
import * as d3 from 'd3';


const useD3 = (renderChartFn: (arg: any) => void, deps: any[]) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => { };
  }, deps);

  return ref;
}

export default useD3