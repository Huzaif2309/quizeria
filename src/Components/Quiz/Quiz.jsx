import React, { useState, useRef, useEffect, useCallback,useMemo } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = useMemo(() => [Option1, Option2, Option3, Option4], [Option1, Option2, Option3, Option4]);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        const shuffledQuestions = shuffleArray(data).slice(0, 5);
        setQuestions(shuffledQuestions);
        setQuestion(shuffledQuestions[0]);
    }, []);

    const handleTimeout = useCallback(() => {
        setLock(true);
        option_array[question.ans - 1].current.classList.add("correct");
    }, [question, option_array]);

    useEffect(() => {
        if (timeLeft > 0 && !lock) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !lock) {
            handleTimeout();
        }
    }, [timeLeft, lock, handleTimeout]);

    const checkAns = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                option_array[question.ans - 1].current.classList.add("correct");
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            if (index === questions.length - 1) {
                setResult(true);
                return 0;
            }
            const newIndex = index + 1;
            setIndex(newIndex);
            setQuestion(questions[newIndex]);
            setLock(false);
            setTimeLeft(10);
            option_array.map((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
                return null;
            });
        }
    };

    const reset = () => {
        const shuffledQuestions = shuffleArray(data).slice(0, 5);
        setQuestions(shuffledQuestions);
        setIndex(0);
        setQuestion(shuffledQuestions[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(10);
    };

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            {result ? <></> : <>
                <h2>{index + 1}. {question?.question}</h2>
                <ul>
                    <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question?.option1}</li>
                    <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question?.option2}</li>
                    <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question?.option3}</li>
                    <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question?.option4}</li>
                </ul>
                <div className="timer">Time left: {timeLeft} seconds</div>
                <button onClick={next}>Next</button>
                <div className="index">{index + 1} of {questions.length} questions</div></>
            }
            {result ? <>
                <h2>You Scored {score} out of {questions.length}</h2>
                <button onClick={reset}>Reset</button></> : <></>
            }
        </div>
    );
}

export default Quiz;
