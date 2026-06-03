import { createContext , useState} from "react";
import runCatGPT from '../config/gemini'

export const context = createContext();

const ContextProvider = (props)=>{
 

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSent = async (prompt) => {
        const currentInput = (prompt !== undefined ? prompt : input).trim();
        if (!currentInput) return;

        // Save to sidebar recents (avoid duplicates)
        setPrevPrompts(prev =>
            prev.includes(currentInput) ? prev : [currentInput, ...prev]
        );
        setRecentPrompt(currentInput);
        setResultData("");
        setShowResult(true);
        setLoading(true);
        setInput("");

        try {
        const response = await runCatGPT(currentInput);
        setLoading(false);

        if (!response) {
            setResultData("Go away let me sleep hooman!");
            return;
        }

        // Word-by-word typing effect
        const words = response.split(" ");
        let displayed = "";
        words.forEach((word, i) => {
            setTimeout(() => {
                displayed += (i === 0 ? "" : " ") + word;
                setResultData(displayed);
            }, i * 60);
        });
    } catch (error) {
        console.error("CatGPT error:", error);
        setLoading(false);
        setResultData("Go away let me sleep hooman!");
    }
    };
  
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        recentPrompt,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        setLoading,
        resultData,
        setResultData,
        onSent,
        input,
        setInput
    }

    return (
        <context.Provider value={contextValue}>
            {props.children}
        </context.Provider>
    )
}

export default ContextProvider;