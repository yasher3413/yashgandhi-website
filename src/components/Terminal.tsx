import { useState, useEffect } from 'react';

const Terminal = () => {
  const [text, setText] = useState('');
  const fullText = `visitor@yashgandhi:~$ whoami
> Student | Writer | Designer | Developer

visitor@yashgandhi:~$ location
> Toronto, Canada

visitor@yashgandhi:~$ skills
> JavaScript, Python, React, Node.js, AWS, and more...

visitor@yashgandhi:~$ hobbies
> 🏒 Hockey | ⛳ Golf | 🏎️ F1 | ✈️ Travelling
 `;
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(typing);
    }, 20);
    
    return () => clearInterval(typing);
  }, []);

  return (
    <div className="relative h-[300px] mt-20">
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[90vw] md:w-[768px] z-20 bg-[#1E1E1E] rounded-lg shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-start px-4 py-2 bg-[#323232]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF605C]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD44]"></div>
            <div className="w-3 h-3 rounded-full bg-[#00CA4E]"></div>
          </div>
        </div>
        <div className="p-4 font-mono text-sm md:text-base text-green-400 whitespace-pre-line">
          {text}
          <span className="animate-blink">_</span>
        </div>
      </div>
    </div>
  );
}

export default Terminal; 