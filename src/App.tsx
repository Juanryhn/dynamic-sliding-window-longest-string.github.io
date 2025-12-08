import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'

type StepSnapshot = { l: number; r: number; longest: string; comparison: string };
function App() {
  const [value, setValue] = useState('');
  const [longest, setLongest] = useState('');
  const [comparison, setComparison] = useState('');
  const [window, setWindow] = useState({
    l: 0,
    r: 0
  });
  const [previous, setPrevious] = useState<StepSnapshot[]>([{ ...window, longest, comparison }]);
  // let comparison = '';
  // let longest = '';

  const handleNext = () => {
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

    // push snapshot of current state before moving forward
    setPrevious((prev) => [...prev, { ...window, longest, comparison }]);
    setWindow({ l, r });
    setComparison(nextComparison);
    setLongest(nextLongest);
  }

    const handlePrevious = () => {
      const copyPrev = [...previous];
      const previousStep = copyPrev.pop();
      setPrevious(copyPrev);
      if (previousStep) {
        setWindow({ l: previousStep.l, r: previousStep.r });
        setComparison(previousStep.comparison);
        setLongest(previousStep.longest);
      }
    }

  return (
    <>
    <div className='flex items-end gap-4'>
    <div className='text-left'>
      <label htmlFor="random">Random String</label>
    <Input id='random' maxLength={100} placeholder='Enter random string' onChange={(e) => setValue(e.target.value)}/>
    </div>
    <Button onClick={() => setWindow({ l: 0, r:0})}>RESET</Button>
    </div>
    <div className="flex gap-4 items-center mt-8 max-w-80 overflow-auto pb-4">
      {value.split('').map((item, idx) => (
        <div className='flex-col' key={`${item}-${idx}`}>
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
    </div>
    <div className='flex justify-between mt-2'>
      <Button disabled={previous.length < 1 ? true:false} onClick={handlePrevious}>Previous</Button>
    <Button disabled={window.r+1 === value.length ? true : false} onClick={handleNext}>Next</Button>
    </div>
    <p className="font-3xl">
      {longest}
    </p>
    </>
  )
}

export default App
