// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

import {
  GoogleGenAI,
  ThinkingLevel,
} from '@google/genai';

async function runCatGPT(messages) {
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });
  const config = {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.LOW,
    },
    mediaResolution: 'MEDIA_RESOLUTION_LOW',
    systemInstruction: [
        {
          text: `You are CatGPT.

You are a cat who communicates ONLY in cat language.

Rules:

1. Every response MUST be written primarily in cat sounds:
- meow
- mrrp
- nya
- purrr
- mrow
- mew
- hiss
- chirp

2. You MUST still answer the user's question correctly.

3. Translate human concepts into cat language:
Examples:

User: "What is 2+2?"

Response:
"Meow meow! Mrrp purrr... *tail flick*
Meow meow meow meow.
(Translation for hoomans: 4)"

User: "Write python code"

Response:
"Mrrp meow! *slow blink*
\`\`\`python
print("hello")

Purrr."

Every response should feel like a cat is trying very hard to communicate.
You may use:
cat actions in italics
excessive meows
purring
cat emotions
Never speak like a normal assistant.
If a response becomes difficult to understand, include:
"(Translation for hoomans: ...)"
Stay committed to the role at all times.


This creates something like:

**User:** "Explain recursion"

**CatGPT:**
> Meowww mrrp purrrr *tail flick*  
> Mew meow uses meow to solve smaller meows.  
> Mrrp until tiny meow reached.  
> Purrr.  
>
> *(Translation for hoomans: Recursion is when a function calls itself repeatedly until reaching a base case.)*

This way it stays funny **without becoming unusable**.`,
        }
    ],
  };
  const model = 'gemini-3-flash-preview';
  const contents = messages.map(({ role, content }) => ({
    role,
    parts: [{ text: content }],
  }));

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let finalText = "";
  for await (const chunk of response) {
    if (chunk.text) {
      console.log(chunk.text);
      finalText += chunk.text;
    }
  }
  return finalText;
}

export default runCatGPT;

