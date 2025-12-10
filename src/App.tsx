import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { ArrowLeft, ArrowRight } from 'lucide-react';

type StepSnapshot = { l: number; r: number; longest: string; comparison: string };

function App() {
  const [value, setValue] = useState('');
  const [longest, setLongest] = useState('');
  const [comparison, setComparison] = useState('');
  const [window, setWindow] = useState({
    l: 0,
    r: 0,
    value: ''
  });
  const [previous, setPrevious] = useState<StepSnapshot[]>([{ ...window, longest, comparison }]);

  const leftCharRef = useRef<HTMLDivElement>(null);
  const rightCharRef = useRef<HTMLDivElement>(null);

  const [scrollTarget, setScrollTarget] = useState<'l' | 'r'>('r');

  useEffect(() => {
    if (scrollTarget === 'r' && rightCharRef.current) {
      rightCharRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'end', 
        block: 'nearest'
      });
    }
    else if (scrollTarget === 'l' && leftCharRef.current) {
      leftCharRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest'
      });
    }
  }, [window.l, window.r, scrollTarget]);

  const handleNext = () => {
    setScrollTarget('r'); 

    let isDuplicate = false;
    let l = window.l;
    let r = window.r;

    for (let j = 0; j < comparison.length; j++) {
      if (value.charAt(l) === value.charAt(r + 1)) {
        l += 1;
        r += 1;
        isDuplicate = true;
        break;
      }
      if (value.charAt(r + 1) === comparison.charAt(j)) {
        l += comparison.indexOf(comparison.charAt(j)) + 1;
        r += 1;
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      r += 1;
    }

    const nextComparison = value.substring(l, r + 1);
    const nextLongest = nextComparison.length > longest.length ? nextComparison : longest;

    setPrevious((prev) => [...prev, { ...window, longest, comparison }]);
    setWindow({ ...window, l, r, });
    setComparison(nextComparison);
    setLongest(nextLongest);
  }

  const handlePrevious = () => {
    setScrollTarget('l');

    const copyPrev = [...previous];
    const previousStep = copyPrev.pop();
    setPrevious(copyPrev);
    if (previousStep) {
      setWindow({ ...window, l: previousStep.l, r: previousStep.r });
      setComparison(previousStep.comparison);
      setLongest(previousStep.longest);
    }
  }

  const handleReset = () => {
    setWindow({ l: 0, r: 0, value: '' });
    setComparison('');
    setLongest('');
    setPrevious([{ l: 0, r: 0, longest: '', comparison: '' }]);
    setValue('');
    setScrollTarget('r');
  }

  return (
    <div className='w-[100%]'>
      <div className='flex items-end gap-4'>
        <div className='text-left'>
          <label className="font-semibold" htmlFor="random">Random String</label>
          <Input className="bg-white" id='random' maxLength={50} placeholder='Enter random string' onChange={(e) => setValue(e.target.value)} value={value} />
        </div>
        <Button onClick={() => setWindow({ ...window, value: value })}>SUBMIT</Button>
      </div>

      {window.value &&
        <div className="flex gap-4 items-center mt-8 overflow-auto pb-4 p-4 mb-8 border rounded border-white">
          {window?.value.split('').map((item, idx) => (
            <div
              className='flex-col'
              key={`${item}-${idx}`}
              ref={(el) => {
                if (idx === window.l) leftCharRef.current = el;
                if (idx === window.r) rightCharRef.current = el;
              }}
            >
              <div>
                <p className={idx === window.l ? '' : 'invisible'}>left</p>
              </div>
              <p className={`text-4xl pb-3.5 ${idx === window.l ? 'border-t-4 border-primary' : ''}
          ${idx === window.r ? 'border-b-4 border-primary' : ''}
          `}>{item}</p>
              <div>
                <p className={idx === window.r ? '' : 'invisible'}>right</p>
              </div>
            </div>
          ))}
        </div>}

      {window?.value && <div className='flex justify-between mt-2'>
        <Button className='flex items-center leading-[unset]' variant="ghost" disabled={previous.length < 1 ? true : false} onClick={handlePrevious}><ArrowLeft /> Previous</Button>
        <Button className='flex items-center leading-[unset]' variant="ghost" disabled={(window.r + 1 === window?.value.length || !window.value) ? true : false} onClick={handleNext}>Next <ArrowRight /></Button>
      </div>}
      {window?.value && <p className="font-3xl">
        Longest String:
        <strong className="border-b border-primary text-primary"> {longest}</strong>
      </p>}
      <br />
      {window?.value && <Button className='w-[100%]' onClick={handleReset} variant="outline">RESET</Button>}
    </div>
  )
}

export default App